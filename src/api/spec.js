/**
 * spec模块接口列表
 */
import { get, post } from '@/utils/http'

const spec = {
  // 列表
  getList(params) {
    return get('/crm/spec/index', params)
  },
  // 新增
  create(params) {
    return post('/crm/spec/create', params)
  },
  // 更新
  edit(id, params) {
    return post(`/crm/spec/edit/${id}`, params)
  },
  // 状态更新
  status(id, params) {
    return post(`/crm/spec/status/${id}`, params)
  },
  // 排序
  sort(params) {
    return post('/crm/spec/sort', params)
  },
  // 删除
  delete(id) {
    return post(`/crm/spec/delete/${id}`)
  },
}

export default spec
