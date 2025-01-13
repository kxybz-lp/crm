/**
 * Created by LIPING on 2020/10/31
 */
import axios from 'axios'
import QS from 'qs' // 引入qs模块，用来序列化post类型的数据
import store from '@/store/index'
import base from '@/api/base' // 导入接口域名列表
import { getToken } from '@/utils/token'
import { toast } from './utils'

// 环境的切换
if (process.env.NODE_ENV == 'development') {
  axios.defaults.baseURL = '/api'
} else if (process.env.NODE_ENV == 'debug') {
  axios.defaults.baseURL = ''
} else if (process.env.NODE_ENV == 'production') {
  axios.defaults.baseURL = base.sq
}
// 请求超时时间,如需一次导出大量数据，需调整请求超时时间
axios.defaults.timeout = 100000

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    const token = getToken()
    token && (config.headers.token = token)
    return config
  },
  (error) => {
    return Promise.error(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      if (response.data.code === -1) {
        toast('登录过期，请重新登录', 'error')
        store.dispatch('logout').finally(() => {
          location.reload()
        })
      }
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  // 服务器状态码不是200的情况
  (error) => {
    if (error.response.status) {
      switch (error.response.status) {
        case 401:
          toast('登录过期，请重新登录', 'error')
          localStorage.removeItem('token')
          location.reload()
          // store.dispatch('logout').finally(() => {
          //   location.reload()
          // })
          break
        // 404请求不存在
        case 404:
          toast('网络请求不存在', 'error')
          break
        // 其他错误，直接抛出错误提示
        default:
          toast(error.response.data.message, 'error')
      }
      return Promise.reject(error.response)
    }
  }
)

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params,
      })
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err.data)
      })
  })
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, QS.stringify(params))
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err.data)
      })
  })
}
