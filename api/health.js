export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.status(200).json({
    status: 'online',
    version: '1.0.0',
    service: 'Universal AI Browser Control Cloud Relay',
    timestamp: Date.now(),
    transport: 'SSE / Streamable HTTP',
    auth: 'Scoped PAT + 2FA Verified',
    clients: ['Gemini', 'Claude', 'Perplexity', 'Cursor', 'Antigravity']
  });
}
