import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import process from 'node:process';
import { launchChrome, getPageSession, waitForNewTab, clickElement, evaluate, sleep, retry, waitForElement, type ChromeSession, type CdpConnection } from './cdp.ts';
import { copyImageToClipboard, copyHtmlToClipboard } from './clipboard.ts';

const WECHAT_URL = 'https://mp.weixin.qq.com/';

interface ImageInfo {
  placeholder: string;
  localPath: string;
  originalPath: string;
}

interface Manifest {
  title?: string;
  author?: string;
  subtitle?: string;
  summary?: string;
  coverImage?: string;
  contentImages?: ImageInfo[];
}

interface PublishOptions {
  htmlFile: string;
  manifestFile?: string;
  coverImage?: string;
  profileDir?: string;
}

interface SaveDraftResult {
  triggered: boolean;
  toastDetected: boolean;
  buttonSelector?: string;
  method: 'selector' | 'text' | 'shortcut' | 'unknown';
}

interface PublishFlowVerdict {
  titleOk: boolean;
  authorOk: boolean;
  summaryOk: boolean;
  contentOk: boolean;
  imageCountOk: boolean;
  saveToastOk: boolean;
  blockingDialog: boolean;
}

async function waitForLogin(session: ChromeSession, timeoutMs = 120_000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const url = await evaluate<string>(session, 'window.location.href');
    if (url.includes('/cgi-bin/home')) return true;
    await sleep(2000);
  }
  return false;
}

async function clickMenuByText(session: ChromeSession, text: string): Promise<void> {
  console.log(`[wechat] Clicking "${text}" menu...`);

  await retry(async () => {
    const posResult = await session.cdp.send<{ result: { value: string } }>('Runtime.evaluate', {
      expression: `
        (function() {
          const items = document.querySelectorAll('.new-creation__menu .new-creation__menu-item');
          for (const item of items) {
            const title = item.querySelector('.new-creation__menu-title');
            if (title && title.textContent?.trim() === '${text}') {
              item.scrollIntoView({ block: 'center' });
              const rect = item.getBoundingClientRect();
              return JSON.stringify({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 });
            }
          }
          return 'null';
        })()
      `,
      returnByValue: true,
    }, { sessionId: session.sessionId });

    if (posResult.result.value === 'null') throw new Error(`Menu "${text}" not found`);
    const pos = JSON.parse(posResult.result.value);

    await session.cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: pos.x, y: pos.y, button: 'left', clickCount: 1 }, { sessionId: session.sessionId });
    await sleep(100);
    await session.cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: pos.x, y: pos.y, button: 'left', clickCount: 1 }, { sessionId: session.sessionId });
  }, { maxAttempts: 5, delayMs: 1000, label: `clickMenuByText(${text})` });
}

async function sendCopy(cdp?: CdpConnection, sessionId?: string): Promise<void> {
  if (process.platform === 'darwin') {
    spawnSync('osascript', ['-e', 'tell application "Google Chrome" to activate']);
    await sleep(150);
    spawnSync('osascript', ['-e', 'tell application "System Events" to keystroke "c" using command down']);
  } else if (process.platform === 'linux') {
    spawnSync('xdotool', ['key', 'ctrl+c']);
  } else if (cdp && sessionId) {
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'c', code: 'KeyC', modifiers: 2, windowsVirtualKeyCode: 67 }, { sessionId });
    await sleep(50);
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'c', code: 'KeyC', modifiers: 2, windowsVirtualKeyCode: 67 }, { sessionId });
  }
}

async function sendSave(cdp?: CdpConnection, sessionId?: string): Promise<void> {
  if (process.platform === 'darwin') {
    spawnSync('osascript', ['-e', 'tell application "Google Chrome" to activate']);
    await sleep(150);
    spawnSync('osascript', ['-e', 'tell application "System Events" to keystroke "s" using command down']);
  } else if (process.platform === 'linux') {
    spawnSync('xdotool', ['key', 'ctrl+s']);
  } else if (cdp && sessionId) {
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 's', code: 'KeyS', modifiers: 2, windowsVirtualKeyCode: 83 }, { sessionId });
    await sleep(50);
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 's', code: 'KeyS', modifiers: 2, windowsVirtualKeyCode: 83 }, { sessionId });
  }
}

