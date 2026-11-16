# Universal AI Browser Control 🌐🤖
### Open-Source Autonomous AI Browser Extension + Universal MCP Server & CLI Hub

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![GitHub Repository](https://img.shields.io/badge/GitHub-abdulaaly%2Funiversal--browser--control-181717.svg?logo=github)](https://github.com/abdulaaly/universal-browser-control)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Production%20Live-black.svg?logo=vercel)](https://universal-browser-control.vercel.app)
[![Manifest V3](https://img.shields.io/badge/Chrome_Extension-Manifest_V3-blue.svg)](chrome-extension)
[![Model Context Protocol](https://img.shields.io/badge/MCP-2024--11--05-purple.svg)](packages/mcp-server)
[![Design System](https://img.shields.io/badge/Design-Obsidian%20Command-6366f1.svg)](DESIGN.md)
[![Author](https://img.shields.io/badge/Contact-100xdigitizer%40gmail.com-black.svg)](mailto:100xdigitizer@gmail.com)

**Live Production Web Portal & Cloud Relay:**  
👉 **[https://universal-browser-control.vercel.app](https://universal-browser-control.vercel.app)**

**Public GitHub Repository:**  
👉 **[https://github.com/abdulaaly/universal-browser-control](https://github.com/abdulaaly/universal-browser-control)**

**Download Packaged Chrome Extension (.zip):**  
👉 **[extension-v1.0.0-chrome.zip](https://github.com/abdulaaly/universal-browser-control/releases/download/v1.0.0/extension-v1.0.0-chrome.zip)**

**Universal AI Browser Control** is a 100% open-source, vendor-agnostic browser automation system engineered to surpass closed proprietary extensions (such as the ChatGPT Chrome Extension `hehggadaopoacecdllhhajmbjkdcmajg`). 

It provides an open bridge allowing **ANY** AI client—including **Google Gemini**, **Anthropic Claude (Web, Desktop, iOS, Android)**, **Perplexity**, **Cursor**, and the **Antigravity CLI**—to safely control the user's live, authenticated desktop browser session without hijacking active tabs or exposing credentials.

---

## 🎨 Tier-1 "Obsidian Command" Design System

The UI was crafted from the ground up utilizing the official **Obsidian Command** design specification (synthesizing Linear, Raycast, and Cursor design tokens):
- **Obsidian Monolithic Palette:** Pure dark canvas (`#08090b`), surface ladder (`#0e1015` → `#14171f` → `#191d27`), and hairline borders (`1px solid #232834`).
- **Tactile Micro-Actions:** 2x2 grid in both the popup and sidepanel for instant DOM indexing, viewport capture, Markdown extraction, and agent cursor positioning.
- **Dedicated Popup Hub (`popup.html`):** Compact 360x520px extension popup featuring active tab domain, live CDP status badge, segmented transport switch (`Local WS` / `Public Tunnel`), and 1-click PAT token rotation.
- **5-Tab Multi-Modal Sidepanel (`sidepanel.html`):**
  1. `Agent Stream`: Natural-language prompt box with `⌘⏎` keycap, live timeline action feed, and emergency `Interrupt Run (Esc)` button.
  2. `DOM Inspector`: Searchable element index table with selector tags and numeric markers `[1]..[n]`.
  3. `DOM Actions`: Zero-friction action playground to dispatch clicks, synthesized typing, and background navigations.
  4. `Security HITL`: Human-In-The-Loop safety guardrails, sensitive domain interceptor, and whitelisted domains.
  5. `Protocol Logs`: Real-time CDP and MCP JSON-RPC protocol trace stream.

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
├── api/                   # Production Vercel Serverless MCP SSE & Relay Gateway
├── public/                # Live Production Web Companion Hub
├── ARCHITECTURE.md        # Comprehensive technical deconstruction & architectural specification
├── DESIGN.md              # Tier-1 Obsidian Command Design System Specification
├── SETUP.md               # Step-by-step connection guide for Gemini, Claude, Perplexity, Cursor
├── firebase.json          # Production Firebase configuration
├── firestore.rules        # Strict user-isolation security rules
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
git clone https://github.com/abdulaaly/universal-browser-control.git
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
   `universal-browser-control/packages/extension/dist` (or `universal-browser-control/chrome-extension`)
4. Pin the **Universal AI Browser Control** icon in your Chrome toolbar.
5. Click the extension icon to view the compact **Popup Hub** or open the **Side Panel** to inspect live telemetry.

### 3. Start the Local MCP Bridge
```bash
# Start local stdio MCP server for Antigravity or local agents
npx universal-browser start

# Or start in SSE streaming mode for remote web/mobile AI clients:
npx universal-browser start --sse --port 3000
```

---

## 🤖 AI Client Connection Configurations

### 1. Anthropic Claude (Web & iOS / Android Mobile)
Add the MCP configuration to your Claude Desktop config (`claude_desktop_config.json`) or mobile connection:
```json
{
  "mcpServers": {
    "universal-browser": {
      "url": "https://universal-browser-control.vercel.app/api/mcp/sse",
      "headers": {
        "Authorization": "Bearer ub_pat_live_89f0a8c2b7d41e9e03"
      }
    }
  }
}
```

### 2. Google Gemini (Web, API & CLI)
Add the MCP server configuration into your Gemini runtime:
```json
{
  "mcpServers": {
    "universal-browser": {
      "url": "https://universal-browser-control.vercel.app/api/mcp/sse",
      "headers": {
        "Authorization": "Bearer ub_pat_live_89f0a8c2b7d41e9e03"
      }
    }
  }
}
```

### 3. Cursor IDE
In Cursor **Settings → Features → MCP**, add a new SSE Server:
- **Name:** `universal-browser`
- **Type:** `sse`
- **URL:** `https://universal-browser-control.vercel.app/api/mcp/sse`
- **Headers:** `{"Authorization": "Bearer ub_pat_live_89f0a8c2b7d41e9e03"}`

### 4. Perplexity AI
Under Perplexity Developer Settings / MCP Connections:
```json
{
  "mcpServer": {
    "name": "universal-browser",
    "transport": "sse",
    "endpoint": "https://universal-browser-control.vercel.app/api/mcp/sse",
    "bearerToken": "ub_pat_live_89f0a8c2b7d41e9e03"
  }
}
```

### 5. Antigravity & Local CLI
Zero-config instant bridge via terminal:
```bash
npx @universal-browser/cli connect --url https://universal-browser-control.vercel.app/api/mcp/sse
```

---

## 📊 Comparison: Vendor-Locked Extension vs. Universal AI Browser Control

| Feature | Original ChatGPT Extension (`hehggadaop...`) | Universal AI Browser Control |
| :--- | :--- | :--- |
| **Supported Models** | ChatGPT Web Only | Gemini, Claude (Web/Mobile), Perplexity, Cursor, Antigravity CLI |
| **Remote / Mobile Control** | ❌ No | ✅ Full SSE & Encrypted Cloud Relay |
| **Dual Transport (stdio + SSE)** | ❌ Stdio/Local Only | ✅ Both Local `stdio` and Remote `SSE` |
| **Background Tab Isolation** | Partial | ✅ Full CDP Background Leases |
| **Visual Agent Cursor** | Basic | ✅ Physics-Based Bezier Curve & Click Ripple |
| **Security Guardrails** | Basic Confirmation | ✅ 3-Tier HITL (`[Allow Once]`, `[Domain]`, `[Deny]`) + 2FA |
| **Sensitive Domain Blocking** | Limited | ✅ Hard-Coded Bank/Vault Blocklist |
| **Design System** | Generic UI | ✅ Tier-1 Obsidian Command (Linear/Raycast/Cursor) |
| **Source Code & License** | Proprietary & Minified | ✅ 100% Open-Source (MIT) |

---

## 🛡️ Security & Privacy Architecture

1. **Local-First Execution:** By default, all CDP commands execute locally on your machine.
2. **Explicit User Leases:** The extension only connects to tabs when an automation action is triggered.
3. **No Credential Harvesting:** The extension never inspects password input values or transmits cookies.
4. **Instant Emergency Kill-Switch:** Users can hit `Esc` or click **Interrupt Run** at any microsecond to revoke automation leases immediately.

---

## 📄 License & Attribution

- **Author & Maintainer:** [100xdigitizer@gmail.com](mailto:100xdigitizer@gmail.com)
- **Repository:** [https://github.com/abdulaaly/universal-browser-control](https://github.com/abdulaaly/universal-browser-control)
- **License:** Released under the [MIT License](LICENSE).
