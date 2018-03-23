import { action } from 'mobx'

import store from '../store'

class Actions {
  constructor(store) {
    this.store = store
  }
}

export default new Actions(store)