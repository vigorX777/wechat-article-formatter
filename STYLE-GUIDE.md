# 微信公众号文章排版样式规范

> 基于参考文章 https://mp.weixin.qq.com/s/5OqgvE1pz4fKtS3lHp0xoA 提炼，已验证公众号编辑器兼容性。

---

## 一、整体色彩规范

### 主色调（橙色系）

| 用途 | 色值 | 说明 |
|------|------|------|
| 主色-亮 | `#fb923c` | 渐变起始色 |
| 主色-深 | `#ea580c` | 渐变结束色 |
| 强调色 | `#d97706` | 文字高亮、左边框 |
| 深橙 | `#78350f` | 引用块文字 |

### 背景色

| 用途 | 色值 | 说明 |
|------|------|------|
| 页面背景 | `#fcfbf8` | 浅米色/暖白 |
| 内容卡片 | `#ffffff` | 纯白 |
| 引用块背景-亮 | `#fff9e6` | 渐变起始 |
| 引用块背景-深 | `#fef3c7` | 渐变结束 |

### 文字色

| 用途 | 色值 | 说明 |
|------|------|------|
| 正文 | `#4a4a4a` | 深灰，护眼 |
| 标题 | `#1a1a1a` | 近黑 |
| 次要信息 | `#9ca3af` | 浅灰 |
| 白底高亮 | `#d97706` | 橙色强调 |

---

## 二、页面结构

```
┌─────────────────────────────────────┐
│  头部渐变区域（橙色渐变）            │
│  - 标签（半透明白底胶囊）            │
│  - 主标题（白色大字）                │
│  - 副标题（半透明白字）              │
│  - 日期信息（半透明白字）            │
└─────────────────────────────────────┘
     ┌─────────────────────────┐
     │  白色内容卡片            │  ← 负 margin 上移，与头部重叠
     │  - 开篇引言              │
     └─────────────────────────┘
┌─────────────────────────────────────┐
│  正文区域                            │
│  - 分隔线                            │
│  - 章节标题（序号方块 + 标题）       │
│  - 正文段落                          │
│  - 引用块                            │
│  - 高亮文字                          │
│  - ...重复...                        │
│  - 底部署名                          │
└─────────────────────────────────────┘
```

---

## 三、各元素样式规范

### 1. 最外层容器

```html
<section style="box-sizing: border-box; margin: 0px auto; padding: 0px; background-color: #fcfbf8;">
  <!-- 所有内容 -->
</section>
```

---

### 2. 头部渐变区域

```html
<section style="box-sizing: border-box; background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%); padding: 40px 20px 50px; overflow: hidden; border-radius: 0px 0px 24px 24px;">
  <!-- 标签、标题、副标题 -->
</section>
```

**样式要点：**
- 渐变方向：`135deg`（左上到右下）
- 底部圆角：`24px`
- 内边距：上 `40px`，左右 `20px`，下 `50px`（为白色卡片上移留空间）

---

### 3. 头部标签（胶囊）

```html
<section style="box-sizing: border-box; display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 4px 12px; border-radius: 20px; margin-bottom: 15px;">
  <span style="color: #ffffff; font-size: 12px; letter-spacing: 1px;">OpenAI AMA 深度解读</span>
</section>
```

**样式要点：**
- 半透明白底：`rgba(255, 255, 255, 0.2)`
- 胶囊圆角：`20px`
- 字号：`12px`
- 字间距：`1px`

---

### 4. 头部主标题

```html
<h1 style="margin: 0px 0px 15px; font-size: 26px; color: #ffffff; line-height: 1.3; font-weight: bold;">标题文字</h1>
```

**样式要点：**
- 字号：`26px`
- 行高：`1.3`
- 颜色：纯白 `#ffffff`

---

### 5. 头部副标题

```html
<p style="margin: 0px; color: rgba(255, 255, 255, 0.9); font-size: 14px; line-height: 1.6;">副标题文字</p>
```

**样式要点：**
- 颜色：90% 透明度白色
- 字号：`14px`

---

### 6. 头部日期信息

```html
<p style="margin: 20px 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 13px;">基于 Sam Altman 2026.1.27 AMA 整理</p>
```

**样式要点：**
- 颜色：80% 透明度白色
- 字号：`13px`
- 上边距：`20px`

---

### 7. 白色内容卡片（开篇区域）

```html
<section style="box-sizing: border-box; padding: 28px 22px; background: #ffffff; margin: -20px 15px 24px; border-radius: 16px; box-shadow: rgba(0, 0, 0, 0.06) 0px 8px 30px;">
  <!-- 开篇引言段落 -->
</section>
```

**样式要点：**
- 负上边距：`-20px`（上移与头部重叠）
- 左右边距：`15px`（比头部窄，形成层次）
- 圆角：`16px`
- 阴影：`rgba(0, 0, 0, 0.06) 0px 8px 30px`

---

### 8. 正文区域容器

