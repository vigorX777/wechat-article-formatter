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

### 第一步：主题选择

**触发 Skill 后，必须首先询问用户选择主题风格：**

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

### 第二步：解析与转换

根据用户选择的主题，加载对应的样式规范进行转换：
- Claude 风格 → 参考 [references/element-styles.md](references/element-styles.md)
- 橙韵风格 → 参考 [references/chengyun-element-styles.md](references/chengyun-element-styles.md)
- 蓝色专业 → 参考 [references/blue-element-styles.md](references/blue-element-styles.md)
- 贴纸风格 → 参考 [references/sticker-element-styles.md](references/sticker-element-styles.md)

### 第三步：输出文件

生成的产物存放在 `.wechat-output/` 目录下，提供一键复制功能。

## 快速开始

输入以下命令对 Markdown 文件进行排版：

```bash
/wechat-format @article.md
```

或者使用自然语言：
- "帮我把 @report.md 格式化为公众号文章"
- "用橙韵风格排版 @深度解读.md"
- "用蓝色专业风格排版 @数据分析报告.md"
- "用贴纸风格排版 @使用技巧.md"

## 发布到公众号

### 命令

使用 `/wechat-publish` 命令一键格式化并发布到微信公众号：

```bash
/wechat-publish @article.md
```

或者使用自然语言：
- "把 @report.md 发布到公众号"
- "用橙韵风格发布 @深度解读.md 到微信公众号"
- "发布 @数据分析报告.md 到公众号，用蓝色专业风格"

### 前置要求

| 要求 | 说明 |
|------|------|
| Google Chrome | 必须安装，用于 CDP 自动化 |
| 首次登录 | 首次运行会打开浏览器，需扫码登录微信公众号后台（会话会被保留） |
| 图片准备 | 文章中的图片需提前准备好本地路径 |

### 发布工作流程

执行 `/wechat-publish` 后，按以下步骤自动处理：

**第一步：主题选择**

同 `/wechat-format` 流程，询问用户选择主题风格（Claude / 橙韵 / 蓝色专业 / 贴纸）。

**第二步：HTML 生成**

根据选定主题生成公众号兼容 HTML，输出到 `.wechat-output/` 目录：
- `article.html`：带预览功能的 HTML 页面
- `raw-content.txt`：纯 HTML 代码片段
- `manifest.json`：图片占位符映射文件

**第三步：图片占位符处理**

Markdown 中的图片会被替换为占位符 `WECHATIMGPH_N`（N 从 1 开始），同时在 `manifest.json` 中记录映射关系。

**第四步：调用 CDP 脚本发布**

通过跨 skill 调用 `baoyu-post-to-wechat` 的发布脚本：

```bash
# 发布到公众号
npx -y bun ${SKILL_DIR}/../baoyu-post-to-wechat/scripts/wechat-article.ts \
  --html .wechat-output/article.html
```

发布脚本会：
1. 打开 Chrome 浏览器（使用 CDP 协议）
2. 导航到微信公众号后台
3. 粘贴 HTML 内容
4. 依次替换图片占位符为实际图片

### manifest.json 格式

生成的 `manifest.json` 包含文章元信息和图片映射：

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

### 跨 Skill 脚本调用

本 Skill 依赖 `baoyu-post-to-wechat` Skill 的 CDP 发布脚本：

```
${SKILL_DIR}/../baoyu-post-to-wechat/scripts/wechat-article.ts
```

其中 `${SKILL_DIR}` 为当前 SKILL.md 所在目录。

### 故障排查

| 问题 | 解决方案 |
|------|----------|
| 未登录 | 首次运行会打开浏览器，扫码登录后会话会被保留 |
| Chrome 未找到 | 设置环境变量 `WECHAT_BROWSER_CHROME_PATH` |
| 粘贴失败 | 检查系统剪贴板权限 |
| 图片替换失败 | 确认 `manifest.json` 中的图片路径正确且文件存在 |

## 主题详情

### Claude 风格（简约橙）

简约橙色主题，适合技术分享、深度思考类文章。详见 [references/element-styles.md](references/element-styles.md)。

| 用途 | 色值 | 说明 |
|------|------|------|
| 主色 | `#D97757` | 标题边框、强调文字 |
| 背景浅 | `#FFF5F0` | 图片占位符背景 |
| 背景灰 | `#FAF9F7` | 表格交替行、代码块背景 |

**结构特点：**
- H2 标题带 4px 左边框
- 引用块使用浅灰背景
- 整体风格简洁清爽

### 橙韵风格（杂志卡片）

渐变头图 + 卡片布局，适合深度解读、专题报道类文章。详见 [references/chengyun-element-styles.md](references/chengyun-element-styles.md)。

| 用途 | 色值 | 说明 |
|------|------|------|
| 主色-亮 | `#fb923c` | 渐变起始色 |
| 主色-深 | `#ea580c` | 渐变结束色 |
| 强调色 | `#d97706` | 文字高亮、左边框 |
| 页面背景 | `#fcfbf8` | 浅米色/暖白 |

**结构特点：**
- 橙色渐变头部区域（带胶囊标签、主副标题）
- 白色内容卡片（负 margin 上移效果）
- 章节标题使用中文序号方块（一、二、三...）
- 引用块使用浅黄渐变背景
- 渐变分隔线

### 蓝色专业风格（商务数据）

蓝色渐变头图 + 白色卡片布局，适合数据分析、用户研究、商业报告类文章。详见 [references/blue-element-styles.md](references/blue-element-styles.md)。

