<template>
  <div class="login">
    <div class="login-main">
      <div class="switch">
        <div v-if="isDesktop" class="switch-item" @click="swtichType">
          <span
            style="width: 40px; height: 40px; background-color: #fff; position: absolute; left: -20px; bottom: -20px; transform: rotate(135deg); -webkit-transform: rotate(135deg)"></span>
          <img style="width: 100%" class="switch-img" src="@/assets/images/desktop.png"
            alt="密码登录" />
        </div>
        <div v-else class="switch-item" @click="swtichType">
          <span
            style="width: 40px; height: 40px; background-color: #fff; position: absolute; left: -20px; bottom: -20px; transform: rotate(135deg); -webkit-transform: rotate(135deg)"></span>
          <img style="width: 100%" src="@/assets/images/ewm.png" alt="扫码登录" />
        </div>
      </div>
      <div class="login-nomal" v-if="isDesktop">
        <div
          style="font-size: 24px; color: #004c59; margin: 10px 0 20px; text-align: center; font-weight: bold">
          星艺装饰订单系统</div>
        <el-form ref="formRef" :rules="rules" :model="form" class="login-from">
          <el-form-item prop="name">
            <el-input v-model="form.name" placeholder="请输入用户名">
              <template #prefix>
                <el-icon>
                  <user-filled />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password>
              <template #prefix>
                <el-icon>
                  <lock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100%" round color="#004c59" class="submit" type="primary"
              @click="onSubmit" :loading="loading">登 录</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="login-wechat" v-else>
        <div
          style="font-size: 24px; color: #004c59; margin: 0; text-align: center; font-weight: bold">
          扫码登录</div>
        <div class="ewm">
          <img :src="img" v-if="img" alt=""
            style="max-width: 200px; display: block; margin: 20px auto 0px" />
          <p style="font-size: 14px; text-aling: center; color: #666; margin: 40px auto 40px"
            v-else>
            <el-icon>
              <Loading />
            </el-icon>二维码生成中...
          </p>
        </div>
        <div style="font-size: 12px; color: #004c59; text-align: center; padding: 10px 0 0 0">
          打开「微信」扫一扫登录系统</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, onUnmounted, onDeactivated } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { setToken } from '@/utils/token'
import { get_query_string, is_weixn, toast } from '@/utils/utils'
import admin from '@/api/admin'

const store = useStore()
const router = useRouter()
// do not use same name with ref
const form = reactive({
  name: '',
  password: '',
})
const rules = {
  name: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'blur',
    },
  ],
}

const session_id = ref('')
const code = ref('')
const img = ref('')
let timer = null
let isDesktop = ref(true)

const swtichType = () => {
  // 微信登录
  if (is_weixn() && code.value) {
    // toast('微信登录', 'warning')
    admin.loginWechatMc({ code: code.value }).then((res) => {
      if (res.code > 0) {
        const { token } = res.result
        //存储token
        setToken(token)
        router.push({ path: '/' })
        toast('登录成功')
      } else {
        toast(res.message || 'error', 'error')
        return false
      }
    })
  } else {
    isDesktop.value = !isDesktop.value
    if (!isDesktop.value) {
      admin.loginWechat().then((res) => {
        if (res.code > 0) {
          session_id.value = res.result.session_id
          img.value = res.result.img

          timer = setInterval(() => {
            admin.loginWechatCheck({ session_id: session_id.value }).then((res) => {
              if (res.code > 0) {
                const { token } = res.result
                //存储token
                setToken(token)
                clearInterval(timer)
                router.push({ path: '/' })
                toast('登录成功')
              }
            })
          }, 2000)
        } else {
          toast(res.message || 'error', 'error')
          return false
        }
      })
    } else {
      clearInterval(timer)
    }
  }
}
onUnmounted(() => {
  clearInterval(timer)
})
onDeactivated(() => {
  clearInterval(timer)
})

const isMobile = ref(false)
const formRef = ref(null)
const loading = ref(false)
const onSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) {
      return false
    }
    loading.value = true
    //发送网络请求
    admin
      .login(form)
      .then((res) => {
        if (res.code > 0) {
          const { token } = res.result
          //存储token
          setToken(token)
          router.push({ path: '/' })
          toast('登录成功')
        } else {
          toast(res.message || 'error', 'error')
          return false
        }
      })
      .finally(() => {
        loading.value = false
      })
  })
}

// 监听回车事件
function onKeyUp(e) {
  if (e.key == 'Enter') onSubmit()
}

// 添加键盘监听
onMounted(() => {
  document.addEventListener('keyup', onKeyUp)
  // 判断是否是移动端
  const clientWidth = document.body.clientWidth
  if (clientWidth < 768) {
    isMobile.value = true
  } else {
    isMobile.value = false
  }
  //移动端微信登录
  code.value = get_query_string('code')
  if (is_weixn()) {
    if (code.value == null || code.value === '' || code.value === false) {
      const local = window.location.href
      window.location.href =
        'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx848fa2e3c9160c71&redirect_uri=' + encodeURIComponent(local) + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect'
    }
  }
})
// 移除键盘监听
onBeforeUnmount(() => {
  document.removeEventListener('keyup', onKeyUp)
})
</script>
<style lang="scss" scoped>
.login {
  min-height: 100vh;
  background: radial-gradient(#016f82 30%, #004c59 70%);
  display: flex;
  justify-content: center;
  align-items: center;
  &-main {
    width: 330px;
    height: 300px;
    overflow: hidden;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgb(26 26 26 / 10%);
    .switch {
      display: flex;
      justify-content: flex-end;
      padding: 5px 5px 0 0;
      &-item {
        display: flex;
        align-items: flex-start;
        font-size: 12px;
        color: #016f82;
        width: 40px;
        height: 40px;
        overflow: hidden;
        position: relative;
      }
    }
    .login-wechat {
      .ewm {
        max-width: 160px;
        margin: 0 auto;
        img {
          width: 100%;
          display: block;
        }
      }
      .toolsip {
        font-size: 12px;
        color: #004c59;
        text-align: center;
        padding: 10px 0 0 0;
      }
    }
    .title-nomal,
    .title-wechat {
      font-size: 24px;
      color: #004c59;
      margin: 10px 0 20px;
      text-align: center;
      font-weight: bold;
    }
    .login-nomal {
      padding: 15px 30px;
      .el-form-item {
        margin-bottom: 24px;
      }
      .el-icon.is-loading {
        color: #fff !important;
      }
      .submit :deep(.el-icon) {
        color: #fff !important;
      }
      // .login-input{
      //   border:1px solid #004c59;
      //   border-radius:3px;
      // }
      // /** el-input 正常模式下、readonly模式下的文字颜色 */
      // .el-input__inner{
      //   color:#004c59;
      // }
    }
  }
}
</style>
