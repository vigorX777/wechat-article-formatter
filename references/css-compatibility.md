# 微信公众号 CSS 兼容性规范

在将 HTML 粘贴到微信公众号编辑器时，由于编辑器会过滤掉大部分 CSS 属性并对 HTML 结构进行清理，必须遵循以下兼容性规范。本规范通过代码对比展示常见问题的解决方案。

## 1. `<div>` 样式不生效问题
**问题**: `<div>` 上的大部分样式（如 `margin`, `padding`, `border`, `background-color` 等）在粘贴后往往会失效或被移除，导致排版错乱。
**解决方案**: 使用 `<table>` 替代 `<div>` 作为布局容器，样式写在 `<td>` 上。

```html
<!-- ❌ 不生效 -->
<div style="background-color: #FFF5F0; border: 1px solid #D97757; padding: 20px;">
  [图片占位符]
</div>

<!-- ✅ 正确写法 -->
<table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
  <tbody><tr>
    <td style="background-color: #FFF5F0; border: 1px solid #D97757; padding: 30px 20px; text-align: center;">
      [图片占位符]
    </td>
  </tr></tbody>
</table>
```

## 2. `<tr>` 背景色不生效问题
**问题**: `<tr>` 标签上的 `background-color` 在公众号编辑器中通常不生效，导致表格行失去预期的背景色。
**解决方案**: 将背景色样式直接写在 `<td>` 或 `<th>` 标签上。

```html
<!-- ❌ 不生效 -->
<tr style="background-color: #D97757;">
  <th>标题</th>
</tr>

<!-- ✅ 正确写法 -->
<tr>
  <th style="background-color: #D97757; color: #FFFFFF; padding: 12px 15px;">标题</th>
</tr>
```

## 3. 代码块换行丢失问题
**问题**: 公众号编辑器不支持 `white-space: pre-wrap`，导致长代码无法自动换行，且连续空格会被压缩。
**解决方案**: 
- 手动将换行符转换为 `<br>`。
- 将空格转换为 `&nbsp;`。

```html
<!-- ❌ 换行丢失 -->
<section style="white-space: pre-wrap;">
line1
line2
  indented
</section>

<!-- ✅ 正确写法 -->
<section style="background-color: #2D2D2D; color: #E8E8E8; padding: 16px 20px;">
line1<br>line2<br>&nbsp;&nbsp;indented
</section>
```

## 4. 边框样式限制
**问题**: `border: dashed`（虚线边框）和 `border-radius`（圆角）在某些移动端环境下支持不佳，或者会被编辑器强制修改或移除。
**解决方案**: 优先使用实线边框，且样式应写在 `<td>` 或具体的块级标签内联 style 中。

```html
<!-- ❌ 可能不生效 -->
<div style="border: 2px dashed #D97757; border-radius: 8px;">
  内容
</div>

<!-- ✅ 正确写法 -->
<table style="width: 100%; border-collapse: collapse;">
  <tr>
    <td style="border: 1px solid #D97757; padding: 15px;">
      内容
    </td>
  </tr>
</table>
```

## 5. 不支持的 CSS 属性清单
以下属性在微信公众号编辑器中通常不生效或会被过滤，请避免使用：

- `display: flex` / `display: grid`（布局请用 table）
- `box-shadow`（部分生效，稳定性差）
- `transform`（旋转、缩放等效果无法保证）
- CSS 变量 `var(--xxx)`
- `@media` 媒体查询（无法实现响应式 CSS）
- `position: fixed` / `position: absolute`（仅支持默认定位）

## 6. 表格单元格字体大小不继承问题
**问题**: 在 `<table>` 标签上设置的 `font-size` 不会被 `<th>` 和 `<td>` 正确继承，导致表格内文字显示为浏览器默认大小（通常为 14px 左右）。

**根本原因**: 微信公众号编辑器在处理粘贴内容时，会对 HTML 结构进行清理和重写，CSS 继承关系被打断。只有**直接写在元素上的内联样式**才能可靠保留。

**解决方案**: 必须在每个 `<th>` 和 `<td>` 标签上**显式声明** `font-size`。

```html
<!-- ❌ 不生效（依赖继承） -->
<table style="font-size: 16px;">
  <tr>
    <th style="padding: 12px 15px; background-color: #D97757;">标题</th>
  </tr>
  <tr>
    <td style="padding: 12px 15px;">内容</td>
  </tr>
</table>

<!-- ✅ 正确写法（显式声明） -->
<table style="width: 100%; border-collapse: collapse; font-size: 16px;">
  <tr>
    <th style="padding: 12px 15px; background-color: #D97757; color: #FFFFFF; font-size: 16px;">标题</th>
  </tr>
  <tr>
    <td style="padding: 12px 15px; background-color: #FFFFFF; font-size: 16px;">内容</td>
  </tr>
</table>
```

**规则**: 生成表格时，所有 `<th>` 和 `<td>` 必须包含 `font-size` 属性。

## 7. 复制粘贴时样式丢失问题
**问题**: 使用传统的 `document.execCommand('copy')` 复制 HTML 内容时，在某些浏览器（特别是 Safari）中粘贴后会丢失 HTML 格式，只保留纯文本。

**解决方案**: 使用 Clipboard API，同时写入 `text/html` 和 `text/plain` 两种格式。

```javascript
// ❌ 可能丢失格式
const range = document.createRange();
range.selectNodeContents(content);
const selection = window.getSelection();
selection.removeAllRanges();
selection.addRange(range);
document.execCommand('copy');

// ✅ 正确写法（保留 HTML 格式）
const htmlContent = content.innerHTML;
const blob = new Blob([htmlContent], { type: 'text/html' });
const textBlob = new Blob([content.innerText], { type: 'text/plain' });

await navigator.clipboard.write([
  new ClipboardItem({
    'text/html': blob,
    'text/plain': textBlob
  })
]);
```

## 8. 其他注意事项
- **外链**: 不支持 `<a>` 标签跳转到非公众号域名以外的链接（会被移除 `href`）。
- **图片**: 图片必须使用公众号素材库地址。Skill 生成时应使用占位符，由用户手动替换。
- **字体**: 公众号会强制使用系统默认字体，设置 `font-family` 效果有限。
