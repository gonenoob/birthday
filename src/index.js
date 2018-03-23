/**
 * 入口
 */
import 'babel-polyfill'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import { useStrict } from 'mobx'
import { AppContainer } from 'react-hot-loader'
import { LocaleProvider } from 'antd'
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale-provider/zh_CN'

import App from './app'
import injects from './inject'

// 不允许在@action之外进行状态的修改
useStrict(true)

const render = Component => {
  ReactDOM.render(
    <LocaleProvider locale={zhCN}>
      <AppContainer>
        <Provider {...injects}>
          <Component />
        </Provider>
      </AppContainer>
    </LocaleProvider>,
    document.getElementById('app')
  )
}

render(App)
if (module.hot) {
  module.hot.accept('./app', () => { render(App)})
}
