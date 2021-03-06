const electron = require('electron')

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const shell = require('electron').shell;
const os = require('os');

const ipc = require('electron').ipcMain
const dialog = require('electron').dialog

ipc.on('open-file-dialog', function (event,arg) {


  dialog.showOpenDialog({
    properties: ['openFile'],
    title: arg[0],
    filters: [
      {name: 'Pdf', extensions: ['pdf']}
    ]
  }, function (files) {
    if (files) event.sender.send('selected-file', files)
  })
})

ipc.on('open-folder-dialog', function (event,arg) {


  dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: arg[0],

  }, function (files) {
    if (files) event.sender.send('selected-folder', files)
  })
})





// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

ipc.on('open-folder', function (event,arg) {
  shell.showItemInFolder(arg[0]);
  //mainWindow.blur();


})

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1280*2, height: 600*2})

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
