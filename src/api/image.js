/**
 * image模块接口列表
 */
import { get, post } from '@/utils/http'

const image = {
  // 图库分类列表
  getClassList() {
    return get('/crm/image_class/index')
  },
  // 图库分类新增
  createClass(params) {
    return post('/crm/image_class/create', params)
  },
  // 图库分类编辑
  updateClass(id, params) {
    return post('/crm/image_class/edit/' + id, params)
  },
  // 图库分类删除
  deleteClass(id) {
    return post('/crm/image_class/delete/' + id)
  },
  // 图片上传api
  uploadImageAction() {
    return '/crm/image/upload'
  },
  // 图片列表
  getList(params) {
    return get('/crm/image/index', params)
  },
  // 图库移动
  move(params) {
    return post('/crm/image/move/', params)
  },
  // 图库删除
  remove(id) {
    return post('/crm/image/delete/' + id)
  },
  // 图库编辑
  update(id, params) {
    return post('/crm/image/edit/' + id, params)
  },
}

export default image
