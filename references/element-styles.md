# WeChat Article Formatter: Element Styles

本文档包含了 `wechat-article-formatter` Skill 使用的元素样式模板，旨在将常用的 Markdown 元素转换为与微信公众号完全兼容的 HTML 结构和内联样式。

## 配色方案 (Claude 主题)

| 用途 | 色值 | 说明 |
| :--- | :--- | :--- |
| 主色 | `#D97757` | Claude 橙 |
| 主色浅 | `#E8956D` | 渐变用 |
| 背景浅 | `#FFF5F0` | 占位符背景 |
| 背景灰 | `#FAF9F7` | 表格交替行 |
| 文字色 | `#2D2D2D` | 正文 |
| 代码背景 | `#2D2D2D` | 深色 |
| 代码文字 | `#E8E8E8` | 浅色 |
| 代码注释 | `#6A9955` | 绿色 |

### 色系变量（用于自定义派生）

当用户指定自定义主色时，需要替换以下色值：

| 变量名 | 默认值 | 派生规则 | 用途 |
| :--- | :--- | :--- | :--- |
| `{主色}` | `#D97757` | 用户提供 | 标题边框、强调文字、引用边框 |
| `{主色浅}` | `#E8956D` | 主色 L+10% | 渐变辅助 |
| `{背景浅}` | `#FFF5F0` | 主色 S=15%, L=97% | 占位符背景、高亮背景 |
| `{背景灰}` | `#FAF9F7` | 固定（中性灰） | 表格交替行、代码块背景 |

---

## 字号规范

> **重要**: 所有字号已统一调整，确保手机端阅读舒适度。

| 元素 | 字号 | 说明 |
| :--- | :--- | :--- |
| H1 标题 | 22px | 居中大标题 |
| H2 标题 | 20px | 章节标题 |
| H3 标题 | 18px | 小节标题 |
| 正文段落 | 16px | 主要阅读内容 |
| 引用块 | 16px | 引用文字 |
| 列表项 | 16px | 有序/无序列表 |
| 表格单元格 | 16px | th/td 必须显式声明 |
| 行内代码 | 14px | code 标签 |
| 代码块 | 14px | 代码区块 |
| 图片占位符 | 14px | 占位提示文字 |

---

## 元素模板

### 0. 外层容器
> **用途**：包裹全文，提供浅色底色和圆角，提升卡片感。
```html
<section style="background: rgba(0,0,0,0.02); border-radius: 12px; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;">
{全文内容}
</section>
```

### 1. H1 标题（居中）
```html
<h1 style="font-size: 22px; font-weight: bold; color: #1A1A1A; margin-bottom: 30px; text-align: center; line-height: 1.4;">{标题}</h1>
```

### 2. H2 标题（带左边框）
```html
<h2 style="font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif; font-size: 20px; font-weight: bold; color: #1A1A1A; margin-top: 40px; margin-bottom: 20px; padding-left: 12px; padding-bottom: 8px; border-left: 4px solid #D97757; border-bottom: 1px dashed #D97757;">{标题}</h2>
```

### 3. H3 标题（主题色）
```html
<h3 style="font-size: 18px; font-weight: bold; color: #D97757; margin-top: 30px; margin-bottom: 16px;">{标题}</h3>
```

### 4. 段落
```html
<p style="font-size: 16px; color: #2D2D2D; margin-bottom: 20px; line-height: 1.75; letter-spacing: 0.05em; text-align: justify;">{内容}</p>
```

### 5. 强调文字
```html
<strong style="font-weight: bold; color: #D97757;">{强调内容}</strong>
```

### 6. 行内代码
```html
<code style="background-color: #F0F0F0; color: #D97757; padding: 2px 6px; border-radius: 4px; font-family: Menlo, Monaco, Consolas, monospace; font-size: 14px; letter-spacing: 0;">{代码}</code>
```

