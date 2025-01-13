<template>
  订单项目1{{name}}
  <div>{{names}}--{{age}}</div>
  <button @click="add">方法执行</button>
  <input type="text" v-model="val" ref="inputRef" />--{{val}}
  <div>{{fullName}}</div>
  <!-- 获取vuex定义的变量 -->
  <div>{{$store.state.collapse}}</div>
</template>
  
<script>
// 所有使用的钩子都要引入
// import { onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onRenderTracked, onRenderTriggered, watch, computed } from 'vue'
import { ref, reactive, toRefs, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'test',
  components: {},
  // data() {
  //   return {
  //     name: 'liping',
  //   }
  // },
  setup() {
    console.log('setup')
    onMounted(() => {
      console.log('渲染完了')
    })
    // 监听一个值，如果要监听多个值，第一个参数就是个数组，元素是要监听的多个值
    // watch('要监听的值', (val, oldVal) => {})

    const name = ref('liping') //单独的变量
    //对象变量,模板中使用{{data.names}},使用...toRefs结构对象后可以直接使用{{names}}
    const data = reactive({
      names: 'liping',
      age: 18,
      val: '',
    })

    //计算属性
    const fullName = computed(() => {
      return data.names + ' hello'
    })

    const add = () => {
      data.age++
    }

    const store = useStore()
    //执行vuex mutations里定义的方法
    const switchCollapse = () => {
      store.commit('switchCollapse')
    }

    return {
      name,
      ...toRefs(data),
      fullName,
      add,
      switchCollapse,
    }
  },
}
</script>
  