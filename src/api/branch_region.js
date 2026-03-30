/**
 * branch_region模块接口列表
 */
import { get, post } from '@/utils/http'

const branch_region = {
  // 列表
  getList(params) {
    return get('/crm/branch_region/index', params)
  },
  // 新增
  create(params) {
    return post('/crm/branch_region/create', params)
  },
  // 更新
  edit(id, params) {
    return post(`/crm/branch_region/edit/${id}`, params)
  },
  // 状态更新
  status(params) {
    return post('/crm/branch_region/status', params)
  },
  // 排序
  sort(params) {
    return post('/crm/branch_region/sort', params)
  },
  // 删除
  delete(id) {
    return post(`/crm/branch_region/delete/${id}`)
  },
}

export default branch_region
