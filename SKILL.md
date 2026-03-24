---
name: wechat-article-formatter
description: 将 Markdown 文稿转换为微信公众号兼容的 HTML 格式。支持 Claude 风格（简约橙）、橙韵风格（杂志卡片）、蓝色专业风格（商务数据）和贴纸风格（旋转贴纸）四种预设主题。自动处理公众号编辑器的 CSS 兼容性问题（div 转 table、代码块换行、表格背景色、字体继承等）。触发词：「公众号排版」「微信文章格式化」「WeChat article」「格式化为公众号」「转换为微信格式」「复刻排版」「模板复刻」「clone theme」。
---

# 微信文章排版生成器 (WeChat Article Formatter)

本 Skill 将 Markdown 文稿一键转换为微信公众号编辑器兼容的 HTML，彻底解决粘贴后排版错乱、CSS 失效等痛点。

## 核心能力

- **Markdown → 公众号 HTML**: 自动转换标题、列表、引用、表格等元素。
- **CSS 兼容性引擎**: `div` 转 `table`、`white-space` 预处理、字体显式声明等。
- **四主题支持**: Claude 风格（简约橙）、橙韵风格（杂志卡片）、蓝色专业风格（商务数据）、贴纸风格（旋转贴纸）。
- **一键复制**: Clipboard API 输出 HTML 格式，直接粘贴到公众号编辑器并保留样式。

## 全主题统一要求

> ⚠️ 以下要求对四个主题全部生效，不能因为主题不同而退回旧样式。

1. **头部胶囊标签显示文章分类**：优先使用源 Markdown 明确提供的分类字段，如「行业快评」「深度解读」「工具实测」「教程指南」，不要在 HTML 阶段临时猜测。
2. **标题区域显示署名**：必须使用源 Markdown 明确提供的署名；如项目有长期约定的默认署名，才按约定回填，不得自由改写。
3. **前言卡片必须精简**：只放 1-2 段短引言 / hook，不要塞长背景说明。
4. **前言卡片禁止引用块效果**：不能使用左边框、引用底色、引号感 blockquote 视觉。
5. **封面效果图放进前言卡片**：`WECHATIMGPH_1` 视为封面效果图，位于前言文字之后，属于前言卡片内部。
6. **用户确认过的效果图优先级最高**：如果用户提供最终效果图，以该效果图为版式准绳，再套用主题色。
7. **正文加粗必须映射成高亮强调**：源 Markdown 里的 `**加粗**` 不是普通粗体占位，HTML 中必须渲染成“字重 + 低饱和主色高亮”的强调样式，默认使用克制的底线式高亮。
8. **重要 URL 默认卡片化展示**：正文里用于引导跳转的关键 URL（如 GitHub、项目主页、工具入口、阅读原文）默认不要裸链直出；应优先渲染为轻量链接卡片，包含来源标签、主标题/项目名、域名或一句短说明。
9. **图片占位卡说明文字必须优先显示配图备注**：`WECHATIMGPH_N` 下方的第二行说明默认使用源 Markdown 图片的 alt 文案 / 配图备注，不显示本地文件名；只有 alt 缺失时才回退到简短中文说明。
10. **必须兼容 Obsidian 图片嵌入语法**：除了标准 Markdown 图片 `![alt](path)`，也要识别 `![[filename.png]]` 这类手动贴图；不能在转换时静默丢弃。
11. **公众号摘要默认取副标题**：发布阶段填写 `#js_description` 时，优先使用源 Markdown / manifest 中的 `subtitle`；只有副标题缺失时才回退到 `summary`。
12. **优先接管已登录 Chrome**：发布阶段先尝试连接 `9222 / 9223 / 9333` 等已开启远程调试端口的 Chrome；接管失败时，才回退到同步过登录态的自动化 profile。

## 源 Markdown 输入契约（新增强制规则）

> ⚠️ 公众号排版的稳定性取决于源 Markdown 是否提供完整的首屏结构。Formatter 负责结构映射，不负责临时补写内容。

用于公众号排版的 Markdown，首屏默认必须提供以下字段：

1. **文章标题**：用于文章识别、项目命名、文件命名
2. **正标题**：HTML 首屏主标题
3. **副标题**：HTML 首屏补充说明
4. **署名**：如 `懂点儿AI - vigor`
5. **分类**：如 `工具实测`、`深度解读`、`行业快评`、`教程指南`
6. **前言**：一段精炼 hook，说明这篇文章讲什么、解决什么问题、为什么值得看
7. **封面图占位符**：默认 `WECHATIMGPH_1`，属于前言区的一部分

