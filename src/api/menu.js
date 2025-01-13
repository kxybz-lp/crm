/**
 * menu模块接口列表
 */
import { get, post } from '@/utils/http'

const menu = {
  // 列表
  getList(params) {
    return get('/crm/menu/index', params)
  },
  // 新增
  create(params) {
    return post('/crm/menu/create', params)
  },
  // 更新
  edit(id, params) {
    return post(`/crm/menu/edit/${id}`, params)
  },
  // 状态更新
  status(params) {
    return post('/crm/menu/status', params)
  },
  // 删除
  delete(id) {
    return post(`/crm/menu/delete/${id}`)
  },
}

export default menu
