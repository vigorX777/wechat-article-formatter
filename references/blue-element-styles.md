# WeChat Article Formatter: 蓝色专业主题样式

本文档包含蓝色专业主题的元素样式模板，适用于数据分析报告、用户研究、商业报告等专业内容。

## 配色方案 (蓝色专业主题)

| 用途 | 色值 | 说明 |
| :--- | :--- | :--- |
| 主色 | `#2563eb` | 专业蓝 |
| 主色深 | `#1d4ed8` | 渐变结束色 |
| 强调色 | `#3b82f6` | 按钮、渐变起始 |
| 背景浅 | `#eff6ff` | 浅蓝背景、引用块 |
| 背景深浅蓝 | `#dbeafe` | 渐变辅助色 |
| 页面背景 | `#f8fafc` | 近白灰 |
| 卡片背景 | `#ffffff` | 纯白 |
| 文字色-深 | `#1e3a5f` | 引用块文字 |
| 文字色-正文 | `#4a4a4a` | 正文段落 |
| 文字色-浅 | `#9ca3af` | 辅助说明 |
| 边框色 | `#e5e7eb` | 表格边框 |

---

## 字号规范

| 元素 | 字号 | 说明 |
| :--- | :--- | :--- |
| 主标题 | 26px | 头部区域大标题 |
| H2 章节标题 | 20px | 中文序号方块 + 标题 |
| H3 小节标题 | 18px | 蓝色文字 |
| 正文段落 | 16px | line-height: 2.4 |
| 引用块 | 16px | 浅蓝背景 |
| 列表项 | 16px | 有序/无序列表 |
| 表格单元格 | 16px | th/td 必须显式声明 |
| 代码块 | 14px | 深色背景 |
| 辅助文字 | 15px | 数据来源、日期等 |
| 胶囊标签 | 12px | 头部分类标签 |

---

## 页面结构模板

### 整体页面结构
```html
<section style="box-sizing: border-box; margin: 0px auto; padding: 0px; background-color: #f8fafc;">

<!-- 头部区域 -->
<section style="box-sizing: border-box; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 20px 50px; overflow: hidden; border-radius: 0px 0px 24px 24px;">
  <!-- 胶囊标签 -->
  <section style="box-sizing: border-box; display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 4px 12px; border-radius: 20px; margin-bottom: 15px;">
    <span style="color: #ffffff; font-size: 12px; letter-spacing: 1px;">{分类标签}</span>
  </section>
  <!-- 主标题 -->
  <h1 style="margin: 0px 0px 15px; font-size: 26px; color: #ffffff; line-height: 1.3; font-weight: bold;">{主标题}</h1>
  <!-- 副标题 -->
  <p style="margin: 0px; color: rgba(255, 255, 255, 0.9); font-size: 16px; line-height: 1.6;">{副标题}</p>
  <!-- 数据来源 -->
  <p style="margin: 20px 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 15px;">{数据来源}</p>
</section>

<!-- 内容卡片 -->
<section style="box-sizing: border-box; padding: 28px 22px; background: #ffffff; margin: -20px 15px 24px; border-radius: 16px; box-shadow: rgba(0, 0, 0, 0.06) 0px 8px 30px;">
  <!-- 核心观点引用块 -->
  <section style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 16px; padding: 20px 24px; border-left: 5px solid #2563eb; margin: 0;">
    <p style="font-size: 16px; color: #1e3a5f; line-height: 2; letter-spacing: 0.3px; margin: 0;">{核心观点}</p>
  </section>
</section>

<!-- 正文区域 -->
<section style="box-sizing: border-box; padding: 0 20px 35px;">
  {正文内容}
</section>

</section>
```

---

## 元素模板

### 1. 章节标题（中文序号方块）
```html
<p style="margin: 0 0 24px 0; line-height: 40px;">
<span style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; font-size: 20px; font-weight: bold; width: 44px; height: 40px; line-height: 40px; text-align: center; border-radius: 12px; margin-right: 12px; vertical-align: middle;">一</span>
<span style="font-size: 20px; color: #1a1a1a; font-weight: bold; vertical-align: middle;">{章节标题}</span>
</p>
```

> **中文序号对照**: 一、二、三、四、五、六、七、八、九、十

### 2. H3 小节标题
```html
<h3 style="font-size: 18px; font-weight: bold; color: #2563eb; margin-top: 30px; margin-bottom: 16px;">{标题}</h3>
```

### 3. 段落
```html
<p style="font-size: 16px; color: #4a4a4a; line-height: 2.4; letter-spacing: 0.3px; margin: 0 0 16px 0;">{内容}</p>
```

### 4. 强调文字
```html
<strong style="color: #2563eb;">{强调内容}</strong>
```

### 5. 引用块
```html
<section style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 16px; padding: 20px 24px; border-left: 5px solid #2563eb; margin: 20px 0;">
<p style="font-size: 16px; color: #1e3a5f; line-height: 2; letter-spacing: 0.3px; margin: 0;">{引用内容}</p>
</section>
```

### 6. 渐变分隔线
```html
<section style="height: 2px; background: linear-gradient(90deg, transparent, rgba(37,99,235,0.6), transparent); margin: 30px 0;"></section>
```

### 7. 无序列表
```html
<ul style="margin: 0 0 20px 0; padding-left: 20px;">
<li style="margin-bottom: 10px; font-size: 16px; color: #4a4a4a; line-height: 2;">{列表项}</li>
</ul>
```

### 8. 有序列表
```html
<ol style="margin: 0 0 20px 0; padding-left: 20px;">
<li style="margin-bottom: 10px; font-size: 16px; color: #4a4a4a; line-height: 2;">{列表项}</li>
</ol>
```

### 9. 表格
> **关键**：背景色和字体大小必须显式写在每个 `<th>` 和 `<td>` 上

