const path = require('path');
/* eslint-disable import/no-extraneous-dependencies */
const { app, BrowserWindow, protocol, Menu } = require('electron');
/* eslint-enable import/no-extraneous-dependencies */

const PATHS_RE = /\/(css|js|img|fonts)\/(.+)/;

let openedUrl = null;

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

  mainWindow = new BrowserWindow({ width: 360, height: 600 });
  mainWindow.loadFile('www/index.html');
  // mainWindow.toggleDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', () => {
    if (!openedUrl) return;

    mainWindow.webContents.send('handleProtocol', openedUrl);
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
      return callback({ path: path.resolve(app.getAppPath(), 'www/index.html') });
    }

    const match = url.match(PATHS_RE);

    if (!match) return callback({ path: url });

    const newPath = path.resolve(app.getAppPath(), `www/${match[1]}/${match[2]}`);

    return callback({ path: newPath });
  });

  Menu.setApplicationMenu(appMenu);
}

const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', (e, argv) => {
    e.preventDefault();

    if (argv.length === 2) {
      mainWindow.webContents.send('handleProtocol', argv[1]);
    }

    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

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

  app.on('will-finish-launching', () => {
    app.on('open-url', (e, newUrl) => {
      e.preventDefault();

      if (!mainWindow) {
        openedUrl = newUrl;
      } else {
        mainWindow.webContents.send('handleProtocol', newUrl);
      }
    });

    process.argv.forEach(arg => {
      if (/steem:\/\//.test(arg)) {
        openedUrl = arg;
      }
    });
  });

  app.setAsDefaultProtocolClient('steem');
}
