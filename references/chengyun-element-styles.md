# 橙韵风格：Element Styles

本文档包含了 `wechat-article-formatter` Skill 的「橙韵」主题元素样式模板，旨在将 Markdown 元素转换为与微信公众号完全兼容的 HTML 结构和内联样式。

> 基于参考文章 https://mp.weixin.qq.com/s/5OqgvE1pz4fKtS3lHp0xoA 提炼，已验证公众号编辑器兼容性。

## 配色方案

| 用途 | 色值 | 说明 |
|:---|:---|:---|
| 主色-亮 | `#fb923c` | 渐变起始 |
| 主色-深 | `#ea580c` | 渐变结束 |
| 强调色 | `#d97706` | 边框、高亮文字 |
| 深橙 | `#78350f` | 引用块文字 |
| 页面背景 | `#fcfbf8` | 浅米色 |
| 引用背景-亮 | `#fff9e6` | 渐变起始 |
| 引用背景-深 | `#fef3c7` | 渐变结束 |
| 正文色 | `#4a4a4a` | 深灰 |
| 标题色 | `#1a1a1a` | 近黑 |
| 次要信息 | `#9ca3af` | 浅灰 |

---

## 页面结构模板

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
  <!-- 标签、标题、副标题、日期 -->
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
  <span style="color: #ffffff; font-size: 12px; letter-spacing: 1px;">{标签文字}</span>
</section>
```

**用途：** 文章分类标签，如「深度解读」「技术分享」「年度总结」

---

### 4. 头部主标题（H1）

```html
<h1 style="margin: 0px 0px 15px; font-size: 26px; color: #ffffff; line-height: 1.3; font-weight: bold;">{主标题}</h1>
```

---

### 5. 头部副标题

```html
<p style="margin: 0px; color: rgba(255, 255, 255, 0.9); font-size: 14px; line-height: 1.6;">{副标题}</p>
```

---

### 6. 头部日期信息

```html
<p style="margin: 20px 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 13px;">{日期信息}</p>
```

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

**用途：** 放置文章开篇引言、摘要等重点内容

---

### 8. 正文区域容器

```html
<section style="box-sizing: border-box; padding: 0 20px 35px;">
  <!-- 分隔线、章节标题、段落、引用块 -->
</section>
```

---

## 元素模板

### 9. 分隔线

**首个分隔线（在开篇卡片后）：**
```html
<section style="height: 2px; background: linear-gradient(90deg, transparent, rgba(217,119,6,0.6), transparent); margin: 10px 0 30px;"></section>
```

**章节间分隔线：**
```html
<section style="height: 2px; background: linear-gradient(90deg, transparent, rgba(217,119,6,0.6), transparent); margin: 30px 0;"></section>
```

**样式要点：**
- 高度：`2px`
- 渐变：两端透明，中间橙色（60% 透明度）

---

### 10. 章节标题（序号方块 + 标题文字）⭐ 关键

```html
<p style="margin: 0 0 24px 0; line-height: 40px;">
  <span style="display: inline-block; background: linear-gradient(135deg, #d97706 0%, #ea580c 100%); color: #ffffff; font-size: 18px; font-weight: bold; width: 40px; height: 40px; line-height: 40px; text-align: center; border-radius: 12px; margin-right: 12px; vertical-align: middle;">{序号}</span>
  <span style="font-size: 18px; color: #1a1a1a; font-weight: bold; vertical-align: middle;">{章节标题}</span>
