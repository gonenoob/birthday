import { Component } from 'react'
import { Calendar, Badge, Popover } from 'antd'
import moment from 'moment'
import solarLunar from 'solarlunar'
import CSSModules from 'react-css-modules'

import styles from './calendar.less'
import Edit from '../../../../component/ui/birthday/Edit'

@CSSModules(styles)
export default class MyCalendar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      showEdit: false,
      record: {},
      data: [],
      popoverShow: false
    }
  }

  componentDidMount() {
  }

  componentWillReceiveProps(newProps) {
    const { list: newList } = newProps
    const { list: oldList } = this.props

    if (JSON.stringify(newList) != JSON.stringify(oldList)) {
      let data = this.handleDate(newList)
      this.setState({
        data
      })
      
      if (this.props.showNotification) {
        let month = new Date().getMonth() + 1
        let day = new Date().getDate()
        let peoples = data[month] && data[month][day] || []
        
        if (peoples.length) {
          let names = peoples.map(people => {
            return people.name
          })
          let myNotification = new Notification('今天生日', {
            body: names.length > 7 ? names.slice(0,7).join(',') + '等' : names.join(',')
          })
        }

        this.props.userActions.merge({
          showNotification: false
        })
      }
    }
  }

  handleDate(list) {
    let year = new Date().getFullYear()
    let obj = {}

    list.map(item => {
      if (item.type == "1") {
        //阴历
        let result = solarLunar.lunar2solar(year, parseInt(item.month), parseInt(item.day))

        if (result.lYear > year) {
          result = solarLunar.lunar2solar(year - 1, item.month, item.day)
        }

        if (result == -1) {
          return
        }

        obj[result.cMonth] = obj[result.cMonth] || {}
        obj[result.cMonth][result.cDay] = obj[result.cMonth][result.cDay] || []
        obj[result.cMonth][result.cDay].push(Object.assign(item, {
          oMonth: result.cMonth,
          oDay: result.cDay
        }))
      }

      if (item.type == "2") {
        //阳历
        obj[item.month] = obj[item.month] || {}
        obj[item.month][item.day] = obj[item.month][item.day] || []
        obj[item.month][item.day].push(Object.assign(item, {
          oMonth: item.month,
          oDay: item.day
        }))
      }
    })

    return obj
  }

  dateCellRender(value) {
    let month = value.month() + 1
    let day = value.date()
    let peoples = this.state.data[month] && this.state.data[month][day] || []
    let length = peoples.length

    let content = length ? 
    (
      <ul>
        {
          peoples.map(item => (
            <li key={item.id} onClick={ this.showEdit.bind(this, item) }>
              <Badge style={{ cursor: 'pointer' }} status="success" text={item.name} />
            </li>
          ))
        }
      </ul>
    ) : null

    return (
      <Popover content={content} overlayStyle={{ zIndex: '999' }}>
        <span>
          { length ? `人数：${length}` : null }
        </span>
      </Popover>
    )
  }

  monthCellRender(value) {
    let { data } = this.state
    let month = value.month() + 1
    let day = value.date()
    let peoples = data[month] || {}
    let length = 0 
    
    Object.keys(peoples).map(k => {
      length += peoples[k].length
    })

    return length ? (
      <div>
        {
          length
        }
      </div>
    ) : null
  }

  handleSelect(e) {
    // this.setState({})
  }

  handlePanel(e, mode) {
    // this.setState({})
  }

  showEdit(item) {
    this.setState({
      record: item,
      showEdit: true
    })
  }

  render() {
    return (
      <div>
       <Edit type="edit" data={this.state.record} show={ this.state.showEdit } hideModal={ ()=> this.setState({ showEdit: false }) } />
      </div>
    )
  }
}