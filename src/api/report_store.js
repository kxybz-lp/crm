/**
 * report_store模块接口列表
 */
import { get, post } from '@/utils/http'

const report_store = {
  // 列表
  getList(params) {
    return get('/crm/report_store/index', params)
  },
  // select数据
  getSelect() {
    return get('/crm/report_store/getSelectData')
  },
  // 新增
  create(params) {
    return post('/crm/report_store/create', params)
  },
  // 更新
  edit(id, params) {
    return post(`/crm/report_store/edit/${id}`, params)
  },
  // 状态更新
  status(params) {
    return post('/crm/report_store/status', params)
  },
  // 导出
  export(params) {
    return post('/crm/report_store/export', params)
  },
  // 导入
  import(params) {
    return post('/crm/report_store/import', params)
  },
  // 删除
  delete(id) {
    return post(`/crm/report_store/delete/${id}`)
  },
}

export default report_store
