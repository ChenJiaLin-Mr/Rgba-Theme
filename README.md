# Rgba Theme

A VSCode color theme extension that lets you customize theme colors using RGBA values.

一款支持通过 RGBA 值自定义颜色的 VSCode 主题扩展。

---

## Features / 功能

- 🎨 Visual color picker + RGBA/HEX text input for each color token
- 📦 Grouped by: Editor / UI / Syntax Highlighting
- 💾 Changes are saved directly to the theme file
- 🔄 Reset to defaults at any time

---

- 🎨 每个颜色项均提供可视化取色器 + RGBA/HEX 文本输入
- 📦 按分组展示：编辑器 / 界面 / 语法高亮
- 💾 修改直接保存到主题文件
- 🔄 随时恢复默认值

---

## Usage / 使用方法

1. Install the extension and select **Rgba Theme** as your color theme.  
   安装扩展后，将颜色主题切换为 **Rgba Theme**。

2. Open the customizer via Command Palette (`Ctrl+Shift+P`):  
   通过命令面板（`Ctrl+Shift+P`）打开自定义面板：
   - `Rgba Theme: Customize Colors` — open the color editor  
   - `Rgba Theme: Reset to Default` — restore all defaults

3. Edit colors using:  
   支持以下格式输入颜色：
   - `rgba(38, 50, 56, 1)`
   - `rgb(238, 255, 255)`
   - `#263238`
   - `#263238ff`

4. Click **Apply**, then reload the window (`Ctrl+Shift+P` → `Developer: Reload Window`).  
   点击 **应用**，然后重新加载窗口（`Ctrl+Shift+P` → `Developer: Reload Window`）。

---

## Customizable Colors / 可自定义颜色项

| Group / 分组 | Items / 项目 |
|---|---|
| Editor / 编辑器 | Background, Foreground, Selection, Line Highlight, Cursor, Line Number |
| UI / 界面 | Activity Bar Badge, Sidebar Title, Status Bar, Title Bar |
| Syntax / 语法高亮 | Comment, Keyword, String, Number, Function, Variable, Type, Operator, Tag, Attribute |

---

## Requirements / 环境要求

- VSCode `^1.74.0`

---

## License / 许可证

MIT
