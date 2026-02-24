---
name: wechat-article-formatter
description: 将 Markdown 文稿转换为微信公众号兼容的 HTML 格式。支持 Claude 风格（简约橙）、橙韵风格（杂志卡片）、蓝色专业风格（商务数据）和贴纸风格（旋转贴纸）四种预设主题。自动处理公众号编辑器的 CSS 兼容性问题（div 转 table、代码块换行、表格背景色、字体继承等）。触发词：「公众号排版」「微信文章格式化」「WeChat article」「格式化为公众号」「转换为微信格式」。
---

# 微信文章排版生成器 (WeChat Article Formatter)

本 Skill 旨在将 Markdown 文稿一键转换为微信公众号编辑器完美兼容的 HTML 格式，彻底解决粘贴后排版错乱、CSS 失效等痛点。

## 核心能力

- **Markdown → 公众号 HTML**: 自动转换标题、列表、引用、表格等 Markdown 元素。
- **CSS 兼容性引擎**: 自动执行 `div` 转 `table`、`white-space` 预处理、**字体显式声明**等兼容性修复。
- **四主题支持**: 预设 **Claude 风格**（简约橙）、**橙韵风格**（杂志卡片）、**蓝色专业风格**（商务数据）和 **贴纸风格**（旋转贴纸），用户触发后选择。
- **一键复制准备**: 使用 Clipboard API 输出 HTML 格式，支持直接粘贴到公众号编辑器并保留样式。

## 工作流程（必须遵循）

### 快捷模式：一次性配置

用户可以在触发命令中直接指定所有参数，跳过交互式选择：

**完整参数格式：**
```bash
/wechat-format @article.md --theme 橙韵 --color #007AFF
```

**自然语言格式：**
```
用橙韵风格、主色 #007AFF 排版 @article.md
使用蓝色专业风格排版 @report.md（使用默认色系）
用贴纸风格、主色 #10B981 排版 @tutorial.md
```

**参数说明：**

| 参数 | 必需 | 说明 |
|------|------|------|
| `@file.md` | ✅ | 要排版的 Markdown 文件 |
| `--theme` / 主题名 | ❌ | 主题风格：Claude/橙韵/蓝色专业/贴纸 |
| `--color` / 主色 | ❌ | 自定义主色（如 `#007AFF`），不指定则使用默认色系 |

> **识别规则**：如果用户在触发命令中已包含主题和/或颜色信息，则跳过对应的交互式提问，直接执行转换。

---

### 交互模式：分步配置

如果用户仅提供文件而未指定参数，则进入交互式配置流程。

#### 第一步：主题选择

**触发 Skill 后，首先询问用户选择主题风格：**

| 主题 | 特点 | 适用场景 |
|------|------|----------|
| **Claude 风格** | 简约橙色、左边框标题、清爽段落 | 技术分享、日常随笔、简短内容 |
| **橙韵风格** | 渐变头图、卡片布局、中文序号章节 | 深度解读、专题报道、长文精读 |
| **蓝色专业** | 蓝色渐变头图、白色卡片、数据感 | 数据分析、用户研究、商业报告 |
| **贴纸风格** | 旋转贴纸编号、渐变头图、卡片布局 | 教程指南、技术解析、趣味科普 |

**提问示例：**
> 请选择排版主题：
> 1. **Claude 风格** - 简约清爽，适合技术分享
> 2. **橙韵风格** - 杂志卡片，适合深度解读
> 3. **蓝色专业** - 商务数据，适合分析报告
> 4. **贴纸风格** - 旋转贴纸，适合教程指南
>
> 输入 1、2、3 或 4，或直接说「Claude」/「橙韵」/「蓝色」/「贴纸」

#### 第二步：色系选择

**主题选择后，询问用户是否使用默认色系：**

**提问示例：**
> 已选择「橙韵风格」，默认色系为暖橙色。
> 
> 请选择色系：
> 1. **使用默认色系** - 橙色渐变（推荐）
> 2. **自定义主色** - 输入 HEX 色值（如 `#007AFF`）
>
> 输入 1 使用默认，或直接输入色值自定义

**各主题默认色系预览：**

| 主题 | 默认主色 | 色系风格 |
|------|----------|----------|
| Claude 风格 | `#D97757` | 温暖橙 |
| 橙韵风格 | `#fb923c` | 明亮橙 |
| 蓝色专业 | `#2563eb` | 专业蓝 |
| 贴纸风格 | `#D97757` | Claude 橙 |

> **色系派生**：当用户提供自定义主色时，Claude 会自动基于该主色派生出完整色系（主色深、主色浅、背景浅等）。详见 [references/themes.md](references/themes.md) 中的色系派生逻辑。

#### 第三步：解析与转换

