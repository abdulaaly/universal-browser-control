// Universal AI Browser Control - Natural Visual Agent Cursor Overlay

(function initAgentCursor() {
  const OVERLAY_ID = 'universal-browser-agent-cursor-root';
  if (document.getElementById(OVERLAY_ID)) return;

  const container = document.createElement('div');
  container.id = OVERLAY_ID;
  container.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:2147483647;';
  document.documentElement.appendChild(container);

  const shadow = container.attachShadow({ mode: 'closed' });

  const style = document.createElement('style');
  style.textContent = `
    .agent-pointer {
      position: absolute;
      width: 24px;
      height: 24px;
      transform: translate(0, 0);
      transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1);
      pointer-events: none;
      filter: drop-shadow(0 2px 6px rgba(0,0,0,0.3));
    }
    .pointer-icon {
      fill: #22c55e;
      stroke: #ffffff;
      stroke-width: 1.5;
    }
    .click-ripple {
      position: absolute;
      border-radius: 50%;
      border: 2px solid #22c55e;
      background: rgba(34, 197, 94, 0.2);
      pointer-events: none;
      transform: translate(-50%, -50%) scale(0);
      animation: ripple 0.5s ease-out forwards;
    }
    .target-highlight {
      position: absolute;
      border: 2px solid #22c55e;
      border-radius: 4px;
      background: rgba(34, 197, 94, 0.1);
      box-shadow: 0 0 12px rgba(34, 197, 94, 0.4);
      pointer-events: none;
      transition: all 0.2s ease-out;
    }
    @keyframes ripple {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
    }
  `;
  shadow.appendChild(style);

  const cursorEl = document.createElement('div');
  cursorEl.className = 'agent-pointer';
  cursorEl.style.display = 'none';
  cursorEl.innerHTML = `
    <svg viewBox="0 0 24 24" class="pointer-icon">
      <path d="M3 3l7 18 3-7 7-3L3 3z"/>
    </svg>
  `;
  shadow.appendChild(cursorEl);

  const highlightEl = document.createElement('div');
  highlightEl.className = 'target-highlight';
  highlightEl.style.display = 'none';
  shadow.appendChild(highlightEl);

  function animateTo(x: number, y: number) {
    cursorEl.style.display = 'block';
    cursorEl.style.transform = `translate(${x}px, ${y}px)`;
  }

  function triggerRipple(x: number, y: number) {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '30px';
    ripple.style.height = '30px';
    shadow.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  function highlightElement(bounds: { x: number; y: number; width: number; height: number }) {
    highlightEl.style.display = 'block';
    highlightEl.style.left = `${bounds.x - window.scrollX}px`;
    highlightEl.style.top = `${bounds.y - window.scrollY}px`;
    highlightEl.style.width = `${bounds.width}px`;
    highlightEl.style.height = `${bounds.height}px`;

    setTimeout(() => {
      highlightEl.style.display = 'none';
    }, 2000);
  }

  if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
      if (msg.type === 'CURSOR_MOVE') {
        animateTo(msg.x, msg.y);
        sendResponse({ ok: true });
      } else if (msg.type === 'CURSOR_CLICK') {
        animateTo(msg.x, msg.y);
        triggerRipple(msg.x, msg.y);
        if (msg.bounds) {
          highlightElement(msg.bounds);
        }
        sendResponse({ ok: true });
      } else if (msg.type === 'CURSOR_HIDE') {
        cursorEl.style.display = 'none';
        highlightEl.style.display = 'none';
        sendResponse({ ok: true });
      }
      return true;
    });
  }
})();
