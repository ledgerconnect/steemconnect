// Modules to control application life and create native browser window
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

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 1280, height: 720 });

  // and load the index.html of the app.
  mainWindow.loadFile('web-dist/index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
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

  const template = [
    {
      label: 'Application',
      submenu: [
        { label: 'Quit', accelerator: 'CommandOrCrl+Q', click: () => app.quit() }
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectAll' },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
