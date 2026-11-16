# Universal AI Browser Control — Design System & UI Specification (`DESIGN.md`)

**Author:** `100xdigitizer@gmail.com`  
**License:** MIT  
**Version:** 2.0.0 (Elevated Precision Edition)

---

## 1. Aesthetic Identity & Design Philosophy

Universal AI Browser Control rejects generic, bloated UI templates ("AI slop") in favor of an **ultra-refined, dark cyber-minimalist developer console**. The design balances mission-critical security controls with dense, legible telemetry and instantaneous responsiveness.

### Core Principles
1. **Uncompromised Information Density:** Maximum utility per pixel. Essential metrics (active AI client, latency, connection mode, HITL state) are immediately visible without scrolling.
2. **Deterministic Clarity:** States are distinct, unequivocal, and color-coded. A green pulse indicates a live WebSocket connection; amber signifies pending human authorization; red signals a policy violation or blocked sensitive domain.
3. **Tactile Feedback & Micro-Interactions:** Subtle hover states, smooth token rotation animations, and instant clipboard copy feedback instill trust and confidence in autonomous browser actions.

---

## 2. Design Tokens & Palette

### Background & Surface Hierarchy
- **Deep Void (Root Canvas):** `#030712` (Tailwind `slate-950` / neutral black)
- **Obsidian Surface 1 (Cards & Modals):** `#0a0f1d` with 1px border `rgba(30, 41, 59, 0.8)`
- **Obsidian Surface 2 (Code & Inputs):** `#020617` with inset border `rgba(15, 23, 42, 0.9)`
- **Glassmorphism Backdrop:** `rgba(10, 15, 29, 0.75)` with `backdrop-filter: blur(12px)`

### Accent & Semantic Tokens
- **Cyber Emerald (Primary / Active / Safe):**
  - Base: `#10b981` (Emerald 500)
  - Glow / Highlight: `#34d399` (Emerald 400)
  - Dark Badge: `#022c22` with border `#065f46`
- **Quantum Cyan (Relay / Remote Stream):**
  - Base: `#06b6d4` (Cyan 500)
  - Glow: `#38bdf8` (Sky 400)
- **Amber Warning (Human-in-the-Loop Gating):**
  - Base: `#f59e0b` (Amber 500)
  - Dark Card: `rgba(69, 26, 3, 0.4)` with border `rgba(180, 83, 9, 0.6)`
- **Rose Guardrail (Blocklist / Deny / Error):**
  - Base: `#f43f5e` (Rose 500)
  - Dark Card: `rgba(76, 5, 25, 0.4)` with border `rgba(190, 18, 60, 0.6)`

---

## 3. Typography Scale & Font Stack

- **Primary UI Font:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif`
- **Monospace Code & Telemetry:** `"JetBrains Mono", "Fira Code", Menlo, Monaco, Consolas, monospace`

| Element | Size | Weight | Line Height | Tracking |
| :--- | :--- | :--- | :--- | :--- |
| **Header Title** | `14px` (`0.875rem`) | `700` (Bold) | `1.25` | `-0.025em` |
| **Section Headings** | `13px` (`0.8125rem`) | `600` (Semibold) | `1.3` | `-0.01em` |
| **Body / Labels** | `12px` (`0.75rem`) | `400` / `500` | `1.4` | `normal` |
| **Badges & Metadata** | `11px` (`0.6875rem`) | `500` (Medium) | `1.2` | `+0.01em` |
| **Code Snippets & PAT** | `11.5px` | `400` (Mono) | `1.5` | `normal` |

---

## 4. UI Architecture & View Hierarchy

The enhanced user interface provides a dedicated multi-tab view inside Chrome's Side Panel (and Popup):

```
+-------------------------------------------------------------+
|  [⚡ Universal AI Browser PRO]      [Local WS] [14ms] [HITL] |
|  Active Client: Gemini / Claude / Cursor                    |
+-------------------------------------------------------------+
|  [ Connect Hub ]  [ Active Tabs ]  [ Live Feed ]  [ Playground ]|
+-------------------------------------------------------------+
|                                                             |
|  [TAB 1: Connect Hub]                                       |
|  - Remote MCP SSE URL + 1-Click Copy                        |
|  - Scoped PAT Token with Instant Rotate Button              |
|  - Multi-client Config Switcher (Gemini, Claude, Cursor, CLI)|
|                                                             |
|  [TAB 2: Active Tabs & Background Leases]                   |
|  - Live list of open browser tabs                           |
|  - Visual indicators for foreground vs background lease     |
|  - 1-click Focus and Close actions                          |
|                                                             |
|  [TAB 3: Live Action Audit Feed]                            |
|  - Real-time stream of CDP/MCP operations                   |
|  - Execution latencies, status checkmarks, timestamps       |
|                                                             |
|  [TAB 4: Live Automation Playground]                        |
|  - Interactive diagnostic panel                             |
|  - 1-click "Inspect DOM", "Take Screenshot", "Click Element"|
|                                                             |
+-------------------------------------------------------------+
|  Universal AI Browser Control • MIT • 100xdigitizer@gmail.com|
+-------------------------------------------------------------+
```

---

## 5. Visual Agent Feedback in Host Pages

When an AI interacts with a live tab:
1. **Interactive Node Overlay:** Elements are highlighted with temporary numeric tags (`[1]`, `[2]`, `[3]`).
2. **Smooth Cursor Trajectory:** An emerald pointer glides across the viewport via cubic-bezier easing to indicate element selection.
3. **Click Ripple Effect:** An expanding pulse ring confirms the exact coordinates of synthetic mouse events.
4. **Isolated Context:** Rendered entirely inside a closed Shadow DOM container (`closed` mode) to guarantee zero interference with host page styles or scripts.
