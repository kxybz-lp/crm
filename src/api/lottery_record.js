/**
 * lottery_record模块接口列表
 */
import { get, post } from '@/utils/http'

const lottery_record = {
  // 列表
  getList(params) {
    return get('/crm/lottery_record/index', params)
  },
  getAnalysis(params) {
    return post('/crm/lottery_record/analysis', params)
  },
  // select数据
  getSelect() {
    return get('/crm/lottery_record/getSelectData')
  },
  // 生成二维码
  ewm(params) {
    return post('/crm/lottery_record/create_ewm', params)
  },
  // 新增
  create(params) {
    return post('/crm/lottery_record/create', params)
  },
  // 更新
  edit(id, params) {
    return post(`/crm/lottery_record/edit/${id}`, params)
  },
  // 状态更新
  status(params) {
    return post('/crm/lottery_record/status', params)
  },
  // 导出
  export(params) {
    return post('/crm/lottery_record/export', params)
  },
  // 导入
  import(params) {
    return post('/crm/lottery_record/import', params)
  },
  // 删除
  delete(id) {
    return post(`/crm/lottery_record/delete/${id}`)
  },
}

export default lottery_record
