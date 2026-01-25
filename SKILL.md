---
name: wechat-article-formatter
description: 将 Markdown 文稿转换为微信公众号兼容的 HTML 格式。支持 Claude 风格（橙色主题）和自定义主题。自动处理公众号编辑器的 CSS 兼容性问题（div 转 table、代码块换行、表格背景色等）。触发词：「公众号排版」「微信文章格式化」「WeChat article」「格式化为公众号」「转换为微信格式」。
---

# 微信文章排版生成器 (WeChat Article Formatter)

本 Skill 旨在将 Markdown 文稿一键转换为微信公众号编辑器完美兼容的 HTML 格式，彻底解决粘贴后排版错乱、CSS 失效等痛点。

## 核心能力

- **Markdown → 公众号 HTML**: 自动转换标题、列表、引用、表格等 Markdown 元素。
- **CSS 兼容性引擎**: 自动执行 `div` 转 `table`、`white-space` 预处理等兼容性修复。
- **主题支持**: 预设 **Claude 风格**（经典橙色），支持根据品牌主色自定义主题。
- **一键复制准备**: 输出结构优化的 HTML，支持直接粘贴到公众号编辑器。

## 快速开始

输入以下命令对 Markdown 文件进行排版：

```bash
/wechat-format @article.md
```

或者使用自然语言：
- "帮我把 @report.md 格式化为公众号文章"
- "排版这份文稿，使用主色 #007AFF"

## 公众号 CSS 兼容性规范摘要

由于公众号编辑器的严格过滤，排版时需遵循以下原则（详见 [references/css-compatibility.md](references/css-compatibility.md)）：

1. **容器替换**: 尽量使用 `<table>` 替代 `<div>` 来承载布局样式。
2. **背景色声明**: 样式必须写在 `<td>` 或 `<th>` 上，而非 `<tr>`。
3. **代码块处理**: 不支持 `white-space: pre-wrap`，需将换行符转为 `<br>` 并处理空格。
4. **装饰限制**: 慎用 `dashed` 虚线边框和 `border-radius` 圆角，优先保证实线显示。

## 工作流程

1. **读取与解析**: 加载 Markdown 文稿，解析文档树结构。
2. **应用主题**: 根据用户选择或默认配置（Claude 橙）加载颜色与样式规范。详细主题配置见 [references/themes.md](references/themes.md)。
3. **兼容性转译**: 将标准 HTML 标签（如 `div`, `blockquote`）根据兼容性规范转译为公众号友好的结构。
4. **生成 HTML**: 生成包含内联样式的完整 HTML 文件。
5. **输出引导**: 提供一键复制按钮或方法，引导用户粘贴至公众号后台。

## 输出文件说明

生成的产物将存放在 `.wechat-output/` 目录下：
- `article.html`: 可直接用浏览器打开并复制的预览页面。
- `raw-content.txt`: 纯 HTML 代码片段。

## 验证清单

- [ ] 所有 `div` 容器是否已按需转换为 `table`？
- [ ] 表格背景色是否已正确应用到 `td` 标签？
- [ ] 引用块 (blockquote) 的边框是否符合主题配色？
- [ ] 代码块的长行是否已处理为可自动换行的 HTML 结构？
- [ ] 图片占位符是否包含原始文件名以便用户替换？