</p>
```

**序号对照表：**
| 数字 | 中文 |
|------|------|
| 1 | 一 |
| 2 | 二 |
| 3 | 三 |
| 4 | 四 |
| 5 | 五 |
| 6 | 六 |
| 7 | 七 |
| 8 | 八 |
| 9 | 九 |
| 10 | 十 |

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

---

### 11. 正文段落

```html
<p style="font-size: 14px; color: #4a4a4a; line-height: 2.4; letter-spacing: 0.3px; margin: 0 0 16px 0;">{段落文字}</p>
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
  <p style="font-size: 14px; color: #78350f; line-height: 2; letter-spacing: 0.3px; margin: 0;">"{引用文字}"</p>
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
<strong style="color: #d97706;">{高亮文字}</strong>
```

**用途：**
- 段落中的重点句子
- 总结性观点
- 转折提示

---

### 14. 行内代码

```html
<code style="background-color: #fef3c7; color: #78350f; padding: 2px 6px; border-radius: 4px; font-family: Menlo, Monaco, Consolas, monospace; font-size: 13px;">{代码}</code>
```

---

### 15. 代码块

```html
<section style="background-color: #2D2D2D; color: #E8E8E8; padding: 16px 20px; border-radius: 8px; margin: 16px 0; font-family: Menlo, Monaco, Consolas, 'Microsoft YaHei', monospace; font-size: 13px; line-height: 2; display: block;">
<span style="color: #6A9955;"># 注释用绿色</span><br>
command --flag=value<br>
&nbsp;&nbsp;缩进内容
</section>
```

---

### 16. 无序列表

```html
<ul style="margin: 0 0 16px 0; padding-left: 20px;">
<li style="margin-bottom: 8px; font-size: 14px; color: #4a4a4a; line-height: 2;">{列表项}</li>
</ul>
```

---

### 17. 有序列表

```html
<ol style="margin: 0 0 16px 0; padding-left: 20px;">
<li style="margin-bottom: 8px; font-size: 14px; color: #4a4a4a; line-height: 2;">{列表项}</li>
</ol>
```

---

### 18. 表格

```html
<table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
<thead>
<tr>
<th style="padding: 12px 15px; text-align: left; border: 1px solid #E5E5E5; background-color: #d97706; color: #FFFFFF;">列1</th>
<th style="padding: 12px 15px; text-align: left; border: 1px solid #E5E5E5; background-color: #d97706; color: #FFFFFF;">列2</th>
</tr>
</thead>
<tbody>
<tr>
<td style="padding: 12px 15px; border: 1px solid #E5E5E5; background-color: #FFFFFF; color: #4a4a4a;">内容</td>
<td style="padding: 12px 15px; border: 1px solid #E5E5E5; background-color: #FFFFFF; color: #4a4a4a;">内容</td>
</tr>
<tr>
<td style="padding: 12px 15px; border: 1px solid #E5E5E5; background-color: #fcfbf8; color: #4a4a4a;">交替行</td>
<td style="padding: 12px 15px; border: 1px solid #E5E5E5; background-color: #fcfbf8; color: #4a4a4a;">交替行</td>
</tr>
</tbody>
</table>
```

**注意：** 背景色必须直接应用在 `td` 或 `th` 标签上。

---

### 19. 图片占位符

```html
<table style="width: 100%; margin: 16px 0; border-collapse: collapse;">
<tbody><tr>
<td style="background-color: #fff9e6; border: 1px solid #d97706; color: #d97706; padding: 30px 20px; text-align: center; font-weight: bold; font-size: 14px;">
📷 [图片] {文件名.png}
</td>
</tr></tbody>
</table>
```

---

### 20. 底部署名

```html
<p style="margin: 30px 0 20px 0; text-align: center; color: #9ca3af; font-size: 13px; font-style: italic;">{署名文字}</p>
```

---

## 公众号兼容性注意事项 ⚠️

### 必须遵守

| 规则 | 说明 |
|------|------|
| **所有样式必须内联** | 公众号不支持 `<style>` 标签 |
| **禁用 `display: flex/grid`** | 完全不支持 |
| **禁用 `<table>` 做布局** | 会被识别为真正的表格，添加边框 |
| **使用 `<section>` 替代 `<div>`** | 兼容性更好 |
| **背景色写在最内层元素** | 不要写在 `<tr>` 上 |

### 可以使用（已验证）

| 特性 | 示例 |
|------|------|
| `display: inline-block` | 序号方块 |
| `linear-gradient()` | 背景渐变 |
| `border-radius` | 圆角 |
| `box-shadow` | 阴影 |
| `rgba()` | 透明度颜色 |
| 负 `margin` | 元素重叠效果 |

### 谨慎使用

| 特性 | 风险 |
|------|------|
| `position: absolute/fixed` | 部分设备不支持 |
| `transform` | 部分设备不支持 |
| 复杂嵌套 | 层级过深可能丢失样式 |

---

## Markdown → HTML 转换规则

| Markdown 元素 | 转换为 |
|---------------|--------|
| `# 标题` | 头部主标题 `<h1>` |
| `## 章节` | 章节标题（序号方块 + span） |
| 普通段落 | `<p>` 正文段落样式 |
| `> 引用` | 引用块 `<section>` |
| `**加粗**` | `<strong style="color: #d97706;">` |
| `---` | 分隔线 `<section>` |
| `` `代码` `` | 行内代码 `<code>` |
| 代码块 | `<section>` + `<br>` 换行 |
| 列表 | `<ul>` / `<ol>` |
| 表格 | `<table>` 带内联样式 |
| `![图片]()` | 图片占位符 |

---

## 完整模板结构

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
    <p style="font-size: 14px; color: #4a4a4a; line-height: 2.4; letter-spacing: 0.3px; margin: 0 0 16px 0;">{{开篇段落}}</p>
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

    <!-- 章节分隔线 -->
    <section style="height: 2px; background: linear-gradient(90deg, transparent, rgba(217,119,6,0.6), transparent); margin: 30px 0;"></section>

    <!-- 更多章节... -->

    <!-- 底部署名 -->
    <p style="margin: 30px 0 20px 0; text-align: center; color: #9ca3af; font-size: 13px; font-style: italic;">{{署名文字}}</p>

  </section>

</section>
```
