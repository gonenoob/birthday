/**
 * listAddRowNo.js
 * @author oldj
 * @blog https://oldj.net
 */

'use strict'

export default (list) => {
  if (typeof list !== 'object' || typeof list.pageNo !== 'number' || typeof list.pageSize !== 'number') {
    return list
  }

  let {pageNo, pageSize, itemCount} = list

  list.items = list.items.map((item, index) => {
    item.rowNo = (pageNo - 1) * pageSize + index + 1 // 正序
    // item.rowNo = itemCount - (pageNo - 1) * pageSize - index // 倒序
    return item
  })

  return list
}
