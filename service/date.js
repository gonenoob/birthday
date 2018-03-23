const { ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../data/birth.json')

function writeFile(data) {
  let d = JSON.stringify(data, null, 2)
  fs.writeFileSync(filePath, d, 'utf-8')
}

//添加
ipcMain.on('birthday-add', (event, arg) => {
  try {
    //读取数据
    let data = fs.readFileSync(filePath, 'utf-8')
    let d = JSON.parse(data)

    //将修改的数据添加进数组
    if (!arg.id) {
      //添加
      d.id = d.id + 1
      arg.id = d.id
    } 
    
    d.items = addInObjArray(arg, d.items) 
    writeFile(d)

    //通知页面数据变动
    event.sender.send('birthday-change-reply', {
      success: true,
      data: {
        items: d.items
      }
    })
    //返回消息
    event.returnValue = {
      success: true
    }
  } catch(e) {
    event.returnValue = {
      success: false,
      msg: '添加失败'
    }
  }
})

//修改
ipcMain.on('birthday-edit', (event, arg) => {
  try {
    //读取数据
    let data = fs.readFileSync(filePath, 'utf-8')
    let d = JSON.parse(data)

    //将修改的数据修改进数组
    d.items = addInObjArray(arg, d.items) 
    writeFile(d)

    //通知页面数据变动
    event.sender.send('birthday-change-reply', {
      success: true,
      data: {
        items: d.items
      }
    })

    //返回消息
    event.returnValue = {
      success: true
    }
  } catch(e) {
    event.returnValue = {
      success: false,
      msg: '编辑失败'
    }
  }
})

//获取全部
ipcMain.on('get-birthday-all', (event, arg) => {
  try {
    //读取数据
    let data = fs.readFileSync(filePath, 'utf-8')
    let d = JSON.parse(data)
    //返回消息
    event.returnValue = {
      success: true,
      data: {
        items: d.items,
      }
    }
  } catch(e) {
    event.returnValue = {
      success: false,
      msg: '读取失败'
    }
  }
})

//分页获取
ipcMain.on('get-birthday-list', (event, arg) => {
  try {
    //读取数据
    let data = fs.readFileSync(filePath, 'utf-8')
    let d = JSON.parse(data)
    let { pageNo, pageSize } = arg
    //返回消息
    event.returnValue = {
      success: true,
      data: {
        itemCount: d.items.length,
        items: d.items.splice(pageSize * (pageNo - 1), pageSize),
        pageNo,
        pageSize
      }
    }
  } catch(e) {
    event.returnValue = {
      success: false,
      msg: '读取失败'
    }
  }
})

//删除
ipcMain.on('birthday-delete', (event, arg) => {
  try {
    //读取数据
    let data = fs.readFileSync(filePath, 'utf-8')
    let d = JSON.parse(data)
    let id = arg.id
    console.log(arg)
    d.items.map((item, index) => {
      if (item.id == id) {
        d.items.splice(index, 1)
      }
    })
    writeFile(d)

    //返回消息
    event.returnValue = {
      success: true
    }
  } catch(e) {
    event.returnValue = {
      success: false,
      msg: '删除失败'
    }
  }
})

function addInObjArray(data={}, obj=[]) {
  let arr = obj
  let ret = false

  if (!Array.isArray(obj)) {
    return obj
  }

  arr.map((item, index) => {
    if (item.id === data.id) {
      arr[index] = data
      ret = true
    }
  })

  if (!ret) {
    arr.push(data)
  }

  return arr
}