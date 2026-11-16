// Universal AI Browser Control - Chrome DevTools Protocol (CDP) Automation Engine

export class CdpEngine {
  private attachedTabs = new Set<number>();

  public async attach(tabId: number): Promise<void> {
    if (this.attachedTabs.has(tabId)) return;

    return new Promise((resolve, reject) => {
      chrome.debugger.attach({ tabId }, '1.3', () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          this.attachedTabs.add(tabId);
          resolve();
        }
      });
    });
  }

  public async detach(tabId: number): Promise<void> {
    if (!this.attachedTabs.has(tabId)) return;

    return new Promise((resolve) => {
      chrome.debugger.detach({ tabId }, () => {
        this.attachedTabs.delete(tabId);
        resolve();
      });
    });
  }

  public async sendCommand<T = unknown>(tabId: number, method: string, commandParams?: object): Promise<T> {
    await this.attach(tabId);

    return new Promise((resolve, reject) => {
      chrome.debugger.sendCommand({ tabId }, method, commandParams, (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(result as T);
        }
      });
    });
  }

  public async clickAt(tabId: number, x: number, y: number): Promise<void> {
    // 1. Mouse move
    await this.sendCommand(tabId, 'Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x,
      y
    });

    // 2. Mouse pressed
    await this.sendCommand(tabId, 'Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x,
      y,
      button: 'left',
      clickCount: 1
    });

    // Small delay between press and release
    await new Promise((r) => setTimeout(r, 60));

    // 3. Mouse released
    await this.sendCommand(tabId, 'Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x,
      y,
      button: 'left',
      clickCount: 1
    });
  }

  public async typeString(tabId: number, text: string): Promise<void> {
    for (const char of text) {
      await this.sendCommand(tabId, 'Input.dispatchKeyEvent', {
        type: 'keyDown',
        text: char,
        unmodifiedText: char
      });
      await this.sendCommand(tabId, 'Input.dispatchKeyEvent', {
        type: 'keyUp',
        text: char,
        unmodifiedText: char
      });
      // realistic typing jitter
      await new Promise((r) => setTimeout(r, 20));
    }
  }

  public async pressKey(tabId: number, key: string): Promise<void> {
    await this.sendCommand(tabId, 'Input.dispatchKeyEvent', {
      type: 'keyDown',
      key
    });
    await new Promise((r) => setTimeout(r, 40));
    await this.sendCommand(tabId, 'Input.dispatchKeyEvent', {
      type: 'keyUp',
      key
    });
  }

  public async scroll(tabId: number, x: number, y: number, deltaX: number, deltaY: number): Promise<void> {
    await this.sendCommand(tabId, 'Input.dispatchMouseEvent', {
      type: 'mouseWheel',
      x,
      y,
      deltaX,
      deltaY
    });
  }

  public async captureScreenshot(tabId: number, format: 'png' | 'jpeg' = 'png'): Promise<string> {
    const result = await this.sendCommand<{ data: string }>(tabId, 'Page.captureScreenshot', {
      format,
      quality: 90
    });
    return `data:image/${format};base64,${result.data}`;
  }

  public handleDetach(tabId: number) {
    this.attachedTabs.delete(tabId);
  }
}
