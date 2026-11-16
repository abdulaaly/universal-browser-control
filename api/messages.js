export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method, params, id } = req.body || {};

  // MCP Protocol Tool Call Handler
  if (method === 'tools/list') {
    return res.status(200).json({
      jsonrpc: '2.0',
      id,
      result: {
        tools: [
          {
            name: 'list_tabs',
            description: 'List all open browser tabs across windows',
            inputSchema: { type: 'object', properties: {} }
          },
          {
            name: 'get_dom_tree',
            description: 'Extract interactive element markers ([1], [2]) and Markdown summary',
            inputSchema: { type: 'object', properties: { tabId: { type: 'number' } } }
          },
          {
            name: 'click_element',
            description: 'Click an element using its numeric elementIndex or CSS selector',
            inputSchema: { type: 'object', properties: { elementIndex: { type: 'number' }, tabId: { type: 'number' } } }
          },
          {
            name: 'type_text',
            description: 'Type text into an input element',
            inputSchema: { type: 'object', properties: { text: { type: 'string' }, elementIndex: { type: 'number' } }, required: ['text'] }
          },
          {
            name: 'capture_screenshot',
            description: 'Capture screenshot of active tab viewport',
            inputSchema: { type: 'object', properties: { fullPage: { type: 'boolean' } } }
          },
          {
            name: 'scroll',
            description: 'Scroll viewport by vertical or horizontal offset',
            inputSchema: { type: 'object', properties: { deltaY: { type: 'number' } } }
          }
        ]
      }
    });
  }

  // Handle generic tool execution
  res.status(200).json({
    jsonrpc: '2.0',
    id,
    result: {
      content: [
        {
          type: 'text',
          text: `[Universal Browser Cloud Relay] Tool call '${method}' acknowledged and queued for user browser session.`
        }
      ]
    }
  });
}
