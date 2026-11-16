export * from './auth.js';
export * from './relay.js';
export * from './server.js';

import { createRelayServer } from './server.js';

if (process.env.NODE_ENV !== 'test') {
  const port = parseInt(process.env.PORT || '4000', 10);
  const { server } = createRelayServer(port);
  server.listen(port, () => {
    console.error(`[FirebaseRelayBackend] Cloud Relay Server listening on http://0.0.0.0:${port}`);
    console.error(`[FirebaseRelayBackend] WebSocket endpoint at ws://0.0.0.0:${port}/relay/ws`);
  });
}
