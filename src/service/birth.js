import { ipcRenderer } from 'electron'
import { message } from 'antd'

ipcRenderer.on('event-birthday-reply', (event, arg) => {
  message.info(arg)
})

ipcRenderer.send('event-birthday', '')

