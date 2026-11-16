#!/usr/bin/env node
import { runStdioServer, runSseServer } from './server.js';

const mode = process.argv.includes('--sse') ? 'sse' : 'stdio';

if (mode === 'sse') {
  const portArgIndex = process.argv.indexOf('--port');
  const port = portArgIndex !== -1 ? parseInt(process.argv[portArgIndex + 1], 10) : 3000;
  runSseServer({ port }).catch((err) => {
    console.error('Fatal error starting SSE server:', err);
    process.exit(1);
  });
} else {
  runStdioServer().catch((err) => {
    console.error('Fatal error starting stdio server:', err);
    process.exit(1);
  });
}
