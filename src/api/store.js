/**
 * branch模块接口列表
 */
import { get, post } from '@/utils/http'

const store = {
  // 列表
  getList(params) {
    return get('/crm/store/index', params)
  },
  // select数据
  getSelect() {
    return get('/crm/store/getSelectData')
  },
  // 新增
  create(params) {
    return post('/crm/store/create', params)
  },
  // 更新
  edit(id, params) {
    return post(`/crm/store/edit/${id}`, params)
  },
  // 导出
  export(params) {
    return post('/crm/store/export', params)
  },
  // 导入
  import(params) {
    return post('/crm/store/import', params)
  },
  // 删除
  delete(id) {
    return post(`/crm/store/delete/${id}`)
  },
}

export default store
