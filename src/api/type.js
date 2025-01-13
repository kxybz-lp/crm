/**
 * type模块接口列表
 */
import { get, post } from '@/utils/http'

const type = {
  // 列表
  getList(params) {
    return get('/order/type/index', params)
  },
  // 新增
  create(params) {
    return post('/order/type/create', params)
  },
  // 更新
  edit(id, params) {
    return post(`/order/type/edit/${id}`, params)
  },
  // 状态更新
  status(params) {
    return post('/order/type/status', params)
  },
  // 排序
  sort(params) {
    return post('/order/type/sort', params)
  },
  // 删除
  delete(id) {
    return post(`/order/type/delete/${id}`)
  },
}

export default type
