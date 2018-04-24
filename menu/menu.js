const electron = require('electron')
const { app, BrowserWindow, Menu, MenuItem } = electron

function getMemuTemplete(mainWindow) {
  const menuTemplete = [{
    label: 'File',
    submenu: [{
      label: '新消息',
      accelerator: 'CmdOrCtrl+N',
      enabled: true,
      click: () => mainWindow.webContents.send('new-msg'),
    }, {
      label: 'New Project',
      accelerator: 'Shift+CmdOrCtrl+N',
      enabled: false,
    }]
  }, {
    label: 'Help',
    role: 'help',
    submenu: [{
      label: '帮助',
      click: () => {
        electron.shell.openExternal('https://www.dingxiang-inc.com/');
      },
    }]
  }];

  // mac, linux
  if (process.platform === 'darwin') {
    const name = '生日记录器';
    menuTemplete.unshift({
      label: name,
      submenu: [{
        label: `About ${name}`,
        role: 'about',
      }, {
        type: 'separator',
      }, {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: () => {
          app.quit();
        },
      }],
    });
  }

  return menuTemplete;
}

function setMenu(mainWindow) {
  const menuTemplete = getMemuTemplete(mainWindow);
  const menu = Menu.buildFromTemplate(menuTemplete);
  Menu.setApplicationMenu(menu);
}

module.exports = {
  setMenu
}