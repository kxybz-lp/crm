/**
 * lottery_award模块接口列表
 */
import { get, post } from '@/utils/http'

const lottery_award = {
  // 列表
  getList(params) {
    return get('/crm/lottery_award/index', params)
  },
  // 新增
  create(params) {
    return post('/crm/lottery_award/create', params)
  },
  // 更新
  edit(id, params) {
    return post(`/crm/lottery_award/edit/${id}`, params)
  },
  // 状态更新
  status(params) {
    return post('/crm/lottery_award/status', params)
  },
  // 排序
  sort(params) {
    return post('/crm/lottery_award/sort', params)
  },
  // 删除
  delete(id) {
    return post(`/crm/lottery_award/delete/${id}`)
  },
}

export default lottery_award
