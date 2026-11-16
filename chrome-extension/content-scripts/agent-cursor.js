(function(){var d;const s="universal-browser-agent-cursor-root";if(document.getElementById(s))return;const i=document.createElement("div");i.id=s,i.style.cssText="position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:2147483647;",document.documentElement.appendChild(i);const r=i.attachShadow({mode:"closed"}),a=document.createElement("style");a.textContent=`
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
  `,r.appendChild(a);const o=document.createElement("div");o.className="agent-pointer",o.style.display="none",o.innerHTML=`
    <svg viewBox="0 0 24 24" class="pointer-icon">
      <path d="M3 3l7 18 3-7 7-3L3 3z"/>
    </svg>
  `,r.appendChild(o);const n=document.createElement("div");n.className="target-highlight",n.style.display="none",r.appendChild(n);function p(e,l){o.style.display="block",o.style.transform=`translate(${e}px, ${l}px)`}function c(e,l){const t=document.createElement("div");t.className="click-ripple",t.style.left=`${e}px`,t.style.top=`${l}px`,t.style.width="30px",t.style.height="30px",r.appendChild(t),setTimeout(()=>t.remove(),600)}function h(e){n.style.display="block",n.style.left=`${e.x-window.scrollX}px`,n.style.top=`${e.y-window.scrollY}px`,n.style.width=`${e.width}px`,n.style.height=`${e.height}px`,setTimeout(()=>{n.style.display="none"},2e3)}typeof chrome<"u"&&((d=chrome.runtime)!=null&&d.onMessage)&&chrome.runtime.onMessage.addListener((e,l,t)=>(e.type==="CURSOR_MOVE"?(p(e.x,e.y),t({ok:!0})):e.type==="CURSOR_CLICK"?(p(e.x,e.y),c(e.x,e.y),e.bounds&&h(e.bounds),t({ok:!0})):e.type==="CURSOR_HIDE"&&(o.style.display="none",n.style.display="none",t({ok:!0})),!0))})();
