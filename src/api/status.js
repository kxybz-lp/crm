/**
 * status模块接口列表
 */
import { get, post } from '@/utils/http'

const status = {
  // 列表
  getList(params) {
    return get('/order/status/index', params)
  },
  // 新增
  create(params) {
    return post('/order/status/create', params)
  },
  // 更新
  edit(id, params) {
    return post(`/order/status/edit/${id}`, params)
  },
  // 状态更新
  status(params) {
    return post('/order/status/status', params)
  },
  // 排序
  sort(params) {
    return post('/order/status/sort', params)
  },
  // 删除
  delete(id) {
    return post(`/order/status/delete/${id}`)
  },
}

export default status
