/**
 * spec_template模块接口列表
 */
import { get, post } from '@/utils/http'

const spec_template = {
  // 列表
  getList(params) {
    return get('/crm/spec_template/index', params)
  },
  // 新增
  create(params) {
    return post('/crm/spec_template/create', params)
  },
  // 详情
  read(id) {
    return post(`/crm/spec_template/read/${id}`)
  },
  // 更新
  edit(id, params) {
    return post(`/crm/spec_template/edit/${id}`, params)
  },
  // 状态更新
  status(id, params) {
    return post('/crm/spec_template/status', params)
  },
  // 排序
  sort(params) {
    return post('/crm/spec_template/sort', params)
  },
  // 删除
  delete(id) {
    return post(`/crm/spec_template/delete/${id}`)
  },
}

export default spec_template
