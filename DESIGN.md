---
version: alpha
name: Universal-Browser-Control-Design-System
description: |
  Universal AI Browser Control: A high-precision, developer-grade Chrome Extension & MCP Control Console blending the tactile utility of Raycast with the in-product AI telemetry of Cursor and the razor-sharp bento aesthetics of Linear. Built for autonomous agent sessions (Gemini, Claude, Perplexity, Cursor, Antigravity CLI) controlling live desktop browser tabs through Chrome DevTools Protocol (CDP) with Human-In-The-Loop (HITL) safety guardrails.

colors:
  primary: "#ffffff"
  primary-pressed: "#e8e8e8"
  on-primary: "#000000"
  accent-emerald: "#10b981"
  accent-emerald-soft: "rgba(16, 185, 129, 0.12)"
  accent-indigo: "#6366f1"
  accent-indigo-soft: "rgba(99, 102, 241, 0.12)"
  accent-amber: "#f59e0b"
  accent-amber-soft: "rgba(245, 158, 11, 0.12)"
  accent-rose: "#f43f5e"
  accent-rose-soft: "rgba(244, 63, 94, 0.12)"
  canvas: "#08090b"
  surface: "#0e1015"
  surface-elevated: "#14171f"
  surface-card: "#191d27"
  surface-card-hover: "#1f2430"
  hairline: "#232834"
  hairline-soft: "rgba(255, 255, 255, 0.06)"
  hairline-strong: "rgba(255, 255, 255, 0.14)"
  ink: "#f4f4f6"
  body: "#c4c8d4"
  mute: "#7a8296"
  ash: "#484f63"
  timeline-plan: "#dfa88f"
  timeline-index: "#9fc9a2"
  timeline-read: "#9fbbe0"
  timeline-exec: "#c0a8dd"
  timeline-done: "#e5c07b"

typography:
  display-lg:
    fontFamily: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.4px
  heading-md:
    fontFamily: Inter, sans-serif
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.2px
  heading-sm:
    fontFamily: Inter, sans-serif
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: -0.1px
  body-md:
    fontFamily: Inter, sans-serif
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: Inter, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm-strong:
    fontFamily: Inter, sans-serif
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.1px
  caption:
    fontFamily: Inter, sans-serif
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.1px
  caption-uppercase:
    fontFamily: Inter, sans-serif
    fontSize: 10px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.8px
    textTransform: uppercase
  code:
    fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
  code-lg:
    fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 10px
  xl: 14px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  xxl: 28px
  panel: 16px

components:
  nav-header:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    height: 48px
    padding: 0 14px
    hairline: "1px solid {colors.hairline}"
  status-dot-active:
    backgroundColor: "{colors.accent-emerald}"
    rounded: "{rounded.full}"
    size: 7px
  latency-pill:
    backgroundColor: "{colors.accent-emerald-soft}"
    textColor: "{colors.accent-emerald}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 2px 7px
  tab-context-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 10px 12px
    hairline: "1px solid {colors.hairline}"
  quick-action-button:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.md}"
    padding: 6px 10px
    hairline: "1px solid {colors.hairline}"
  chat-input-box:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 10px 12px
    hairline: "1px solid {colors.hairline}"
  suggestion-chip:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.body}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 3px 9px
    hairline: "1px solid {colors.hairline-soft}"
  activity-event-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 8px 10px
    hairline: "1px solid {colors.hairline}"
  keycap:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body}"
    typography: "{typography.code}"
    rounded: "{rounded.xs}"
    padding: 1px 5px
    hairline: "1px solid {colors.hairline-strong}"
  hitl-guard-banner:
    backgroundColor: "{colors.accent-amber-soft}"
    textColor: "{colors.accent-amber}"
    rounded: "{rounded.md}"
    padding: 8px 10px
    hairline: "1px solid rgba(245, 158, 11, 0.25)"
---

# Universal AI Browser Control — Design System Specification

## 1. Atmosphere & Philosophy
Universal Browser Control is a developer-centric instrument engineered for transparency, velocity, and safety. Rather than disguising AI as a playful novelty or cluttering the window with marketing logos, the interface feels like an authentic browser flight recorder and mission control panel. 

The aesthetic synthesizes:
- **Raycast's Tactile Precision:** Dark monochrome surface ladder (`#08090b` → `#0e1015` → `#14171f` → `#191d27`), 1px hairlines (`#232834`), crisp keycaps (`⌘ K`, `⌥ B`), and zero drop shadows.
- **Cursor's AI Telemetry:** Dedicated action timeline pills (Plan `#dfa88f`, Index `#9fc9a2`, Read `#9fbbe0`, Exec `#c0a8dd`, Done `#e5c07b`) with real-time millisecond execution counters and live DOM element counters.
- **Linear's Restraint:** Clean typography (Inter + JetBrains Mono), crisp 6–10px border radiuses, and high-visibility status indicators.

## 2. Color Surface Ladder
- **Canvas** (`#08090b`): The root deep canvas background.
- **Surface** (`#0e1015`): Outer card wrappers and sub-panels.
- **Surface Elevated** (`#14171f`): Active inputs, hovering chips, elevated controls.
- **Surface Card** (`#191d27`): Activity stream log cards, keycaps, and action buttons.
- **Hairlines** (`#232834` / `rgba(255, 255, 255, 0.08)`): Subtle 1px structural boundaries.

## 3. Telemetry & State Colors
- **Live Connected Status:** Emerald (`#10b981`) with soft glow badge (`rgba(16, 185, 129, 0.12)`).
- **AI Planning & Executing:** Indigo (`#6366f1`) with soft background (`rgba(99, 102, 241, 0.12)`).
- **HITL Permission Warning:** Amber (`#f59e0b`) with translucent guardrail card.
- **Error / Denied:** Rose (`#f43f5e`).

## 4. Typography Scale
- **Header & Title:** `Inter` 14–16px, weight 600, tight tracking (`-0.2px`).
- **Body & Secondary Copy:** `Inter` 12–13px, weight 400.
- **Code & Telemetry Data:** `JetBrains Mono` 11–12px, weight 500 for coordinates, tab IDs, and execution latency (`28ms`, `100xdigitizer@gmail.com`, `http://localhost:3000/sse`).

## 5. Components & Layout
1. **Nav Header (48px):** Clean logo mark, latency indicator (`8ms · TUNNEL`), and drawer trigger for Tunnel & Scoped PAT configuration.
2. **Active Tab Context Bar:** Displays current tab URL, active tab title, live interactive node count (`24 nodes indexed`), and 4 primary one-click actions:
   - `Index DOM` (highlight elements)
   - `Snapshot` (full viewport PNG)
   - `Markdown` (clean article reader mode)
   - `Pointer` (visual Bezier cursor toggle)
3. **Agent Action Feed:** Chronological action timeline showing:
   - Action name (`click_element`, `get_dom_tree`, `open_tab`)
   - Target coordinates or selector
   - Execution duration (`14ms`)
   - Status badge (`COMPLETED` / `DENIED`)
4. **HITL Permission Card:** Non-intrusive interactive card when AI requests sensitive access:
   - `Allow Once`
   - `Always for Domain`
   - `Deny`
5. **Tunnel & Access Hub Drawer:**
   - Local SSE Endpoint (`http://localhost:3000/sse`)
   - Public HTTPS Tunnel (`https://ub-tunnel-prod.loca.lt/sse`)
   - Scoped Bearer Token generator & copy button (`ub_pat_live_...`)
   - Quick instructions for ChatGPT Mobile, Claude, and CLI.
