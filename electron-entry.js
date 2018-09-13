const path = require('path');
/* eslint-disable import/no-extraneous-dependencies */
const {
  app,
  BrowserWindow,
  protocol,
  Menu,
} = require('electron');
/* eslint-enable import/no-extraneous-dependencies */

const PATHS_RE = /\/(css|js|img|fonts)\/(.+)/;

// NOTE: Accelerators are optional, but provided so they are
// displayed in context menus on right click.
const SELECTION_MENU = [
  { role: 'copy', accelerator: 'CmdOrCtrl+C' },
  { role: 'selectAll', accelerator: 'CmdOrCtrl+A' },
];
const INPUT_MENU = [
  { role: 'undo', accelerator: 'CmdOrCtrl+Z' },
  { role: 'redo', accelerator: 'Shift+CmdOrCtrl+Z' },
  { type: 'separator' },
  { role: 'cut', accelerator: 'CmdOrCtrl+X' },
  { role: 'copy', accelerator: 'CmdOrCtrl+C' },
  { role: 'paste', accelerator: 'CmdOrCtrl+V' },
  { role: 'selectAll', accelerator: 'CmdOrCtrl+A' },
];
const APP_MENU = [
  {
    label: 'Application',
    submenu: [{ role: 'quit' }],
  },
  {
    label: 'Edit',
    submenu: INPUT_MENU,
  },
];

let mainWindow;

function createWindow() {
  const appMenu = Menu.buildFromTemplate(APP_MENU);
  const inputMenu = Menu.buildFromTemplate(INPUT_MENU);
  const selectionMenu = Menu.buildFromTemplate(SELECTION_MENU);

  mainWindow = new BrowserWindow({ width: 1280, height: 720 });
  mainWindow.loadFile('web-dist/index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('context-menu', (e, props) => {
    const { selectionText, isEditable } = props;
    if (isEditable) {
      inputMenu.popup(mainWindow);
    } else if (selectionText && selectionText.trim() !== '') {
      selectionMenu.popup(mainWindow);
    }
  });

  // Required so build works both on the browser and inside electron.
  protocol.interceptFileProtocol('file', ({ url }, callback) => {
    if (url.indexOf('index.html') !== -1) {
      return callback({ path: path.resolve(app.getAppPath(), 'web-dist/index.html') });
    }

    const match = url.match(PATHS_RE);

    if (!match) return callback({ path: url });

    const newPath = path.resolve(app.getAppPath(), `web-dist/${match[1]}/${match[2]}`);

    return callback({ path: newPath });
  });

  Menu.setApplicationMenu(appMenu);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
