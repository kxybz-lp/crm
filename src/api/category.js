/**
 * category模块接口列表
 */
import { get, post } from '@/utils/http'

const category = {
  // 列表
  getList(params) {
    return get('/crm/category/index', params)
  },
  // 新增
  create(params) {
    return post('/crm/category/create', params)
  },
  // 更新
  edit(id, params) {
    return post(`/crm/category/edit/${id}`, params)
  },
  // 状态更新
  status(params) {
    return post('/crm/category/status', params)
  },
  // 排序
  sort(params) {
    return post('/crm/category/sort', params)
  },
  // 删除
  delete(id) {
    return post(`/crm/category/delete/${id}`)
  },
}

export default category
