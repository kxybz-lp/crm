/**
 * channel模块接口列表
 */
import { get, post } from '@/utils/http'

const channel = {
  // 列表
  getList(params) {
    return get('/order/channel/index', params)
  },
  // 新增
  create(params) {
    return post('/order/channel/create', params)
  },
  // 更新
  edit(id, params) {
    return post(`/order/channel/edit/${id}`, params)
  },
  // 状态更新
  status(params) {
    return post('/order/channel/status', params)
  },
  // 排序
  sort(params) {
    return post('/order/channel/sort', params)
  },
  // 删除
  delete(id) {
    return post(`/order/channel/delete/${id}`)
  },
}

export default channel