| 用途 | 色值 | 说明 |
|------|------|------|
| 主色 | `#2563eb` | 专业蓝、标题边框 |
| 主色深 | `#1d4ed8` | 渐变结束色 |
| 强调色 | `#3b82f6` | 按钮、渐变起始 |
| 背景浅 | `#eff6ff` | 浅蓝背景、图片占位符 |
| 页面背景 | `#f8fafc` | 近白灰 |

**结构特点：**
- 蓝色渐变头部区域（带胶囊标签、主副标题、数据来源）
- 白色内容卡片（负 margin 上移效果，圆角阴影）
- 章节标题使用中文序号方块（一、二、三...）
- 引用块使用浅蓝渐变背景和蓝色左边框
- 渐变分隔线

### 贴纸风格（旋转贴纸）

旋转贴纸编号 + 渐变头图 + 卡片布局，适合教程指南、技术解析、趣味科普类文章。详见 [references/sticker-element-styles.md](references/sticker-element-styles.md)。

| 用途 | 色值 | 说明 |
|------|------|------|
| 主色 | `#D97757` | Claude 橙，贴纸背景 |
| 主色深 | `#C4684A` | 渐变结束色 |
| 背景灰 | `#FAF9F7` | 引用块背景 |
| 背景浅橙 | `#FFF5F0` | 提示块背景 |

**结构特点：**
- 橙色渐变头部区域（带胶囊标签、主副标题、来源信息）
- 白色内容卡片（负 margin 上移效果，圆角阴影）
- **旋转贴纸编号**（`transform: rotate(-15deg)`）⭐ 核心特色
- 章节标题使用阿拉伯数字 + 英文标签（01 PARALLEL, 02 PLAN...）
- 引用块使用灰色背景，提示块使用浅橙背景
- 渐变分隔线

**⚠️ 兼容性注意：** `transform: rotate()` 在部分老旧 Android WebView 可能不生效，降级为水平显示。

## 公众号 CSS 兼容性规范摘要

由于公众号编辑器的严格过滤，排版时需遵循以下原则（详见 [references/css-compatibility.md](references/css-compatibility.md)）：

1. **容器替换**: 尽量使用 `<section>` 替代 `<div>`，避免使用 `<table>` 做布局。
2. **背景色声明**: 如需使用表格，样式必须写在 `<td>` 或 `<th>` 上，而非 `<tr>`。
3. **代码块处理**: 不支持 `white-space: pre-wrap`，需将换行符转为 `<br>` 并处理空格。
4. **装饰限制**: 慎用 `dashed` 虚线边框，可放心使用 `border-radius` 和 `linear-gradient`。
5. **禁用布局**: 不支持 `flex`、`grid`，需使用 `inline-block` 或嵌套结构。
6. **字体继承**: `<th>` 和 `<td>` 必须显式声明 `font-size`，不能依赖表格继承。

## 输出文件说明

生成的产物将存放在 `.wechat-output/` 目录下：
- `article.html`: 可直接用浏览器打开并复制的预览页面。
- `raw-content.txt`: 纯 HTML 代码片段。

## 复制功能实现规范

生成的 HTML 预览文件**必须**包含以下复制函数实现，使用 Clipboard API 确保粘贴时保留 HTML 格式：

```javascript
async function copyContent() {
  const content = document.getElementById('wechat-content');
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

## 验证清单

### 通用检查
- [ ] 所有样式是否已内联（无 `<style>` 标签用于内容区域）？
- [ ] 代码块的长行是否已处理为可自动换行的 HTML 结构？
- [ ] 图片占位符是否包含原始文件名以便用户替换？
- [ ] 复制功能是否使用 Clipboard API + text/html blob？
- [ ] 所有正文段落 font-size 是否为 16px？
- [ ] 所有 `<th>` 和 `<td>` 是否**显式**包含 `font-size: 16px`？

### Claude 风格检查
- [ ] 表格背景色是否已正确应用到 `td` 标签？
- [ ] 引用块 (blockquote) 的边框是否符合主题配色？

### 橙韵风格检查
- [ ] 头部渐变区域是否完整（标签、主标题、副标题、日期）？
- [ ] 白色内容卡片是否使用负 margin 上移？
- [ ] 章节标题是否使用中文序号方块（一、二、三...）？
- [ ] 引用块是否使用浅黄渐变背景和左边框？
- [ ] 分隔线是否使用渐变效果？

### 蓝色专业风格检查
- [ ] 头部蓝色渐变区域是否完整（标签、主标题、副标题、数据来源）？
- [ ] 白色内容卡片是否使用负 margin 上移和圆角阴影？
- [ ] 章节标题是否使用蓝色中文序号方块（一、二、三...）？
- [ ] 引用块是否使用浅蓝渐变背景和蓝色左边框？
- [ ] 分隔线是否使用蓝色渐变效果？
- [ ] 强调文字是否使用 `#2563eb` 蓝色？

### 贴纸风格检查
- [ ] 头部橙色渐变区域是否完整（标签、主标题、副标题、来源信息）？
- [ ] 白色内容卡片是否使用负 margin 上移和圆角阴影？
- [ ] 旋转贴纸是否使用 `transform: rotate(-15deg)`？
- [ ] 贴纸序号是否使用两位数格式（01, 02...）+ 英文标签？
- [ ] 引用块是否使用 `#FAF9F7` 灰色背景和橙色左边框？
- [ ] 提示块是否使用 `#FFF5F0` 浅橙背景？
- [ ] 分隔线是否使用橙色渐变效果？
- [ ] 强调文字是否使用 `#D97757` 橙色？
