/**
 * coupon模块接口列表
 */
import { get, post } from '@/utils/http'

const coupon = {
  // 列表
  getList(params) {
    return get('/crm/coupon/index', params)
  },
  // 领取记录列表
  getReceive(params) {
    return get('/crm/coupon/receive', params)
  },
  // select数据
  getSelect() {
    return post('/crm/coupon/getSelectData')
  },
  // 新增
  create(params) {
    return post('/crm/coupon/create', params)
  },
  // 更新
  edit(id, params) {
    return post(`/crm/coupon/edit/${id}`, params)
  },
  // 状态更新
  status(params) {
    return post('/crm/coupon/status', params)
  },
  // 删除
  delete(id) {
    id = !Array.isArray(id) ? [id] : id
    return post(`/crm/coupon/delete/${id}`)
  },
}

export default coupon
