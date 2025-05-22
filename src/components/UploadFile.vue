<template>
  <el-upload :action="uploadImageAction" multiple :before-upload="beforeUpload" :headers="{
      token,
    }" name="file" :data="data" :on-success="uploadSuccess" :on-error="uploadError">
    <el-button>
      上传
      <el-icon class="el-icon--right" style="margin-left: 6px;">
        <Upload />
      </el-icon>
    </el-button>
  </el-upload>
</template>
<script setup>
import image from '@/api/image'
import { getToken } from '@/utils/token'
import { toast } from '@/utils/utils'
const token = getToken()
// const uploadImageAction = image.uploadImageAction() //报错405
const uploadImageAction = 'https://api.xydec.com.cn/crm/image/upload'
defineProps({
  data: Object,
})

const beforeUpload = (file) => {
  return new Promise((resolve, reject) => {
    // 检查文件大小
    const maxSize = 2 * 1024 * 1024 // 2MB = (1024 * 1024 * 2) = 2097152 字节
    if (file.size > maxSize) {
      toast('文件大小不能超过 2MB!', 'error')
      reject(false)
      return false
    }
    // 创建一个Image对象来读取图片
    const image = new Image()
    image.onload = () => {
      // 检查图片的宽度和高度
      const maxWidth = 1000
      const maxHeight = 1000
      if (image.width > maxWidth || image.height > maxHeight) {
        toast('图片宽度和高度不能大于 1000px!', 'error')
        reject(false)
      }
      resolve(file)
    }

    // 读取图片
    image.src = URL.createObjectURL(file)

    image.onerror = () => {
      toast('文件不是有效的图片格式!', 'error')
      reject(false)
    }
  })
}

const emit = defineEmits(['success'])

const uploadSuccess = (response, uploadFile, uploadFiles) => {
  emit('success', {
    response,
    uploadFile,
    uploadFiles,
  })
}

const uploadError = (error, uploadFile, uploadFiles) => {
  let msg = JSON.parse(error.message).message || '上传失败'
  toast(msg, 'error')
}
</script>
<style lang="scss" scoped>
:deep(.el-upload-list) {
  display: none;
}
</style>
