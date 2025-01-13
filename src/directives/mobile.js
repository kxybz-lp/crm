// 权限指令
import store from '@/store'
import { mobile_replace } from '@/utils/utils'
function hasMobilePermission(value, el = false) {
  if (value) {
    let hasAuth = false
    if (store.state.adminInfo) {
      hasAuth = store.state.adminInfo.auths.includes(151)
      if (el && !hasAuth) {
        // let mobile = el.innerText  //点击分页没有刷新
        el.innerText = mobile_replace(value)
      }
    }
    return hasAuth
  } else {
    throw new Error(`需要配置权限ID`)
  }
}
export default {
  install(app) {
    app.directive('mobile', {
      //给el添加key值，点击分页或搜索时才会触发
      mounted(el, binding) {
        hasMobilePermission(binding.value, el)
      },
    })
  },
}
