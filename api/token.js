import crypto from 'crypto';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const rawBytes = crypto.randomBytes(16).toString('hex');
    const token = `ub_pat_live_${rawBytes}`;
    
    return res.status(200).json({
      token,
      scopes: ['tabs:read', 'tabs:write', 'dom:read', 'input:write', 'screenshot:read'],
      createdAt: Date.now(),
      status: 'active'
    });
  }

  res.status(200).json({
    message: 'Universal AI Browser Control Token Endpoint. Send POST to generate a new scoped PAT.'
  });
}
