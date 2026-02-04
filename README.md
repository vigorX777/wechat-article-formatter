# WeChat Article Formatter

将 Markdown 文稿一键转换为微信公众号编辑器完美兼容的 HTML 格式，彻底解决粘贴后排版错乱、CSS 失效等痛点。

这是一个 [Claude Skill](https://docs.anthropic.com/en/docs/claude-code/skills)，可以在 Claude Code 或 OpenCode 中使用。

## 功能特性

- **Markdown → 公众号 HTML**：自动转换标题、列表、引用、表格等 Markdown 元素
- **CSS 兼容性引擎**：自动处理公众号编辑器的兼容性问题（`section` 替代 `div`、代码块换行等）
- **四主题支持**：预设 **Claude 风格**（简约橙）、**橙韵风格**（杂志卡片）、**蓝色专业**（商务数据）和 **贴纸风格**（旋转贴纸）
- **自定义色系**：支持用户指定主色，自动派生完整色系 🆕
- **一次性配置**：支持在命令中直接指定主题和色系，跳过交互式提问 🆕
- **一键复制**：输出结构优化的 HTML，支持直接粘贴到公众号编辑器
- **自动发布草稿**：通过 Chrome CDP 自动化发布到公众号后台，支持图片替换和封面上传 🆕

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

**基础用法（交互式）：**
```
/wechat-format @article.md
```

**快捷用法（一次性配置）：**
```bash
# 指定主题，使用默认色系
/wechat-format @article.md --theme 橙韵

# 指定主题和自定义主色
/wechat-format @article.md --theme 蓝色专业 --color #10B981
```

**自然语言：**

- "帮我把 @report.md 格式化为公众号文章"
- "用橙韵风格排版 @深度解读.md"
- "用蓝色专业风格排版 @数据分析报告.md"
- "用贴纸风格排版 @使用技巧.md"
- "用橙韵风格、主色 #007AFF 排版 @article.md"

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

### 贴纸风格（旋转贴纸）

旋转贴纸编号 + 渐变头图 + 卡片布局，适合教程指南、技术解析、趣味科普类文章。

| 用途 | 色值 | 说明 |
|------|------|------|
| 主色 | `#D97757` | Claude 橙、贴纸背景 |
| 主色深 | `#C4684A` | 渐变结束色 |
| 背景灰 | `#FAF9F7` | 引用块背景 |

**特点**：
- 橙色渐变头部区域（带胶囊标签、主副标题）
- 白色内容卡片（负 margin 上移效果，圆角阴影）
- **旋转贴纸编号**（`transform: rotate(-15deg)`）⭐ 核心特色
- 章节标题使用阿拉伯数字 + 英文标签（01 PARALLEL, 02 PLAN...）
- 渐变分隔线

## 自定义色系 🆕

每个主题都支持自定义主色，Claude 会自动派生出完整的色系：

```bash
# 使用默认色系
/wechat-format @article.md --theme 橙韵

# 使用自定义主色（自动派生完整色系）
/wechat-format @article.md --theme 橙韵 --color #007AFF
```

**派生规则**：
- 主色-深：主色降低亮度 15-20%
- 主色-浅：主色提高亮度 10-15%
- 背景-浅：主色亮度提高到 95%+，饱和度降低到 10-20%
- 引用块文字：主色降低亮度 40-50%

详细派生规则见 [references/themes.md](references/themes.md)。

## 项目结构

```
wechat-article-formatter/
├── SKILL.md                              # Skill 主文件（Claude 读取的入口）
├── README.md                             # 项目说明
├── assets/
│   ├── template.html                     # Claude 风格 HTML 模板
│   ├── template-chengyun.html            # 橙韵风格 HTML 模板
│   ├── template-blue.html                # 蓝色专业 HTML 模板
│   └── template-sticker.html             # 贴纸风格 HTML 模板
├── scripts/
│   └── publish.ts                        # CDP 自动发布脚本 🆕
└── references/
    ├── themes.md                         # 主题配色方案 + 色系派生逻辑
    ├── element-styles.md                 # Claude 风格元素样式
    ├── chengyun-element-styles.md        # 橙韵风格元素样式
    ├── blue-element-styles.md            # 蓝色专业元素样式
    ├── sticker-element-styles.md         # 贴纸风格元素样式
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

## 自动发布到公众号 🆕

排版完成后，可选择自动发布到微信公众号草稿箱。

### 发布方式

**方式一：排版后交互发布**

`/wechat-format` 生成 HTML 后会询问是否发布，输入"是"或"发布"即可。

**方式二：直接发布已有 HTML**

```bash
# 基础用法
/wechat-post-html .wechat-output/article.html

# 带图片映射（自动替换占位符）
/wechat-post-html .wechat-output/article.html --manifest .wechat-output/manifest.json

# 带封面图
/wechat-post-html .wechat-output/article.html --cover ./cover.png
```

### 前置要求

| 要求 | 说明 |
|------|------|
| Google Chrome | 必须安装，用于 CDP 自动化 |
| Bun 运行时 | 用于执行 TypeScript 脚本 |
| 首次登录 | 首次运行会打开浏览器，需扫码登录微信公众号后台（会话会被保留） |

### 发布流程

执行发布后，自动完成以下步骤：

1. **启动 Chrome** - 使用 CDP 协议启动浏览器
2. **登录检测** - 如未登录，等待用户扫码
3. **创建草稿** - 点击"写图文"进入编辑器
4. **粘贴内容** - 通过临时标签页复制 HTML 并粘贴
5. **替换图片** - 依次替换 `WECHATIMGPH_N` 占位符为实际图片
6. **上传封面** - 如提供封面图，上传到封面位置
7. **保存草稿** - 保存为草稿（不自动发布上线）

### manifest.json 格式

`/wechat-format` 生成的 `manifest.json` 包含文章元信息和图片映射：

```json
{
  "title": "文章标题",
  "contentImages": [
    {
      "placeholder": "WECHATIMGPH_1",
      "localPath": "./images/fig1.png",
      "originalPath": "./images/fig1.png"
    }
  ]
}
```

## 输出说明

生成的产物存放在 `.wechat-output/` 目录：

- `article.html`：可直接用浏览器打开并复制的预览页面
- `raw-content.txt`：纯 HTML 代码片段

---

## 更新日志

### v1.3.0 (2025-02-04)

**自定义色系 + 一次性配置 + 自动发布**

- ✨ **自定义色系功能**：所有主题支持用户提供自定义主色，自动派生完整色系
  - 添加 HSL 色系派生逻辑（主色深、主色浅、背景浅、引用文字等）
  - 各主题 element-styles.md 新增色系变量表
  - 支持渐变色自动替换
- ✨ **一次性配置模式**：支持在命令中直接指定主题和色系，跳过交互式提问
  - 命令格式：`/wechat-format @file.md --theme 橙韵 --color #007AFF`
  - 自然语言：`用橙韵风格、主色 #007AFF 排版 @article.md`
- ✨ **自动发布到公众号**：通过 Chrome CDP 自动化发布到公众号草稿箱
  - 新增 `/wechat-post-html` 命令直接发布已有 HTML
  - 支持 manifest.json 图片映射，自动替换占位符
  - 支持封面图上传
  - 排版完成后可选择直接发布
- 🔄 **工作流程优化**：主题选择后新增色系选择步骤
  - 用户可选择使用默认色系或输入自定义主色
  - 智能识别命令参数，自动跳过已配置的步骤
- 📝 更新 `references/themes.md` 添加完整色系派生规则
- 📝 更新各主题 element-styles.md 添加色系变量说明
- 📄 新增 `scripts/publish.ts` 发布脚本

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
