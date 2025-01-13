/**
 * admin模块接口列表
 */
import { get, post } from '@/utils/http'

const admin = {
  // 列表
  getList(params) {
    return get('/crm/admin/index', params)
  },
  // 登录
  login(params) {
    return post('/crm/account/login', params)
  },
  // 查询个人信息
  getInfo() {
    return post('/crm/admin/getInfo')
  },
  // 退出
  logout() {
    return post('/crm/account/logout')
  },
  // 修改密码
  password(params) {
    return post('/crm/admin/password', params)
  },
  // select数据
  getSelect() {
    return post('/crm/admin/getSelectData')
  },
  // 修改密码
  password(params) {
    return post('/crm/admin/password', params)
  },
  // 新增
  create(params) {
    return post('/crm/admin/create', params)
  },
  // 更新
  edit(id, params) {
    return post(`/crm/admin/edit/${id}`, params)
  },
  // 状态更新
  status(params) {
    return post('/crm/admin/status', params)
  },
  // 绑定微信
  wechat() {
    return post('/crm/admin/wechat')
  },
  // 微信绑定检测
  wechatCheck() {
    return post('/crm/admin/check_bind')
  },
  // 微信绑定解除
  wechatRemove() {
    return post('/crm/admin/remove_wechat')
  },
  // 微信扫码登录
  loginWechat() {
    return post('/crm/account/login_wechat')
  },
  // 微信登录
  loginWechatMc(params) {
    return post('/crm/account/login_wechat_mc', params)
  },
  // 微信登录检测
  loginWechatCheck(params) {
    return post('/crm/account/check_login_wechat', params)
  },
  // 消息通知
  getNote() {
    return post('/crm/index/note')
  },
  // 删除
  delete(id) {
    id = !Array.isArray(id) ? [id] : id
    return post(`/crm/admin/delete/${id}`)
  },
  // 批量删除
  deleteAll(ids) {
    ids = !Array.isArray(ids) ? [ids] : ids
    return post('/crm/admin/deleteAll', { ids })
  },
}

export default admin