```html
<section style="box-sizing: border-box; padding: 0 20px 35px;">
  <!-- 分隔线、章节标题、段落、引用块 -->
</section>
```

---

### 9. 分隔线

```html
<section style="height: 2px; background: linear-gradient(90deg, transparent, rgba(217,119,6,0.6), transparent); margin: 30px 0;"></section>
```

**样式要点：**
- 高度：`2px`
- 渐变：两端透明，中间橙色（60% 透明度）
- 上下边距：`30px`

**首次出现的分隔线（在开篇后）：**
```html
<section style="height: 2px; background: linear-gradient(90deg, transparent, rgba(217,119,6,0.6), transparent); margin: 10px 0 30px;"></section>
```
- 上边距较小：`10px`

---

### 10. 章节标题（序号方块 + 标题文字）⭐ 关键

```html
<p style="margin: 0 0 24px 0; line-height: 40px;">
  <span style="display: inline-block; background: linear-gradient(135deg, #d97706 0%, #ea580c 100%); color: #ffffff; font-size: 18px; font-weight: bold; width: 40px; height: 40px; line-height: 40px; text-align: center; border-radius: 12px; margin-right: 12px; vertical-align: middle;">一</span>
  <span style="font-size: 18px; color: #1a1a1a; font-weight: bold; vertical-align: middle;">章节标题文字</span>
</p>
```

**样式要点：**

| 属性 | 序号方块 | 标题文字 |
|------|----------|----------|
| display | `inline-block` | 默认 inline |
| background | 橙色渐变 | 无 |
| color | `#ffffff` | `#1a1a1a` |
| font-size | `18px` | `18px` |
| font-weight | `bold` | `bold` |
| width/height | `40px` | 自动 |
| line-height | `40px` | 继承 |
| text-align | `center` | 默认 |
| border-radius | `12px` | 无 |
| margin-right | `12px` | 无 |
| vertical-align | `middle` | `middle` |

**序号列表：** 一、二、三、四、五、六、七、八、九、十

---

### 11. 正文段落

```html
<p style="font-size: 14px; color: #4a4a4a; line-height: 2.4; letter-spacing: 0.3px; margin: 0 0 16px 0;">段落文字</p>
```

**样式要点：**
- 字号：`14px`
- 颜色：`#4a4a4a`
- 行高：`2.4`（非常宽松，适合阅读）
- 字间距：`0.3px`
- 段落间距：`16px`

---

### 12. 引用块

```html
<section style="background: linear-gradient(135deg, #fff9e6 0%, #fef3c7 100%); border-radius: 16px; padding: 20px 24px; border-left: 5px solid #d97706; margin: 0 0 18px 0;">
  <p style="font-size: 14px; color: #78350f; line-height: 2; letter-spacing: 0.3px; margin: 0;">"引用的文字内容"</p>
</section>
```

**样式要点：**
- 背景：浅黄渐变 `#fff9e6 → #fef3c7`
- 左边框：`5px solid #d97706`
- 圆角：`16px`
- 内边距：`20px 24px`
- 文字颜色：深棕 `#78350f`
- 行高：`2`

---

### 13. 高亮/强调文字

```html
<strong style="color: #d97706;">高亮的文字</strong>
```

**用途：**
- 段落中的重点句子
- 总结性观点
- 转折提示

---

### 14. 底部署名

```html
<p style="margin: 30px 0 20px 0; text-align: center; color: #9ca3af; font-size: 13px; font-style: italic;">本文基于Sam Altman 2026年1月27日AMA研讨会内容整理</p>
```

**样式要点：**
- 居中对齐
- 浅灰色：`#9ca3af`
- 斜体：`font-style: italic`
- 字号：`13px`

---

## 四、公众号兼容性注意事项 ⚠️

### 必须遵守

| 规则 | 说明 |
|------|------|
| **所有样式必须内联** | 公众号不支持 `<style>` 标签，样式必须写在 `style=""` 属性中 |
| **禁用 `display: flex/grid`** | 完全不支持 |
| **禁用 `<table>` 做布局** | 会被识别为真正的表格，添加边框和间距 |
| **使用 `<section>` 替代 `<div>`** | 兼容性更好 |
| **背景色写在最内层元素** | 不要写在 `<tr>` 上，要写在 `<td>` 上（如果必须用表格） |

### 可以使用（已验证）

| 特性 | 示例 |
|------|------|
| `display: inline-block` | 用于序号方块 |
| `linear-gradient()` | 背景渐变 |
| `border-radius` | 圆角 |
| `box-shadow` | 阴影 |
| `rgba()` | 透明度颜色 |
| 负 `margin` | 元素重叠效果 |

### 可能有问题（谨慎使用）

| 特性 | 风险 |
|------|------|
| `position: absolute/fixed` | 部分设备不支持 |
| `transform` | 部分设备不支持 |
| 复杂嵌套 | 层级过深可能丢失样式 |

---

## 五、HTML 模板结构

