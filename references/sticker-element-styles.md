> **CSS 兼容性速查**: div 上样式用 table+td 替代 | tr 背景色写在 td 上 | th/td 必须显式 font-size | 代码块用 br+nbsp 替代 white-space | 不支持 flex/grid/box-shadow/var()/position | 完整规范见 SKILL.md

# 贴纸风格：Element Styles

本文档包含了 `wechat-article-formatter` Skill 的「贴纸风格」主题元素样式模板，特色是旋转贴纸编号，适合教程指南、技术解析、趣味科普类文章。

> 基于参考文章 https://mp.weixin.qq.com/s/AjVuo5XqNbIgiBiaGf63zQ 提炼，包含 `transform: rotate()` 特效（部分设备兼容性风险已知）。采用 Claude 橙色系配色。

## 配色方案

| 用途 | 色值 | 说明 |
|:---|:---|:---|
| 主色 | `#D97757` | Claude 橙，贴纸背景 |
| 主色深 | `#C4684A` | 渐变结束色 |
| 主色浅 | `#E8956D` | 渐变辅助 |
| 正文色 | `#2D2D2D` | 深灰，正文段落 |
| 辅助色 | `#666666` | 中灰，引用块 |
| 标题色 | `#1A1A1A` | 近黑，章节标题 |
| 页面背景 | `#FFFFFF` | 白色 |
| 块背景-灰 | `#FAF9F7` | 引用/注释块（Claude 灰） |
| 块背景-浅橙 | `#FFF5F0` | 提示/警告块 |
| 文字-提示 | `#8A6D3B` | 棕色，提示块内文字 |

### 色系变量（用于自定义派生）

当用户指定自定义主色时，需要替换以下色值：

| 变量名 | 默认值 | 派生规则 | 用途 |
|:---|:---|:---|:---|
| `{主色}` | `#D97757` | 用户提供 | 贴纸背景、强调色、H3 标题 |
| `{主色-深}` | `#C4684A` | 主色 L-10% | 渐变结束 |
| `{主色-浅}` | `#E8956D` | 主色 L+10% | 渐变辅助 |
| `{背景-浅}` | `#FFF5F0` | 主色 S=20%, L=97% | 提示块背景 |
| `{文字-提示}` | `#8A6D3B` | 主色 H 偏移-20°, L=35% | 提示块文字 |

**渐变替换规则：**
- 头部渐变：`linear-gradient(135deg, {主色} 0%, {主色-深} 100%)`
- 分隔线：`linear-gradient(90deg, transparent, rgba({主色RGB}, 0.6), transparent)`

**贴纸颜色替换：**
- 贴纸背景色：`{主色}`
- 贴纸边框左色（引用块）：`{主色}`

---

## 字号规范

| 元素 | 字号 | 行高 | 字重 |
|:---|:---|:---|:---|
| 主标题 (H1) | 26px | 1.3 | bold |
| 旋转贴纸-数字 | 24px | 1 | bold |
| 旋转贴纸-标签 | 10px | 1.2 | normal |
| 章节标题 | 22px | 1.4 | bold |
| H3 小节标题 | 18px | 1.4 | bold |
| 正文段落 | 16px | 2.2 | normal |
| 引用块文字 | 16px | 2 | normal |
| 列表项 | 16px | 2 | normal |
| 表格单元格 | 16px | 1.6 | normal |
| 辅助文字 | 14px | 1.6 | normal |
| 胶囊标签 | 12px | 1 | normal |

---

## 页面结构模板

### 1. 最外层容器

```html
<section style="box-sizing: border-box; margin: 0px auto; padding: 0px; background-color: #FFFFFF;">
</section>
```

---

### 2. 头部渐变区域

```html
<section style="box-sizing: border-box; background: linear-gradient(135deg, #D97757 0%, #C4684A 100%); padding: 40px 20px 50px; overflow: hidden; border-radius: 0px 0px 24px 24px;">
</section>
```

**样式要点：**
- 渐变方向：`135deg`（左上到右下）
- 渐变色：`#D97757` → `#C4684A`（Claude 橙）
- 底部圆角：`24px`
- 内边距：上 `40px`，左右 `20px`，下 `50px`（为白色卡片上移留空间）

---

### 3. 头部标签（胶囊）

```html
<section style="box-sizing: border-box; display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 4px 12px; border-radius: 20px; margin-bottom: 8px;">
  <span style="color: #ffffff; font-size: 12px; letter-spacing: 1px;">{标签文字}</span>
</section>
```

**用途：** 文章分类标签，如「技术教程」「使用指南」「效率提升」

**注意：** `margin-bottom: 8px` 控制与标题的间距

---

### 4. 头部主标题（H1）

```html
<h1 style="margin: 0px 0px 12px; font-size: 26px; color: #ffffff; line-height: 1.3; font-weight: bold;">{主标题}</h1>
```

