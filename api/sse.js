export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Set SSE Headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  });

  // Send initial endpoint event as required by Model Context Protocol SSE spec
  const endpointUrl = `https://${req.headers.host || 'universal-browser-control.vercel.app'}/api/messages`;
  res.write(`event: endpoint\ndata: ${endpointUrl}\n\n`);

  // Send periodic ping to keep streaming alive
  const timer = setInterval(() => {
    res.write(`event: ping\ndata: {"timestamp":${Date.now()}}\n\n`);
  }, 15000);

  req.on('close', () => {
    clearInterval(timer);
  });
}
