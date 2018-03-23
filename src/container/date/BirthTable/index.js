import { Component } from 'react'
import { Table, message, Button, Modal } from 'antd'
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
      record: {}
    }
  }

  componentDidMount() {
    this.getItems()
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
    
    return [{
      title: '序号',
      dataIndex: 'rowNo'
    }, {
      title: '姓名',
      dataIndex: 'name'
    }, {
      title: '阴阳历',
      dataIndex: 'type',
      render: v => birthdayType[v]
    }, {
      title: '生日',
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
      title: '操作',
      render: record => {
        return (
          <div>
            <Button onClick={this.handleEdit.bind(this, record)}>修改</Button>
            <Button onClick={this.handleDel.bind(this, record)}>删除</Button>
          </div>
        )
      }
    }]
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

  render() {
    return (
      <div>
        <Table 
          loading={ this.state.loading }
          dataSource={ this.state.items }
          columns={ this.getColumns() }
          pagination={ this.getPagination() }
          rowKey={r => r.id}
          bordered={true}
        />
        <Edit data={this.state.record} type="edit" show={ this.state.showEdit } hideModal={ ()=> this.setState({ showEdit: false }) } />
      </div>
    )
  }
}