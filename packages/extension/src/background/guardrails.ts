// Universal AI Browser Control - Security Guardrails & HITL Manager

export interface HitlRequest {
  id: string;
  tool: string;
  params: Record<string, any>;
  tabId?: number;
  url?: string;
  domain?: string;
  description: string;
  timestamp: number;
  status: 'pending' | 'approved' | 'denied';
  resolve?: (value: boolean) => void;
}

export class GuardrailsManager {
  private blockedDomains = new Set<string>([
    'chase.com',
    'bankofamerica.com',
    'wellsfargo.com',
    'citibank.com',
    'paypal.com',
    '1password.com',
    'lastpass.com',
    'bitwarden.com',
    'accounts.google.com',
    'auth0.com',
    'login.microsoftonline.com'
  ]);

  private allowedSessionDomains = new Set<string>();
  private pendingApprovals = new Map<string, HitlRequest>();

  public isDomainBlocked(url: string): { blocked: boolean; domain?: string } {
    try {
      const parsed = new URL(url);
      const domain = parsed.hostname.toLowerCase();
      
      for (const blocked of this.blockedDomains) {
        if (domain === blocked || domain.endsWith(`.${blocked}`)) {
          return { blocked: true, domain };
        }
      }
      return { blocked: false, domain };
    } catch {
      return { blocked: false };
    }
  }

  public isDomainAllowedBySession(url: string): boolean {
    try {
      const parsed = new URL(url);
      return this.allowedSessionDomains.has(parsed.hostname.toLowerCase());
    } catch {
      return false;
    }
  }

  public allowDomainForSession(domain: string) {
    this.allowedSessionDomains.add(domain.toLowerCase());
  }

  public async requestApproval(request: Omit<HitlRequest, 'id' | 'timestamp' | 'status'>): Promise<boolean> {
    const id = `hitl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // Check if domain is already whitelisted for this session
    if (request.url && this.isDomainAllowedBySession(request.url)) {
      return true;
    }

    return new Promise((resolve) => {
      const hitlItem: HitlRequest = {
        ...request,
        id,
        timestamp: Date.now(),
        status: 'pending',
        resolve
      };

      this.pendingApprovals.set(id, hitlItem);

      // Broadcast to sidepanel / popup UI
      chrome.runtime.sendMessage({
        type: 'HITL_REQUEST_PENDING',
        request: {
          id: hitlItem.id,
          tool: hitlItem.tool,
          params: hitlItem.params,
          url: hitlItem.url,
          domain: hitlItem.domain,
          description: hitlItem.description,
          timestamp: hitlItem.timestamp,
          status: hitlItem.status
        }
      }).catch(() => {});
    });
  }

  public resolveApproval(id: string, decision: 'allow_once' | 'allow_domain' | 'deny'): boolean {
    const item = this.pendingApprovals.get(id);
    if (!item) return false;

    this.pendingApprovals.delete(id);

    if (decision === 'allow_domain' && item.domain) {
      this.allowDomainForSession(item.domain);
    }

    const approved = decision === 'allow_once' || decision === 'allow_domain';
    item.status = approved ? 'approved' : 'denied';
    item.resolve?.(approved);

    chrome.runtime.sendMessage({
      type: 'HITL_REQUEST_RESOLVED',
      id,
      decision,
      status: item.status
    }).catch(() => {});

    return true;
  }

  public getPendingApprovals(): Omit<HitlRequest, 'resolve'>[] {
    return Array.from(this.pendingApprovals.values()).map(({ resolve, ...rest }) => rest);
  }
}
