<template>
  <div class="loading">
    <div ref="bar" class="bar"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
let speed = ref(1)
let bar = ref()
let timer = ref(0)
const startLoading = () => {
  let dom = bar.value
  speed.value = 1
  // 不使用箭头函数是因为递归需要使用函数名称
  timer.value = window.requestAnimationFrame(function fn() {
    if (speed.value < 90) {
      speed.value += 1
      dom.style.width = speed.value + '%'
      // requestAnimationFrame性能优于setinterval，但只执行一次，所以使用递归
      timer.value = window.requestAnimationFrame(fn)
    } else {
      speed.value = 1
      window.cancelAnimationFrame(timer.value)
    }
  })
}

const endLoading = () => {
  let dom = bar.value
  setTimeout(() => {
    window.requestAnimationFrame(() => {
      speed.value = 100
      dom.style.width = speed.value + '%'
    })
  }, 500)
}

defineExpose({
  startLoading,
  endLoading,
})
</script>

<style scoped lang="scss">
.loading {
  position: fixed;
  top: 0;
  width: 100%;
  height: 1px;
  .bar {
    height: inherit;
    width: 0;
    background-color: #02333b;
  }
}
</style>
