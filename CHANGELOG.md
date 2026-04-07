# Changelog

## [0.4.0] - 2026-04-07

### Added
- Font settings panel: fontFamily, fontSize, lineHeight (writes to global VSCode config)
- Real-time color preview via `workbench.colorCustomizations` — no window reload needed
- Theme switcher dropdown inside the customizer panel
- Color favorites: save colors per-key with ★, stored in localStorage, click to copy
- Export / Import color config as JSON file
- WCAG contrast ratio badge on foreground color rows

### Fixed
- Reset to Default now correctly restores each theme's own defaults

---

### Added
- Eye Care theme (护眼浅黄色主题，基于 Solarized Light 配色)
- Xcode Dark / Xcode Light themes
- Per-theme default backup: reset now restores the correct defaults for each theme
- Theme switch sync: customizer panel auto-updates when switching themes

### Fixed
- Reset to Default now correctly restores each theme's own defaults instead of always applying the dark theme values

---

## [0.3.0] - 2026-04-07

### Added
- Webview-based color customizer panel (`Rgba Theme: Customize Colors`)
- Support for RGBA, RGB, and HEX color input formats
- Grouped color editing: Editor, UI, Syntax Highlighting (21 tokens total)
- `Rgba Theme: Reset to Default` command
- Bilingual UI (Chinese / English)
- 6 built-in themes: One Dark Pro, Dracula, Monokai, GitHub Dark, Xcode Dark, Xcode Light
