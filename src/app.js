import { Component } from 'react'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import {
  // BrowserRouter as Router
  HashRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'
import CSSModules from 'react-css-modules'

import './less/antd.less'
import styles from './less/app.less'

import Dynamic from './dynamic'
import Menu from './component/Menu'

@inject('userStore')
@CSSModules(styles)
@observer
class App extends Component {

  render() {
    const user = toJS(this.props.userStore.user)
    return (
      <Router>
        <div className="app-root">
          <Menu />
          <div className="app-wrapper">
            <div className="app-content">
              <Switch>
                {
                // <Dynamic exact path="/" load={require('bundle-loader?lazy!./container/home')} />
                }
                <Dynamic exact path="/" load={require('bundle-loader?lazy!./container/date/Birth')} />
                <Dynamic exact path="/date/birth" load={require('bundle-loader?lazy!./container/date/Birth')} />
                <Dynamic exact path="/date/table" load={require('bundle-loader?lazy!./container/date/BirthTable')} />
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    )
  }
}

export default App
