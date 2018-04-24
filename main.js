const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
// const { JSONStorage } = require('node-localstorage')
const settings = require('electron-settings')
const { setMenu } = require('./menu/menu')
let mainWindow
let windowState = {}
let entryPath = process.env.ELECTRON_ENV === 'dev' ? './template/' : './build/'

function createWindow() {
  mainWindow = new BrowserWindow({
    x: windowState.bounds && windowState.bounds.x || undefined,
    y: windowState.bounds && windowState.bounds.y || undefined,
    width: windowState.bounds && windowState.bounds.width || 1000,
    height: windowState.bounds && windowState.bounds.height || 700
  })
  
  if (windowState.isMaximized) {
    mainWindow.maximize();
  }

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, entryPath, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  setMenu(mainWindow)
  require('./service')
  
  if (process.env.ELECTRON_ENV === 'dev') {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', function() {
    mainWindow = null
  })


  let storageEvents = ['resize', 'move', 'close']
  storageEvents.map(function(e) {
    mainWindow.on(e, function() {
      storeWindowState()
    })
  })
}

app.on('ready', () => {
  try {
    windowState = settings.get('windowState') || {}
  } catch (e) {
    console.log(e)
  }
  createWindow()
})

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow()
  }
})

function storeWindowState() {
  windowState.isMaximized = mainWindow.isMaximized()

  if (!windowState.isMaximized) {
    windowState.bounds = mainWindow.getBounds()
  }

  settings.setAll({windowState})
}

//打开子窗口
ipcMain.on('show-child', (event, arg) => {
  makeChild()
})

//新建子窗口
function makeChild() {
  let child = new BrowserWindow({
    parent: mainWindow,
    modal: false,
    show: false,
    autoHideMenuBar: true,
    resizable: false,
    minimizable: false
  })

  child.loadURL(url.format({
    pathname: path.join(__dirname, entryPath, 'login.html'),
    protocol: 'file:',
    slashes: true
  }))

  if (process.env.ELECTRON_ENV === 'dev') {
    child.webContents.openDevTools()
  }

  child.once('ready-to-show', ()=> {
    child.show()
  })
  
  child.on('closed', function() {
    child = null
  })
}