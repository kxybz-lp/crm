/**
 * goods模块接口列表
 */
import { get, post } from '@/utils/http'

const goods = {
  // 列表
  getList(params) {
    return get('/crm/goods/index', params)
  },
  // select数据
  getSelect() {
    return get('/crm/goods/getSelectData')
  },
  // 新增
  create(params) {
    return post('/crm/goods/create', params)
  },
  // 详情
  read(id) {
    return post(`/crm/goods/read/${id}`)
  },
  // 更新
  edit(id, params) {
    return post(`/crm/goods/edit/${id}`, params)
  },
  // 移动
  move(params) {
    return post('/crm/goods/move', params)
  },
  // 状态更新
  status(params) {
    return post('/crm/goods/status', params)
  },
  // 排序
  sort(params) {
    return post('/crm/goods/sort', params)
  },
  // 数据恢复
  resave(id) {
    return post('/crm/goods/resave', { id })
  },
  // 删除
  delete(id) {
    return post(`/crm/goods/delete/${id}`)
  },
  // 数据硬删除
  del(id) {
    return post('/crm/goods/del', { id })
  },
  // 规格新增
  create_spec(params) {
    return post('/crm/goods/addSpec', params)
  },
  // 规格更新
  update_spec(params) {
    return post('/crm/goods/updateSpec', params)
  },
  // 规格删除
  delete_spec(spec_id) {
    return post('/crm/goods/deleteSpec', { spec_id })
  },
  // 规格值新增
  create_spec_value(params) {
    return post('/crm/goods/addSpecValue', params)
  },
  // 规格值更新
  update_spec_value(params) {
    return post('/crm/goods/updateSpecValue', params)
  },
  // 规格值删除
  delete_spec_value(spec_value_id) {
    return post('/crm/goods/deleteSpecValue', { spec_value_id })
  },
  // 列表
  getSpecTemplateList() {
    return get('/crm/goods/getSpecTemplateData')
  },
}

export default goods
