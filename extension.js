const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const THEME_PATH = path.join(__dirname, 'themes', 'Rgba Theme-color-theme.json');
const DEFAULT_COLORS = {
  "editor.background": "#1e2127",
  "editor.foreground": "#abb2bf",
  "activityBarBadge.background": "#528bff",
  "sideBarTitle.foreground": "#abb2bf",
  "editor.selectionBackground": "#3e4451",
  "editor.lineHighlightBackground": "#2c313a",
  "editorCursor.foreground": "#528bff",
  "editorLineNumber.foreground": "#495162",
  "editorLineNumber.activeForeground": "#abb2bf",
  "editorGutter.background": "#1e2127",
  "editor.findMatchBackground": "#528bff40",
  "editor.findMatchHighlightBackground": "#528bff20",
  "editor.wordHighlightBackground": "#3e445180",
  "statusBar.background": "#21252b",
  "statusBar.foreground": "#9da5b4",
  "titleBar.activeBackground": "#21252b",
  "activityBar.background": "#21252b",
  "activityBar.foreground": "#d7dae0",
  "activityBar.border": "#181a1f",
  "sideBar.background": "#21252b",
  "sideBar.foreground": "#abb2bf",
  "sideBar.border": "#181a1f",
  "tab.activeBackground": "#1e2127",
  "tab.activeForeground": "#abb2bf",
  "tab.inactiveBackground": "#21252b",
  "tab.inactiveForeground": "#5c6370",
  "tab.border": "#181a1f",
  "panel.background": "#21252b",
  "panel.border": "#181a1f",
  "terminal.background": "#1e2127",
  "terminal.foreground": "#abb2bf",
  "input.background": "#1e2127",
  "input.foreground": "#abb2bf",
  "input.border": "#181a1f",
  "button.background": "#528bff",
  "button.foreground": "#ffffff",
};

const COLOR_GROUPS = {
  "编辑器": {
    "editor.background": "背景色",
    "editor.foreground": "前景色",
    "editor.selectionBackground": "选中背景",
    "editor.lineHighlightBackground": "当前行高亮",
    "editorCursor.foreground": "光标颜色",
    "editorLineNumber.foreground": "行号颜色",
    "editorLineNumber.activeForeground": "当前行号颜色",
    "editorGutter.background": "Gutter 背景",
    "editor.findMatchBackground": "搜索匹配背景",
    "editor.findMatchHighlightBackground": "搜索高亮背景",
    "editor.wordHighlightBackground": "词高亮背景",
  },
  "标签页": {
    "tab.activeBackground": "活动标签背景",
    "tab.activeForeground": "活动标签前景",
    "tab.inactiveBackground": "非活动标签背景",
    "tab.inactiveForeground": "非活动标签前景",
    "tab.border": "标签边框",
  },
  "侧边栏": {
    "sideBar.background": "侧边栏背景",
    "sideBar.foreground": "侧边栏前景",
    "sideBar.border": "侧边栏边框",
    "sideBarTitle.foreground": "侧边栏标题",
  },
  "活动栏": {
    "activityBar.background": "活动栏背景",
    "activityBar.foreground": "活动栏前景",
    "activityBar.border": "活动栏边框",
    "activityBarBadge.background": "活动栏徽章",
  },
  "界面": {
    "statusBar.background": "状态栏背景",
    "statusBar.foreground": "状态栏前景",
    "titleBar.activeBackground": "标题栏背景",
    "panel.background": "面板背景",
    "panel.border": "面板边框",
    "terminal.background": "终端背景",
    "terminal.foreground": "终端前景",
  },
  "输入 / 按钮": {
    "input.background": "输入框背景",
    "input.foreground": "输入框前景",
    "input.border": "输入框边框",
    "button.background": "按钮背景",
    "button.foreground": "按钮前景",
  },
  "语法高亮": {
    "comment": "注释",
    "keyword": "关键字",
    "string": "字符串",
    "number": "数字",
    "function": "函数名",
    "variable": "变量",
    "type": "类型/类",
    "operator": "运算符",
    "tag": "标签",
    "attribute": "属性",
  }
};

