import { Component } from 'react'
import { observer, inject } from "mobx-react"
import CSSModules from 'react-css-modules'
import { Table, Input, Button, message } from 'antd'
import { ipcRenderer } from 'electron'

import styles from './less/index.less'
import Calendar from './component/Calendar'
import Edit from '../../../component/ui/birthday/Edit'

@inject('userStore', 'userActions')
@CSSModules(styles)
@observer
export default class Birth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      loading: false,
      showAdd: false
    }
  }

  componentDidMount() {
    let res = ipcRenderer.sendSync('get-birthday-all')
    if (res.success) {
      this.setState({
        list: res.data.items
      })
    } else {
      message.error(res.msg)
    }

    ipcRenderer.on('birthday-change-reply', (event, res) => {
      this.setState({
        list: res.data.items
      })
    })
  }

  handleAdd() {
    this.setState({
      showAdd: true
    })
  }

  render() {
    
    return (
      <div styleName="calendar-wrapper">
        <div styleName="btn-wrapper">
          <Button onClick={ this.handleAdd.bind(this) } type="primary">添加生日</Button>
        </div>
        <Calendar list={this.state.list} showNotification={this.props.userStore.showNotification} userActions={this.props.userActions} />
        <Edit show={ this.state.showAdd } hideModal={ ()=> this.setState({ showAdd: false }) } />
      </div>
    )
  }
}