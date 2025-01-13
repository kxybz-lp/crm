/**
 * role模块接口列表
 */
import { get, post } from '@/utils/http'

const role = {
  // 列表
  getList(params) {
    return get('/crm/role/index', params)
  },
  // 新增
  create(params) {
    return post('/crm/role/create', params)
  },
  // 更新
  edit(id, params) {
    return post(`/crm/role/edit/${id}`, params)
  },
  // 状态更新
  status(params) {
    return post('/crm/role/status', params)
  },
  // 设置权限
  authorize(params) {
    return post('/crm/role/authorize', params)
  },
  // 删除
  delete(id) {
    return post(`/crm/role/delete/${id}`)
  },
}

export default role
