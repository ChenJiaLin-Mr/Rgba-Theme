const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const THEME_PATH = path.join(__dirname, 'themes', 'Rgba Theme-color-theme.json');
const DEFAULT_COLORS = {
  "editor.background": "#263238",
  "editor.foreground": "#eeffff",
  "activityBarBadge.background": "#007acc",
  "sideBarTitle.foreground": "#bbbbbb"
};

// Grouped color definitions: { groupName: { tokenKey: label } }
const COLOR_GROUPS = {
  "编辑器": {
    "editor.background": "背景色",
    "editor.foreground": "前景色",
    "editor.selectionBackground": "选中背景",
    "editor.lineHighlightBackground": "当前行高亮",
    "editorCursor.foreground": "光标颜色",
    "editorLineNumber.foreground": "行号颜色",
  },
  "界面": {
    "activityBarBadge.background": "活动栏徽章",
    "sideBarTitle.foreground": "侧边栏标题",
    "statusBar.background": "状态栏背景",
    "statusBar.foreground": "状态栏前景",
    "titleBar.activeBackground": "标题栏背景",
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

// Flat map for lookup
const COLOR_LABELS = Object.values(COLOR_GROUPS).reduce((acc, g) => Object.assign(acc, g), {});

function rgbaToHex(r, g, b, a = 1) {
  const toHex = n => Math.round(n).toString(16).padStart(2, '0');
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  if (a < 1) return hex + toHex(Math.round(a * 255));
  return hex;
}

function parseRgba(input) {
  // Support: rgba(r,g,b,a), rgb(r,g,b), #rrggbb, #rrggbbaa
  const rgbaMatch = input.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/);
  if (rgbaMatch) {
    return rgbaToHex(+rgbaMatch[1], +rgbaMatch[2], +rgbaMatch[3], rgbaMatch[4] !== undefined ? +rgbaMatch[4] : 1);
  }
  if (/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(input)) return input;
  return null;
}

// token scope 映射：语法高亮 key -> tokenColors scope
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

function getTheme() {
  return JSON.parse(fs.readFileSync(THEME_PATH, 'utf8'));
}

function saveTheme(theme) {
  fs.writeFileSync(THEME_PATH, JSON.stringify(theme, null, '\t'), 'utf8');
}

// 从 tokenColors 中读取某个 scope 的颜色
function getTokenColor(tokenColors, scope) {
  for (const t of tokenColors) {
    const scopes = Array.isArray(t.scope) ? t.scope : [t.scope];
    if (scopes.includes(scope)) return t.settings && t.settings.foreground;
  }
  return null;
}

// 构建传给 webview 的完整颜色 map（ui colors + token colors）
function buildColorMap(theme) {
  const map = Object.assign({}, theme.colors);
  for (const [key, scope] of Object.entries(TOKEN_SCOPE_MAP)) {
    map[key] = getTokenColor(theme.tokenColors, scope) || '#ffffff';
  }
  return map;
}

// 将 webview 提交的颜色写回 theme
function applyColorMap(theme, colors) {
  for (const [key, val] of Object.entries(colors)) {
    const hex = parseRgba(val);
    if (!hex) continue;
    if (TOKEN_SCOPE_MAP[key]) {
      // 写入 tokenColors
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
      const hex = (colorMap[key] || '#000000').slice(0, 7);
      return `<tr>
        <td>${label}</td>
        <td><code>${key}</code></td>
        <td><input type="color" id="picker_${key}" value="${hex}"></td>
        <td><input type="text" id="input_${key}" value="${colorMap[key] || hex}" placeholder="rgba(r,g,b,a) 或 #rrggbb"></td>
      </tr>`;
    }).join('');
    return `<h3>${groupName}</h3>
    <table>
      <thead><tr><th>名称</th><th>Token</th><th>取色</th><th>值</th></tr></thead>
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
  <button onclick="applyColors()">应用</button>
  <button onclick="resetColors()">恢复默认</button>
</div>
<div id="status"></div>
<script>
  const vscode = acquireVsCodeApi();
  const keys = ${JSON.stringify(allKeys)};
  keys.forEach(key => {
    const picker = document.getElementById('picker_' + key);
    const input = document.getElementById('input_' + key);
    picker.addEventListener('input', () => { input.value = picker.value; });
    input.addEventListener('change', () => {
      const v = input.value.trim();
      if (/^#[0-9a-fA-F]{6}/.test(v)) picker.value = v.slice(0,7);
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

      panel.webview.onDidReceiveMessage(msg => {
        const theme = getTheme();
        if (msg.command === 'apply') {
          applyColorMap(theme, msg.colors);
          saveTheme(theme);
          panel.webview.postMessage({ command: 'status', text: '已应用！重新加载窗口后生效。' });
        } else if (msg.command === 'reset') {
          Object.assign(theme.colors, DEFAULT_COLORS);
          saveTheme(theme);
          const resetMap = buildColorMap(theme);
          panel.webview.postMessage({ command: 'updateValues', colors: resetMap });
          panel.webview.postMessage({ command: 'status', text: '已恢复默认。重新加载窗口后生效。' });
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