async function sendPaste(cdp?: CdpConnection, sessionId?: string): Promise<void> {
  if (process.platform === 'darwin') {
    spawnSync('osascript', ['-e', 'tell application "Google Chrome" to activate']);
    await sleep(150);
    spawnSync('osascript', ['-e', 'tell application "System Events" to keystroke "v" using command down']);
  } else if (process.platform === 'linux') {
    spawnSync('xdotool', ['key', 'ctrl+v']);
  } else if (cdp && sessionId) {
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'v', code: 'KeyV', modifiers: 2, windowsVirtualKeyCode: 86 }, { sessionId });
    await sleep(50);
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'v', code: 'KeyV', modifiers: 2, windowsVirtualKeyCode: 86 }, { sessionId });
  }
}

function getRawHtmlForClipboard(htmlFilePath: string): string {
  const absolutePath = path.isAbsolute(htmlFilePath) ? htmlFilePath : path.resolve(process.cwd(), htmlFilePath);
  const siblingRawPath = path.join(path.dirname(absolutePath), 'raw-content.txt');

  if (fs.existsSync(siblingRawPath)) {
    console.log(`[wechat] Using sibling raw-content.txt for clipboard HTML: ${siblingRawPath}`);
    return fs.readFileSync(siblingRawPath, 'utf-8');
  }

  console.log('[wechat] raw-content.txt not found, falling back to HTML file contents');
  return fs.readFileSync(absolutePath, 'utf-8');
}

async function copyHtmlForEditor(htmlFilePath: string): Promise<string> {
  const htmlContent = getRawHtmlForClipboard(htmlFilePath);
  console.log('[wechat] Copying prepared HTML into system clipboard...');
  await copyHtmlToClipboard(htmlContent);
  await sleep(500);
  return htmlContent;
}

async function syntheticPasteHtml(session: ChromeSession, htmlContent: string): Promise<boolean> {
  const textContent = htmlContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  await evaluate(session, `window.__wechatPasteHtml = ${JSON.stringify(htmlContent)};`);
  await evaluate(session, `window.__wechatPasteText = ${JSON.stringify(textContent)};`);

  return await evaluate<boolean>(session, `
    (() => {
      const editor = document.querySelector('.ProseMirror');
      if (!editor) return false;
      editor.focus();
      const dt = new DataTransfer();
      dt.setData('text/html', window.__wechatPasteHtml || '');
      dt.setData('text/plain', window.__wechatPasteText || '');
      const evt = new ClipboardEvent('paste', {
        clipboardData: dt,
        bubbles: true,
        cancelable: true,
      });
      return editor.dispatchEvent(evt);
    })()
  `);
}

async function pasteFromClipboardInEditor(session: ChromeSession, htmlContent?: string): Promise<void> {
  console.log('[wechat] Pasting content...');
  await sendPaste(session.cdp, session.sessionId);
  await sleep(1500);

  const hasContent = await evaluate<boolean>(session, `
    (() => {
      const editor = document.querySelector('.ProseMirror');
      return !!(editor && editor.textContent && editor.textContent.trim().length > 10);
    })()
  `);
  if (!hasContent) {
    if (htmlContent) {
      console.warn('[wechat] ⚠ Editor still empty after system paste — trying synthetic HTML paste...');
      await syntheticPasteHtml(session, htmlContent);
      await sleep(1500);
    } else {
      console.warn('[wechat] ⚠ Editor may be empty after paste — retrying paste...');
      await sendPaste(session.cdp, session.sessionId);
      await sleep(2000);
    }
  }
}

async function selectAndReplacePlaceholder(session: ChromeSession, placeholder: string): Promise<boolean> {
  const result = await session.cdp.send<{ result: { value: boolean } }>('Runtime.evaluate', {
    expression: `
      (function() {
        const editor = document.querySelector('.ProseMirror');
        if (!editor) return false;

        const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT, null, false);
        let node;

        while ((node = walker.nextNode())) {
          const text = node.textContent || '';
          const idx = text.indexOf(${JSON.stringify(placeholder)});
          if (idx !== -1) {
            node.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

            const range = document.createRange();
            range.setStart(node, idx);
            range.setEnd(node, idx + ${placeholder.length});
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            return true;
          }
        }
        return false;
      })()
    `,
    returnByValue: true,
  }, { sessionId: session.sessionId });

  return result.result.value;
}

async function pressDeleteKey(session: ChromeSession): Promise<void> {
  await session.cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8 }, { sessionId: session.sessionId });
  await sleep(50);
  await session.cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8 }, { sessionId: session.sessionId });
}

async function getEditorImageCount(session: ChromeSession): Promise<number> {
  return await evaluate<number>(session, `
    (() => {
      const editor = document.querySelector('.ProseMirror');
      if (!editor) return 0;
      return editor.querySelectorAll('img').length;
    })()
  `);
}