```html
<section style="box-sizing: border-box; margin: 0px auto; padding: 0px; background-color: #fcfbf8;">

  <!-- 头部渐变区域 -->
  <section style="box-sizing: border-box; background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%); padding: 40px 20px 50px; overflow: hidden; border-radius: 0px 0px 24px 24px;">
    <section style="box-sizing: border-box; display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 4px 12px; border-radius: 20px; margin-bottom: 15px;">
      <span style="color: #ffffff; font-size: 12px; letter-spacing: 1px;">{{标签文字}}</span>
    </section>
    <h1 style="margin: 0px 0px 15px; font-size: 26px; color: #ffffff; line-height: 1.3; font-weight: bold;">{{主标题}}</h1>
    <p style="margin: 0px; color: rgba(255, 255, 255, 0.9); font-size: 14px; line-height: 1.6;">{{副标题}}</p>
    <p style="margin: 20px 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 13px;">{{日期信息}}</p>
  </section>

  <!-- 白色内容卡片 -->
  <section style="box-sizing: border-box; padding: 28px 22px; background: #ffffff; margin: -20px 15px 24px; border-radius: 16px; box-shadow: rgba(0, 0, 0, 0.06) 0px 8px 30px;">
    <p style="font-size: 14px; color: #4a4a4a; line-height: 2.4; letter-spacing: 0.3px; margin: 0 0 16px 0;">{{开篇段落1}}</p>
    <p style="font-size: 14px; color: #4a4a4a; line-height: 2.4; letter-spacing: 0.3px; margin: 0 0 16px 0;">{{开篇段落2}}</p>
    <!-- 更多开篇段落... -->
  </section>

  <!-- 正文区域 -->
  <section style="box-sizing: border-box; padding: 0 20px 35px;">

    <!-- 首个分隔线 -->
    <section style="height: 2px; background: linear-gradient(90deg, transparent, rgba(217,119,6,0.6), transparent); margin: 10px 0 30px;"></section>

    <!-- 章节标题 -->
    <p style="margin: 0 0 24px 0; line-height: 40px;">
      <span style="display: inline-block; background: linear-gradient(135deg, #d97706 0%, #ea580c 100%); color: #ffffff; font-size: 18px; font-weight: bold; width: 40px; height: 40px; line-height: 40px; text-align: center; border-radius: 12px; margin-right: 12px; vertical-align: middle;">一</span>
      <span style="font-size: 18px; color: #1a1a1a; font-weight: bold; vertical-align: middle;">{{章节标题}}</span>
    </p>

    <!-- 正文段落 -->
    <p style="font-size: 14px; color: #4a4a4a; line-height: 2.4; letter-spacing: 0.3px; margin: 0 0 16px 0;">{{段落文字}}</p>

    <!-- 引用块 -->
    <section style="background: linear-gradient(135deg, #fff9e6 0%, #fef3c7 100%); border-radius: 16px; padding: 20px 24px; border-left: 5px solid #d97706; margin: 0 0 18px 0;">
      <p style="font-size: 14px; color: #78350f; line-height: 2; letter-spacing: 0.3px; margin: 0;">"{{引用文字}}"</p>
    </section>

    <!-- 高亮段落 -->
    <p style="font-size: 14px; color: #4a4a4a; line-height: 2.4; letter-spacing: 0.3px; margin: 0 0 16px 0;"><strong style="color: #d97706;">{{高亮文字}}</strong></p>

    <!-- 章节分隔线 -->
    <section style="height: 2px; background: linear-gradient(90deg, transparent, rgba(217,119,6,0.6), transparent); margin: 30px 0;"></section>

    <!-- 更多章节... -->

    <!-- 底部署名 -->
    <p style="margin: 30px 0 20px 0; text-align: center; color: #9ca3af; font-size: 13px; font-style: italic;">{{署名文字}}</p>

  </section>

</section>
```

---

## 六、转换规则（Markdown → HTML）

| Markdown 元素 | 转换为 |
|---------------|--------|
| `# 标题` | 头部主标题 `<h1>` |
| `## 章节` | 章节标题（序号方块 + span） |
| 普通段落 | `<p>` 正文段落样式 |
| `> 引用` | 引用块 `<section>` |
| `**加粗**` | `<strong style="color: #d97706;">` |
| `---` | 分隔线 `<section>` |

---

## 七、版本记录

| 版本 | 日期 | 修改内容 |
|------|------|----------|
| v1 | 2026-01-28 | 初版，Claude 橙色主题 |
| v2 | 2026-01-28 | 应用参考文章样式，章节标题用 `table-cell` |
| v3 | 2026-01-28 | 修复章节标题，改用嵌套 `<table>` |
| v4 | 2026-01-28 | 彻底移除 `<table>`，改用纯 `<span>` 内联元素 ✅ |

---

## 八、参考资源

- 参考文章：https://mp.weixin.qq.com/s/5OqgvE1pz4fKtS3lHp0xoA
- 最终可用模板：`article-v4.html`
