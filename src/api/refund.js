/**
 * 售后模块接口列表
 */
import { get, post } from '@/utils/http'

const refund = {
  // 列表
  getList(params) {
    return get('/crm/refund/index', params)
  },
  // select数据
  getSelect() {
    return get('/crm/refund/getSelectData')
  },
  // 发货
  receipt(id, params) {
    return post(`/crm/refund/receipt/${id}`, params)
  },
  // 审核取消
  audit(id, params) {
    return post(`/crm/refund/audit/${id}`, params)
  },
  // 详情
  read(id) {
    return post(`/crm/refund/read/${id}`)
  },
  // 删除
  delete(id) {
    id = !Array.isArray(id) ? [id] : id
    return post(`/crm/refund/delete/${id}`)
  },
  // 导出
  export(params) {
    return post('/crm/refund/export', params)
  },
}

export default refund
