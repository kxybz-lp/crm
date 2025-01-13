// import { useCookies } from '@vueuse/integrations/useCookies'
// const cookie = useCookies()
const TokenKey = 'token'
// // 获取token
// export function getToken() {
//   return cookie.get(TokenKey)
// }

// // 设置token,设置path避免出现多个token，其他参数expires，maxAge，domain等
// export function setToken(token) {
//   return cookie.set(TokenKey, token, { path: '/', maxAge: 60 * 60 * 24 * 7 })
// }

// // 清除token
// export function removeToken() {
//   return cookie.remove(TokenKey)
// }

// 获取token
export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

// 清除token
export function removeToken() {
  return localStorage.removeItem(TokenKey)
}
