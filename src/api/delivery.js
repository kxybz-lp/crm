/**
 * delivery模块接口列表
 */
import { get, post } from '@/utils/http'

const delivery = {
  // 列表
  getList(params) {
    return get('/crm/delivery/index', params)
  },
  // select
  getSelect() {
    return get('/crm/delivery/getSelectData')
  },
  // 新增
  create(params) {
    return post('/crm/delivery/create', params)
  },
  // 详情
  read(id) {
    return post(`/crm/delivery/read/${id}`)
  },
  // 更新
  edit(id, params) {
    return post(`/crm/delivery/edit/${id}`, params)
  },
  // 状态更新
  status(id, params) {
    return post('/crm/delivery/status', params)
  },
  // 排序
  sort(params) {
    return post('/crm/delivery/sort', params)
  },
  // 删除
  delete(id) {
    return post(`/crm/delivery/delete/${id}`)
  },
}

export default delivery
