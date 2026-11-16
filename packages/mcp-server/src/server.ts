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

  const { mcp, bridge } = createUniversalMcpServer(options);
  let sseTransport: SSEServerTransport | null = null;

  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      bridge: bridge.getStatus(),
      timestamp: Date.now()
    });
  });

  app.get('/sse', async (req: Request, res: Response) => {
    console.error('[UniversalBrowserMCP] New SSE connection established from', req.ip);
    sseTransport = new SSEServerTransport('/messages', res);
    await mcp.connect(sseTransport);

    req.on('close', () => {
      console.error('[UniversalBrowserMCP] SSE connection closed');
    });
  });

  app.post('/messages', async (req: Request, res: Response) => {
    if (sseTransport) {
      await sseTransport.handlePostMessage(req, res);
    } else {
      res.status(400).send('SSE connection not yet established');
    }
  });

  app.listen(port, host, () => {
    console.error(`[UniversalBrowserMCP] SSE / HTTP Stream server running at http://${host}:${port}/sse`);
  });
}
