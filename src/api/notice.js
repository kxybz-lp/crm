/**
 * notice模块接口列表
 */
import { get, post } from '@/utils/http'

const notice = {
  // 列表
  getList(params) {
    return get('/crm/notice/index', params)
  },
  // 新增
  create(params) {
    return post('/crm/notice/create', params)
  },
  // 更新
  edit(id, params) {
    return post(`/crm/notice/edit/${id}`, params)
  },
  // 状态更新
  status(params) {
    return post('/crm/notice/status', params)
  },
  // 排序
  sort(params) {
    return post('/crm/notice/sort', params)
  },
  // 删除
  delete(id) {
    return post(`/crm/notice/delete/${id}`)
  },
}

export default notice
