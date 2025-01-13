/**
 * express模块接口列表
 */
import { get, post } from '@/utils/http'

const express = {
  // 列表
  getList(params) {
    return get('/crm/express/index', params)
  },
  // 新增
  create(params) {
    return post('/crm/express/create', params)
  },
  // 更新
  edit(id, params) {
    return post(`/crm/express/edit/${id}`, params)
  },
  // 状态更新
  status(params) {
    return post('/crm/express/status', params)
  },
  // 排序
  sort(params) {
    return post('/crm/express/sort', params)
  },
  // 删除
  delete(id) {
    return post(`/crm/express/delete/${id}`)
  },
}

export default express
