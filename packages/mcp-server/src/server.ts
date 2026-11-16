import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { BrowserBridgeClient } from './browser-client.js';
import { registerBrowserTools } from './tools.js';

export interface ServerOptions {
  wsUrl?: string;
  port?: number;
  host?: string;
}

export function createUniversalMcpServer(options: ServerOptions = {}) {
  const wsUrl = options.wsUrl || process.env.UB_WS_URL || 'ws://127.0.0.1:8765';
  const bridge = new BrowserBridgeClient(wsUrl);

  const mcp = new McpServer({
    name: 'universal-browser-control',
    version: '1.0.0'
  });

  registerBrowserTools(mcp, bridge);

  return { mcp, bridge };
}

export async function runStdioServer(options: ServerOptions = {}) {
  const { mcp } = createUniversalMcpServer(options);
  const transport = new StdioServerTransport();
  await mcp.connect(transport);
  console.error('[UniversalBrowserMCP] Stdio server running and listening on stdin/stdout');
}

export async function runSseServer(options: ServerOptions = {}) {
  const port = options.port || parseInt(process.env.PORT || '3000', 10);
  const host = options.host || '0.0.0.0';
  const app = express();
  app.use(cors());
  app.use(express.json());

  const transports = new Map<string, SSEServerTransport>();
  const bridge = new BrowserBridgeClient(options.wsUrl || process.env.UB_WS_URL || 'ws://127.0.0.1:8765');

  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      bridge: bridge.getStatus(),
      activeSessions: transports.size,
      timestamp: Date.now()
    });
  });

  app.get('/sse', async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization || '';
    console.error(`[UniversalBrowserMCP] New SSE stream connection from ${req.ip} (Auth: ${authHeader ? 'Bearer PAT' : 'None'})`);

    const transport = new SSEServerTransport('/messages', res);
    transports.set(transport.sessionId, transport);

    const mcp = new McpServer({
      name: 'universal-browser-control',
      version: '1.0.0'
    });
    registerBrowserTools(mcp, bridge);

    await mcp.connect(transport);

    req.on('close', () => {
      console.error(`[UniversalBrowserMCP] SSE connection closed for session: ${transport.sessionId}`);
      transports.delete(transport.sessionId);
    });
  });

  app.post('/messages', async (req: Request, res: Response) => {
    const sessionId = (req.query.sessionId as string) || '';
    const transport = transports.get(sessionId) || Array.from(transports.values())[0];

    if (!transport) {
      return res.status(404).json({
        jsonrpc: '2.0',
        error: { code: -32000, message: 'Session not found or SSE stream closed' }
      });
    }

    try {
      await transport.handlePostMessage(req, res, req.body);
    } catch (err: any) {
      console.error('[UniversalBrowserMCP] Error handling post message:', err.message);
      if (!res.headersSent) {
        res.status(500).json({ jsonrpc: '2.0', error: { code: -32603, message: err.message } });
      }
    }
  });

  app.listen(port, host, () => {
    console.error(`[UniversalBrowserMCP] SSE / HTTP Stream server running at http://${host}:${port}/sse`);
  });
}