async function waitForEditorImageCountIncrease(session: ChromeSession, beforeCount: number, timeoutMs = 15_000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const currentCount = await getEditorImageCount(session);
    if (currentCount > beforeCount) return true;
    await sleep(500);
  }
  return false;
}

async function waitForSelector(session: ChromeSession, selectors: string[], timeoutMs = 15_000): Promise<string | null> {
  const selectorList = JSON.stringify(selectors);
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const result = await session.cdp.send<{ result: { value: string } }>('Runtime.evaluate', {
      expression: `
        (() => {
          const selectors = ${selectorList};
          for (const s of selectors) {
            if (document.querySelector(s)) return s;
          }
          return '';
        })()
      `,
      returnByValue: true,
    }, { sessionId: session.sessionId });
    if (result.result.value) return result.result.value;
    await sleep(500);
  }
  return null;
}

async function clickBySelector(session: ChromeSession, selector: string): Promise<boolean> {
  const result = await session.cdp.send<{ result: { value: boolean } }>('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) return false;
        el.scrollIntoView({ block: 'center' });
        el.click();
        return true;
      })()
    `,
    returnByValue: true,
  }, { sessionId: session.sessionId });
  return result.result.value;
}

async function fillInputField(
  session: ChromeSession,
  label: string,
  selectors: string[],
  value: string,
  options?: { required?: boolean },
): Promise<boolean> {
  const selector = await waitForSelector(session, selectors, 15_000);
  if (!selector) {
    if (options?.required) {
      throw new Error(`${label} field not found`);
    }
    console.warn(`[wechat] ⚠ ${label} field not found.`);
    return false;
  }

  console.log(`[wechat] Filling ${label} via ${selector}...`);
  const normalizedValue = value.trim();
  let verified = false;

  for (let attempt = 1; attempt <= 3; attempt++) {
    verified = await evaluate<boolean>(session, `
      (() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) return false;
        el.scrollIntoView({ block: 'center' });
        if (typeof el.focus === 'function') el.focus();
        if ('click' in el && typeof el.click === 'function') el.click();
        el.value = ${JSON.stringify(normalizedValue)};
        ['input', 'change', 'blur'].forEach(type => {
          el.dispatchEvent(new Event(type, { bubbles: true }));
        });
        return (el.value || '').trim() === ${JSON.stringify(normalizedValue)};
      })()
    `);
    if (verified) break;
    console.warn(`[wechat] ${label} write verification failed (attempt ${attempt}/3), retrying...`);
    await sleep(400);
  }

  if (!verified) {
    const message = `${label} did not persist after input/change/blur events`;
    if (options?.required) {
      throw new Error(message);
    }
    console.warn(`[wechat] ⚠ ${message}`);
    return false;
  }

  return true;
}

async function detectBlockingDialog(session: ChromeSession): Promise<boolean> {
  return await evaluate<boolean>(session, `
    (() => {
      const dialog = document.querySelector('.weui-desktop-dialog, .weui-dialog, [role="dialog"]');
      if (!dialog) return false;
      const text = (dialog.textContent || '').trim();
      const visible = dialog.offsetParent !== null || dialog.getBoundingClientRect().height > 0;
      return visible && text.length > 0;
    })()
  `);
}

async function collectPublishFlowVerdict(
  session: ChromeSession,
  expected: { title?: string; author?: string; summary?: string; imageCount: number },
  saveResult: SaveDraftResult,
): Promise<PublishFlowVerdict> {
  return await evaluate<PublishFlowVerdict>(session, `
    (() => {
      const titleEl = document.querySelector('#title');
      const authorEl = document.querySelector('#author');
      const summaryEl = document.querySelector('#js_description');
      const editor = document.querySelector('.ProseMirror');
      const dialog = document.querySelector('.weui-desktop-dialog, .weui-dialog, [role="dialog"]');
      const dialogVisible = !!dialog && ((dialog.offsetParent !== null) || dialog.getBoundingClientRect().height > 0) && ((dialog.textContent || '').trim().length > 0);
      const actualTitle = (titleEl?.value || '').trim();
      const actualAuthor = (authorEl?.value || '').trim();
      const actualSummary = (summaryEl?.value || '').trim();
      const imageCount = editor ? editor.querySelectorAll('img').length : 0;
      const textLen = (editor?.textContent || '').trim().length;

      return {
        titleOk: ${expected.title ? `actualTitle === ${JSON.stringify(expected.title.trim())}` : 'true'},
        authorOk: ${expected.author ? `actualAuthor === ${JSON.stringify(expected.author.trim())}` : 'true'},
        summaryOk: ${expected.summary ? `actualSummary === ${JSON.stringify(expected.summary.trim())}` : 'true'},
        contentOk: textLen > 50,
        imageCountOk: imageCount >= ${expected.imageCount},
        saveToastOk: ${saveResult.toastDetected ? 'true' : 'false'},
        blockingDialog: dialogVisible,
      };
    })()
  `);
}

async function findFileInput(session: ChromeSession, timeoutMs = 10_000): Promise<number | null> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const { root } = await session.cdp.send<{ root: { nodeId: number } }>('DOM.getDocument', {}, { sessionId: session.sessionId });
    const selectors = [
      'input[type="file"][accept*="image"]',
      'input[type="file"][accept*="jpeg"]',
      'input[type="file"][accept*="png"]',
      'input[type="file"]',
    ];
    for (const selector of selectors) {
      try {
        const { nodeId } = await session.cdp.send<{ nodeId: number }>('DOM.querySelector', {
          nodeId: root.nodeId,
          selector,
        }, { sessionId: session.sessionId });
        if (nodeId) return nodeId;
      } catch { /* selector not found */ }
    }
    await sleep(500);
  }
  return null;
}

async function uploadCoverImage(session: ChromeSession, coverPath: string): Promise<void> {
  const absolutePath = path.isAbsolute(coverPath) ? coverPath : path.resolve(process.cwd(), coverPath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Cover image not found: ${absolutePath}`);
  }
  console.log(`[wechat] Uploading cover image: ${absolutePath}`);

  // Step 1: Click cover area → opens material dialog
  console.log('[wechat] Clicking cover area...');
  const coverAreaSelectors = [
    '#js_cover_img_area',
    '[data-target=\"cover\"]',
    '[class*=\"cover\"][class*=\"img\"]',
    '[class*=\"cover\"][class*=\"upload\"]',
    '[class*=\"cover\"]',
  ];
  const coverArea = await waitForSelector(session, coverAreaSelectors, 10_000);
  let clickedCover = false;
  if (coverArea) {
    console.log(`[wechat] Found cover area selector: ${coverArea}`);
    clickedCover = await clickBySelector(session, coverArea);
  }
  if (!clickedCover) {
    console.log('[wechat] Cover selector not found, trying text match...');
    const clicked = await session.cdp.send<{ result: { value: boolean } }>('Runtime.evaluate', {
      expression: `
        (() => {
          const texts = ['封面', '题图', '上传封面', '封面图'];
          const candidates = Array.from(document.querySelectorAll('button, a, div, span'));
          for (const el of candidates) {
            const text = (el.textContent || '').trim();
            const cls = (el.className || '').toString();
            if (texts.some(t => text.includes(t)) || cls.includes('cover')) {
              el.scrollIntoView({ block: 'center' });
              el.click();
              return true;
            }
          }
          return false;
        })()
      `,
      returnByValue: true,
    }, { sessionId: session.sessionId });
    clickedCover = clicked.result.value;
  }
  if (!clickedCover) {
    console.warn('[wechat] ⚠ Cover area not found. Please upload the cover image manually in the browser window.');
    return;
  }
  await sleep(2000);

  // Step 2: Find and click "上传图片" tab in the material dialog
  const uploadTabSelectors = [
    '.js_upload_tab',
    '.weui-desktop-dialog .upload-tab',
    '[class*="upload"]',
  ];
  const uploadTab = await waitForSelector(session, uploadTabSelectors, 5_000);
  if (uploadTab) {
    console.log(`[wechat] Found upload tab: ${uploadTab}`);
    await clickBySelector(session, uploadTab);
    await sleep(1000);
  } else {
    // Try clicking text "上传图片" via text content search
    console.log('[wechat] Upload tab not found by selector, trying text match...');
    const clicked = await session.cdp.send<{ result: { value: boolean } }>('Runtime.evaluate', {
      expression: `
        (() => {
          // Look for any clickable element with upload-related text in the dialog
          const texts = ['上传图片', '本地上传', '从电脑上传', '选择文件'];
          const candidates = document.querySelectorAll('.weui-desktop-dialog a, .weui-desktop-dialog button, .weui-desktop-dialog .weui-desktop-tab__nav-item, .weui-desktop-dialog [role="tab"], [class*="tab"]');
          for (const el of candidates) {
            const t = (el.textContent || '').trim();
            if (texts.some(x => t.includes(x))) {
              el.click();
              return true;
            }
          }
          return false;
        })()
      `,
      returnByValue: true,
    }, { sessionId: session.sessionId });
    if (clicked.result.value) {
      console.log('[wechat] Clicked upload tab via text match');
      await sleep(1000);
    }
  }

  // Step 3: Find hidden file input and inject file via CDP
  console.log('[wechat] Looking for file input...');
  const fileNodeId = await findFileInput(session, 10_000);
  if (!fileNodeId) {
    console.warn('[wechat] ⚠ File input not found. Cover image upload requires manual interaction.');
    console.warn('[wechat]   Please upload the cover image manually in the browser window.');
    return;
  }

  console.log(`[wechat] Found file input (nodeId: ${fileNodeId}), injecting file...`);
  await session.cdp.send('DOM.setFileInputFiles', {
    nodeId: fileNodeId,
    files: [absolutePath],
  }, { sessionId: session.sessionId });
  console.log('[wechat] File injected, waiting for upload processing...');
  await sleep(3000);

  // Step 4: Handle crop/confirm dialog
  // WeChat shows a crop dialog after image upload with ratio options (2.35:1, 1:1)
  // and a confirm button
  console.log('[wechat] Looking for crop confirm button...');
  const cropConfirmSelectors = [
    '.weui-desktop-dialog .weui-desktop-btn_primary',
    '.js_crop_confirm',
    '.weui-desktop-dialog .btn_primary',
    '.weui-desktop-dialog button[class*="primary"]',
    '.image-cropper .weui-desktop-btn_primary',
  ];
  const confirmBtn = await waitForSelector(session, cropConfirmSelectors, 10_000);
  if (confirmBtn) {
    console.log(`[wechat] Found crop confirm button: ${confirmBtn}`);
    // Small delay to let crop UI render fully
    await sleep(1000);
    await clickBySelector(session, confirmBtn);
    await sleep(2000);
    console.log('[wechat] Cover image uploaded and confirmed.');
  } else {
    // Fallback: try clicking any primary button in a dialog
    console.log('[wechat] Crop confirm button not found by selector, trying text match...');
    const confirmed = await session.cdp.send<{ result: { value: boolean } }>('Runtime.evaluate', {
      expression: `
        (() => {
          const texts = ['完成', '确定', '确认', '保存'];
          const btns = document.querySelectorAll('.weui-desktop-dialog button, .weui-desktop-dialog .weui-desktop-btn');
          for (const btn of btns) {
            const t = (btn.textContent || '').trim();
            if (texts.some(x => t === x)) {
              btn.click();
              return true;
            }
          }
          return false;
        })()
      `,
      returnByValue: true,
    }, { sessionId: session.sessionId });
    if (confirmed.result.value) {
      console.log('[wechat] Clicked confirm via text match');
      await sleep(2000);
    } else {
      console.warn('[wechat] ⚠ Could not find confirm button. Please confirm crop manually.');
    }
  }
}

