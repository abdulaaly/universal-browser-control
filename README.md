# Universal AI Browser Control 🌐🤖
### Open-Source Autonomous AI Browser Extension + Universal MCP Server & CLI Hub

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/Chrome_Extension-Manifest_V3-blue.svg)](packages/extension)
[![Model Context Protocol](https://img.shields.io/badge/MCP-2024--11--05-purple.svg)](packages/mcp-server)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](tsconfig.base.json)
[![Author](https://img.shields.io/badge/Contact-100xdigitizer%40gmail.com-black.svg)](mailto:100xdigitizer@gmail.com)

**Universal AI Browser Control** is a 100% open-source, vendor-agnostic browser automation system engineered to surpass closed proprietary extensions (such as the ChatGPT Chrome Extension `hehggadaopoacecdllhhajmbjkdcmajg`). 

It provides an open bridge allowing **ANY** AI client—including **Google Gemini**, **Anthropic Claude (Web, Desktop, iOS, Android)**, **Perplexity**, **Cursor**, and the **Antigravity CLI**—to safely control the user's live, authenticated desktop browser session without hijacking active tabs or exposing credentials.

---

## 🌟 Key Superpowers & Capabilities

- 🔓 **100% Vendor Agnostic:** Works identically with Gemini, Claude, Perplexity, Cursor, Antigravity, or custom autonomous agents via standard [Model Context Protocol (MCP)](https://modelcontextprotocol.io).
- 🛡️ **Zero Tab Hijacking & Background Leases:** Operates smoothly in background tabs using Chrome DevTools Protocol (`chrome.debugger`) and tab leases without stealing focus while you work.
- 👁️ **Token-Optimized DOM Indexer:** Converts web pages into compact, numbered interactive element markers (`[1]`, `[2]`, `[3]`) and human-readable Markdown summaries.
- 🖱️ **Natural Visual Agent Cursor:** Injects a physics-based Bezier cursor trail and click ripple animation inside an isolated Shadow DOM container (`closed` mode) so you see exactly what the AI is doing in real-time.
- 🚨 **Human-in-the-Loop (HITL) Guardrails:** High-risk actions (file downloads, browser history access, form submissions on unknown domains) pause for interactive approval cards (`[Allow Once]`, `[Trust Domain]`, `[Deny]`).
- 🛑 **Pre-configured Sensitive Domain Blocklist:** Automatic denial on banking portals, password managers, and critical identity providers (`chase.com`, `paypal.com`, `1password.com`, `bitwarden.com`, etc.).
- 📡 **Dual Transport Modes:**
  - **Local `stdio` Transport:** Zero-latency IPC for local coding assistants (Antigravity, Cursor, Terminal).
  - **Remote `SSE / Streamable HTTP` & WSS Cloud Relay:** Enables remote mobile and web clients (Claude on iPhone, Gemini Web in the cloud) to command your desktop browser across networks with Firebase Auth & 2FA.

---

## 🏗️ Monorepo Architecture

```
universal-browser-control/
├── packages/
│   ├── extension/         # Chrome/Edge/Brave Extension (React + Vite + Tailwind + MV3)
│   ├── mcp-server/        # Universal MCP Server (@modelcontextprotocol/sdk, stdio & SSE)
│   ├── cli/               # CLI-Anything zero-config hub (npx universal-browser)
│   └── firebase-backend/  # Firebase Auth, 2FA, Scoped PATs & WSS Cloud Relay
├── reference-extension/   # Deconstructed ChatGPT Chrome Extension (hehggadaopoacecdllhhajmbjkdcmajg)
├── ARCHITECTURE.md        # Comprehensive technical deconstruction & architectural specification
├── SETUP.md               # Step-by-step connection guide for Gemini, Claude, Perplexity, Cursor
└── LICENSE                # MIT License
```

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js `>= 18.0.0`
- Google Chrome, Microsoft Edge, or Brave Browser

### 1. Build the Monorepo
```bash
# Clone the repository
git clone https://github.com/100xdigitizer/universal-browser-control.git
cd universal-browser-control

# Install all workspace dependencies
npm install

# Build all packages
npm run build
```

### 2. Load the Chrome Extension
1. Open Google Chrome and navigate to `chrome://extensions`.
2. Enable **Developer mode** in the top-right corner.
3. Click **Load unpacked** and select the directory:
   `universal-browser-control/packages/extension/dist`
4. Pin the **Universal AI Browser Control** icon in your Chrome toolbar.
5. Click the extension icon or open the **Side Panel** to inspect the live telemetry and connect hub.

### 3. Start the Local MCP Bridge
```bash
# Start local stdio MCP server for Antigravity or local agents
npx universal-browser start

# Or start in SSE streaming mode for remote web/mobile AI clients:
npx universal-browser start --sse --port 3000
```

---

## 🤖 AI Client Connection Configurations

### 1. Google Gemini (Web & API)
Add the MCP server configuration into your Gemini runtime or agent configuration:
```json
{
  "mcpServers": {
    "universal-browser": {
      "url": "http://localhost:3000/sse",
      "headers": {
        "Authorization": "Bearer ub_pat_your_token_here"
      }
    }
  }
}
```

### 2. Anthropic Claude (Desktop & Web/Mobile)
For **Claude Desktop**, add this to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "universal-browser": {
      "command": "npx",
      "args": ["-y", "@universal-browser/mcp-server"]
    }
  }
}
```
For **Claude Web / iOS / Android**, configure the remote SSE URL:
```
URL: http://localhost:3000/sse
Authorization: Bearer <Your Scoped PAT Token>
```

### 3. Cursor IDE
In Cursor **Settings > Features > MCP**:
- Name: `universal-browser`
- Type: `command`
- Command: `npx @universal-browser/mcp-server`

### 4. Antigravity CLI
Add to your project's MCP server configuration:
```json
{
  "mcpServers": {
    "universal-browser": {
      "command": "node",
      "args": ["packages/mcp-server/dist/cli-entry.js"]
    }
  }
}
```

---

## 🛠️ Complete MCP Tool Catalog

| Tool Name | Parameters | Description | HITL Guardrail |
| :--- | :--- | :--- | :---: |
| `list_tabs` | - | Returns an array of all open tabs with IDs, titles, URLs, and active states. | 🟢 Automatic |
| `open_tab` | `url`, `active`, `groupTitle` | Opens a URL in a new tab (foreground or background). | 🟢 Sensitive Check |
| `close_tab` | `tabId` | Closes the specified tab ID. | 🟢 Automatic |
| `switch_tab` | `tabId` | Focuses the specified tab. | 🟢 Automatic |
| `get_dom_tree` | `tabId?`, `includeMarkdown?` | Returns numbered element index (`[1]`, `[2]`) and readable Markdown. | 🟢 Sensitive Check |
| `click_element`| `tabId?`, `elementIndex?`, `selector?` | Dispatches CDP click at target coordinates with visual cursor animation. | 🟢 Automatic |
| `type_text` | `tabId?`, `elementIndex?`, `text`, `pressEnter?` | Types text into input fields with natural keystroke timing. | 🟢 Automatic |
| `press_key` | `tabId?`, `key` | Dispatches keyboard events (Enter, Escape, Tab, ArrowDown, etc.). | 🟢 Automatic |
| `scroll` | `tabId?`, `deltaY`, `deltaX` | Scrolls page by specified pixel offset. | 🟢 Automatic |
| `capture_screenshot` | `tabId?`, `fullPage?` | Returns PNG screenshot base64 image. | 🟢 Automatic |
| `navigate` | `tabId?`, `url` | Navigates existing tab to a new URL. | 🟢 Sensitive Check |
| `download_file` | `url`, `filename?` | Downloads file to user's machine. | ⚠️ **HITL Gated** |
| `get_history` | `query`, `maxResults?` | Searches browser history for keywords. | ⚠️ **HITL Gated** |
| `manage_tab_groups` | `tabIds`, `title`, `color` | Organizes tabs into labeled Chrome tab groups. | 🟢 Automatic |
| `get_connection_status` | - | Returns bridge status, latency, and connected client metrics. | 🟢 Automatic |

---

## 🔒 Security Architecture & Guardrails

1. **Explicit Sensitive Domain Blocklist:**
   Protects banking portals, cryptocurrency exchanges, and password vaults (`chase.com`, `paypal.com`, `1password.com`, `bitwarden.com`, `accounts.google.com`).
2. **Interactive Human Approval Cards:**
   Actions requiring elevated trust (downloading files or querying history) trigger sidepanel cards with `[Allow Once]`, `[Trust Domain]`, and `[Deny]`.
3. **Multi-Factor Authentication (2FA) & Token Revocation:**
   Powered by Firebase Auth. Generate scoped Personal Access Tokens (PATs) and revoke them instantly from the sidepanel.

---

## 📄 License & Attribution

- **Author & Maintainer:** `100xdigitizer@gmail.com`
- **License:** MIT License. See [LICENSE](LICENSE) for details.
- Deconstructed and built cleanly from first principles.
