# 微信文章排版生成器 (WeChat Article Formatter)

将 Markdown 文稿一键转换为微信公众号编辑器兼容的 HTML，支持自动发布。

## 功能概览

- **Markdown → 公众号 HTML**：自动转换标题、列表、引用、表格、代码块等元素，所有样式内联
- **CSS 兼容性引擎**：自动处理公众号编辑器的限制（`div` 转 `table`、`white-space` 预处理、字体显式声明等）
- **4 种预设主题**：Claude 风格 · 橙韵风格 · 蓝色专业 · 贴纸风格，均支持自定义主色
- **自定义色系派生**：输入一个主色 HEX 值，自动通过 HSL 计算派生完整色系
- **一键复制**：生成的预览页面内置 Clipboard API 复制按钮，粘贴到公众号编辑器即保留样式
- **CDP 自动发布**：通过 Chrome DevTools Protocol 自动化登录、创建草稿、粘贴内容、替换图片、保存

## 主题一览

| 主题 | 默认主色 | 风格特点 | 适用场景 |
|------|----------|----------|----------|
| **Claude 风格** | `#D97757` | 简约橙色、左边框标题、清爽段落 | 技术分享、日常随笔 |
| **橙韵风格** | `#fb923c` | 渐变头图、卡片布局、杂志感 | 深度解读、专题报道 |
| **蓝色专业** | `#2563eb` | 蓝色渐变、白色卡片、数据感 | 数据分析、商业报告 |
| **贴纸风格** | `#D97757` | 旋转贴纸编号、渐变头图 | 教程指南、趣味科普 |

所有主题均支持通过 `--color #HEX` 自定义主色，Claude 会自动派生完整配色方案。

## 快速开始

### 排版文章

```bash
# 交互式（逐步选择主题和色系）
/wechat-format @article.md

# 一次性指定
/wechat-format @article.md --theme 橙韵

# 自定义主色
/wechat-format @article.md --theme 蓝色专业 --color #10B981

# 自然语言
用橙韵风格排版 @深度解读.md
```

### 发布到公众号

```bash
# 发布已生成的 HTML
/wechat-post-html .wechat-output/article.html

# 带图片映射
/wechat-post-html .wechat-output/article.html --manifest .wechat-output/manifest.json

# 带封面图
/wechat-post-html .wechat-output/article.html --cover ./cover.png
```

## 工作流程

```
Markdown 文稿
     │
     ▼
┌─────────────┐
│ 1. 选择主题  │  Claude / 橙韵 / 蓝色专业 / 贴纸
│ 2. 选择色系  │  默认色 或 自定义 HEX
└─────┬───────┘
      │
      ▼
┌─────────────────────┐
│ 3. Markdown → HTML  │  逐元素转换 + CSS 兼容性处理
│    样式内联          │  所有 style 写在元素属性中
│    图片 → 占位符     │  WECHATIMGPH_1, WECHATIMGPH_2, ...
└─────┬───────────────┘
      │
      ▼
┌─────────────────────┐
│ 4. 输出文件          │
│  .wechat-output/    │
│  ├── article.html   │  带复制按钮的预览页面
│  ├── raw-content.txt│  纯 HTML 片段
│  └── manifest.json  │  标题、图片映射等元信息
└─────┬───────────────┘
      │
      ▼
┌─────────────────────┐
│ 5. 发布（可选）      │  CDP 自动化
│  启动 Chrome        │
│  → 登录检测         │  首次需扫码
│  → 创建草稿         │  点击"写图文"
│  → 粘贴 HTML        │  通过临时标签页复制
│  → 替换图片占位符    │  逐个粘贴本地图片
│  → 保存草稿         │
└─────────────────────┘
```

## 项目结构

```
wechat-article-formatter/
├── SKILL.md                    # Skill 定义（LLM 读取的主入口）
├── README.md                   # 本文件
├── assets/                     # HTML 预览模板
│   ├── template.html           # Claude 风格模板
│   ├── template-chengyun.html  # 橙韵风格模板
│   ├── template-blue.html      # 蓝色专业模板
│   └── template-sticker.html   # 贴纸风格模板
├── scripts/                    # 自动化脚本（Bun + TypeScript）
│   ├── publish.ts              # CDP 发布主流程（617 行）
│   ├── clipboard.ts            # 跨平台剪贴板操作（321 行）
│   └── cdp.ts                  # Chrome DevTools Protocol 客户端（274 行）
└── references/                 # 样式与规范参考文档
    ├── themes.md               # 4 个主题定义 + 色系派生逻辑
    ├── element-styles.md       # Claude 风格元素样式
    ├── chengyun-element-styles.md  # 橙韵风格元素样式
    ├── blue-element-styles.md  # 蓝色专业元素样式
    ├── sticker-element-styles.md   # 贴纸风格元素样式
    ├── css-compatibility.md    # 公众号 CSS 兼容性规范
    ├── copy-function.md        # 复制按钮实现规范
    └── verification-checklist.md   # 转换后验证清单
```

