/**
 * lottery_user模块接口列表
 */
import { get, post } from '@/utils/http'

const lottery_user = {
  // 列表
  getList(params) {
    return get('/crm/lottery_user/index', params)
  },
  // select数据
  getSelect() {
    return get('/crm/lottery_user/getSelectData')
  },
  // 生成二维码
  ewm(params) {
    return post('/crm/lottery_user/create_ewm', params)
  },
  // 新增
  create(params) {
    return post('/crm/lottery_user/create', params)
  },
  // 更新
  edit(id, params) {
    return post(`/crm/lottery_user/edit/${id}`, params)
  },
  // 状态更新
  status(params) {
    return post('/crm/lottery_user/status', params)
  },
  // 导出
  export(params) {
    return post('/crm/lottery_user/export', params)
  },
  // 导入
  import(params) {
    return post('/crm/lottery_user/import', params)
  },
  // 删除
  delete(id) {
    return post(`/crm/lottery_user/delete/${id}`)
  },
}

export default lottery_user
