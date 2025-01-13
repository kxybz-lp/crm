<template>
  <el-upload class="upload-import" :action="action" :headers="{
      token,
    }" name="file" :before-upload="uploadBefore" :on-success="uploadSuccess"
    :on-error="uploadError">
    <el-button type="success" size="default">导入</el-button>
  </el-upload>
</template>
<script setup>
import { toast, elLoading, closeElLoading } from '@/utils/utils'
import { getToken } from '@/utils/token'
defineProps({
  action: {
    type: String,
    default: '',
  },
})
const token = getToken()
const uploadBefore = () => {
  elLoading('数据导入中...')
}

const emit = defineEmits(['success'])
const uploadSuccess = (response, uploadFile, uploadFiles) => {
  if (response.code > 0) {
    toast('数据上传成功')
    emit('success', {
      response,
      uploadFile,
      uploadFiles,
    })
  } else {
    toast(response.message, 'error')
  }
  closeElLoading()
}

const uploadError = (error, uploadFile, uploadFiles) => {
  let msg = JSON.parse(error.message).message || '上传失败'
  closeElLoading()
  toast(msg, 'error')
}
</script>
<style lang="scss" scoped>
.upload-import {
  display: inline-block;
  margin: 0 12px;
}
:deep(.el-upload-list) {
  display: none;
}
</style>
