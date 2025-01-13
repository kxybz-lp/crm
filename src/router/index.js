import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

//通用路由
const routes = [
  {
    path: '/',
    name: 'LayOut',
    component: Layout,
    meta: { title: '首页' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: { title: '登录', permissions: false },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "404" */ '@/views/other/404.vue'),
    meta: { title: '404', permissions: false },
  },
]

// 权限路由,面包屑导航需要使用嵌套路由
// const authRoutes = [
//   {
//     path: '/',
//     name: 'Home',
//     component: Home,
//     meta: { title: '数据概览', permissions: true },
//   },
//   {
//     path: '',
//     name: 'Admins',
//     meta: { title: '用户管理' },
//     path: '/admin',
//     redirect: '/admin/index',
//     children: [
//       {
//         path: '/admin/index',
//         name: 'Admin',
//         component: () => import(/* webpackChunkName: "admin" */ '@/views/admin/index.vue'),
//         meta: { title: '管理员列表', permissions: true },
//       },
//       {
//         path: '/admin/role',
//         name: 'Role',
//         component: () => import(/* webpackChunkName: "role" */ '@/views/role/index.vue'),
//         meta: { title: '角色列表', permissions: true },
//       },
//     ],
//   },
//   {
//     path: '/system',
//     name: 'System',
//     meta: { title: '系统管理', permissions: true },
//     children: [
//       {
//         path: '/system/menu',
//         name: 'Menu',
//         component: () => import(/* webpackChunkName: "menu" */ '@/views/menu/index.vue'),
//         meta: { title: '菜单列表', permissions: true },
//       },
//     ],
//   },
// ]

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 移动端打开新页面时返回页面顶部
    // let elMain = document.querySelector('.el-main')
    // elMain.scrollTop = 0
    // if (savedPosition) {
    //   return savedPosition
    // } else {
    //   return { top: 0 }
    // }
  },
})

// 临时路由，解决刷新浏览器出现路由不存在的警告
if (!router.hasRoute()) {
  router.addRoute({
    path: window.location.pathname,
    name: 'TempRoute',
    component: () => import('@/views/other/404.vue'),
  })
}

// 动态添加路由的方法
export function addRoutes(menus) {
  // 是否有新的路由
  let hasNewRoutes = false
  const findAndAddRoutesByMenus = (arr) => {
    arr.forEach((e) => {
      if (e.component && !router.hasRoute(e.path)) {
        let item = {
          path: e.path,
          name: e.name,
          component: e.component ? () => import('@/' + e.component) : '',
          meta: e.meta,
        }
        router.addRoute('LayOut', item)
        hasNewRoutes = true
      }
      if (e.children && e.children.length > 0) {
        findAndAddRoutesByMenus(e.children)
      }
    })
  }

  findAndAddRoutesByMenus(menus)

  //查看router里所有路由
  // console.log(router.getRoutes())
  return hasNewRoutes
}
