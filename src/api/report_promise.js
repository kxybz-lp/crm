/**
 * report_promise模块接口列表
 */
import { get, post } from '@/utils/http'

const report_promise = {
  // 列表
  getList(params) {
    return get('/crm/report_promise/index', params)
  },
  // select数据
  getSelect() {
    return get('/crm/report_promise/getSelectData')
  },
  // 新增
  create(params) {
    return post('/crm/report_promise/create', params)
  },
  // 更新
  edit(id, params) {
    return post(`/crm/report_promise/edit/${id}`, params)
  },
  // 状态更新
  status(params) {
    return post('/crm/report_promise/status', params)
  },
  // 导出
  export(params) {
    return post('/crm/report_promise/export', params)
  },
  // 导入
  import(params) {
    return post('/crm/report_promise/import', params)
  },
  // 删除
  delete(id) {
    return post(`/crm/report_promise/delete/${id}`)
  },
}

export default report_promise
