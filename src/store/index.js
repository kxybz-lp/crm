import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import admin from '@/api/admin'
import { removeToken } from '@/utils/token'
import { parseTime } from '@/utils/utils'

export default createStore({
  state: {
    collapse: false,
    collapseMobile: false,
    isMobile: false,
    token: '',
    adminInfo: null,
    storeInfo: null,
    currentRoute: '/', //当前页面路由
    menuList: null,
    noteList: null, //消息通知数据
    statusList: null, //订单状态
    tabList: [
      //标签导航
      {
        label: '首页',
        path: '/',
      },
    ],
  },
  getters: {},
  mutations: {
    switchCollapse(state) {
      state.collapse = !state.collapse
    },
    switchCollapseMobile(state) {
      state.collapseMobile = !state.collapseMobile
    },
    switchIsMobile(state, val) {
      state.isMobile = val
    },
    //设置当前页面路由
    setCurrentRoute(state, val) {
      state.currentRoute = val
    },
    //设置权限菜单
    setMenuList(state, val) {
      state.menuList = val
    },
    //设置权限菜单
    setStatusList(state, val) {
      state.statusList = val
    },
    //设置权限菜单
    setTabList(state, val) {
      state.tabList = val
    },
    //设置消息通知数据
    setNoteList(state, val) {
      state.noteList = val
    },
    //选择标签
    selectMenu(state, val) {
      if (val.path === '/home' || val.path === '/') {
        state.currentRoute = '/home'
      } else {
        state.currentRoute = val.path
        let result = state.tabsList.findIndex((item) => item.path === val.path)
        result === -1 ? state.tabsList.push(val) : ''
      }
    },
    //设置登录管理员账号信息
    setAdminInfo(state, val) {
      state.adminInfo = val
    },
    //设置登录用户门店信息
    setStoreInfo(state, val) {
      state.storeInfo = val
    },
  },
  actions: {
    // 获取当前登录用户信息
    getinfo({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        admin
          .getInfo()
          .then((res) => {
            let adminInfo = res.result.adminInfo
            // let storeInfo = res.result.storeInfo
            // 判断所属公司是否关闭
            //let isClose = storeInfo.every((item) => item.status == 2)
            if (!adminInfo.status || !adminInfo.store.status) {
              dispatch('logout')
              location.reload()
              return false
            } else {
              adminInfo.auths = adminInfo.auths.split(',').map((o) => parseInt(o))
              commit('setAdminInfo', adminInfo)
              // commit('setStoreInfo', storeInfo)
              commit('setMenuList', res.result.menu)
              resolve(res.result)
            }
          })
          .catch((err) => reject(err))
      })
    },
    getNote({ commit }) {
      admin.getNote().then((res) => {
        let data = res.result.map((item) => {
          item.order_time = parseTime(item.order_time)
          return item
        })
        commit('setNoteList', res.result)
      })
    },
    // 退出登录
    logout({ commit }) {
      removeToken()
      commit('setAdminInfo', null)
      // commit('setMenuList', [])
      commit('setTabList', [
        {
          label: '首页',
          path: '/',
        },
      ])
      commit('setCurrentRoute', '/')
    },
  },
  modules: {},
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      reducer(val) {
        return {
          // 只储存state中的token
          tabList: val.tabList,
          currentRoute: val.currentRoute,
          menuList: val.menuList,
          adminInfo: val.adminInfo,
          storeInfo: val.storeInfo,
          isMobile: val.isMobile,
          // noteList: val.noteList,
        }
      },
    }),
  ],
})