### 生成原则

- Formatter 只负责把源 Markdown 已经明确提供的首屏结构映射到 HTML
- Formatter 不负责从正文中临时猜测副标题
- Formatter 不负责自动抽取正文第一段作为前言
- Formatter 不得忽略源 Markdown 中已有的 `**加粗**` 标记；这些重点句必须进入 HTML 的强调样式映射
- Formatter 不得把关键 URL 一律渲染成普通下划线文本链接；若该 URL 承担明显 CTA 作用，应优先转成卡片式展示
- Formatter 不负责根据语气或内容自动脑补分类
- Formatter 不负责临时生成署名文案
- Formatter 不得把图片本地文件名（如 `01-cover.png`）直接渲染进公众号正文；图片占位卡说明文字必须优先取源 Markdown 的 alt 文案
- Formatter 必须处理 Obsidian 嵌入图 `![[...]]`：若能解析路径则直接纳入图片映射；若缺少备注，则回退到简短中文说明，而不是跳过该图

### 首屏固定顺序

正标题 → 副标题 → 署名和分类 → 前言 → 封面图（WECHATIMGPH_1）→ 正文开场

### 缺字段处理

- 缺正标题：中断生成，提示用户补齐
- 缺副标题：允许为空，但必须显式确认是否留空
- 缺署名：仅在用户已明确约定默认署名的场景下允许回填，否则中断生成
- 缺分类：中断生成，不再根据内容自动猜测
- 缺前言：中断生成，不再自动从正文抽取
- 缺封面图占位符：允许继续生成，但必须提示“前言区将无封面图”

### 一致性检查

生成 HTML 前，必须校验：

- 首屏字段是否完整
- HTML 是否完整映射这些字段
- 正文开头是否重复前言内容
- `WECHATIMGPH_1` 是否位于前言区内部

## 快速开始

```bash
# 交互式（分步选主题、色系）
/wechat-format @article.md

# 快捷（一次性配置）
/wechat-format @article.md --theme 橙韵 --color #007AFF

# 模板复刻
/wechat-clone-theme https://mp.weixin.qq.com/s/xxxxx

# 直接发布已生成的 HTML
/wechat-post-html .wechat-output/article.html
```

自然语言示例：
- "帮我把 @report.md 格式化为公众号文章"
- "用橙韵风格、主色 #007AFF 排版 @article.md"
- "复刻这篇公众号的排版：https://mp.weixin.qq.com/s/xxxxx"

---

## 工作流程（必须遵循）

> ⚠️ **强制规则**：无论是否之前使用过此 Skill，每次排版都**必须从第一步（主题选择）开始走完整交互流程**。不得跳过任何交互步骤，不得基于"上次用过"而假设用户偏好不变。

### 快捷模式

命令中已含主题和/或颜色时，跳过对应交互提问直接执行。

| 参数 | 必需 | 说明 |
|------|------|------|
| `@file.md` | ✅ | 要排版的 Markdown 文件 |
| `--theme` / 主题名 | ❌ | Claude / 橙韵 / 蓝色专业 / 贴纸 |
| `--color` / 主色 | ❌ | 自定义主色（如 `#007AFF`） |

### 交互模式（分步配置）

#### 第一步：主题选择

| 主题 | 特点 | 适用场景 |
|------|------|----------|
| **Claude 风格** | 简约橙色、左边框标题、清爽段落 | 技术分享、日常随笔、简短内容 |
| **橙韵风格** | 渐变头图、卡片布局、中文序号章节 | 深度解读、专题报道、长文精读 |
| **蓝色专业** | 蓝色渐变头图、白色卡片、数据感 | 数据分析、用户研究、商业报告 |
| **贴纸风格** | 旋转贴纸编号、渐变头图、卡片布局 | 教程指南、技术解析、趣味科普 |

详细样式规范见 [references/themes.md](references/themes.md)。

#### 第二步：色系选择

各主题默认主色：

| 主题 | 默认主色 | 色系风格 |
|------|----------|----------|
| Claude 风格 | `#D97757` | 温暖橙 |
| 橙韵风格 | `#fb923c` | 明亮橙 |
| 蓝色专业 | `#2563eb` | 专业蓝 |
| 贴纸风格 | `#D97757` | Claude 橙 |

