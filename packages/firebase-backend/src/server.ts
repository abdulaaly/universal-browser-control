import express, { Request, Response } from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import { AuthManager } from './auth.js';
import { CloudRelayBridge } from './relay.js';

export function createRelayServer(port = 4000) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const authManager = new AuthManager();
  const relayBridge = new CloudRelayBridge();

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: '/relay/ws' });

  // WebSocket connection handler
  wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const token = url.searchParams.get('token') || '';
    const authResult = authManager.verifyToken(token);

    if (!authResult.valid || !authResult.userId) {
      ws.close(1008, `Authentication failed: ${authResult.reason || 'Invalid token'}`);
      return;
    }

    const userId = authResult.userId;
    const clientType = url.searchParams.get('type') || 'extension';

    if (clientType === 'extension') {
      relayBridge.registerExtension(userId, ws);
      ws.send(JSON.stringify({ type: 'registered', userId, timestamp: Date.now() }));
    }
  });

  // REST API: Health Check
  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      relay: relayBridge.getStats(),
      timestamp: Date.now()
    });
  });

  // REST API: Provision Personal Access Token
  app.post('/api/tokens', (req: Request, res: Response) => {
    const { userId, name, scopes } = req.body;
    if (!userId || !name) {
      return res.status(400).json({ error: 'userId and name are required' });
    }
    const tokenData = authManager.createPersonalAccessToken(userId, name, scopes);
    res.json(tokenData);
  });

  // REST API: Revoke Token
  app.delete('/api/tokens/:id', (req: Request, res: Response) => {
    const success = authManager.revokeToken(req.params.id);
    res.json({ success });
  });

  // REST API: Dispatch remote action (for HTTP MCP streaming)
  app.post('/api/action', async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization || '';
    const rawToken = authHeader.replace(/^Bearer\s+/i, '');
    const authResult = authManager.verifyToken(rawToken);

    if (!authResult.valid || !authResult.userId) {
      return res.status(401).json({ error: authResult.reason || 'Unauthorized' });
    }

    const { action, params } = req.body;
    try {
      const result = await relayBridge.dispatchActionToUserBrowser(authResult.userId, action, params);
      res.json({ success: true, result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  return { app, server, authManager, relayBridge, port };
}