async function saveDraft(session: ChromeSession): Promise<SaveDraftResult> {
  console.log('[wechat] Saving as draft...');

  let triggerMethod: SaveDraftResult['method'] = 'unknown';
  let triggerSelector: string | undefined;

  await retry(async () => {
    const saveSelectors = [
      '#js_submit button',
      '.js_submit button',
      '#js_submit',
      '.js_submit',
      '#js_save',
      '.weui-desktop-btn_primary',
      'button[type="submit"]',
      '[class*="submit"] button',
      '[class*="save"] button',
    ];
    const selector = await waitForSelector(session, saveSelectors, 3_000);
    let clicked = false;
    if (selector) {
      console.log(`[wechat] Found save button selector: ${selector}`);
      clicked = await clickBySelector(session, selector);
      if (clicked) {
        triggerMethod = 'selector';
        triggerSelector = selector;
      }
    }
    if (!clicked) {
      const result = await session.cdp.send<{ result: { value: boolean } }>('Runtime.evaluate', {
        expression: `
          (() => {
            const texts = ['保存', '保存草稿', '草稿'];
            const btns = Array.from(document.querySelectorAll('button, a, div, span'));
            for (const btn of btns) {
              const text = (btn.textContent || '').trim();
              const style = window.getComputedStyle(btn);
              const visible = style.display !== 'none' && style.visibility !== 'hidden' && btn.getBoundingClientRect().width > 0 && btn.getBoundingClientRect().height > 0;
              if (visible && texts.some(t => text.includes(t))) {
                btn.scrollIntoView({ block: 'center' });
                btn.click();
                return true;
              }
            }
            return false;
          })()
        `,
        returnByValue: true,
      }, { sessionId: session.sessionId });
      clicked = result.result.value;
      if (clicked) {
        triggerMethod = 'text';
      }
    }
    if (!clicked) {
      console.warn('[wechat] Save button not found by selector/text, trying Cmd+S...');
      await sendSave(session.cdp, session.sessionId);
      triggerMethod = 'shortcut';
      await sleep(1000);
      const shortcutWorked = await evaluate<boolean>(session, `
        (() => {
          const toast = document.querySelector('.weui-desktop-toast');
          if (!toast) return false;
          const text = (toast.textContent || '').trim();
          return text.includes('保存成功') || text.includes('已保存') || text.includes('保存');
        })()
      `);
      if (shortcutWorked) {
        triggerSelector = undefined;
        return;
      }
      const diagnostics = await evaluate<string[]>(session, `
        (() => Array.from(document.querySelectorAll('button, a, div, span'))
          .map(el => ({
            text: (el.textContent || '').trim(),
            cls: (el.className || '').toString()
          }))
          .filter(item => item.text && /保存|草稿/.test(item.text))
          .slice(0, 20)
          .map(item => item.text + ' :: ' + item.cls)
        )()
      `);
      console.warn('[wechat] Save candidates seen on page:', diagnostics);
      throw new Error('Save button not found');
    }
  }, { maxAttempts: 3, delayMs: 1000, label: 'saveDraft-click' });

  const start = Date.now();
  const timeoutMs = 15_000;
  while (Date.now() - start < timeoutMs) {
    const toastVisible = await evaluate<boolean>(session, `
      (() => {
        const toast = document.querySelector('.weui-desktop-toast');
        if (!toast) return false;
        const text = toast.textContent || '';
        return text.includes('保存成功') || text.includes('已保存') || text.includes('保存');
      })()
    `);
    if (toastVisible) {
      console.log('[wechat] Draft saved successfully!');
      return {
        triggered: true,
        toastDetected: true,
        buttonSelector: triggerSelector,
        method: triggerMethod,
      };
    }
    await sleep(500);
  }
  console.warn('[wechat] ⚠ Save confirmation toast not detected within timeout — draft may still have been saved');
  return {
    triggered: true,
    toastDetected: false,
    buttonSelector: triggerSelector,
    method: triggerMethod,
  };
}

