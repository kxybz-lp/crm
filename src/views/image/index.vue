<template>
  <el-container class="image-container" :style="{ height: h + 'px' }">
    <ImageAside ref="ImageAsideRef" @change="handleAsideChange"></ImageAside>
    <ImageMain ref="ImageMainRef"></ImageMain>
  </el-container>
</template>
<script setup>
import ImageAside from '@/components/image/ImageAside.vue'
import ImageMain from '@/components/image/ImageMain.vue'
import { ref } from 'vue'
// 设置组件全屏高度
const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 60 - 25 - 30
const vh = h - 60
const ImageAsideRef = ref(null)
const ImageMainRef = ref(null)
const handleAsideChange = (class_id) => {
  ImageMainRef.value.loadData(class_id)
}
// 图片上传
const handleOpenUpload = () => ImageMainRef.value.openUploadFile()
</script>
<style lang="scss" scoped>
.image-container {
  margin: 15px;
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
  .image-header {
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
  }
}
</style>
