<template>
  <el-dialog class="diaolog-form" v-model="showFormDialog" :title="title"
    :width="$store.state.isMobile? '90%' : width" :destroy-on-close="destroyOnClose"
    @closed="dialogClosed" :close-on-click-modal="false">
    <el-scrollbar>
      <div :class="$store.state.isMobile ? 'dialog-container' : 'dialog-container-p'">
        <slot></slot>
      </div>
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeFormDialog">取消</el-button>
        <el-button style="margin-left:15px;" type="primary" @click="submit" :loading="loading">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
  <script setup>
import { ref } from 'vue'

const props = defineProps({
  title: String,
  width: {
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
const showFormDialog = ref(false)
const loading = ref(false)
const showLoading = () => (loading.value = true)
const hideLoading = () => (loading.value = false)

// 打开
const openFormDialog = () => (showFormDialog.value = true)

// 关闭
const closeFormDialog = () => (showFormDialog.value = false)

// 提交
const emit = defineEmits(['submit', 'dialogClosed'])
const submit = () => emit('submit')
const dialogClosed = () => emit('dialogClosed')
defineExpose({
  openFormDialog,
  closeFormDialog,
  showLoading,
  hideLoading,
})
</script>
<style lang="scss">
.diaolog-form .el-dialog__header {
  padding-bottom: 16px;
  border-bottom: 1px solid #f5f5f5;
}
.diaolog-form .el-dialog__footer {
  padding-top: 20px;
  border-top: 1px solid #f5f5f5 !important;
  box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, 0.04), 0px 8px 20px rgba(0, 0, 0, 0.08);
}
.diaolog-form .el-dialog__body {
  height: 50vh;
}
.diaolog-form .dialog-container {
  width: 100%;
}
.diaolog-form .dialog-container-p {
  width: calc(100% - 60px);
}
.diaolog-form label {
  font-weight: 100;
  color: #000;
}
</style>