function parseManifest(manifestPath: string): Manifest {
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest file not found: ${manifestPath}`);
  }
  const content = fs.readFileSync(manifestPath, 'utf-8');
  return JSON.parse(content) as Manifest;
}

function preflightCheck(htmlFile: string, manifest: Manifest, manifestFile?: string): void {
  console.log('[wechat] Running pre-flight checks...');
  const errors: string[] = [];

  const htmlContent = fs.readFileSync(htmlFile, 'utf-8');
  const contentImages = manifest.contentImages || [];

  for (const img of contentImages) {
    let imagePath = img.localPath;
    if (manifestFile && !path.isAbsolute(imagePath)) {
      imagePath = path.resolve(path.dirname(manifestFile), imagePath);
    }
    if (!fs.existsSync(imagePath)) {
      errors.push(`[Missing file] ${img.placeholder} → ${imagePath}`);
    }
  }

  const htmlPlaceholders: string[] = htmlContent.match(/WECHATIMGPH_\d+/g) ?? [];
  const uniqueHtmlPlaceholders = [...new Set(htmlPlaceholders)];
  const manifestPlaceholders = new Set(contentImages.map(img => img.placeholder));

  for (const ph of uniqueHtmlPlaceholders) {
    if (!manifestPlaceholders.has(ph)) {
      errors.push(`[Unmapped placeholder] ${ph} found in HTML but missing in manifest.json`);
    }
  }

  for (const img of contentImages) {
    if (!uniqueHtmlPlaceholders.includes(img.placeholder)) {
      errors.push(`[Orphan mapping] ${img.placeholder} in manifest.json but not found in HTML`);
    }
  }

  const effectiveCover = manifest.coverImage;
  if (effectiveCover && !fs.existsSync(effectiveCover)) {
    errors.push(`[Missing cover] ${effectiveCover}`);
  }

  if (errors.length > 0) {
    console.error('[wechat] ❌ Pre-flight check FAILED:');
    for (const err of errors) {
      console.error(`  ${err}`);
    }
    console.error('\n[wechat] Hint: After changing images or article content, re-run Step 7 (wechat-article-formatter) to regenerate article.html + raw-content.txt + manifest.json together.');
    throw new Error(`Pre-flight check failed with ${errors.length} error(s). Fix issues before publishing.`);
  }

  console.log(`[wechat] ✅ Pre-flight check passed (${contentImages.length} images, ${uniqueHtmlPlaceholders.length} placeholders)`);
}

export async function publishArticle(options: PublishOptions): Promise<void> {
  const { htmlFile, manifestFile, coverImage, profileDir } = options;

  if (!fs.existsSync(htmlFile)) {
    throw new Error(`HTML file not found: ${htmlFile}`);
  }

  let manifest: Manifest = {};
  if (manifestFile) {
    manifest = parseManifest(manifestFile);
    console.log(`[wechat] Loaded manifest: ${manifestFile}`);
    console.log(`[wechat] Title: ${manifest.title || '(empty)'}`);
    console.log(`[wechat] Author: ${manifest.author || '(empty)'}`);
    console.log(`[wechat] Subtitle: ${manifest.subtitle || '(empty)'}`);
    console.log(`[wechat] Summary: ${manifest.summary || '(empty)'}`);
    console.log(`[wechat] Content images: ${manifest.contentImages?.length || 0}`);
  }

  const contentImages = manifest.contentImages || [];

  preflightCheck(htmlFile, manifest, manifestFile);

  const { cdp } = await launchChrome(WECHAT_URL, profileDir);

  try {
    console.log('[wechat] Waiting for page load...');
    let session = await retry(
      () => getPageSession(cdp, 'mp.weixin.qq.com'),
      { maxAttempts: 6, delayMs: 1000, label: 'getPageSession' },
    );

    const url = await evaluate<string>(session, 'window.location.href');
    if (!url.includes('/cgi-bin/home')) {
      console.log('[wechat] Not logged in. Please scan QR code...');
      const loggedIn = await waitForLogin(session);
      if (!loggedIn) throw new Error('Login timeout');
    }
    console.log('[wechat] Logged in.');

    const menuReady = await waitForElement(session, '.new-creation__menu', 10_000);
    if (!menuReady) {
      console.warn('[wechat] ⚠ Menu container not detected, proceeding anyway...');
    }

    const targets = await cdp.send<{ targetInfos: Array<{ targetId: string; url: string; type: string }> }>('Target.getTargets');
    const initialIds = new Set(targets.targetInfos.map(t => t.targetId));

    await clickMenuByText(session, '文章');

    const editorTargetId = await waitForNewTab(cdp, initialIds, 'mp.weixin.qq.com');
    console.log('[wechat] Editor tab opened.');

    const { sessionId } = await cdp.send<{ sessionId: string }>('Target.attachToTarget', { targetId: editorTargetId, flatten: true });
    session = { cdp, sessionId, targetId: editorTargetId };

    await cdp.send('Page.enable', {}, { sessionId });
    await cdp.send('Runtime.enable', {}, { sessionId });
    await cdp.send('DOM.enable', {}, { sessionId });

    const editorReady = await waitForSelector(session, ['#title', '.ProseMirror'], 15_000);
    if (!editorReady) {
      console.warn('[wechat] ⚠ Editor may not be fully loaded, proceeding...');
    }

    if (manifest.title) {
      await fillInputField(session, 'title', ['#title', 'input#title', 'textarea#title'], manifest.title, { required: true });
    }

    if (manifest.author) {
      await fillInputField(session, 'author', ['#author', 'input#author', 'textarea#author'], manifest.author);
    }

    console.log('[wechat] Focusing editor...');
    await clickElement(session, '.ProseMirror');
    await sleep(300);
    await clickElement(session, '.ProseMirror');
    await sleep(300);

    console.log(`[wechat] Preparing HTML content from: ${htmlFile}`);
    const htmlContent = await copyHtmlForEditor(htmlFile);
    await sleep(500);
    console.log('[wechat] Pasting into editor...');
    await pasteFromClipboardInEditor(session, htmlContent);
    await sleep(1000);

    if (contentImages.length > 0) {
      console.log(`[wechat] Inserting ${contentImages.length} images...`);
      for (let i = 0; i < contentImages.length; i++) {
        const img = contentImages[i]!;
        console.log(`[wechat] [${i + 1}/${contentImages.length}] Processing: ${img.placeholder}`);

        let found = false;
        for (let attempt = 1; attempt <= 3; attempt++) {
          found = await selectAndReplacePlaceholder(session, img.placeholder);
          if (found) break;
          if (attempt < 3) {
            console.log(`[wechat] Placeholder "${img.placeholder}" not found (attempt ${attempt}/3), waiting...`);
            await sleep(2000);
          }
        }
        if (!found) {
          console.warn(`[wechat] Placeholder not found: ${img.placeholder}`);
          continue;
        }

        await sleep(500);

        let imagePath = img.localPath;
        if (manifestFile && !path.isAbsolute(imagePath)) {
          const manifestDir = path.dirname(manifestFile);
          imagePath = path.resolve(manifestDir, imagePath);
        }

        if (!fs.existsSync(imagePath)) {
          console.warn(`[wechat] Image file not found: ${imagePath}`);
          continue;
        }

        console.log(`[wechat] Copying image: ${path.basename(imagePath)}`);
        await copyImageToClipboard(imagePath);
        await sleep(300);

        const beforeImageCount = await getEditorImageCount(session);

        console.log('[wechat] Deleting placeholder with Backspace...');
        await pressDeleteKey(session);
        await sleep(200);

        console.log('[wechat] Pasting image...');
        await pasteFromClipboardInEditor(session);
        const inserted = await waitForEditorImageCountIncrease(session, beforeImageCount, 15_000);
        if (!inserted) {
          throw new Error(`Image paste did not produce a new <img> node for ${img.placeholder} (${path.basename(imagePath)})`);
        }
        await sleep(1000);
      }
      console.log('[wechat] All images inserted.');
    }

    const effectiveSummary = manifest.subtitle || manifest.summary;
    if (effectiveSummary) {
      await fillInputField(session, 'summary', ['#js_description', 'textarea#js_description'], effectiveSummary);
    }

    let saveResult: SaveDraftResult;
    try {
      saveResult = await saveDraft(session);
    } catch (error) {
      console.warn('[wechat] ⚠ Automatic draft save failed. Please save manually in the current editor page.');
      console.warn(`[wechat]   Reason: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }

    const verdict = await collectPublishFlowVerdict(session, {
      title: manifest.title,
      author: manifest.author,
      summary: effectiveSummary,
      imageCount: contentImages.length,
    }, saveResult);

    if (verdict.blockingDialog || !verdict.titleOk || !verdict.contentOk || !verdict.imageCountOk || !verdict.saveToastOk) {
      console.warn('[wechat] ⚠ Publish flow requires manual review.', verdict);
      if (verdict.blockingDialog) {
        throw new Error('Blocking dialog detected after save attempt');
      }
      if (!verdict.titleOk) {
        throw new Error('Title was not persisted in WeChat editor');
      }
      if (!verdict.contentOk) {
        throw new Error('Editor content looks incomplete after paste/save');
      }
      if (!verdict.imageCountOk) {
        throw new Error('Not all content images were inserted into editor');
      }
      if (!verdict.saveToastOk) {
        throw new Error('Draft save success toast was not detected');
      }
    }

    const blockingDialog = await detectBlockingDialog(session);
    if (blockingDialog) {
      throw new Error('Blocking dialog remains open in editor');
    }

    console.log('[wechat] ✅ Publish flow completed with verified draft-save state.');

    console.log('[wechat] Stopped on the current editor page by request. Cover upload is skipped.');
    console.log('[wechat] Browser window left open.');
    return;
  } finally {
    cdp.close();
  }
  
  // Explicitly exit after completion
  process.exit(0);
}

