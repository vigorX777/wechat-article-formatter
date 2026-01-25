# WeChat Article Formatter

将 Markdown 文稿一键转换为微信公众号编辑器完美兼容的 HTML 格式，彻底解决粘贴后排版错乱、CSS 失效等痛点。

这是一个 [Claude Skill](https://docs.anthropic.com/en/docs/claude-code/skills)，可以在 Claude Code 或 OpenCode 中使用。

## 功能特性

- **Markdown → 公众号 HTML**：自动转换标题、列表、引用、表格等 Markdown 元素
- **CSS 兼容性引擎**：自动执行 `div` 转 `table`、`white-space` 预处理等兼容性修复
- **主题支持**：预设 Claude 风格（经典橙色），支持根据品牌主色自定义主题
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
- "排版这份文稿，使用主色 #007AFF"

## 项目结构

```
wechat-article-formatter/
├── SKILL.md                    # Skill 主文件（Claude 读取的入口）
├── README.md                   # 项目说明
├── assets/
│   └── template.html           # HTML 输出模板（含一键复制功能）
└── references/
    ├── themes.md               # 主题配色方案
    ├── element-styles.md       # 元素样式模板
    └── css-compatibility.md    # 公众号 CSS 兼容性规范
```

## 公众号 CSS 兼容性

由于公众号编辑器的严格过滤，本工具遵循以下核心规范：

| 问题 | 解决方案 |
|------|----------|
| `<div>` 样式不生效 | 使用 `<table>` 替代布局容器 |
| `<tr>` 背景色丢失 | 背景色写在 `<td>` 上 |
| 代码块换行丢失 | 换行符 → `<br>`，空格 → `&nbsp;` |
| 虚线边框不支持 | 优先使用实线边框 |

**不支持的 CSS 属性**：`flex`、`grid`、`box-shadow`、`transform`、CSS 变量、媒体查询等。

详细规范见 [references/css-compatibility.md](references/css-compatibility.md)。

## 主题

### Claude 风格（默认）

简约橙色主题，适合技术分享、深度思考类文章。

| 用途 | 色值 | 说明 |
|------|------|------|
| 主色 | `#D97757` | 标题边框、强调文字 |
| 背景浅 | `#FFF5F0` | 图片占位符背景 |
| 背景灰 | `#FAF9F7` | 表格交替行、代码块背景 |

### 自定义主题

指定主色即可自动计算辅助色：

```
排版这份文稿，使用主色 #007AFF
```

## 输出说明

生成的产物存放在 `.wechat-output/` 目录：

- `article.html`：可直接用浏览器打开并复制的预览页面
- `raw-content.txt`：纯 HTML 代码片段

## License

MIT
