## 复制功能实现规范

生成的 HTML 预览文件**必须**包含以下复制函数实现，使用 Clipboard API 确保粘贴时保留 HTML 格式：

```javascript
async function copyContent() {
  const content = document.getElementById('output');
  const btn = document.querySelector('.copy-btn');
  
  try {
    // 主方案：Clipboard API（保留 HTML 格式）
    const htmlContent = content.innerHTML;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const textBlob = new Blob([content.innerText], { type: 'text/plain' });
    
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': blob,
        'text/plain': textBlob
      })
    ]);
    
    btn.textContent = '✅ 已复制';
    btn.classList.add('copied');
  } catch (err) {
    // 降级方案：传统选择复制
    const range = document.createRange();
    range.selectNodeContents(content);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    selection.removeAllRanges();
    
    btn.textContent = '✅ 已复制';
    btn.classList.add('copied');
  }
  
  setTimeout(() => {
    btn.textContent = '📋 复制全文';
    btn.classList.remove('copied');
  }, 2000);
}
```

> **重要**: 不要使用传统的 `document.execCommand('copy')` 作为主方案，它在 Safari 等浏览器中可能丢失 HTML 格式。
