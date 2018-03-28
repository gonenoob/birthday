import { observable, computed } from "mobx"

class Store {
  @observable showNotification = true
}

export default new Store()