根据用户选择的主题和色系，加载对应的样式规范进行转换：
- Claude 风格 → 参考 [references/element-styles.md](references/element-styles.md)
- 橙韵风格 → 参考 [references/chengyun-element-styles.md](references/chengyun-element-styles.md)
- 蓝色专业 → 参考 [references/blue-element-styles.md](references/blue-element-styles.md)
- 贴纸风格 → 参考 [references/sticker-element-styles.md](references/sticker-element-styles.md)

> **自定义色系处理**：如果用户指定了自定义主色，Claude 需要在转换时将样式模板中的颜色值替换为派生后的色系。详见 [references/themes.md](references/themes.md) 中的色系派生规则。

#### 第四步：输出文件

生成的产物存放在 `.wechat-output/` 目录下，提供一键复制功能。

#### 第五步：询问是否发布

HTML 生成完成后，询问用户是否要发布到公众号：

> HTML 已生成到 `.wechat-output/article.html`
> 
> 是否要发布到微信公众号？
> - 输入 **是** 或 **发布** → 调用 CDP 脚本发布
> - 输入 **否** 或直接回车 → 结束流程

如用户选择发布，则调用本地发布脚本 `scripts/publish.ts` 完成自动化发布。

## 快速开始

### 基础用法（交互式）

输入以下命令对 Markdown 文件进行排版：

```bash
/wechat-format @article.md
```

### 快捷用法（一次性配置）

在命令中直接指定主题和色系，跳过交互式提问：

```bash
# 指定主题，使用默认色系
/wechat-format @article.md --theme 橙韵

# 指定主题和自定义主色
/wechat-format @article.md --theme 蓝色专业 --color #10B981
```

### 自然语言用法

或者使用自然语言：
- "帮我把 @report.md 格式化为公众号文章"
- "用橙韵风格排版 @深度解读.md"
- "用蓝色专业风格排版 @数据分析报告.md"
- "用贴纸风格排版 @使用技巧.md"
- "用橙韵风格、主色 #007AFF 排版 @article.md"
- "使用 Claude 风格，主色 #10B981 格式化 @绿色主题.md"

## 直接发布 HTML 到公众号

### 命令

使用 `/wechat-post-html` 命令将已生成的 HTML 直接发布到微信公众号：

```bash
/wechat-post-html .wechat-output/article.html
```

**注意：** 此命令接受 **HTML 文件**，不进行 Markdown 转换。如需从 Markdown 生成并发布，请使用 `/wechat-format` 命令。

### 用法示例