用户可输入自定义 HEX 色值替换默认色系。色系派生逻辑详见 [references/themes.md](references/themes.md)。

#### 第三步：源文档预分析

分析源 Markdown，提取结构指纹（H2/H3 标题、表格行数、列表项数、图片数、总行数），用于转换后的自动验证。详见 [references/long-doc-strategy.md](references/long-doc-strategy.md)。

#### 第四步：分段转换

根据主题加载样式规范：
- Claude 风格 → [references/element-styles.md](references/element-styles.md)
- 橙韵风格 → [references/chengyun-element-styles.md](references/chengyun-element-styles.md)
- 蓝色专业 → [references/blue-element-styles.md](references/blue-element-styles.md)
- 贴纸风格 → [references/sticker-element-styles.md](references/sticker-element-styles.md)

**短文档（≤300 行）**：直接一次性转换为完整 HTML。

**长文档（>300 行）**：按 H2 分段转换，完整流程见 [references/long-doc-strategy.md](references/long-doc-strategy.md)。

#### 第五步：自动化验证（必做）

转换后自动对比结构指纹，检查 H2/H3 标题数、表格行数、列表项数、图片占位符数。不通过则自动修补后重新验证，直到全部通过。详见 [references/long-doc-strategy.md](references/long-doc-strategy.md)。

#### 第六步：输出文件

产物存放在 `wechat-output/` 目录下（注意：**不要**使用 `.wechat-output/` 隐藏目录，用户不方便查看）：
- `article.html`：浏览器可打开并复制的预览页面
- `raw-content.txt`：纯 HTML 代码片段
- `manifest.json`：文章元信息与图片占位符映射

预览 HTML **必须**包含以下复制函数（Clipboard API 主方案 + execCommand 降级）：

```javascript
async function copyContent() {
  const content = document.getElementById('output');
  const btn = document.querySelector('.copy-btn');
  try {
    const htmlContent = content.innerHTML;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const textBlob = new Blob([content.innerText], { type: 'text/plain' });
    await navigator.clipboard.write([new ClipboardItem({'text/html': blob, 'text/plain': textBlob})]);
    btn.textContent = '✅ 已复制'; btn.classList.add('copied');
  } catch (err) {
    const range = document.createRange(); range.selectNodeContents(content);
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    document.execCommand('copy'); selection.removeAllRanges();
    btn.textContent = '✅ 已复制'; btn.classList.add('copied');
  }
  setTimeout(() => { btn.textContent = '📋 复制全文'; btn.classList.remove('copied'); }, 2000);
}
```

#### 第七步：询问是否发布

> HTML 已生成到 `wechat-output/article.html`
> 是否要发布到微信公众号？（输入**是**或**发布**触发 CDP 脚本；否则结束流程）

---

## 直接发布 HTML 到公众号

### 命令

```bash
/wechat-post-html .wechat-output/article.html
/wechat-post-html .wechat-output/article.html --manifest .wechat-output/manifest.json
/wechat-post-html .wechat-output/article.html --cover ./cover.png
```

**注意**：此命令接受 HTML 文件，不进行 Markdown 转换。

### 发布脚本参数

```bash
npx -y bun scripts/publish.ts --html <path> [options]
```

| 参数 | 说明 |
|------|------|
| `--html <path>` | HTML 文件路径（必需） |
| `--manifest <path>` | manifest.json 路径（可选） |
| `--cover <path>` | 封面图路径（可选） |
| `--profile <dir>` | Chrome profile 目录（可选） |

### 故障排查

| 问题 | 解决方案 |
|------|----------|
| Chrome 未找到 | 安装 Chrome 或设置 `CHROME_PATH` |
| 未登录 | 首次运行扫码登录，会话会被保留 |
| 粘贴失败（macOS） | 系统偏好设置 → 安全性 → 隐私 → 辅助功能，添加终端应用 |
| 粘贴失败（内容为空） | 确保 HTML 文件含 `id="output"` 容器 |
| 粘贴后公众号编辑器无内容 | `document.execCommand('copy')` 和基础 Clipboard API 对 ProseMirror 编辑器不可靠。需使用合成 `ClipboardEvent` + `DataTransfer.setData('text/html', html)` 触发粘贴。大 HTML 先存入 `window.__wechatPasteHtml` 全局变量（单独 `Runtime.evaluate`，避免 CDP 消息体积限制），再在粘贴函数中读取 |
| 图片粘贴失败（CDP keyEvent 无效） | CDP `Input.dispatchKeyEvent` 模拟 Cmd+V 不会触发真实剪贴板读取。需使用系统级方案：`copyImageToClipboard`（Swift NSPasteboard）写入剪贴板 + `pasteImageViaSystem`（osascript keystroke）发送粘贴。注意先 `tell application "Google Chrome" to activate` 激活窗口 |
| 图片替换失败 | 确认 manifest.json 中图片路径正确且文件存在 |
| Bun 未安装 | `npm install -g bun` 或 `npx -y bun` |

