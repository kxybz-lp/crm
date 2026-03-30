/**
 * areas模块接口列表
 */
import { get, post } from '@/utils/http'

const areas = {
  // 列表
  getList(params) {
    return get('/crm/areas/index', params)
  },
  // 新增
  create(params) {
    return post('/crm/areas/create', params)
  },
  // 更新
  edit(id, params) {
    return post(`/crm/areas/edit/${id}`, params)
  },
  // 状态更新
  status(params) {
    return post('/crm/areas/status', params)
  },
  // 排序
  sort(params) {
    return post('/crm/areas/sort', params)
  },
  // 删除
  delete(id) {
    return post(`/crm/areas/delete/${id}`)
  },
}

export default areas
