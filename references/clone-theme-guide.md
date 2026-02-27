# 模板复刻模式 — 完整操作指南

通过公众号文章 URL，自动分析提取排版风格，生成可复用的新主题。

### 触发方式

**命令格式：**
```bash
/wechat-clone-theme https://mp.weixin.qq.com/s/xxxxx
```

**自然语言格式：**
```
复刻这篇公众号的排版：https://mp.weixin.qq.com/s/xxxxx
模板复刻：https://mp.weixin.qq.com/s/xxxxx
```

> **URL 限制**：仅支持 `https://mp.weixin.qq.com/s/` 开头的公众号文章链接，其他 URL 将被拒绝。

---

### 第一步：URL 校验与抓取

1. **校验 URL**：必须是 `https://mp.weixin.qq.com/s/` 开头，否则拒绝并提示用户提供正确的公众号文章链接。

2. **抓取文章 HTML**：使用 webfetch 工具抓取文章内容，请求时设置标准浏览器 User-Agent。

3. **异常处理**：
   - 返回 403 → 提示文章可能已被删除或需要登录才能访问
   - 超时 → 重试一次，仍失败则提示网络问题
   - 内容为空或非 HTML → 提示 URL 无效或文章内容不可用

4. **提取文章标题**：从 `<h1>` 标签或 `<title>` 元素中提取，作为后续主题命名的参考信息。

---

### 第二步：样式分析与提取

对抓取到的 HTML 进行系统性样式分析，提取以下四类信息：

#### A. 配色方案提取

扫描所有内联 `style` 属性中的颜色声明（`color`、`background-color`、`background`、`border-color`、`border-left` 等），以及 `<style>` 标签中的规则（辅助参考）。

将提取的颜色归类，输出配色方案表：

| 色彩角色 | 色值 | 用途说明 |
|---------|------|---------|
| 主色 | `#xxxx` | 标题、强调、边框等核心元素 |
| 主色深 | `#xxxx` | 深色变体，用于悬停/对比 |
| 主色浅 | `#xxxx` | 浅色变体，用于背景/填充 |
| 强调色 | `#xxxx` | 高亮文字、链接、胶囊 |
| 背景浅 | `#xxxx` | 内容卡片背景 |
| 背景深 | `#xxxx` | 页面整体背景 |
| 正文色 | `#xxxx` | 段落正文颜色 |
| 标题色 | `#xxxx` | 各级标题颜色 |
| 辅助色 | `#xxxx` | 次要信息、引用文字 |

同时提取渐变定义（`linear-gradient` 的方向、色标值）用于头部区域重建。

#### B. 页面结构提取

识别页面的整体层级架构：

- **头部区域**：渐变背景/纯色背景、标签胶囊、主标题、副标题等
- **内容卡片**：白色或浅色圆角卡片，padding、border-radius、box-shadow（注意兼容性转换）
- **正文区域**：文章正文段落、章节标题的排列方式
- **尾部**：分隔线、版权信息、结尾装饰等（如有）

为每个结构层记录：容器标签类型、padding、margin、border-radius、background、宽度约束等参数。

绘制页面结构示意图（ASCII art），与现有主题格式保持一致，示例：

