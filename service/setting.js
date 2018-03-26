const { ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../data/setting.json')

function writeFile(data) {
  let d = JSON.stringify(data, null, 2)
  fs.writeFileSync(filePath, d, 'utf-8')
}

//设置是否显示年龄
ipcMain.on('set-age-show-config', (event, arg) => {
  try {
    //读取数据
    let data = fs.readFileSync(filePath, 'utf-8')
    let d = JSON.parse(data)
    
    d.showAge = arg.showAge
    writeFile(d)

    event.returnValue = {
      success: true,
      data
    }
  } catch(e) {
    event.returnValue = {
      success: false,
      msg: '读取失败'
    }
  }
})

//获取是否显示年龄
ipcMain.on('get-age-show-config', (event, arg) => {
  try {
    //读取数据
    let data = fs.readFileSync(filePath, 'utf-8')
    let d = JSON.parse(data)
    //返回消息
    
    event.returnValue = d
  } catch(e) {
    event.returnValue = {
      success: false,
      msg: '读取失败'
    }
  }
})