import { toast } from '@/utils/utils'
import useClipboard from 'vue-clipboard3'
const { toClipboard } = useClipboard()

const copy_mobile = async (mobile) => {
  event.stopPropagation()
  try {
    await toClipboard(mobile)
    toast('复制成功', 'success')
  } catch (e) {
    toast('复制失败', 'error')
  }
}

export default {
  install(app) {
    app.directive('copy', {
      // 给el添加key值，点击分页或搜索时才会触发
      mounted(el, binding) {
        // console.log(binding.value)
        el.addEventListener('click', copy_mobile.bind(this, binding.value))
      },
      beforeUnmount(el) {
        el.removeEventListener('click', copy_mobile)
      },
    })
  },
}