## 环境要求

| 依赖 | 用途 |
|------|------|
| **Google Chrome** | CDP 自动化发布（本地安装） |
| **Bun** | 执行 TypeScript 脚本（`npx -y bun`） |
| **macOS 辅助功能权限** | `osascript` 发送键盘事件（Cmd+V 粘贴） |

### macOS 权限设置

首次发布需授予终端辅助功能权限：

1. **系统偏好设置 → 安全性与隐私 → 隐私 → 辅助功能**
2. 添加你的终端应用（Terminal / iTerm2 / VS Code 等）
3. 重启终端

## 脚本说明

### publish.ts — 发布主流程

```bash
npx -y bun scripts/publish.ts --html <path> [options]
```

| 参数 | 说明 |
|------|------|
| `--html <path>` | HTML 文件路径（必需） |
| `--manifest <path>` | manifest.json 路径（可选，含标题/图片映射） |
| `--cover <path>` | 封面图路径（可选，通过 CDP 自动上传） |
| `--profile <dir>` | Chrome profile 目录（可选，保持登录状态） |

### clipboard.ts — 跨平台剪贴板

- **macOS**：Swift + AppKit（`NSPasteboard`），支持 HTML 和图片
- **Linux**：`wl-copy`（Wayland）或 `xclip`（X11）
- **Windows**：PowerShell `Set-Clipboard`

### cdp.ts — Chrome DevTools Protocol 客户端

轻量级 CDP 实现，支持：
- 自动发现空闲端口并启动 Chrome
- WebSocket 双向通信
- 多 Target/Session 管理
- 页面导航、DOM 操作、JavaScript 执行

## manifest.json 格式

排版生成的元信息文件，供发布脚本消费：

```json
{
  "title": "文章标题",
  "author": "作者",
  "summary": "摘要（≤100字）",
  "coverImage": "./cover.png",
  "contentImages": [
    {
      "placeholder": "WECHATIMGPH_1",
      "localPath": "./images/fig1.png",
      "originalPath": "./images/fig1.png"
    }
  ]
}
```

## 更新日志

### v2.0.0 (2026-02-24)
- **长文档分段转换**：>150 行文档按 H2 标题自动切分，逐段转换后拼接，解决长文内容丢失问题
- **自动结构验证**：转换后自动比对 H2/H3 数量、表格行数、列表项数、图片占位符数，不匹配时自动补漏
- **封面图自动上传**：通过 CDP `DOM.setFileInputFiles` 实现封面图自动注入，支持裁剪确认弹窗处理
- **SKILL.md 重构**：将重复内容抽离到 references/ 目录，SKILL.md 精简为工作流程定义
- **模板标准化**：统一 4 个模板的容器 ID (`#output`) 和复制函数实现

### v1.4.0 (2026-02-12)
- **Claude 风格升级**：行高调整为 1.75、字距 0.05em、H2 改用虚线下边框
- **容器样式优化**：新增外层容器背景色和内边距配置
- **验证清单增强**：新增 Claude 风格专项验证条目

### v1.3.1 (2026-02-06)
- **内容完整性检查**：新增转换后内容丢失检测机制
- **故障排查文档**：补充常见问题和解决方案

### v1.3.0 (2026-02-04)
- **自定义色系**：支持输入 HEX 主色，自动通过 HSL 派生完整色系
- **快捷模式**：支持 `--theme` + `--color` 一次性配置，跳过交互式提问
- **自动发布流程**：排版完成后询问是否发布，整合 `/wechat-post-html` 调用
- **命令重命名**：`/wechat-publish` → `/wechat-post-html`
- **CDP 发布脚本**：新增 `publish.ts`、`clipboard.ts`、`cdp.ts`，实现完整的 Chrome 自动化发布

### v1.2.0 (2026-02-01)
- **蓝色专业主题**：新增蓝色渐变 + 白色卡片主题，适合数据分析和商业报告
- **表格字体继承修复**：解决公众号编辑器表格字体不继承的兼容性问题

### v1.1.0 (2026-01-28)
- **橙韵主题**：新增渐变头图 + 卡片布局的杂志风主题

### v1.0.0 (2026-01-26)
- **初始发布**：Claude 风格主题，Markdown → 公众号 HTML 转换核心功能
- **CSS 兼容性引擎**：`div` 转 `table`、代码块换行、字体继承等兼容性处理
- **一键复制**：Clipboard API 复制按钮

## 已知限制

| 限制 | 说明 | 应对 |
|------|------|------|
| 网络图片 | 不自动下载 Markdown 中的网络图片 URL | 需手动下载到本地并更新路径 |
| 仅保存草稿 | 发布脚本只保存为草稿，不直接发布 | 需到公众号后台手动点击发布 |

## License

Private skill — 仅供个人使用。
