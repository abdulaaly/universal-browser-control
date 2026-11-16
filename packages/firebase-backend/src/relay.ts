import WebSocket from 'ws';

export interface RelayConnection {
  ws: WebSocket;
  userId: string;
  clientType: 'extension' | 'ai_client';
  lastPing: number;
}

export class CloudRelayBridge {
  private userExtensions = new Map<string, WebSocket>();
  private pendingRequests = new Map<string, {
    resolve: (res: any) => void;
    reject: (err: any) => void;
    timer: NodeJS.Timeout;
  }>();

  public registerExtension(userId: string, ws: WebSocket) {
    this.userExtensions.set(userId, ws);
    console.error(`[CloudRelay] Browser extension registered for user: ${userId}`);

    ws.on('close', () => {
      if (this.userExtensions.get(userId) === ws) {
        this.userExtensions.delete(userId);
        console.error(`[CloudRelay] Browser extension disconnected for user: ${userId}`);
      }
    });

    ws.on('message', (data: WebSocket.Data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'action_response' && msg.id) {
          const pending = this.pendingRequests.get(msg.id);
          if (pending) {
            clearTimeout(pending.timer);
            this.pendingRequests.delete(msg.id);
            if (msg.error) {
              pending.reject(new Error(msg.error));
            } else {
              pending.resolve(msg.result);
            }
          }
        }
      } catch (err) {
        console.error('[CloudRelay] Error handling message from extension:', err);
      }
    });
  }

  public async dispatchActionToUserBrowser(userId: string, action: string, params?: unknown, timeoutMs = 30000): Promise<unknown> {
    const extWs = this.userExtensions.get(userId);
    if (!extWs || extWs.readyState !== WebSocket.OPEN) {
      throw new Error(`User ${userId} does not have an active browser extension connected to the Cloud Relay.`);
    }

    const id = `relay_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const payload = {
      id,
      type: 'action',
      action,
      params,
      timestamp: Date.now()
    };

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error(`Relay action '${action}' timed out waiting for user's desktop browser`));
      }, timeoutMs);

      this.pendingRequests.set(id, { resolve, reject, timer });
      extWs.send(JSON.stringify(payload));
    });
  }

  public getStats() {
    return {
      connectedExtensionsCount: this.userExtensions.size,
      pendingRelayRequestsCount: this.pendingRequests.size
    };
  }
}