```
┌─────────────────────────────────────────────────┐
│ 外层容器 (section, max-width: 677px)             │
│ ┌─────────────────────────────────────────────┐ │
│ │ 头部渐变区域 (background: linear-gradient) │ │
│ │ ┌─────────────────────────────────────────┐ │ │
│ │ │ 标签胶囊 + 主标题 + 副标题              │ │ │
│ │ └─────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────┐ │
│ │ 内容白色卡片 (background: #ffffff)          │ │
│ │  H2 章节 │ H3 小节 │ 段落 │ 列表 │ 表格    │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

#### C. 元素样式提取（15 类）

逐一提取以下 15 类元素的内联样式参数，与现有主题格式对齐：

| 序号 | 元素 | 关注参数 |
|------|------|---------|
| 1 | 外层容器 | max-width、font-family、background |
| 2 | 头部区域 | background（渐变）、padding、border-radius |
| 3 | 头部标签/胶囊 | background、color、border-radius、padding、font-size |
| 4 | 主标题（H1） | font-size、font-weight、color、letter-spacing、margin |
| 5 | 章节标题（H2） | 装饰方式（左边框/序号方块/渐变背景）、font-size、color |
| 6 | 小节标题（H3） | font-size、font-weight、color、margin、装饰细节 |
| 7 | 段落（p） | font-size、line-height、letter-spacing、color、text-align |
| 8 | 强调文字（strong） | color、font-weight、背景色（如有） |
| 9 | 行内代码（code） | background、color、border-radius、padding、font-size |
| 10 | 代码块 | background、color、padding、border-radius、font-size |
| 11 | 引用块（blockquote） | border-left、background、color、padding |
| 12 | 无序列表（ul/li） | list-style、color、padding-left、line-height |
| 13 | 有序列表（ol/li） | list-style 或自定义序号、color、padding |
| 14 | 表格（table/th/td） | background、color、border、padding、font-size |
| 15 | 分隔线（hr） | border、background、height |
| 16 | 图片占位符 | 使用 `WECHATIMGPH_N` 格式（N 从 1 开始） |

#### D. 字号规范提取

统计各主要元素的 `font-size` 值，输出字号规范表：

| 元素 | 字号 |
|------|------|
| 正文段落 | `15px` |
| H2 标题 | `18px` |
| ... | ... |

---

### 第三步：缺失元素推导补全

目标文章中可能不包含所有 15 类元素。对未出现的元素执行推导：

**推导规则：**
- **颜色**：基于已提取的配色方案，按 `references/themes.md` 中的 HSL 派生逻辑推算色彩角色映射
- **间距**：与已提取元素保持风格一致（如整体偏紧凑或偏宽松）
- **圆角**：与已提取的卡片/胶囊圆角参数保持一致
- **结构模式**：参照现有主题中该元素的典型实现

**标注规则：** 在生成的文档中，对推导补全的元素 HTML 模板添加 `<!-- 推导补全 -->` 注释，与实际提取的元素区分。

---

### 第四步：CSS 兼容性检查

对所有提取和推导的样式执行兼容性合规检查：

| 违规项 | 处理方式 |
|--------|---------|
| `display: flex` / `display: grid` | 改为 `table` 布局 |
| `div` 上的 `background-color` | 改为 `table` 或 `section` 元素 |
| `box-shadow` | 移除或降级为 `border` |
| `transform` | 保留但标注兼容性风险 |
| `var(--xxx)` CSS 变量 | 替换为实际色值 |
| `@media` 媒体查询 | 移除 |
| `white-space: pre-wrap` in 代码块 | 改用 `section + br + &nbsp;` 方式 |
| `th/td` 未声明 `font-size` | 显式添加 `font-size` |
| `tr` 上的 `background-color` | 移至 `td/th` 上声明 |

---

### 第五步：预览确认

将分析结果完整展示给用户，包含以下内容：

1. **配色方案表**（主色/辅助色/背景色等，含具体色值）
2. **页面结构示意图**（ASCII art，反映实际抓取的结构）
3. **各元素样式预览**（展示关键元素的 HTML 模板片段）
4. **推导补全标注**（说明哪些元素未在原文出现，系推导生成）
5. **推荐主题名称**（基于视觉特征命名，如「渐变紫卡片」「极简黑白」「深蓝科技」）及推荐适用场景
6. **主题冲突检测**：检查 `references/` 目录是否已存在同名文件（`{theme-name}-element-styles.md`），若冲突则提示用户选择新名称

**询问用户：**
- 主题名称是否满意？或请输入自定义名称
- 样式是否需要调整？
- 确认后将写入文件，是否继续？

**等待用户确认后**再执行第六步写入操作。

---

### 第六步：写入与注册

用户确认后，依次完成以下操作：

**1. 生成主题文档**

创建 `references/{theme-name}-element-styles.md`，格式完全对齐现有主题文档结构：
- 配色方案表
- 色系派生变量表
- 字号规范表
- 页面结构示意图（ASCII art）
- 15 类元素 HTML 模板（推导补全的标注 `<!-- 推导补全 -->`）
- 约束与规范（参照 CSS 兼容性规则）

**2. 更新主题注册表**

在 `references/themes.md` 末尾新增主题条目，参照现有条目格式，包含：
- 主题名称和一句话描述
- 来源文章 URL（复刻自：...）
- 配色方案摘要
- 核心元素样式说明
- 页面结构 ASCII art
- 适用场景

**3. 更新 SKILL.md**

- 在「第一步：主题选择」表格中新增该主题的行（名称、特点、适用场景）
- 在「第四步：分段转换」的主题→样式文件映射列表中新增对应条目

> **注意**：模板复刻模式仅产出主题文档，不自动触发排版发布流程。如需使用新主题排版文章，请使用 `/wechat-format` 命令并选择该主题。
