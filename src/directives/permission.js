// 权限指令
import store from '@/store'
function hasPermission(value, el = false) {
  if (typeof value === 'number' && !isNaN(value)) {
    //store.state.adminInfo?.role_id  低版本手机不支持?写法
    let hasAuth = false
    if (store.state.adminInfo) {
      hasAuth = store.state.adminInfo.auths.includes(value)
      // 超级管理员开放权限
      if (store.state.adminInfo.role_id == 10001) hasAuth = true
    }

    if (el && !hasAuth) {
      el.parentNode && el.parentNode.removeChild(el)
    }
    return hasAuth
  } else {
    throw new Error(`需要配置权限ID`)
  }
}
export default {
  install(app) {
    app.directive('permission', {
      mounted(el, binding) {
        hasPermission(binding.value, el)
      },
    })
  },
}
