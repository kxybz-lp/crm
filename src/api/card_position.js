/**
 * card_position模块接口列表
 */
import { get, post } from '@/utils/http'

const card_position = {
  // 列表
  getList(params) {
    return get('/crm/card_position/index', params)
  },
  // 新增
  create(params) {
    return post('/crm/card_position/create', params)
  },
  // 更新
  edit(id, params) {
    return post(`/crm/card_position/edit/${id}`, params)
  },
  // 状态更新
  status(params) {
    return post('/crm/card_position/status', params)
  },
  // 排序
  sort(params) {
    return post('/crm/card_position/sort', params)
  },
  // 删除
  delete(id) {
    return post(`/crm/card_position/delete/${id}`)
  },
}

export default card_position
