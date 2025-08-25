/**
 * branch模块接口列表
 */
import { get, post } from '@/utils/http'

const report_order = {
  // 列表
  getList(params) {
    return get('/crm/report_order/index', params)
  },
  getAnalysis(params) {
    return post('/crm/report_order/analysis', params)
  },
  // select数据
  getSelect() {
    return get('/crm/report_order/getSelectData')
  },
  // 生成二维码
  ewm(params) {
    return post('/crm/report_order/create_ewm', params)
  },
  // 新增
  create(params) {
    return post('/crm/report_order/create', params)
  },
  // 更新
  edit(id, params) {
    return post(`/crm/report_order/edit/${id}`, params)
  },
  // 状态更新
  status(params) {
    return post('/crm/report_order/status', params)
  },
  // 导出
  export(params) {
    return post('/crm/report_order/export', params)
  },
  // 导入
  import(params) {
    return post('/crm/report_order/import', params)
  },
  // 删除
  delete(id) {
    return post(`/crm/report_order/delete/${id}`)
  },
}

export default report_order
