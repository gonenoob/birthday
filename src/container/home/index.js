import { Component } from 'react'
import { ipcRenderer } from 'electron'
import { message } from 'antd'

export default class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentDidMount() {
    ipcRenderer.on('event-birthday-reply', (event, arg) => {
      message.info(arg)
    })
  }

  handleSend() {
    ipcRenderer.send('event-birthday', {
      'id': 2,
      'time': '7'
    })
  }

  render() {
    return (
      <div onClick={ this.handleSend.bind(this) }>
        home
      </div>
    )
  }
}