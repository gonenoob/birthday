import { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Menu, Icon, Button } from 'antd'

import styles from './index.less'

const SubMenu = Menu.SubMenu
const MenuItem = Menu.Item

@withRouter
export default class Menus extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false
    }
  }

  handleClick(e) {
    const { location, history } = this.props
    const pathname = location.pathname
    const target = e.item.props.pathname
    
    if (pathname !== target) {
      history.push(target)
    }
  }
  
  getMenu() {
    return [
    // {
    //   code: 'home',
    //   name: 'home',
    //   path: '/',
    //   children: []
    // }, 
    {
      code: 'date',
      name: '日期',
      path: '/date',
      children: [{
        code: 'birth',
        name: '生日日历',
        path: '/date/birth',
      }, {
        code: 'birthTable',
        name: '生日列表',
        path: '/date/table',
      }]
    }]
  }

  renderSub(list=[]) {
    return (
      list.map(item => {
        if (item.children && item.children.length) {
          return (
            <SubMenu key={item.code} title={item.name}>
              {
                this.renderSub(item.children)
              }
            </SubMenu>
          )
        }

        return <MenuItem key={item.code} pathname={item.path}>{item.name}</MenuItem>
      })
    )
  }

  render() {
    const menu = this.getMenu()

    return (
      <div className="app-menu">
        <Menu
          onClick={ this.handleClick.bind(this) }
          mode="inline"
          theme="dark"
          defaultSelectedKeys={['birth']}
          defaultOpenKeys={['date']}
          inlineCollapsed={this.state.collapsed}
        >
          {
            this.renderSub(menu)
          }
        </Menu>
      </div>
    )
  }
}