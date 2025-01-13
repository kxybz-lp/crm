// import '@babel/polyfill'
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import store from './store'

import '@/assets/css/global.css'
import * as ElIcon from '@element-plus/icons-vue'
const app = createApp(App)

for (let iconName in ElIcon) {
  app.component(iconName, ElIcon[iconName])
}
// 权限指令
import permission from '@/directives/permission'
// 复制黏贴指令
import copy from '@/directives/copy'
// 查看手机号指令
import mobile from '@/directives/mobile'
app.use(permission).use(copy).use(mobile)
// 全局方法
// app.config.globalProperties.$filters = {
//   dateFormart(val, type = 'date') {
//     const dt = new Date(parseInt(val) * 1000) //后台返回的时间戳是以秒单位，js是以毫秒为单位
//     const y = dt.getFullYear()
//     const m = (dt.getMonth() + 1 + '').padStart(2, '0')
//     const d = (dt.getDate() + '').padStart(2, '0')
//     const hh = (dt.getHours() + '').padStart(2, '0')
//     const mm = (dt.getMinutes() + '').padStart(2, '0')
//     const ss = (dt.getSeconds() + '').padStart(2, '0')
//     if (type == 'hour') {
//       return `${y}-${m}-${d} ${hh}:${mm}`
//     } else {
//       return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
//     }
//   },
// }
// app.config.globalProperties.$utils = utils
// app.config.globalProperties.$api = api

// 权限控制
import '@/utils/permission'

app.use(store).use(router).mount('#app')
