const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

let mainWindow

let entryPath = './build/index.html'

if (process.env.ELECTRON_ENV === 'dev') {
  entryPath = './template/index.html'
}
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700
  })
  
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

  require('./service/setting')
  require('./service/date')
}


app.on('ready', createWindow)

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow()
  }
})
