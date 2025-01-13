/**
 * search模块接口列表
 */
import { get, post } from '@/utils/http'

const search = {
  // 列表
  getList(params) {
    return get('/order/search/index', params)
  },
  // 新增
  create(params) {
    return post('/order/search/create', params)
  },
  // 删除
  delete(id) {
    return post(`/order/search/delete/${id}`)
  },
}

export default search
