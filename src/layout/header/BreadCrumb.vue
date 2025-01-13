<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
      <span class="no-redirect"
        v-if="index === breadcrumbList.length - 1">{{ item.meta.title }}</span>
      <span class="redirect" v-else @click="handleRedirect(item.path)">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()
const store = useStore()
//当前路由的完整路径,嵌套路由
//console.log(route.matched)
const breadcrumbList = ref([])
const initBreadcrumbList = () => {
  const routes = route.matched
  breadcrumbList.value = routes
}
const handleRedirect = (path) => {
  return false
  if (path) {
    router.push(path)
    store.commit('switchCurrentRoute', path)
  }
}
watch(
  route,
  () => {
    initBreadcrumbList()
  },
  { deep: true, immediate: true }
)
</script>

<style lang="scss" scoped></style>
