# Universal AI Browser Control — Complete Setup & Configuration Guide

**Author:** `100xdigitizer@gmail.com`  
**License:** MIT  

---

## 1. Local Development & Installation

### Step 1: Install Dependencies
```bash
git clone https://github.com/100xdigitizer/universal-browser-control.git
cd universal-browser-control
npm install
npm run build
```

### Step 2: Load Extension in Chrome, Edge, or Brave
1. Open your browser and navigate to `chrome://extensions` (or `edge://extensions` or `brave://extensions`).
2. Toggle on **Developer Mode** (top right switch).
3. Click the **Load unpacked** button.
4. Select the directory:
   `<path-to-repo>/packages/extension/dist`
5. The extension icon will appear in your extensions tray. Click the puzzle icon and pin **Universal AI Browser Control** to your toolbar.
6. Click the extension icon to verify the Side Panel opens and displays the **Universal AI Browser PRO** dashboard.

---

## 2. Running the Local Bridge

The Universal MCP Server connects directly to your active browser extension via a local WebSocket bridge.

### Running with CLI (Recommended)
```bash
# In packages/cli or using npx
npm run start --workspace=@universal-browser/cli
# Or:
node packages/cli/dist/index.js start
```

### Running with Stdio for Local AI Agents (Antigravity, Cursor, Claude Desktop)
```bash
node packages/mcp-server/dist/cli-entry.js
```

### Running with Remote SSE for Web & Mobile AI Clients (Gemini, Claude iOS/Android)
```bash
node packages/mcp-server/dist/cli-entry.js --sse --port 3000
```

---

## 3. Configuring AI Clients

### 🤖 Google Gemini Setup
1. In your Gemini API or custom assistant settings, define the MCP endpoint:
```json
{
  "mcpServers": {
    "universal-browser": {
      "url": "http://localhost:3000/sse",
      "headers": {
        "Authorization": "Bearer <YOUR_PAT_TOKEN>"
      }
    }
  }
}
```
2. You can generate a PAT token anytime in the Extension Side Panel or via CLI:
```bash
node packages/cli/dist/index.js token generate
```

---

### 🟣 Anthropic Claude Desktop
Open `%APPDATA%\Claude\claude_desktop_config.json` on Windows (or `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS) and add:

```json
{
  "mcpServers": {
    "universal-browser": {
      "command": "node",
      "args": [
        "<path-to-repo>/packages/mcp-server/dist/cli-entry.js"
      ]
    }
  }
}
```
Restart Claude Desktop. The hammer icon will appear in chat with all 15 browser tools available!

---

### 💻 Cursor IDE Setup
1. Open Cursor Settings -> **Features** -> **MCP**.
2. Click **Add New MCP Server**:
   - **Name:** `universal-browser`
   - **Type:** `command`
   - **Command:** `node <path-to-repo>/packages/mcp-server/dist/cli-entry.js`
3. Cursor Composer / Agent can now browse the web, read live documentation, and inspect local webapps directly inside your live browser session!

---

### ⚡ Antigravity CLI Setup
In your Antigravity workspace configuration:
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

## 4. Cloud Relay & Mobile Setup (Firebase Backend)

To control your home desktop browser from Claude on your iPhone, Gemini on the web, or remote cloud servers:

1. Start the Firebase Cloud Relay:
```bash
cd packages/firebase-backend
npm run start
```
2. Open the Chrome Extension Side Panel and click **Connect Cloud Relay**.
3. Point your remote mobile/web AI client to your relay endpoint with your Bearer PAT token.
4. Commands sent from your mobile phone will execute securely on your desktop browser with live visual feedback!

---

## 5. Troubleshooting & Diagnostics

Run the built-in diagnostic tool anytime:
```bash
node packages/cli/dist/index.js doctor
```

It validates:
- Node.js runtime compatibility
- WebSocket port availability (8765)
- SSE HTTP port availability (3000)
- Unpacked Chrome extension bundle integrity