```bash
# 发布已生成的 HTML
/wechat-post-html .wechat-output/article.html

# 带 manifest 文件（包含图片映射）
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
| 图片准备 | 如使用图片占位符，需确保 manifest.json 中的路径正确 |

### 发布脚本

本 Skill 内置 CDP 发布脚本，无需依赖外部 skill：

```bash
npx -y bun scripts/publish.ts --html <path> [options]
```

**参数说明：**

| 参数 | 说明 |
|------|------|
| `--html <path>` | HTML 文件路径（必需） |
| `--manifest <path>` | manifest.json 文件路径（可选，包含图片映射） |
| `--cover <path>` | 封面图路径（可选） |
| `--profile <dir>` | Chrome profile 目录（可选，用于保持登录状态） |

### 发布流程

执行发布脚本后，自动完成以下步骤：

1. **启动 Chrome** - 使用 CDP 协议启动浏览器
2. **登录检测** - 如未登录，等待用户扫码
3. **创建草稿** - 点击"写图文"进入编辑器
4. **粘贴内容** - 通过临时标签页复制 HTML 并粘贴
5. **替换图片** - 依次替换 `WECHATIMGPH_N` 占位符为实际图片
6. **上传封面** - 如提供封面图，上传到封面位置
7. **保存草稿** - 保存为草稿（不自动发布上线）

### manifest.json 格式

`/wechat-format` 生成的 `manifest.json` 包含文章元信息和图片映射，供 `/wechat-post-html` 消费：

```json
{
  "title": "文章标题",
  "contentImages": [
    {
      "placeholder": "WECHATIMGPH_1",
      "localPath": "./images/fig1.png",
      "originalPath": "./images/fig1.png"
    },
    {
      "placeholder": "WECHATIMGPH_2",
      "localPath": "./images/fig2.png",
      "originalPath": "./images/fig2.png"
    }
  ]
}
```

| 字段 | 说明 |
|------|------|
| `title` | 从 Markdown 提取的文章标题（H1 或 frontmatter） |
| `contentImages` | 图片占位符数组 |
| `placeholder` | 占位符文本，格式为 `WECHATIMGPH_N` |
| `localPath` | 图片本地路径（相对于 `.wechat-output/`） |
| `originalPath` | 图片在原 Markdown 中的路径 |

### 故障排查

| 问题 | 解决方案 |
|------|----------|
| Chrome 未找到 | 安装 Chrome 或设置环境变量 `CHROME_PATH` |
| 未登录 | 首次运行会打开浏览器，扫码登录后会话会被保留 |
| 粘贴失败（macOS） | 检查辅助功能权限：系统偏好设置 → 安全性与隐私 → 隐私 → 辅助功能，添加终端应用 |
| 粘贴失败（内容为空） | 确保 HTML 文件包含 `id="output"` 的容器元素 |
| 图片替换失败 | 确认 manifest.json 中的图片路径正确且文件存在 |
| 内容不完整 | 长文档（>300行）可能遗漏内容，手动核对原文后补充 |
| Bun 未安装 | 运行 `npm install -g bun` 或使用 `npx -y bun` |

## 主题详情

- **Claude 风格（简约橙）**: 简约橙色主题，适合技术分享、深度思考类文章。详见 [references/element-styles.md](references/element-styles.md)。
- **橙韵风格（杂志卡片）**: 渐变头图+卡片布局，适合深度解读、专题报道类文章。详见 [references/chengyun-element-styles.md](references/chengyun-element-styles.md)。
- **蓝色专业风格（商务数据）**: 蓝色渐变头图+白色卡片，适合数据分析、商业报告类文章。详见 [references/blue-element-styles.md](references/blue-element-styles.md)。
- **贴纸风格（旋转贴纸）**: 旋转贴纸编号+渐变头图，适合教程指南、技术解析类文章。详见 [references/sticker-element-styles.md](references/sticker-element-styles.md)。

## 公众号 CSS 兼容性规范

> 转换时必须遵循 [references/css-compatibility.md](references/css-compatibility.md) 中的兼容性规则（容器替换、背景色声明、代码块处理、字体继承等）。

## 输出文件说明

生成的产物将存放在 `.wechat-output/` 目录下：
- `article.html`: 可直接用浏览器打开并复制的预览页面。
- `raw-content.txt`: 纯 HTML 代码片段。

## 复制功能实现规范

> 生成的预览 HTML 必须包含标准复制函数（Clipboard API 主方案 + execCommand 降级）。详见 [references/copy-function.md](references/copy-function.md)。

## 已知限制与注意事项

### 长文档转换（重要）

由于 Markdown → HTML 转换依赖 LLM 逐行处理，**超过 300 行的文档可能出现内容遗漏**。常见遗漏场景：

| 遗漏类型 | 典型表现 | 预防措施 |
|----------|----------|----------|
| 表格行丢失 | 原文 20 行表格，转换后只有 7 行 | 转换后对比原文表格行数 |
| 章节缺失 | 末尾章节（如附录、参考资料）完全消失 | 检查 H2/H3 标题数量是否匹配 |
| 列表截断 | 长列表只保留前几项 | 核对列表项数量 |

**强烈建议**：转换完成后，执行以下核对：
1. 对比原文 H2 标题数量
2. 对比原文表格行数（尤其是大表格）
3. 检查附录/参考资料是否完整
4. 验证图片占位符数量与原文图片数量一致

### HTML 输出规范

生成的 HTML 必须满足以下要求才能正常发布：

| 要求 | 说明 |
|------|------|
| 容器 ID | 内容容器必须使用 `id="output"`（发布脚本依赖此 ID） |
| 样式内联 | 所有样式必须写在元素 `style` 属性中 |
| 图片占位符 | 格式为 `WECHATIMGPH_N`（N 从 1 开始） |
| ⚠️ 预览辅助元素禁入内容区 | 预览提示文字（如"微信公众号预览 · 贴纸风格"）和复制按钮**必须**放在 `#output` 容器和 `.preview-wrapper` **外部**，使用 `position: fixed` 定位。预览标签放左上角，复制按钮放右侧悬浮。这些元素不属于文章内容，绝不能出现在文章主体区域内 |
| ⚠️ 封面图位置 | 封面图（WECHATIMGPH_1）**必须**放在开篇白色卡片（前言段落）**之后**，不能放在前言之前。正确顺序：头部渐变区域 → 白色内容卡片（前言） → 封面图 → 正文分隔线 → 正文内容 |

### macOS 权限问题

发布脚本使用 `osascript` 发送键盘事件（Cmd+V），首次运行需要授予辅助功能权限：

1. 打开 **系统偏好设置 → 安全性与隐私 → 隐私 → 辅助功能**
2. 添加你的终端应用（Terminal、iTerm2、VS Code 等）
3. 重启终端后重试

**检查权限状态**：
```bash
# 查看当前授权的应用
sqlite3 ~/Library/Application\ Support/com.apple.TCC/TCC.db \
  "SELECT client FROM access WHERE service='kTCCServiceAccessibility'"
```

## 验证清单

> 转换完成后按 [references/verification-checklist.md](references/verification-checklist.md) 逐项检查。
