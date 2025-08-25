/**
 * card模块接口列表
 */
import { get, post } from '@/utils/http'

const card = {
  // 列表
  getList(params) {
    return get('/crm/card/index', params)
  },
  // select数据
  getSelect() {
    return get('/crm/card/getSelectData')
  },
  // 新增
  create(params) {
    return post('/crm/card/create', params)
  },
  // 更新
  edit(id, params) {
    return post(`/crm/card/edit/${id}`, params)
  },
  // 状态更新
  status(params) {
    return post('/crm/card/status', params)
  },
  // 排序
  sort(params) {
    return post('/crm/card/sort', params)
  },
  // 生成二维码
  ewm(params) {
    return post('/crm/card/create_ewm', params)
  },
  // 删除
  delete(id) {
    return post(`/crm/card/delete/${id}`)
  },
}

export default card
