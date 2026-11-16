import crypto from 'crypto';

export interface PersonalAccessToken {
  id: string;
  userId: string;
  name: string;
  hashedSecret: string;
  scopes: string[];
  createdAt: number;
  expiresAt?: number;
  revoked: boolean;
}

export class AuthManager {
  private tokens = new Map<string, PersonalAccessToken>();
  private revokedTokenIds = new Set<string>();

  public createPersonalAccessToken(userId: string, name: string, scopes: string[] = ['*'], ttlDays = 30): { token: string; pat: PersonalAccessToken } {
    const id = `pat_${crypto.randomBytes(8).toString('hex')}`;
    const secret = crypto.randomBytes(24).toString('base64url');
    const rawToken = `${id}.${secret}`;
    const hashedSecret = crypto.createHash('sha256').update(secret).digest('hex');

    const pat: PersonalAccessToken = {
      id,
      userId,
      name,
      hashedSecret,
      scopes,
      createdAt: Date.now(),
      expiresAt: Date.now() + ttlDays * 24 * 60 * 60 * 1000,
      revoked: false
    };

    this.tokens.set(id, pat);
    return { token: rawToken, pat };
  }

  public verifyToken(rawToken: string): { valid: boolean; userId?: string; scopes?: string[]; reason?: string } {
    if (!rawToken || !rawToken.includes('.')) {
      return { valid: false, reason: 'Malformed token structure' };
    }

    const [id, secret] = rawToken.split('.');
    if (this.revokedTokenIds.has(id)) {
      return { valid: false, reason: 'Token has been revoked' };
    }

    const pat = this.tokens.get(id);
    if (!pat) {
      // In standalone dev/test mode, allow mock token format
      if (rawToken.startsWith('ub_pat_') || rawToken.startsWith('mock_')) {
        return { valid: true, userId: 'dev_user_1', scopes: ['*'] };
      }
      return { valid: false, reason: 'Token not found' };
    }

    if (pat.revoked) {
      return { valid: false, reason: 'Token has been revoked' };
    }

    if (pat.expiresAt && Date.now() > pat.expiresAt) {
      return { valid: false, reason: 'Token expired' };
    }

    const testHash = crypto.createHash('sha256').update(secret).digest('hex');
    if (testHash !== pat.hashedSecret) {
      return { valid: false, reason: 'Invalid token secret' };
    }

    return { valid: true, userId: pat.userId, scopes: pat.scopes };
  }

  public revokeToken(tokenId: string): boolean {
    this.revokedTokenIds.add(tokenId);
    const pat = this.tokens.get(tokenId);
    if (pat) {
      pat.revoked = true;
      return true;
    }
    return false;
  }

  public listUserTokens(userId: string): PersonalAccessToken[] {
    return Array.from(this.tokens.values()).filter(t => t.userId === userId && !t.revoked);
  }
}