---

### 5. 头部副标题

```html
<p style="margin: 0px; color: rgba(255, 255, 255, 0.9); font-size: 16px; line-height: 1.6;">{副标题}</p>
```

---

### 6. 头部来源信息

```html
<p style="margin: 16px 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 14px;">{来源信息}</p>
```

---

### 7. 白色内容卡片（开篇区域）

```html
<section style="box-sizing: border-box; padding: 28px 22px; background: #ffffff; margin: -20px 15px 24px; border-radius: 16px; box-shadow: rgba(0, 0, 0, 0.06) 0px 8px 30px;">
</section>
```

**样式要点：**
- 负上边距：`-20px`（上移与头部重叠）
- 左右边距：`15px`（比头部窄，形成层次）
- 圆角：`16px`
- 阴影：`rgba(0, 0, 0, 0.06) 0px 8px 30px`

**用途：** 放置文章开篇引言（**仅限一段精炼的核心观点或数据 hook，不超过 2-3 句话**）。自我介绍、背景铺垫、过渡段落等内容不放入此卡片，应置于卡片之后作为正文开头。卡片内容过多会导致白色区域过高，破坏视觉层次。

---

### 8. 正文区域容器

```html
<section style="box-sizing: border-box; padding: 0 20px 35px;">
</section>
```

---

## 元素模板

### 9. 分隔线

**首个分隔线（在开篇卡片后）：**
```html
<section style="height: 2px; background: linear-gradient(90deg, transparent, rgba(217,119,87,0.6), transparent); margin: 10px 0 30px;"></section>
```

**章节间分隔线：**
```html
<section style="height: 2px; background: linear-gradient(90deg, transparent, rgba(217,119,87,0.6), transparent); margin: 30px 0;"></section>
```

**样式要点：**
- 高度：`2px`
- 渐变：两端透明，中间橙色（60% 透明度）

---

### 10. 旋转贴纸编号 ⭐ 核心特色

```html
<section style="margin-bottom: 12px;">
  <section style="transform: rotate(-15deg); display: inline-block; margin-left: 10px;">
    <section style="background-color: #D97757; color: white; padding: 12px 18px; border-radius: 10px; text-align: center;">
      <span style="display: block; font-size: 24px; font-weight: bold; line-height: 1;">{序号}</span>
      <span style="display: block; font-size: 10px; line-height: 1.2; margin-top: 4px; letter-spacing: 0.5px;">{英文标签}</span>
    </section>
  </section>
</section>
```

**样式要点：**

| 属性 | 值 | 说明 |
|------|-----|------|
| transform | `rotate(-15deg)` | 逆时针旋转 15 度 |
| display (外层) | `inline-block` | 收缩包裹内容 |
| background-color | `#D97757` | Claude 橙 |
| border-radius | `10px` | 圆角 |
| padding | `12px 18px` | 内边距 |
| margin-bottom | `12px` | 与标题间距 |

**序号格式：** `01`, `02`, `03`, ... , `10`, `11`, ...

**英文标签对照表：**

| 场景 | 英文标签 |
|------|----------|
| 开篇/引言 | INTRO |
| 核心观点 | KEY POINT |
| 技巧/提示 | TIPS |
| 步骤 | STEP |
| 案例 | CASE |
| 对比 | COMPARE |
| 总结 | SUMMARY |
| 结论 | CONCLUSION |
| 注意事项 | NOTICE |
| 常见问题 | FAQ |
| 配置/设置 | CONFIG |
| 工具 | TOOLS |
| 最佳实践 | BEST PRACTICE |

**⚠️ 兼容性警告：** `transform: rotate()` 在部分微信客户端（特别是老旧 Android WebView）可能不生效，降级为水平显示。用户已知悉此风险。

---

### 11. 章节标题

```html
<h2 style="font-size: 22px; font-weight: bold; color: #1A1A1A; margin: 0 0 20px 0; line-height: 1.4;">{章节标题}</h2>
```

---

### 12. H3 小节标题

```html
<h3 style="font-size: 18px; font-weight: bold; color: #D97757; margin-top: 28px; margin-bottom: 16px;">{标题}</h3>
```

---

### 13. 正文段落

```html
<p style="font-size: 16px; color: #2D2D2D; line-height: 2.2; letter-spacing: 0.3px; margin: 0 0 18px 0;">{段落文字}</p>
```

**样式要点：**
- 字号：`16px`
- 颜色：`#2D2D2D`
- 行高：`2.2`（舒适阅读）
- 字间距：`0.3px`
- 段落间距：`18px`

---

### 14. 引用块（灰色）

```html
<section style="background-color: #FAF9F7; border-radius: 12px; padding: 18px 22px; border-left: 4px solid #D97757; margin: 0 0 20px 0;">
  <p style="font-size: 16px; color: #666666; line-height: 2; letter-spacing: 0.3px; margin: 0;">{引用文字}</p>
</section>
```