const TOKEN_SCOPE_MAP = {
  "comment":   "comment",
  "keyword":   "keyword",
  "string":    "string",
  "number":    "constant.numeric",
  "function":  "entity.name.function",
  "variable":  "variable",
  "type":      "entity.name",
  "operator":  "keyword.control",
  "tag":       "entity.name.tag",
  "attribute": "entity.other.attribute-name",
};

function rgbaToHex(r, g, b, a = 1) {
  const toHex = n => Math.round(n).toString(16).padStart(2, '0');
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  if (a < 1) return hex + toHex(Math.round(a * 255));
  return hex;
}

function parseRgba(input) {
  const m = input.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/);
  if (m) return rgbaToHex(+m[1], +m[2], +m[3], m[4] !== undefined ? +m[4] : 1);
  if (/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(input)) return input;
  return null;
}

function getTheme() {
  return JSON.parse(fs.readFileSync(THEME_PATH, 'utf8'));
}

function saveTheme(theme) {
  fs.writeFileSync(THEME_PATH, JSON.stringify(theme, null, '\t'), 'utf8');
}

function getTokenColor(tokenColors, scope) {
  for (const t of tokenColors) {
    const scopes = Array.isArray(t.scope) ? t.scope : [t.scope];
    if (scopes.includes(scope)) return t.settings && t.settings.foreground;
  }
  return null;
}

function buildColorMap(theme) {
  const map = Object.assign({}, DEFAULT_COLORS, theme.colors);
  for (const [key, scope] of Object.entries(TOKEN_SCOPE_MAP)) {
    map[key] = getTokenColor(theme.tokenColors, scope) || '#ffffff';
  }
  return map;
}

function applyColorMap(theme, colors) {
  for (const [key, val] of Object.entries(colors)) {
    const hex = parseRgba(val);
    if (!hex) continue;
    if (TOKEN_SCOPE_MAP[key]) {
      const scope = TOKEN_SCOPE_MAP[key];
      const entry = theme.tokenColors.find(t => {
        const s = Array.isArray(t.scope) ? t.scope : [t.scope];
        return s.includes(scope);
      });
      if (entry) entry.settings.foreground = hex;
    } else {
      theme.colors[key] = hex;
    }
  }
}

