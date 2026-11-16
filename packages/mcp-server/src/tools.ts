import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { BrowserBridgeClient } from './browser-client.js';

export function registerBrowserTools(server: McpServer, bridge: BrowserBridgeClient) {
  // 1. list_tabs
  server.tool(
    'list_tabs',
    'List all open browser tabs across windows, including active states, titles, URLs, and IDs.',
    {},
    async () => {
      try {
        const tabs = await bridge.executeAction('list_tabs');
        return {
          content: [{ type: 'text', text: JSON.stringify(tabs, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Failed to list tabs: ${err.message}` }]
        };
      }
    }
  );

  // 2. open_tab
  server.tool(
    'open_tab',
    'Open a new browser tab with the specified URL. Can open in the background without stealing user focus.',
    {
      url: z.string().describe('The URL to navigate to (must include http:// or https://)'),
      active: z.boolean().default(false).describe('Whether to focus the tab immediately. Defaults to false (background tab).'),
      groupTitle: z.string().optional().describe('Optional name of tab group to attach this new tab to')
    },
    async ({ url, active, groupTitle }) => {
      try {
        const result = await bridge.executeAction('open_tab', { url, active, groupTitle });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Failed to open tab: ${err.message}` }]
        };
      }
    }
  );

  // 3. close_tab
  server.tool(
    'close_tab',
    'Close an open browser tab by tab ID.',
    {
      tabId: z.number().describe('The ID of the tab to close')
    },
    async ({ tabId }) => {
      try {
        const result = await bridge.executeAction('close_tab', { tabId });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Failed to close tab: ${err.message}` }]
        };
      }
    }
  );

  // 4. switch_tab
  server.tool(
    'switch_tab',
    'Switch active focus to a specific browser tab.',
    {
      tabId: z.number().describe('The ID of the tab to switch to')
    },
    async ({ tabId }) => {
      try {
        const result = await bridge.executeAction('switch_tab', { tabId });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Failed to switch tab: ${err.message}` }]
        };
      }
    }
  );

  // 5. get_dom_tree
  server.tool(
    'get_dom_tree',
    'Extract a token-optimized representation of the DOM with numbered interactive element badges ([1], [2], [3]), bounding boxes, and Markdown representation.',
    {
      tabId: z.number().optional().describe('Tab ID to inspect. If omitted, uses the currently active tab.'),
      includeMarkdown: z.boolean().default(true).describe('Include high-level readable Markdown page summary')
    },
    async ({ tabId, includeMarkdown }) => {
      try {
        const result = await bridge.executeAction('get_dom_tree', { tabId, includeMarkdown });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Failed to get DOM tree: ${err.message}` }]
        };
      }
    }
  );

  // 6. click_element
  server.tool(
    'click_element',
    'Click an element on the page using its numeric element index (from get_dom_tree) or CSS selector.',
    {
      tabId: z.number().optional().describe('Target tab ID. Defaults to active tab.'),
      elementIndex: z.number().optional().describe('The [index] number returned by get_dom_tree'),
      selector: z.string().optional().describe('CSS selector if elementIndex is not provided'),
      showCursorTrail: z.boolean().default(true).describe('Show natural Bezier cursor trail to the user on the screen')
    },
    async ({ tabId, elementIndex, selector, showCursorTrail }) => {
      try {
        const result = await bridge.executeAction('click_element', { tabId, elementIndex, selector, showCursorTrail });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Failed to click element: ${err.message}` }]
        };
      }
    }
  );

  // 7. type_text
  server.tool(
    'type_text',
    'Type text into an input or textarea element on the page.',
    {
      tabId: z.number().optional().describe('Target tab ID. Defaults to active tab.'),
      elementIndex: z.number().optional().describe('The [index] number returned by get_dom_tree'),
      selector: z.string().optional().describe('CSS selector if elementIndex is not provided'),
      text: z.string().describe('The text string to type'),
      clearFirst: z.boolean().default(false).describe('Whether to clear existing field content before typing'),
      pressEnter: z.boolean().default(false).describe('Whether to press Enter after typing')
    },
    async ({ tabId, elementIndex, selector, text, clearFirst, pressEnter }) => {
      try {
        const result = await bridge.executeAction('type_text', { tabId, elementIndex, selector, text, clearFirst, pressEnter });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Failed to type text: ${err.message}` }]
        };
      }
    }
  );

  // 8. press_key
  server.tool(
    'press_key',
    'Dispatch a keyboard key event to the page or active element (e.g. Enter, Escape, ArrowDown, Tab).',
    {
      tabId: z.number().optional().describe('Target tab ID. Defaults to active tab.'),
      key: z.string().describe('Key name (e.g. Enter, Escape, Tab, Backspace, ArrowDown, ArrowUp)')
    },
    async ({ tabId, key }) => {
      try {
        const result = await bridge.executeAction('press_key', { tabId, key });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Failed to press key: ${err.message}` }]
        };
      }
    }
  );

  // 9. scroll
  server.tool(
    'scroll',
    'Scroll the page vertically or horizontally by pixel delta or to specific position.',
    {
      tabId: z.number().optional().describe('Target tab ID. Defaults to active tab.'),
      deltaY: z.number().default(400).describe('Vertical scroll delta (positive = scroll down, negative = scroll up)'),
      deltaX: z.number().default(0).describe('Horizontal scroll delta')
    },
    async ({ tabId, deltaY, deltaX }) => {
      try {
        const result = await bridge.executeAction('scroll', { tabId, deltaY, deltaX });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Failed to scroll: ${err.message}` }]
        };
      }
    }
  );

  // 10. capture_screenshot
  server.tool(
    'capture_screenshot',
    'Capture an image screenshot of the browser page (either viewport or full page).',
    {
      tabId: z.number().optional().describe('Target tab ID. Defaults to active tab.'),
      fullPage: z.boolean().default(false).describe('Capture full scrollable page instead of visible viewport')
    },
    async ({ tabId, fullPage }) => {
      try {
        const result = await bridge.executeAction<{ tabId?: number; fullPage: boolean }, { dataUrl: string }>(
          'capture_screenshot',
          { tabId, fullPage }
        );
        return {
          content: [
            {
              type: 'text',
              text: `Screenshot captured successfully for tab ${tabId || 'active'}`
            },
            {
              type: 'image',
              data: result.dataUrl.replace(/^data:image\/\w+;base64,/, ''),
              mimeType: 'image/png'
            }
          ]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Failed to capture screenshot: ${err.message}` }]
        };
      }
    }
  );

  // 11. navigate
  server.tool(
    'navigate',
    'Navigate an existing tab to a new URL.',
    {
      tabId: z.number().optional().describe('Target tab ID. Defaults to active tab.'),
      url: z.string().describe('URL to navigate to')
    },
    async ({ tabId, url }) => {
      try {
        const result = await bridge.executeAction('navigate', { tabId, url });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Failed to navigate: ${err.message}` }]
        };
      }
    }
  );

  // 12. download_file (HITL Protected)
  server.tool(
    'download_file',
    'Download a file from a URL to the browser Downloads directory. Protected by Human-in-the-Loop approval.',
    {
      url: z.string().describe('Direct file download URL'),
      filename: z.string().optional().describe('Target filename on disk')
    },
    async ({ url, filename }) => {
      try {
        const result = await bridge.executeAction('download_file', { url, filename });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Download request rejected or failed: ${err.message}` }]
        };
      }
    }
  );

  // 13. get_history (HITL Protected)
  server.tool(
    'get_history',
    'Search browser history for matching terms. Protected by Human-in-the-Loop approval.',
    {
      query: z.string().describe('Search query for history items'),
      maxResults: z.number().default(10).describe('Maximum items to retrieve')
    },
    async ({ query, maxResults }) => {
      try {
        const result = await bridge.executeAction('get_history', { query, maxResults });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `History access denied: ${err.message}` }]
        };
      }
    }
  );

  // 14. manage_tab_groups
  server.tool(
    'manage_tab_groups',
    'Create, organize, or label tab groups to keep automated agent work cleanly segmented from user tabs.',
    {
      tabIds: z.array(z.number()).describe('Array of tab IDs to add to the group'),
      title: z.string().describe('Group label/title'),
      color: z.enum(['grey', 'blue', 'red', 'yellow', 'green', 'pink', 'purple', 'cyan', 'orange']).default('green'),
      collapsed: z.boolean().default(false)
    },
    async ({ tabIds, title, color, collapsed }) => {
      try {
        const result = await bridge.executeAction('manage_tab_groups', { tabIds, title, color, collapsed });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Failed to manage tab groups: ${err.message}` }]
        };
      }
    }
  );

  // 15. get_connection_status
  server.tool(
    'get_connection_status',
    'Check health of the Universal Browser Control bridge, extension presence, and latency.',
    {},
    async () => {
      const status = bridge.getStatus();
      return {
        content: [{ type: 'text', text: JSON.stringify(status, null, 2) }]
      };
    }
  );
}
