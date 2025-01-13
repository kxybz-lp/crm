/**
 * 订单模块接口列表
 */
import { get, post } from '@/utils/http'

const order = {
  // 列表
  getList(params) {
    return get('/crm/order/index', params)
  },
  // select数据
  getSelect() {
    return get('/crm/order/getSelectData')
  },
  // 发货
  delivery(id, params) {
    return post(`/crm/order/delivery/${id}`, params)
  },
  // 审核取消
  cancel(id, params) {
    return post(`/crm/order/confirmCancel/${id}`, params)
  },
  // 改价
  update_price(id, params) {
    return post(`/crm/order/updatePrice/${id}`, params)
  },
  // 详情
  read(id) {
    return post(`/crm/order/read/${id}`)
  },
  // 删除
  delete(id) {
    id = !Array.isArray(id) ? [id] : id
    return post(`/crm/order/delete/${id}`)
  },
  // 导出
  export(params) {
    return post('/crm/order/export', params)
  },
  // 移动
  move(params) {
    return post('/crm/order/move', params)
  },
  // 统计
  getAnalysis(params) {
    return post('/crm/order/analysis', params)
  },
  // 数据硬删除
  del(id) {
    return post('/crm/order/del', { id })
  },
}

export default order
