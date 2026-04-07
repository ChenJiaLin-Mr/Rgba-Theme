# Rgba Theme

A VSCode color theme extension that lets you customize theme colors using RGBA values.

一款支持通过 RGBA 值自定义颜色的 VSCode 主题扩展。

---

## Features / 功能

- 🎨 Visual color picker + alpha slider + RGBA/HEX text input for each token
- 📦 7 built-in themes: One Dark Pro, Dracula, Monokai, GitHub Dark, Xcode Dark, Xcode Light, Eye Care
- 🗂️ Grouped color editing: Editor / Tabs / Sidebar / Activity Bar / UI / Input & Button / Syntax
- 💾 Real-time preview via `colorCustomizations` — no window reload needed
- 🔄 Reset to defaults — each theme restores its own original colors independently
- 🔁 Customizer panel auto-syncs when switching themes
- 🔤 Font settings: fontFamily, fontSize, lineHeight
- 📤 Export / Import color config as JSON
- ⭐ Color favorites — save & reuse colors across sessions
- 🎯 WCAG contrast ratio badge on foreground colors

---

- 🎨 每个颜色项提供取色器 + 透明度滑块 + RGBA/HEX 文本输入
- 📦 内置 7 套主题：One Dark Pro、Dracula、Monokai、GitHub Dark、Xcode Dark、Xcode Light、Eye Care（护眼）
- 🗂️ 分组编辑：编辑器 / 标签页 / 侧边栏 / 活动栏 / 界面 / 输入按钮 / 语法高亮
- 💾 实时预览 — 通过 `colorCustomizations` 即时生效，无需重载窗口
- 🔄 恢复默认值 — 每套主题独立恢复自己的原始颜色
- 🔁 切换主题时自定义面板自动同步
- 🔤 字体设置：字体族、字号、行高
- 📤 导出 / 导入颜色配置 JSON
- ⭐ 收藏颜色 — 保存常用颜色，跨会话复用
- 🎯 前景色显示 WCAG 对比度徽章

---

## Built-in Themes / 内置主题

| Theme | Style |
|---|---|
| Rgba Theme | Dark blue-gray (One Dark Pro) |
| Rgba Theme - Dracula | Purple & pink |
| Rgba Theme - Monokai | Classic green & yellow |
| Rgba Theme - GitHub Dark | GitHub style dark |
| Rgba Theme - Xcode Dark | Apple Xcode dark |
| Rgba Theme - Xcode Light | Apple Xcode light |
| Rgba Theme - Eye Care | Warm yellow, easy on eyes |

---

## How to Open the Customizer / 如何打开自定义面板

**Method 1 — Command Palette / 命令面板**

Press `Ctrl+Shift+P`, type `Rgba Theme: Customize Colors`, press Enter.

按 `Ctrl+Shift+P`，输入 `Rgba Theme: Customize Colors`，回车。

**Method 2 — Gear icon / 齿轮图标**

Extensions panel → find Rgba Theme → click ⚙️ → **Customize Colors**

扩展面板 → 找到 Rgba Theme → 点击 ⚙️ → **Customize Colors**

---

## Usage / 使用方法

1. Switch to any **Rgba Theme** variant via `Ctrl+K Ctrl+T`  
   通过 `Ctrl+K Ctrl+T` 切换到任意 Rgba Theme 变体

2. Open the customizer using either method above  
   用上述方式打开自定义面板

3. Edit colors — supports:  
   支持以下格式：
   - `rgba(38, 50, 56, 0.8)`
   - `rgb(238, 255, 255)`
   - `#263238` / `#263238cc`

4. Click **应用颜色** — colors apply instantly via real-time preview, no reload needed  
   点击 **应用颜色** — 颜色实时生效，无需重载窗口

---

## Customizable Colors / 可自定义颜色项

| Group / 分组 | Items / 项目 |
|---|---|
| Editor / 编辑器 | Background, Foreground, Selection, Line Highlight, Cursor, Line Number, Gutter, Find Match, Word Highlight |
| Tabs / 标签页 | Active/Inactive Background & Foreground, Border |
| Sidebar / 侧边栏 | Background, Foreground, Border, Title |
| Activity Bar / 活动栏 | Background, Foreground, Border, Badge |
| UI / 界面 | Status Bar, Title Bar, Panel, Terminal |
| Input & Button / 输入按钮 | Input & Button colors |
| Syntax / 语法高亮 | Comment, Keyword, String, Number, Function, Variable, Type, Operator, Tag, Attribute |

---

## Requirements / 环境要求

VSCode `^1.74.0`

---

## Repository / 仓库

[github.com/ChenJiaLin-Mr/Rgba-Theme](https://github.com/ChenJiaLin-Mr/Rgba-Theme)

---

## License / 许可证

MIT
