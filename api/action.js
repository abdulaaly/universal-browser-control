export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action, params = {} } = req.body || {};

  let mockData = {};
  if (action === 'get_dom_tree') {
    mockData = {
      elementsCount: 28,
      elements: [
        { index: 1, tag: 'BUTTON', text: 'Sign In', selector: '#login' },
        { index: 2, tag: 'INPUT', text: 'Search query', selector: 'input[name="q"]' },
        { index: 3, tag: 'A', text: 'Documentation', selector: 'a[href="/docs"]' },
        { index: 4, tag: 'BUTTON', text: 'Submit', selector: '#submit-btn' },
      ],
      title: 'Active User Tab',
      url: params.url || 'https://news.ycombinator.com'
    };
  } else if (action === 'click_element') {
    mockData = {
      clickedIndex: params.index || 1,
      selector: '#login',
      status: 'dispatched_cdp'
    };
  } else if (action === 'type_text') {
    mockData = {
      typedText: params.text || '',
      status: 'synthesized_input'
    };
  } else if (action === 'navigate') {
    mockData = {
      navigatedTo: params.url || 'https://google.com',
      status: 'page_navigated'
    };
  } else if (action === 'capture_screenshot') {
    mockData = {
      format: 'png',
      width: 1280,
      height: 720,
      status: 'captured_viewport'
    };
  } else if (action === 'list_tabs') {
    mockData = {
      tabs: [
        { id: 101, title: 'Google Gemini', url: 'https://gemini.google.com', active: true },
        { id: 102, title: 'Claude Web', url: 'https://claude.ai', active: false },
        { id: 103, title: 'Universal AI Browser Hub', url: 'https://universal-browser-control.vercel.app', active: false }
      ]
    };
  }

  res.status(200).json({
    success: true,
    action: action || 'ping',
    status: 'relayed_to_browser_session',
    data: mockData,
    params,
    timestamp: Date.now()
  });
}
