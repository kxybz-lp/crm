<template>
  <div v-show="!$store.state.isMobile">
    <el-aside :width="$store.state.collapse ? '60px' : '220px'">
      <el-scrollbar>
        <div class="logo">
          <img :src="logo" :width="$store.state.collapse ? '25' : '40'" alt="logo" />
          <p v-show="!$store.state.collapse">CRM系统</p>
        </div>
        <el-menu :default-active="currentRoute" background-color="var(--color)" text-color="#fff"
          active-text-color="#fff" :collapse="$store.state.collapse" :collapse-transition="false"
          :router="true" :unique-opened="true">
          <NavItem :menu="menuList"></NavItem>
        </el-menu>
      </el-scrollbar>
    </el-aside>
  </div>
  <div v-show="$store.state.isMobile">
    <el-aside :width="$store.state.collapse ? '60px' : '0px'">
      <el-scrollbar>
        <div class="logo">
          <img :src="logo" :width="$store.state.collapse ? '25' : '40'" alt="logo" />
        </div>
        <el-menu :default-active="currentRoute" background-color="var(--color)" text-color="#fff"
          active-text-color="#fff" :collapse="$store.state.collapse" :collapse-transition="false"
          :router="true" :unique-opened="true">
          <NavItem :menu="menuList"></NavItem>
        </el-menu>
      </el-scrollbar>
    </el-aside>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, onUnmounted, ref } from 'vue'
import NavItem from './NavItem.vue'
import { useStore } from 'vuex'
const store = useStore()
const logo = require('@/assets/images/logo_s.png')
const menuList = computed(() => store.state.menuList)
const currentRoute = computed(() => store.state.currentRoute)

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

// 递归将多维数据转成一维数组
// const filterMenu1 = (menuList, arr = []) => {
//   menuList.forEach((item, index) => {
//     if (item.is_menu) {
//       arr.push({ id: item.id, pid: item.pid, name: item.name, label: item.label, icon: item.icon, path: item.path, children: [] })
//       if (item.children && item.children.length > 0) {
//         filterMenu1(item.children, arr)
//       }
//     }
//     return arr
//   })
// }
// 递归获取数组中的菜单
// const filterMenu = (menuList, arr = []) => {
//   menuList.forEach((item) => {
//     if (item.is_menu == 1) {
//       arr[item.id] = { id: item.id, pid: item.pid, name: item.name, label: item.label, icon: item.icon, path: item.path }
//       if (item.children && item.children.length > 0 && item.is_menu == 1) {
//         filterMenu(item.children, (arr[item.id].children = []))
//       }
//     }
//     return arr
//   })
// }
// let menu = []
// filterMenu(toRaw(menuList.value), menu)
// console.log(menu)
// // 删除数组中的空元素
// menu = menu.filter(Boolean)
// menu.filter((item) => {
//   if (item.children) item.children = item.children.filter(Boolean)
// })
</script>

<style lang="scss" scoped>
.el-aside {
  height: 100%;
  background-color: var(--color);
  transition: all 0.2s;
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    padding: 15px 0;
    cursor: pointer;
    p {
      padding-left: 12px;
      font-weight: 600;
      font-size: 20px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
</style>
