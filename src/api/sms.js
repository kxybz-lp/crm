/**
 * sms模块接口列表
 */
import { get, post } from '@/utils/http'

const sms = {
  // 列表
  getList(params) {
    return get('/crm/sms/index', params)
  },
  // 删除
  delete(id) {
    return post(`/crm/sms/delete/`, { id })
  },
  // 批量删除
  deleteAll(ids) {
    ids = !Array.isArray(ids) ? [ids] : ids
    return post('/crm/sms/delete', { id: ids })
  },
}

export default sms