```html
<table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 16px;">
<thead>
<tr>
<th style="padding: 12px 15px; text-align: left; border: 1px solid #e5e7eb; background-color: #2563eb; color: #FFFFFF; font-size: 16px;">列1</th>
<th style="padding: 12px 15px; text-align: left; border: 1px solid #e5e7eb; background-color: #2563eb; color: #FFFFFF; font-size: 16px;">列2</th>
</tr>
</thead>
<tbody>
<tr>
<td style="padding: 12px 15px; border: 1px solid #e5e7eb; background-color: #FFFFFF; font-size: 16px;">内容</td>
<td style="padding: 12px 15px; border: 1px solid #e5e7eb; background-color: #FFFFFF; font-size: 16px;">内容</td>
</tr>
<tr>
<td style="padding: 12px 15px; border: 1px solid #e5e7eb; background-color: #f8fafc; font-size: 16px;">交替行</td>
<td style="padding: 12px 15px; border: 1px solid #e5e7eb; background-color: #f8fafc; font-size: 16px;">交替行</td>
</tr>
</tbody>
</table>
```

### 10. 图片占位符
```html
<table style="width: 100%; margin: 16px 0; border-collapse: collapse;">
<tbody><tr>
<td style="background-color: #eff6ff; border: 1px solid #2563eb; color: #2563eb; padding: 30px 20px; text-align: center; font-weight: bold; font-size: 16px;">
WECHATIMGPH_1
</td>
</tr></tbody>
</table>
```

### 11. 代码块
```html
<section style="background-color: #1e293b; color: #e2e8f0; padding: 16px 20px; border-radius: 8px; margin: 20px 0; font-family: Menlo, Monaco, Consolas, monospace; font-size: 14px; line-height: 2; display: block;">
<span style="color: #94a3b8;"># 注释</span><br>
command --flag=value<br>
&nbsp;&nbsp;缩进内容
</section>
```

### 12. 行内代码
```html
<code style="background-color: #eff6ff; color: #2563eb; padding: 2px 6px; border-radius: 4px; font-family: Menlo, Monaco, Consolas, monospace; font-size: 14px;">{代码}</code>
```

### 13. 辅助说明文字
```html
<p style="font-size: 15px; color: #9ca3af; line-height: 2; letter-spacing: 0.3px; margin: 16px 0 0 0;">{辅助说明}</p>
```

---

## 完整示例

以下是一篇数据分析报告的完整 HTML 结构示例：

```html
<section style="box-sizing: border-box; margin: 0px auto; padding: 0px; background-color: #f8fafc;">

<section style="box-sizing: border-box; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 20px 50px; overflow: hidden; border-radius: 0px 0px 24px 24px;">
<section style="box-sizing: border-box; display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 4px 12px; border-radius: 20px; margin-bottom: 15px;">
<span style="color: #ffffff; font-size: 12px; letter-spacing: 1px;">用户研究</span>
</section>
<h1 style="margin: 0px 0px 15px; font-size: 26px; color: #ffffff; line-height: 1.3; font-weight: bold;">为什么AI工具一直用不好？</h1>
<p style="margin: 0px; color: rgba(255, 255, 255, 0.9); font-size: 16px; line-height: 1.6;">基于 200 条真实用户评论的数据分析报告</p>
<p style="margin: 20px 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 15px;">数据来源：Reddit & Discord 社区</p>
</section>

<section style="box-sizing: border-box; padding: 28px 22px; background: #ffffff; margin: -20px 15px 24px; border-radius: 16px; box-shadow: rgba(0, 0, 0, 0.06) 0px 8px 30px;">
<section style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 16px; padding: 20px 24px; border-left: 5px solid #2563eb; margin: 0;">
<p style="font-size: 16px; color: #1e3a5f; line-height: 2; letter-spacing: 0.3px; margin: 0;">AI 工具不是彼此替代，而是形成分工体系。问题不是"哪个工具更强"，而是"哪个工具更适合放在分工体系中的哪个位置"。</p>
</section>
</section>

<section style="box-sizing: border-box; padding: 0 20px 35px;">

<section style="height: 2px; background: linear-gradient(90deg, transparent, rgba(37,99,235,0.6), transparent); margin: 10px 0 30px;"></section>

<p style="margin: 0 0 24px 0; line-height: 40px;">
<span style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; font-size: 20px; font-weight: bold; width: 44px; height: 40px; line-height: 40px; text-align: center; border-radius: 12px; margin-right: 12px; vertical-align: middle;">一</span>
<span style="font-size: 20px; color: #1a1a1a; font-weight: bold; vertical-align: middle;">你的困境：$100/月的 AI 订阅</span>
</p>

<p style="font-size: 16px; color: #4a4a4a; line-height: 2.4; letter-spacing: 0.3px; margin: 0 0 16px 0;">你订阅了 ChatGPT Plus，$20。Claude Pro，$20。Gemini Advanced，$20。</p>

<p style="font-size: 16px; color: #4a4a4a; line-height: 2.4; letter-spacing: 0.3px; margin: 0 0 16px 0;"><strong style="color: #2563eb;">一年下来超过 $1000。</strong></p>

</section>

</section>
```

---

## 约束与规范

1. **字体继承**: 所有 `<th>` 和 `<td>` 必须显式声明 `font-size: 16px`
2. **背景色声明**: 背景色必须写在 `<td>` 或 `<section>` 上，不要写在 `<div>` 或 `<tr>` 上
3. **渐变兼容**: `linear-gradient` 在公众号中支持良好，可放心使用
4. **阴影限制**: `box-shadow` 在内容卡片上使用效果可接受，但避免过度使用
5. **代码块处理**: 使用 `<br>` 替代换行，`&nbsp;` 替代空格
