const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const { JSONStorage } = require('node-localstorage')

global.nodeStorage = new JSONStorage(app.getPath('userData'))

let mainWindow
let windowState = {}

try {
  windowState = global.nodeStorage.getItem('windowState') || {}
} catch (e) {
  console.log(e)
}

let entryPath = './build/index.html'
if (process.env.ELECTRON_ENV === 'dev') {
  entryPath = './template/index.html'
}

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
    pathname: path.join(__dirname, entryPath),
    protocol: 'file:',
    slashes: true
  }))

  if (process.env.ELECTRON_ENV === 'dev') {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', function() {
    mainWindow = null
  })

  require('./service')

  let storageEvents = ['resize', 'move', 'close']

  storageEvents.map(function(e) {
    mainWindow.on(e, function() {
      storeWindowState()
    })
  })
}

app.on('ready', createWindow)

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

  global.nodeStorage.setItem('windowState', windowState)
}