---

## CSS 兼容性规范

转换时必须遵守：**div 上样式用 table+td 替代 | tr 背景色写在 td 上 | th/td 必须显式 font-size | 代码块用 br+nbsp 替代 white-space | 不支持 flex/grid/box-shadow/var()/position | 需要圆角的 table 必须用 `border-collapse: separate; border-spacing: 0` + `overflow: hidden`（`border-collapse: collapse` 会导致 `border-radius` 失效）**。

详细规则见各主题 element-styles 文件头部的兼容性速查提示。

---

## HTML 输出规范

| 要求 | 说明 |
|------|------|
| 容器 ID | 内容容器必须使用 `id="output"`（发布脚本依赖此 ID） |
| 样式内联 | 所有样式写在元素 `style` 属性中 |
| 图片占位符 | 格式为 `WECHATIMGPH_N`（N 从 1 开始） |
| ⚠️ 预览辅助元素禁入内容区 | 预览提示和复制按钮必须放在 `#output` 和 `.preview-wrapper` **外部**，用 `position: fixed` 定位 |
| ⚠️ 首屏字段来源 | 正标题、副标题、署名、分类、前言都应来自源 Markdown 明确定义，不允许在 HTML 阶段自由补写 |
| ⚠️ 头部分类标签 | 必须优先使用源 Markdown 明确提供的分类字段，不再根据正文内容自动猜测 |
| ⚠️ 标题区署名 | 头部主视觉区域必须显示源 Markdown 提供的署名 |
| ⚠️ 禁止自动抽前言 | 不得直接抽正文第一段充当前言，除非源 Markdown 明确标记该段为前言 |
| ⚠️ 前言卡片样式 | 前言卡片只用普通段落，不得使用 blockquote / 引用块样式 |
| ⚠️ 封面图位置 | 封面图（WECHATIMGPH_1）必须放在白色内容卡片（前言）**内部**，位于前言文字之后。顺序：头部渐变 → 白色卡片（前言文字 + 封面图）→ 分隔线 → 正文 |
| ⚠️ 图片占位说明文字 | `WECHATIMGPH_N` 下方说明默认显示源 Markdown 图片的 alt 文案 / 配图备注，不显示技术文件名；若 alt 缺失，只能回退为“封面图”“对比图”“证据截图”这类简短中文说明 |
| ⚠️ Obsidian 嵌入图 | 必须识别 `![[filename.png]]` 这类嵌入图，并将其纳入 HTML 和 manifest；禁止因为不是标准 Markdown 语法就直接漏掉 |
| ⚠️ 正文去重检查 | 若正文开头与前言高度重复，应在生成时提示并中断，避免首屏重复 |
| ⚠️ 标题体系分层 | 文件标题/文章标题 与 HTML 正标题可不同，formatter 必须保留两者分层，不得强制合并 |
| ⚠️ 正文强调样式 | 正文中的 `strong` / `**加粗**` 默认渲染为“较深主色文字 + 低饱和主色底线式高亮 + 较高字重”；效果要清晰但克制，不得做荧光笔大色块 |
| ⚠️ URL 展示样式 | 关键外链默认渲染成轻量链接卡片：低饱和浅底、细边框、来源标签、标题/项目名、域名或一句短说明；样式跟随主题主色，整体克制，不做营销感按钮 |

---

## 模板复刻模式

从公众号文章 URL 复刻排版风格，生成新主题。触发格式：

```bash
/wechat-clone-theme https://mp.weixin.qq.com/s/xxxxx
```

完整的六步复刻流程（URL 校验、样式分析、推导补全、CSS 检查、预览确认、写入注册）详见 [references/clone-theme-guide.md](references/clone-theme-guide.md)。

---

## 验证清单

转换完成后按 [references/verification-checklist.md](references/verification-checklist.md) 逐项检查样式。
