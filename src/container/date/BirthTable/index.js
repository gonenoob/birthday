import { Component } from 'react'
import { Table, message, Button, Modal, Switch } from 'antd'
import { ipcRenderer } from 'electron'
import solarLunar from 'solarlunar'

import addRowNo from '../../../util/listAddRowNo'
import Edit from '../../../component/ui/birthday/Edit'
import { birthdayType } from 'constant/index'

const confirm = Modal.confirm

export default class BirthTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      pageSize: 10,
      pageNo: 1,
      itemCount: 0,
      loading: false,
      showEdit: false,
      record: {},
      showAge: true
    }
  }

  componentDidMount() {
    this.getItems()

    let showAge = ipcRenderer.sendSync('get-age-show-config')
    this.setState(showAge)
  }

  getItems() {
    const { pageNo, pageSize } = this.state
    let response = ipcRenderer.sendSync('get-birthday-list', {
      pageNo,
      pageSize
    })

    if (response.success) {
      this.setState(addRowNo(response.data))
    } else {
      message.error(response.msg)
    }
  }

  editCallback() {
    this.setState({
      pageNo: 1
    }, () => {
      this.getItems()
    })
  }

  getPagination() {
    const { pageNo, pageSize, itemCount } = this.state

    const pagination = {
      current: pageNo,
      pageSize: pageSize,
      total: itemCount,
      onChange: v => {
        this.setState({
          pageNo: v
        }, () => {
          this.getItems()
        })
      },
      showQuickJumper: true
    }

    return pagination
  }

  getColumns() {
    
    let columns = [{
      title: '序号',
      dataIndex: 'rowNo',
      className: 'td-center'
    }, {
      title: '姓名',
      dataIndex: 'name',
      className: 'td-center'
    }, {
      title: '阴阳历',
      dataIndex: 'type',
      className: 'td-center',
      render: v => birthdayType[v]
    }, {
      title: '生日',
      className: 'td-center',
      render: record => {
        if (record.type == 1) {
          let month = solarLunar.toChinaMonth(record.month)
          let day = solarLunar.toChinaDay(record.day)

          return month + day
        }

        if (record.type == 2) {
          return record.month + '-' + record.day
        }
      }
    }, {
      title: '年龄/出生年/生肖',
      dataIndex: 'year',
      className: 'td-center',
      render: v => {
        return (
          <div>
            {
              v ? `${new Date().getFullYear() - v}岁/${v}/${solarLunar.getAnimal(v)}` : '—'
            }
          </div>
        ) 
      }
    }, {
      title: '联系方式',
      dataIndex: 'contact',
      className: 'td-center',
      render: v => {
        return v ? <pre>{v}</pre> : '—'
      }
    }, {
      title: '操作',
      className: 'td-center',
      render: record => {
        return (
          <div>
            <Button onClick={this.handleEdit.bind(this, record)}>修改</Button>
            <Button onClick={this.handleDel.bind(this, record)}>删除</Button>
          </div>
        )
      }
    }]

    if (!this.state.showAge) {
      columns.splice(4, 1)
    }

    return columns
  }

  handleEdit(record) {
    this.setState({
      showEdit: true,
      record
    })
  }

  handleDel(record) {
    let ret = false

    confirm({
      title: '警告',
      content: '您确定要删除此条规则吗？',
      onOk: () => {
        if (ret) {
          return
        }
        ret = true
        return new Promise((resolve, reject) => {
          let data = ipcRenderer.sendSync('birthday-delete', {
            id: record.id
          })

          ret = false

          if (data.success) {
            this.setState({
              pageNo: 1
            }, () => {
              this.getItems()
            })
            resolve()
          } else {
            reject()
          }
        })
      }
    })
  }

  handleShowAge(v) {
    this.setState({
      showAge: v
    })

    let res = ipcRenderer.sendSync('set-age-show-config', {
      showAge: v
    })

    if (!res.success) {
      message.error('设置失败')
      this.setState({
        showAge: !v
      })
    }
  }

  handleShowChild() {
    ipcRenderer.send('show-child')
  }

  render() {
    return (
      <div>
        <Button onClick={this.handleShowChild.bind(this)}>展示子窗口</Button>
        <div style={{ marginBottom: '20px' }}>默认是否展示年龄：<Switch checked={this.state.showAge} onChange={this.handleShowAge.bind(this)} /></div>
        <Table 
          loading={ this.state.loading }
          dataSource={ this.state.items }
          columns={ this.getColumns() }
          pagination={ this.getPagination() }
          rowKey={r => r.id}
          bordered={true}
        />
        <Edit data={this.state.record} callback={()=> this.editCallback()} type="edit" show={ this.state.showEdit } hideModal={ ()=> this.setState({ showEdit: false }) } />
      </div>
    )
  }
}