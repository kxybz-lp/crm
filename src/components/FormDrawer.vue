<!-- 全局抽屉组件 -->
<template>
  <el-drawer v-model="showDrawer" :title="title" :size="$store.state.isMobile? '100%' : size"
    :close-on-click-modal="false" :destroy-on-close="destroyOnClose" @closed="drawerClosed">
    <div class="formDrawer">
      <div class="body">
        <slot></slot>
      </div>
      <div class="actions">
        <el-button type="primary" color="#004c59" @click="submit" :loading="loading">
          {{ confirmText }}</el-button>
        <el-button type="default" @click="closeDrawer">取消</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: String,
  size: {
    type: String,
    default: '45%',
  },
  // 关闭后清空组件
  destroyOnClose: {
    type: Boolean,
    default: false,
  },
  confirmText: {
    type: String,
    default: '提交',
  },
})

const showDrawer = ref(false)
const loading = ref(false)
const showLoading = () => (loading.value = true)
const hideLoading = () => (loading.value = false)

// 打开
const openDrawer = () => (showDrawer.value = true)

// 关闭
const closeDrawer = () => (showDrawer.value = false)

// 提交
const emit = defineEmits(['submit', 'drawerClosed'])
const submit = () => emit('submit')
const drawerClosed = () => emit('drawerClosed')

defineExpose({
  openDrawer,
  closeDrawer,
  showLoading,
  hideLoading,
})
</script>
<style lang="scss" scoped>
.formDrawer {
  width: 100%;
  height: 100%;
  padding: 15px;
  position: relative;
  display: flex;
  flex-direction: column;
}
.formDrawer .body {
  flex: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  overflow-y: auto;
}
.formDrawer .actions {
  height: 40px;
  margin-top: auto;
  display: flex;
  align-items: center;
}
.actions :deep(.el-icon) {
  color: #fff;
}
.formDrawer :deep(.body) {
  padding: 15px;
}
</style>
