<template>
  <div class="layout-common">
    <el-container>
      <Nav v-if="!$store.state.isMobile"></Nav>
      <navm v-if="$store.state.isMobile"></navm>
      <el-container>
        <el-header class="header">
          <Header></Header>
        </el-header>
        <!-- @scroll="handleMainScroll" -->
        <el-main ref="main">
          <tagsView></tagsView>
          <!-- <router-view :key="$route.fullPath" v-if="$route.name === 'OrderEdit'"></router-view> -->
          <router-view #default="{ Component }">
            <transition name="fade">
              <keep-alive :max="10" :exclude="['GoodsEdit']">
                <component :is="Component" :key="$route.fullPath" />
              </keep-alive>
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Nav from '@/layout/nav/index.vue'
import Navm from '@/layout/navm/index.vue'
import Header from '@/layout/header/index.vue'
import tagsView from '@/layout/tags/index.vue'
// const loadMore = ref(false)
//const handleMainScroll = () => {
// setTimeout(() => {
//   let elMain = document.querySelector('.el-main')
//   if (elMain.scrollTop + elMain.clientHeight + 10 >= elMain.scrollHeight && !loadMore.value) {
//     console.log('到底了')
//     loadMore.value = true
//   }
// }, 100)
//}
</script>

<style lang="scss" scoped>
.layout-common {
  height: 100%;
  overflow: hidden;
  .el-container {
    height: 100%;
  }
  .el-header {
    background-color: #fff;
    box-sizing: border-box;
    color: #0c0c0c;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-main {
    background-color: #f0f2f5;
    overflow-y: auto;
    padding: 0;
  }
  .el-main::-webkit-scrollbar-track-piece {
    background-color: rgba(255, 255, 255, 0.6);
  }
  .el-main::-webkit-scrollbar {
    width: 5px !important;
    height: 3px;
  }
  .el-main::-webkit-scrollbar-thumb {
    background-color: #999;
    background-clip: padding-box;
    min-height: 28px;
    overflow-x: hidden;
  }
  .el-main::-webkit-scrollbar-thumb:hover {
    background-color: #000;
  }
  .fade-enter-from {
    opacity: 0;
  }
  .fade-enter-to {
    opacity: 1;
  }
  .fade-leave-from {
    opacity: 1;
  }
  .fade-leave-to {
    opacity: 0;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s;
  }
  .fade-enter-active {
    transition-delay: 0.3s;
  }
}
</style>
