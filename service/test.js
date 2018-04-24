const { ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../data/test.json')

function writeFile(data) {
  let d = JSON.stringify(data, null, 2)
  fs.writeFileSync(filePath, d, 'utf-8')
}

//设置是否显示年龄
ipcMain.on('getMsg', (event, arg) => {
  try {
    //读取数据
    event.sender.send('getMsg-reply', {
      success: true,
      data: {
        msg: '消息'
      }
    })
  } catch(e) {
    event.sender.send('getMsg-reply', {
      success: false,
      data: {
        msg: '消息失败'
      }
    })
  }
})