function getWebviewContent(colorMap) {
  const allKeys = [];
  const sections = Object.entries(COLOR_GROUPS).map(([groupName, items]) => {
    const rows = Object.entries(items).map(([key, label]) => {
      allKeys.push(key);
      const raw = colorMap[key] || '#000000';
      const hex = raw.slice(0, 7);
      let alpha = 100;
      const aaMatch = raw.match(/^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})$/);
      if (aaMatch) alpha = Math.round(parseInt(aaMatch[1], 16) / 255 * 100);
      const rgbaMatch = raw.match(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)/);
      if (rgbaMatch) alpha = Math.round(+rgbaMatch[1] * 100);
      return `<tr>
        <td>${label}</td>
        <td><code>${key}</code></td>
        <td>
          <input type="color" id="picker_${key}" value="${hex}">
          <input type="range" id="alpha_${key}" min="0" max="100" value="${alpha}" style="width:70px;vertical-align:middle">
          <span id="alphaval_${key}" style="font-size:11px">${alpha}%</span>
        </td>
        <td><input type="text" id="input_${key}" value="${raw}" placeholder="rgba(r,g,b,a) 或 #rrggbb"></td>
      </tr>`;
    }).join('');
    return `<h3>${groupName}</h3>
    <table>
      <thead><tr><th>名称</th><th>Token</th><th>取色 / 透明度</th><th>值</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: var(--vscode-font-family); padding: 16px; color: var(--vscode-foreground); background: var(--vscode-editor-background); }
  h3 { margin: 20px 0 6px; border-bottom: 1px solid var(--vscode-panel-border); padding-bottom: 4px; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 8px; }
  th, td { padding: 6px 10px; text-align: left; border-bottom: 1px solid var(--vscode-panel-border); }
  input[type=text] { width: 200px; background: var(--vscode-input-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border); padding: 4px; }
  input[type=color] { width: 40px; height: 26px; border: none; cursor: pointer; background: none; }
  .btns { margin-top: 16px; }
  button { margin-right: 8px; padding: 7px 16px; background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; cursor: pointer; }
  button:hover { background: var(--vscode-button-hoverBackground); }
  #status { margin-top: 10px; color: var(--vscode-notificationsInfoIcon-foreground); }
</style>
</head>
<body>
<h2>Rgba Theme 颜色自定义</h2>
${sections}
<div class="btns">
  <button onclick="applyColors()">应用颜色</button>
  <button onclick="resetColors()">恢复默认</button>
</div>
<div id="status"></div>
<script>
  const vscode = acquireVsCodeApi();
  const keys = ${JSON.stringify(allKeys)};

  function hexToRgb(hex) {
    return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
  }

  function syncInput(key) {
    const hex = document.getElementById('picker_' + key).value;
    const alpha = document.getElementById('alpha_' + key).value / 100;
    const [r,g,b] = hexToRgb(hex);
    document.getElementById('alphaval_' + key).textContent = Math.round(alpha*100) + '%';
    document.getElementById('input_' + key).value = alpha < 1 ? 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')' : hex;
  }

  keys.forEach(key => {
    document.getElementById('picker_' + key).addEventListener('input', () => syncInput(key));
    document.getElementById('alpha_' + key).addEventListener('input', () => syncInput(key));
    document.getElementById('input_' + key).addEventListener('change', () => {
      const v = document.getElementById('input_' + key).value.trim();
      if (/^#[0-9a-fA-F]{6}/.test(v)) {
        document.getElementById('picker_' + key).value = v.slice(0,7);
        document.getElementById('alpha_' + key).value = 100;
        document.getElementById('alphaval_' + key).textContent = '100%';
      }
      const m = v.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/);
      if (m) {
        const toHex = n => (+n).toString(16).padStart(2,'0');
        document.getElementById('picker_' + key).value = '#' + toHex(m[1]) + toHex(m[2]) + toHex(m[3]);
        const a = m[4] !== undefined ? Math.round(+m[4]*100) : 100;
        document.getElementById('alpha_' + key).value = a;
        document.getElementById('alphaval_' + key).textContent = a + '%';
      }
    });
  });

  function applyColors() {
    const colors = {};
    keys.forEach(k => { colors[k] = document.getElementById('input_' + k).value.trim(); });
    vscode.postMessage({ command: 'apply', colors });
  }

  function resetColors() { vscode.postMessage({ command: 'reset' }); }

  window.addEventListener('message', e => {
    if (e.data.command === 'status') document.getElementById('status').textContent = e.data.text;
    if (e.data.command === 'updateValues') {
      Object.entries(e.data.colors).forEach(([key, val]) => {
        const input = document.getElementById('input_' + key);
        const picker = document.getElementById('picker_' + key);
        if (input) { input.value = val; picker.value = val.slice(0,7); }
      });
    }
  });
</script>
</body>
</html>`;
}

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('rgba-theme.customize', () => {
      const panel = vscode.window.createWebviewPanel(
        'rgbaThemeCustomizer',
        'Rgba Theme Customizer',
        vscode.ViewColumn.One,
        { enableScripts: true }
      );
      const theme = getTheme();
      panel.webview.html = getWebviewContent(buildColorMap(theme));
      panel.webview.onDidReceiveMessage(async msg => {
        const theme = getTheme();
        if (msg.command === 'apply') {
          applyColorMap(theme, msg.colors);
          saveTheme(theme);
          panel.webview.postMessage({ command: 'status', text: '已应用！正在重新加载窗口...' });
          setTimeout(() => vscode.commands.executeCommand('workbench.action.reloadWindow'), 500);
        } else if (msg.command === 'reset') {
          Object.assign(theme.colors, DEFAULT_COLORS);
          saveTheme(theme);
          panel.webview.postMessage({ command: 'updateValues', colors: buildColorMap(theme) });
          panel.webview.postMessage({ command: 'status', text: '已恢复默认。正在重新加载窗口...' });
          setTimeout(() => vscode.commands.executeCommand('workbench.action.reloadWindow'), 500);
        }
      }, undefined, context.subscriptions);
    }),

    vscode.commands.registerCommand('rgba-theme.reset', () => {
      const theme = getTheme();
      Object.assign(theme.colors, DEFAULT_COLORS);
      saveTheme(theme);
      vscode.window.showInformationMessage('Rgba Theme 已恢复默认，重新加载窗口后生效。');
    })
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
