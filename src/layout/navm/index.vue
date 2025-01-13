<template>
  <el-drawer v-model="$store.state.collapseMobile" :with-header="false" size="180px"
    :direction="direction">
    <el-aside width="180px">
      <el-scrollbar>
        <el-menu :default-active="currentRoute" background-color="var(--color)" text-color="#fff"
          active-text-color="#fff" :collapse-transition="false" :router="true" :unique-opened="true"
          @select="openRouter">
          <NavItem :menu="menuList"></NavItem>
        </el-menu>
      </el-scrollbar>
    </el-aside>
  </el-drawer>
</template>
<script setup>
import { ref, computed, onBeforeMount, onUnmounted } from 'vue'
import NavItem from '../nav/NavItem.vue'
import { useStore } from 'vuex'

const store = useStore()
const menuList = computed(() => store.state.menuList)
const currentRoute = computed(() => store.state.currentRoute)

const direction = ref('ltr')

// 窗口大小改变时(适配移动端)
const onLayoutResize = () => {
  const clientWidth = document.body.clientWidth
  if (clientWidth < 768) {
    store.commit('switchIsMobile', true)
  } else {
    store.commit('switchIsMobile', false)
  }
}
// 页面加载前
onBeforeMount(() => {
  onLayoutResize()
  window.addEventListener('resize', onLayoutResize)
})
// 页面卸载时
onUnmounted(() => {
  window.removeEventListener('resize', onLayoutResize)
})

const openRouter = () => {
  store.commit('switchCollapseMobile')
}
</script>
<style lang="scss" scoped>
.el-aside {
  height: 100%;
  background-color: var(--color);
  transition: all 0.2s;
}
</style>