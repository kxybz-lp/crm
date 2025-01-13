import { reactive, ref } from 'vue'
import admin from '@/api/admin'
import { toast, showModal } from '@/utils/utils'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export function useRepassword() {
  const router = useRouter()
  const store = useStore()
  const formDrawerRef = ref(null)
  const formRef = ref(null)
  const form = reactive({
    oldpassword: '',
    password: '',
    repassword: '',
  })
  // 确认密码验证
  const validateCheckPass = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('确认密码不能为空'))
    } else {
      if (value != form.password) {
        callback(new Error('确认密码与密码不一致'))
      }
      callback()
    }
  }
  const rules = {
    oldpassword: [
      {
        required: true,
        message: '旧密码不能为空',
        trigger: 'blur',
      },
    ],
    password: [
      {
        required: true,
        message: '新密码不能为空',
        trigger: 'blur',
      },
    ],
    repassword: [
      {
        validator: validateCheckPass,
        trigger: 'blur',
      },
    ],
  }
  const password = () => {
    formDrawerRef.value.openDrawer()
  }
  const onSubmit = () => {
    formRef.value.validate((valid) => {
      if (!valid) {
        return false
      }
      formDrawerRef.value.showLoading()
      admin
        .password(form)
        .then((res) => {
          if (res.code > 0) {
            toast('修改密码成功，请重新登录')
            store.dispatch('logout')
            router.push('/login')
            location.reload()
          } else {
            toast(res.message, 'error')
          }
        })
        .finally(() => {
          formDrawerRef.value.hideLoading()
        })
    })
  }

  return {
    formDrawerRef,
    formRef,
    form,
    rules,
    password,
    onSubmit,
  }
}

export function useLogout() {
  const router = useRouter()
  const store = useStore()
  function logout() {
    showModal('是否要退出登录？').then((res) => {
      admin.logout().finally(() => {
        store.dispatch('logout')
        router.push('/login')
        toast('退出登录成功')
        location.reload()
      })
    })
  }
  return { logout }
}