**样式要点：**
- 背景：Claude 灰 `#FAF9F7`
- 左边框：`4px solid #D97757`
- 圆角：`12px`
- 内边距：`18px 22px`
- 文字颜色：中灰 `#666666`

---

### 15. 提示块（浅橙色）

```html
<section style="background-color: #FFF5F0; border-radius: 12px; padding: 18px 22px; border-left: 4px solid #D97757; margin: 0 0 20px 0;">
  <p style="font-size: 16px; color: #8A6D3B; line-height: 2; letter-spacing: 0.3px; margin: 0;">{提示文字}</p>
</section>
```

**用途：** 重要提醒、温馨提示、注意事项

---

### 16. 高亮/强调文字

```html
<strong style="color: #D97757;">{高亮文字}</strong>
```

**用途：**
- 段落中的重点句子
- 总结性观点
- 关键术语

---

### 17. 行内代码

```html
<code style="background-color: #FAF9F7; color: #D97757; padding: 2px 6px; border-radius: 4px; font-family: Menlo, Monaco, Consolas, monospace; font-size: 14px;">{代码}</code>
```

---

### 18. 代码块

```html
<section style="background-color: #2D2D2D; color: #E8E8E8; padding: 16px 20px; border-radius: 8px; margin: 20px 0; font-family: Menlo, Monaco, Consolas, 'Microsoft YaHei', monospace; font-size: 14px; line-height: 2; display: block;">
<span style="color: #6A9955;"># 注释用绿色</span><br>
command --flag=value<br>
&nbsp;&nbsp;缩进内容
</section>
```

---

### 19. 无序列表

```html
<ul style="margin: 0 0 20px 0; padding-left: 20px;">
<li style="margin-bottom: 10px; font-size: 16px; color: #2D2D2D; line-height: 2;">{列表项}</li>
</ul>
```

---

### 20. 有序列表

```html
<ol style="margin: 0 0 20px 0; padding-left: 20px;">
<li style="margin-bottom: 10px; font-size: 16px; color: #2D2D2D; line-height: 2;">{列表项}</li>
</ol>
```

---

### 21. 表格

```html
<table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 16px;">
<thead>
<tr>
<th style="padding: 12px 15px; text-align: left; border: 1px solid #E5E5E5; background-color: #D97757; color: #FFFFFF; font-size: 16px;">列1</th>
<th style="padding: 12px 15px; text-align: left; border: 1px solid #E5E5E5; background-color: #D97757; color: #FFFFFF; font-size: 16px;">列2</th>
</tr>
</thead>
<tbody>
<tr>
<td style="padding: 12px 15px; border: 1px solid #E5E5E5; background-color: #FFFFFF; color: #2D2D2D; font-size: 16px;">内容</td>
<td style="padding: 12px 15px; border: 1px solid #E5E5E5; background-color: #FFFFFF; color: #2D2D2D; font-size: 16px;">内容</td>
</tr>
<tr>
<td style="padding: 12px 15px; border: 1px solid #E5E5E5; background-color: #FAF9F7; color: #2D2D2D; font-size: 16px;">交替行</td>
<td style="padding: 12px 15px; border: 1px solid #E5E5E5; background-color: #FAF9F7; color: #2D2D2D; font-size: 16px;">交替行</td>
</tr>
</tbody>
</table>
```

**注意：** 背景色和 font-size 必须直接应用在 `td` 或 `th` 标签上。

---

### 22. 图片

图片需要手动上传到公众号素材库后替换。生成时使用图片标签：

```html
<section style="margin: 20px 0; text-align: center;">
  <img src="{图片URL}" style="max-width: 100%; border-radius: 8px;" />
</section>
```

**图片占位符（无法获取图片时）：**
```html
<table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
<tbody><tr>
<td style="background-color: #FFF5F0; border: 1px solid #D97757; color: #D97757; padding: 30px 20px; text-align: center; font-weight: bold; font-size: 16px;">
WECHATIMGPH_1
</td>
</tr></tbody>
</table>
```

---

### 23. 底部署名

```html
<p style="margin: 35px 0 20px 0; text-align: center; color: #999999; font-size: 14px; font-style: italic;">{署名文字}</p>
```

---

> CSS 兼容性规则详见 [css-compatibility.md](css-compatibility.md)。

---

## Markdown → HTML 转换规则

