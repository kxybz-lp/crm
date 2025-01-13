/**
 * api接口的统一出口
 */
//if (process.env.NODE_ENV == 'development') require('@/api/mock.js') //开发环境下引入mockjs,拦截请求，返回随机的模拟数据
// 首页模块接口
import home from '@/api/home'
// 列表模块接口
import admin from '@/api/admin'
// 详情模块接口
import order from '@/api/order'

// 导出接口
export default {
  home,
  admin,
  order,
}
