/**
 * setting系统设置接口列表
 */
import { get, post } from '@/utils/http'

const setting = {
  // 详情
  read(id) {
    return post(`/crm/setting/read/${id}`)
  },
  // 更新
  edit(id, params) {
    return post(`/crm/setting/edit/${id}`, params)
  },
}
export default setting
