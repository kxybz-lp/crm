import { router, addRoutes } from '@/router'
import { toast } from '@/utils/utils'
import { getToken, removeToken } from '@/utils/token'
// 引入页面加载loading
import Loading from '@/components/loading/index'
import store from '@/store'
//全局前置守卫
const whileList = ['/admin/index']
let hasGetInfo = false
router.beforeEach(async (to, from, next) => {
  // if(token || whileList.includes(to.path)){
  //   next()
  // }
  const token = getToken()
  // 没有登录，强制跳转回登录页
  if (!token && to.path != '/login') {
    toast('请先登录', 'error')
    return next({ path: '/login' })
  }

  // 防止重复登录
  if (token && to.path == '/login') {
    toast('请勿重复登录', 'error')
    return next({ path: from.path ? from.path : '/' })
  }
  let hasNewRoutes = false
  // 获取登录账号信息,刷新页面重新获取
  if (token && !hasGetInfo) {
    let { menus } = await store.dispatch('getinfo')
    // 动态添加路由
    hasNewRoutes = addRoutes(menus)
    hasGetInfo = true
    // console.log(hasNewRoutes)
    //获取通知消息
    store.dispatch('getNote')
  }

  // 删除临时路由
  if (router.hasRoute('TempRoute')) {
    router.removeRoute('TempRoute')
  }

  // 设置页面标题
  let title = (to.meta.title ? to.meta.title + '-' : '') + 'CRM管理系统'
  document.title = title

  // 页面加载进度条,Loading.component?.exposed?
  Loading.component.exposed.startLoading()

  // 解决刷新页面404问题
  hasNewRoutes ? next(to.fullPath) : next()
})

// 全局后置守卫
router.afterEach((to, from) => {
  Loading.component.exposed.endLoading()

  // console.log(router.getRoutes())
  // 新增与更新订单后跳转并刷新
  // if ((from.name === 'OrderEdit' || from.name === 'OrderAdd') && to.name === 'Order') {
  //   location.reload()
  // }
})
