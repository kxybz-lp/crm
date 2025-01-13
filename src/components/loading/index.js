// 引入页面加载loading
import loadingBar from '@/components/loading/LoadingBar.vue'
import { createVNode, render } from 'vue'
const Loading = createVNode(loadingBar) //转成虚拟DOM

render(Loading, document.body) //将Dom挂载到页面中

export default Loading
