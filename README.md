# WeChat Article Formatter

将 Markdown 文稿一键转换为微信公众号编辑器完美兼容的 HTML 格式，彻底解决粘贴后排版错乱、CSS 失效等痛点。

这是一个 [Claude Skill](https://docs.anthropic.com/en/docs/claude-code/skills)，可以在 Claude Code 或 OpenCode 中使用。

## 功能特性

- **Markdown → 公众号 HTML**：自动转换标题、列表、引用、表格等 Markdown 元素
- **CSS 兼容性引擎**：自动处理公众号编辑器的兼容性问题（`section` 替代 `div`、代码块换行等）
- **三主题支持**：预设 **Claude 风格**（简约橙）、**橙韵风格**（杂志卡片）和 **蓝色专业**（商务数据）
- **一键复制**：输出结构优化的 HTML，支持直接粘贴到公众号编辑器

## 快速开始

### 安装

将此仓库克隆到 Claude 的 skills 目录：

```bash
# macOS/Linux
git clone https://github.com/vigorX777/wechat-article-formatter.git ~/.claude/skills/wechat-article-formatter

# Windows
git clone https://github.com/vigorX777/wechat-article-formatter.git %USERPROFILE%\.claude\skills\wechat-article-formatter
```

### 使用

在 Claude Code 中输入以下命令：

```
/wechat-format @article.md
```

或者使用自然语言：

- "帮我把 @report.md 格式化为公众号文章"
- "用橙韵风格排版 @深度解读.md"
- "用蓝色专业风格排版 @数据分析报告.md"

## 主题

触发 Skill 后会提示选择主题风格：

### Claude 风格（简约橙）

简约橙色主题，适合技术分享、日常随笔类文章。

| 用途 | 色值 | 说明 |
|------|------|------|
| 主色 | `#D97757` | 标题边框、强调文字 |
| 背景浅 | `#FFF5F0` | 图片占位符背景 |
| 背景灰 | `#FAF9F7` | 表格交替行、代码块背景 |

**特点**：H2 标题带左边框、引用块浅灰背景、整体简洁清爽

### 橙韵风格（杂志卡片）

渐变头图 + 卡片布局，适合深度解读、专题报道类长文。

| 用途 | 色值 | 说明 |
|------|------|------|
| 主色-亮 | `#fb923c` | 渐变起始色 |
| 主色-深 | `#ea580c` | 渐变结束色 |
| 强调色 | `#d97706` | 边框、高亮文字 |

**特点**：
- 橙色渐变头部区域（带胶囊标签、主副标题）
- 白色内容卡片（负 margin 上移效果）
- 章节标题使用中文序号方块（一、二、三...）
- 引用块使用浅黄渐变背景
- 渐变分隔线

### 蓝色专业风格（商务数据）🆕

蓝色渐变头图 + 白色卡片布局，适合数据分析、用户研究、商业报告类文章。

| 用途 | 色值 | 说明 |
|------|------|------|
| 主色 | `#2563eb` | 专业蓝、标题边框 |
| 主色深 | `#1d4ed8` | 渐变结束色 |
| 强调色 | `#3b82f6` | 按钮、渐变起始 |

**特点**：
- 蓝色渐变头部区域（带胶囊标签、主副标题、数据来源）
- 白色内容卡片（负 margin 上移效果，圆角阴影）
- 章节标题使用中文序号方块（一、二、三...）
- 引用块使用浅蓝渐变背景和蓝色左边框
- 渐变分隔线

## 项目结构

```
wechat-article-formatter/
├── SKILL.md                              # Skill 主文件（Claude 读取的入口）
├── README.md                             # 项目说明
├── assets/
│   ├── template.html                     # Claude 风格 HTML 模板
│   ├── template-chengyun.html            # 橙韵风格 HTML 模板
│   └── template-blue.html                # 蓝色专业 HTML 模板
└── references/
    ├── themes.md                         # 主题配色方案
    ├── element-styles.md                 # Claude 风格元素样式
    ├── chengyun-element-styles.md        # 橙韵风格元素样式
    ├── blue-element-styles.md            # 蓝色专业元素样式
    └── css-compatibility.md              # 公众号 CSS 兼容性规范
```

## 公众号 CSS 兼容性

由于公众号编辑器的严格过滤，本工具遵循以下核心规范：

| 问题 | 解决方案 |
|------|----------|
| `<div>` 样式不生效 | 使用 `<section>` 替代 |
| `<tr>` 背景色丢失 | 背景色写在 `<td>` 上 |
| 代码块换行丢失 | 换行符 → `<br>`，空格 → `&nbsp;` |
| 不支持 flex/grid | 使用 `inline-block` 或嵌套结构 |
| 表格字体不继承 | `<th>`/`<td>` 显式声明 `font-size` |

**可放心使用**：`linear-gradient`、`border-radius`、`box-shadow`、`rgba()`、负 `margin`

详细规范见 [references/css-compatibility.md](references/css-compatibility.md)。

## 输出说明

生成的产物存放在 `.wechat-output/` 目录：

- `article.html`：可直接用浏览器打开并复制的预览页面
- `raw-content.txt`：纯 HTML 代码片段

---

## 更新日志

### v1.2.0 (2025-01-28)

**新增蓝色专业主题 + 兼容性修复**

- ✨ 新增「蓝色专业」主题风格（商务数据排版）
  - 蓝色渐变头部区域（带胶囊标签、主副标题、数据来源）
  - 白色内容卡片（负 margin 上移效果，圆角阴影）
  - 中文序号方块章节标题（一、二、三...）
  - 浅蓝渐变引用块和蓝色左边框
  - 渐变分隔线
- 🐛 修复表格字体继承问题：`<th>` 和 `<td>` 现在显式声明 `font-size`
- 🔧 改进复制功能：使用 Clipboard API 确保粘贴时保留 HTML 格式
- 📄 新增 `references/blue-element-styles.md` 蓝色专业元素样式规范
- 📝 更新 CSS 兼容性文档，新增字体继承和复制粘贴问题说明
- 📝 统一各主题的字号规范（正文 16px、代码 14px）

### v1.1.0 (2025-01-28)

**新增橙韵主题**

- ✨ 新增「橙韵」主题风格（杂志卡片式排版）
  - 橙色渐变头部区域（带胶囊标签、主副标题、日期）
  - 白色内容卡片（负 margin 上移效果）
  - 中文序号方块章节标题（一、二、三...）
  - 浅黄渐变引用块
  - 渐变分隔线
- 🔄 Skill 触发后新增主题选择流程
- 📄 新增 `references/chengyun-element-styles.md` 橙韵元素样式规范
- 📄 新增 `assets/template-chengyun.html` 橙韵预览模板
- 📝 更新 `SKILL.md` 添加双主题工作流程说明
- 📝 更新 `references/themes.md` 添加橙韵配色方案

### v1.0.0 (2025-01-27)

**初始版本**

- 🎉 首次发布
- ✨ 支持 Markdown → 公众号 HTML 转换
- 🎨 预设 Claude 风格（简约橙色主题）
- 🔧 公众号 CSS 兼容性引擎
- 📋 一键复制功能

---

## License

MIT