### 7. 代码块
> **注意**：使用 `section` 标签，换行使用 `br`，缩进使用 `&nbsp;`。
```html
<section style="background-color: #2D2D2D; color: #E8E8E8; padding: 16px 20px; border-radius: 8px; margin: 20px 0; font-family: Menlo, Monaco, Consolas, 'Microsoft YaHei', monospace; font-size: 14px; line-height: 2; letter-spacing: 0; display: block;">
<span style="color: #6A9955;"># 注释用绿色</span><br>
command --flag=value<br>
&nbsp;&nbsp;缩进内容
</section>
```

### 8. 引用块
```html
<blockquote style="border-left: 4px solid #D97757; background-color: #FAF9F7; color: #666666; padding: 14px 16px; margin: 20px 0; font-size: 16px; border-radius: 0 4px 4px 0;">
<p style="margin: 0; font-size: 16px; line-height: 1.8;">{引用内容}</p>
</blockquote>
```

### 9. 无序列表
```html
<ul style="margin-bottom: 20px; padding-left: 20px;">
<li style="margin-bottom: 10px; font-size: 16px; line-height: 1.8;">{列表项}</li>
</ul>
```

### 10. 有序列表
```html
<ol style="margin-bottom: 20px; padding-left: 20px;">
<li style="margin-bottom: 10px; font-size: 16px; line-height: 1.8;">{列表项}</li>
</ol>
```

### 11. 表格
> **关键**：
> 1. 背景色必须直接应用在 `td` 或 `th` 标签上
> 2. **字体大小必须在每个 `<th>` 和 `<td>` 上显式声明**，不能依赖继承

```html
<table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 16px;">
<thead>
<tr>
<th style="padding: 12px 15px; text-align: left; border: 1px solid #E5E5E5; background-color: #D97757; color: #FFFFFF; font-size: 16px;">列1</th>
<th style="padding: 12px 15px; text-align: left; border: 1px solid #E5E5E5; background-color: #D97757; color: #FFFFFF; font-size: 16px;">列2</th>
</tr>
</thead>
<tbody>
<tr>
<td style="padding: 12px 15px; border: 1px solid #E5E5E5; background-color: #FFFFFF; font-size: 16px;">内容</td>
<td style="padding: 12px 15px; border: 1px solid #E5E5E5; background-color: #FFFFFF; font-size: 16px;">内容</td>
</tr>
<tr>
<td style="padding: 12px 15px; border: 1px solid #E5E5E5; background-color: #FAF9F7; font-size: 16px;">交替行</td>
<td style="padding: 12px 15px; border: 1px solid #E5E5E5; background-color: #FAF9F7; font-size: 16px;">交替行</td>
</tr>
</tbody>
</table>
```

### 12. 图片占位符
> **限制**：必须使用 `table` 结构模拟，避免使用公众号支持较差的 `div`。占位符 `WECHATIMGPH_N` 会被 CDP 脚本识别并替换为实际图片。
```html
<table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
<tbody><tr>
<td style="background-color: #FFF5F0; border: 1px solid #D97757; color: #D97757; padding: 30px 20px; text-align: center; font-weight: bold; font-size: 14px;">
WECHATIMGPH_1
</td>
</tr></tbody>
</table>
```

### 13. 分隔线
```html
<hr style="background: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.1), rgba(0,0,0,0)); height: 1px; border: none; margin: 40px 0;">
```

---

## 约束与规范

1. **禁用 CSS 布局**：不要使用 `flex`, `grid`, `box-shadow`, `transform` 等高级 CSS 属性。
2. **背景色限制**：不要在 `div` 上应用背景色，微信公众号可能会在转发或查看时丢失。请使用 `table` 或 `section` (针对代码块) 代替。
3. **白空格处理**：代码块中禁止使用 `white-space: pre-wrap`，需通过手动替换换行符为 `<br>` 和空格为 `&nbsp;` 来实现样式一致。
4. **字体继承**：微信公众号编辑器不会正确继承表格的 `font-size`，必须在每个 `<th>` 和 `<td>` 上显式声明。
