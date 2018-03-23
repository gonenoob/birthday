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
    width: 900,
    height: 750
  })
  
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, entryPath),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function() {
    mainWindow = null
  })

  require('./service/date')
}


app.on('ready', createWindow)

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow()
  }
})
