import WebSocket from 'ws';
import { BridgeMessage } from './types.js';

export class BrowserBridgeClient {
  private ws: WebSocket | null = null;
  private pendingRequests = new Map<string, {
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
    timer: NodeJS.Timeout;
  }>();
  private wsUrl: string;
  private reconnectInterval: number = 3000;
  private isConnected = false;
  private messageListeners = new Set<(msg: BridgeMessage) => void>();

  constructor(wsUrl = 'ws://127.0.0.1:8765') {
    this.wsUrl = wsUrl;
    this.init();
  }

  private init() {
    try {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.on('open', () => {
        this.isConnected = true;
        console.error(`[BrowserBridge] Connected to extension bridge at ${this.wsUrl}`);
      });

      this.ws.on('message', (data: WebSocket.Data) => {
        try {
          const msg = JSON.parse(data.toString()) as BridgeMessage;
          this.handleIncomingMessage(msg);
        } catch (err) {
          console.error('[BrowserBridge] Error parsing incoming bridge message:', err);
        }
      });

      this.ws.on('close', () => {
        this.isConnected = false;
        this.cleanupPending(new Error('Extension bridge connection closed'));
        setTimeout(() => this.init(), this.reconnectInterval);
      });

      this.ws.on('error', (err) => {
        // Log cleanly to stderr without crashing stdio MCP streams
        this.isConnected = false;
      });
    } catch {
      setTimeout(() => this.init(), this.reconnectInterval);
    }
  }

  private handleIncomingMessage(msg: BridgeMessage) {
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

    for (const listener of this.messageListeners) {
      listener(msg);
    }
  }

  private cleanupPending(error: Error) {
    for (const [id, pending] of this.pendingRequests.entries()) {
      clearTimeout(pending.timer);
      pending.reject(error);
    }
    this.pendingRequests.clear();
  }

  public onMessage(listener: (msg: BridgeMessage) => void): () => void {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }

  public getStatus() {
    return {
      connected: this.isConnected,
      wsUrl: this.wsUrl,
      pendingRequestsCount: this.pendingRequests.size
    };
  }

  public async executeAction<T = unknown, R = unknown>(action: string, params?: T, timeoutMs = 30000): Promise<R> {
    if (!this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error(`Extension is not currently connected to bridge at ${this.wsUrl}. Please ensure the Universal AI Browser Control extension is active in Chrome.`);
    }

    const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const message: BridgeMessage<T> = {
      id,
      type: 'action',
      action,
      params,
      timestamp: Date.now()
    };

    return new Promise<R>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error(`Action '${action}' timed out after ${timeoutMs}ms waiting for extension response`));
      }, timeoutMs);

      this.pendingRequests.set(id, {
        resolve: resolve as (val: unknown) => void,
        reject,
        timer
      });

      this.ws!.send(JSON.stringify(message));
    });
  }
}