function printUsage(): never {
  console.log(`Publish article to WeChat Official Account

Usage:
  npx -y bun publish.ts --html <path> [options]

Options:
  --html <path>      HTML file to paste (REQUIRED)
  --manifest <path>  manifest.json file with title, author, images
  --cover <path>     Cover image path
  --profile <dir>    Chrome profile directory
  --help             Show this help

Examples:
  npx -y bun publish.ts --html .wechat-output/article.html
  npx -y bun publish.ts --html .wechat-output/article.html --manifest .wechat-output/manifest.json
  npx -y bun publish.ts --html article.html --manifest manifest.json --cover cover.jpg
`);
  process.exit(0);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) printUsage();

  let htmlFile: string | undefined;
  let manifestFile: string | undefined;
  let coverImage: string | undefined;
  let profileDir: string | undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    if (arg === '--html' && args[i + 1]) htmlFile = args[++i];
    else if (arg === '--manifest' && args[i + 1]) manifestFile = args[++i];
    else if (arg === '--cover' && args[i + 1]) coverImage = args[++i];
    else if (arg === '--profile' && args[i + 1]) profileDir = args[++i];
  }

  if (!htmlFile) {
    console.error('Error: --html is required');
    process.exit(1);
  }

  await publishArticle({ htmlFile, manifestFile, coverImage, profileDir });
}

await main().catch((err) => {
  console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
