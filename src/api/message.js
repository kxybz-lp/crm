/**
 * message模块接口列表
 */
import { get, post } from '@/utils/http'

const message = {
  // 列表
  getList(params) {
    return get('/crm/message/index', params)
  },
  // 删除
  delete(id) {
    return post(`/crm/message/delete/`, { id })
  },
  // 批量删除
  deleteAll(ids) {
    ids = !Array.isArray(ids) ? [ids] : ids
    return post('/crm/message/delete', { id: ids })
  },
}

export default message
