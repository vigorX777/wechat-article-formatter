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

产物存放在 `.wechat-output/` 目录下：
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

> HTML 已生成到 `.wechat-output/article.html`
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
| 图片替换失败 | 确认 manifest.json 中图片路径正确且文件存在 |
| Bun 未安装 | `npm install -g bun` 或 `npx -y bun` |

---

## CSS 兼容性规范

转换时必须遵守：**div 上样式用 table+td 替代 | tr 背景色写在 td 上 | th/td 必须显式 font-size | 代码块用 br+nbsp 替代 white-space | 不支持 flex/grid/box-shadow/var()/position**。

详细规则见各主题 element-styles 文件头部的兼容性速查提示。

---

## HTML 输出规范

| 要求 | 说明 |
|------|------|
| 容器 ID | 内容容器必须使用 `id="output"`（发布脚本依赖此 ID） |
| 样式内联 | 所有样式写在元素 `style` 属性中 |
| 图片占位符 | 格式为 `WECHATIMGPH_N`（N 从 1 开始） |
| ⚠️ 预览辅助元素禁入内容区 | 预览提示和复制按钮必须放在 `#output` 和 `.preview-wrapper` **外部**，用 `position: fixed` 定位 |
| ⚠️ 封面图位置 | 封面图（WECHATIMGPH_1）必须放在白色内容卡片（前言）**之后**。顺序：头部渐变 → 白色卡片（前言）→ 封面图 → 分隔线 → 正文 |

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