| Markdown 元素 | 转换为 |
|---------------|--------|
| `# 标题` | 头部主标题 `<h1>` |
| `## 章节` | 旋转贴纸 + 章节标题 `<h2>` |
| `### 小节` | H3 小节标题（橙色） |
| 普通段落 | `<p>` 正文段落样式 |
| `> 引用` | 引用块 `<section>`（灰色背景） |
| `> **提示**` | 提示块 `<section>`（浅橙背景） |
| `**加粗**` | `<strong style="color: #D97757;">` |
| `---` | 分隔线 `<section>`（渐变） |
| `` `代码` `` | 行内代码 `<code>` |
| 代码块 | `<section>` + `<br>` 换行 |
| 列表 | `<ul>` / `<ol>` |
| 表格 | `<table>` 带内联样式 |
| `![图片]()` | 图片 `<img>` 或占位符 |

---

## 完整章节组合示例

一个完整的章节应包含：旋转贴纸 → 章节标题 → 正文内容

```html
<section style="margin-bottom: 12px;">
  <section style="transform: rotate(-15deg); display: inline-block; margin-left: 10px;">
    <section style="background-color: #D97757; color: white; padding: 12px 18px; border-radius: 10px; text-align: center;">
      <span style="display: block; font-size: 24px; font-weight: bold; line-height: 1;">01</span>
      <span style="display: block; font-size: 10px; line-height: 1.2; margin-top: 4px; letter-spacing: 0.5px;">PARALLEL</span>
    </section>
  </section>
</section>

<h2 style="font-size: 22px; font-weight: bold; color: #1A1A1A; margin: 0 0 20px 0; line-height: 1.4;">多开几个窗口并行干活</h2>

<p style="font-size: 16px; color: #2D2D2D; line-height: 2.2; letter-spacing: 0.3px; margin: 0 0 18px 0;">同时开 3-5 个 git worktree，每个跑一个独立的 Claude 会话。这是团队公认的最大生产力提升。</p>
```

---

## 完整模板结构

```html
<section style="box-sizing: border-box; margin: 0px auto; padding: 0px; background-color: #FFFFFF;">

  <section style="box-sizing: border-box; background: linear-gradient(135deg, #D97757 0%, #C4684A 100%); padding: 40px 20px 50px; overflow: hidden; border-radius: 0px 0px 24px 24px;">
    <section style="box-sizing: border-box; display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 4px 12px; border-radius: 20px; margin-bottom: 8px;">
      <span style="color: #ffffff; font-size: 12px; letter-spacing: 1px;">{{标签文字}}</span>
    </section>
    <h1 style="margin: 0px 0px 12px; font-size: 26px; color: #ffffff; line-height: 1.3; font-weight: bold;">{{主标题}}</h1>
    <p style="margin: 0px; color: rgba(255, 255, 255, 0.9); font-size: 16px; line-height: 1.6;">{{副标题}}</p>
    <p style="margin: 16px 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 14px;">{{来源信息}}</p>
  </section>

  <section style="box-sizing: border-box; padding: 28px 22px; background: #ffffff; margin: -20px 15px 24px; border-radius: 16px; box-shadow: rgba(0, 0, 0, 0.06) 0px 8px 30px;">
    <p style="font-size: 16px; color: #2D2D2D; line-height: 2.2; letter-spacing: 0.3px; margin: 0;">{{开篇段落}}</p>
  </section>

  <section style="box-sizing: border-box; padding: 0 20px 35px;">

    <section style="height: 2px; background: linear-gradient(90deg, transparent, rgba(217,119,87,0.6), transparent); margin: 10px 0 30px;"></section>

    <section style="margin-bottom: 12px;">
      <section style="transform: rotate(-15deg); display: inline-block; margin-left: 10px;">
        <section style="background-color: #D97757; color: white; padding: 12px 18px; border-radius: 10px; text-align: center;">
          <span style="display: block; font-size: 24px; font-weight: bold; line-height: 1;">01</span>
          <span style="display: block; font-size: 10px; line-height: 1.2; margin-top: 4px; letter-spacing: 0.5px;">{{英文标签}}</span>
        </section>
      </section>
    </section>

    <h2 style="font-size: 22px; font-weight: bold; color: #1A1A1A; margin: 0 0 20px 0; line-height: 1.4;">{{章节标题}}</h2>

    <p style="font-size: 16px; color: #2D2D2D; line-height: 2.2; letter-spacing: 0.3px; margin: 0 0 18px 0;">{{段落文字}}</p>

    <section style="background-color: #FAF9F7; border-radius: 12px; padding: 18px 22px; border-left: 4px solid #D97757; margin: 0 0 20px 0;">
      <p style="font-size: 16px; color: #666666; line-height: 2; letter-spacing: 0.3px; margin: 0;">{{引用文字}}</p>
    </section>

    <section style="height: 2px; background: linear-gradient(90deg, transparent, rgba(217,119,87,0.6), transparent); margin: 30px 0;"></section>

    <p style="margin: 35px 0 20px 0; text-align: center; color: #999999; font-size: 14px; font-style: italic;">{{署名文字}}</p>

  </section>

</section>
```
