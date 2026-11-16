// Universal AI Browser Control - Interactive DOM Indexer & Markdown Serializer

export interface IndexedElementData {
  index: number;
  tagName: string;
  role?: string;
  text: string;
  href?: string;
  selector: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isClickable: boolean;
  isInput: boolean;
}

export function indexPageElements(): { elements: IndexedElementData[]; markdown: string } {
  // Clear any existing badges or attributes
  document.querySelectorAll('[data-ub-index]').forEach(el => el.removeAttribute('data-ub-index'));

  const interactiveSelectors = [
    'a[href]',
    'button',
    'input',
    'textarea',
    'select',
    '[role="button"]',
    '[role="link"]',
    '[role="tab"]',
    '[role="checkbox"]',
    '[role="menuitem"]',
    '[role="option"]',
    '[tabindex="0"]'
  ];

  const matched = Array.from(document.querySelectorAll(interactiveSelectors.join(','))) as HTMLElement[];
  const elements: IndexedElementData[] = [];
  let currentIndex = 1;

  for (const el of matched) {
    // Check visibility
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;

    el.setAttribute('data-ub-index', String(currentIndex));

    const text = (el.innerText || (el as HTMLInputElement).value || el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.getAttribute('title') || '').trim().replace(/\s+/g, ' ').slice(0, 100);
    const tagName = el.tagName.toLowerCase();
    const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select';
    const isClickable = !isInput || (el as HTMLInputElement).type === 'submit' || (el as HTMLInputElement).type === 'button';

    elements.push({
      index: currentIndex,
      tagName,
      role: el.getAttribute('role') || undefined,
      text,
      href: (el as HTMLAnchorElement).href || undefined,
      selector: `[data-ub-index="${currentIndex}"]`,
      bounds: {
        x: Math.round(rect.left + window.scrollX),
        y: Math.round(rect.top + window.scrollY),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      },
      isClickable,
      isInput
    });

    currentIndex++;
  }

  // Generate clean Markdown structure
  const markdown = generateMarkdownSummary(elements);

  return { elements, markdown };
}

function generateMarkdownSummary(elements: IndexedElementData[]): string {
  const title = document.title || 'Untitled Page';
  const url = window.location.href;
  const lines: string[] = [];

  lines.push(`# ${title}`);
  lines.push(`URL: ${url}\n`);

  // Section headings
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4'));
  if (headings.length > 0) {
    lines.push(`## Page Headings`);
    headings.slice(0, 15).forEach(h => {
      const level = h.tagName.toLowerCase();
      const prefix = level === 'h1' ? '#' : level === 'h2' ? '##' : '###';
      lines.push(`${prefix} ${h.textContent?.trim().replace(/\s+/g, ' ')}`);
    });
    lines.push('');
  }

  // Interactive Elements Inventory
  lines.push(`## Interactive Elements ([Index] Tag "Label"):`);
  elements.slice(0, 100).forEach(el => {
    const roleTag = el.role ? `(${el.role})` : '';
    const linkDest = el.href ? ` -> ${el.href}` : '';
    lines.push(`- [${el.index}] <${el.tagName}${roleTag}> "${el.text}"${linkDest}`);
  });

  if (elements.length > 100) {
    lines.push(`\n... (${elements.length - 100} more interactive elements omitted for brevity)`);
  }

  return lines.join('\n');
}

// Listen for message requests from background worker
if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'INDEX_DOM') {
      const result = indexPageElements();
      sendResponse({ ok: true, data: result });
    }
    return true;
  });
}
