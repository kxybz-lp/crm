<template>
  <template v-if="modelValue && preview">
    <el-image class="privew-image" v-if="typeof modelValue == 'string'" :src="modelValue"
      fit="cover"></el-image>
    <div v-else class="image-lists">
      <div class="image-list" v-for="(url, index) in modelValue" :key="index" draggable="true"
        @dragstart="dragstart(url)" @dragenter="dragenter(url)" @dragend="dragend(url)">
        <el-icon style="z-index: 10" @click="removeImage(url)">
          <Close />
        </el-icon>
        <el-image :src="url" fit="cover"></el-image>
      </div>
    </div>
  </template>

  <div v-if="preview" class="choose-image-btn" @click="open">
    <el-icon :size="25">
      <Plus />
    </el-icon>
  </div>
  <!-- destroy-on-close 每次打开弹窗重新加载数据 -->
  <el-dialog class="image-dialog" title="选择图片" v-model="dialogVisible" width="60%" top="5%">
    <el-container class="image-container" style="height: 50vh">
      <!-- <el-header class="image-header">
        <el-button color="var(--color)" size="small" @click="handleOpenCreate">新增分类</el-button>
        <el-button type="warning" size="small" @click="handleOpenUpload">图片上传</el-button>
      </el-header> -->
      <el-container style="height: calc(50vh-60px)">
        <ImageAside ref="ImageAsideRef" @change="handleAsideChange"></ImageAside>
        <ImageMain :limit="limit" openChoose ref="ImageMainRef" @choose="handleChoose"></ImageMain>
      </el-container>
    </el-container>
    <template #footer>
      <span>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref } from 'vue'
import ImageAside from '@/components/image/ImageAside.vue'
import ImageMain from '@/components/image/ImageMain.vue'
import { toast } from '@/utils/utils'

const ImageAsideRef = ref(null)
const ImageMainRef = ref(null)
// 新增图片分类,调用子类暴露的方法
const handleOpenCreate = () => ImageAsideRef.value.handleCreate()
const handleAsideChange = (class_id) => {
  ImageMainRef.value.loadData(class_id)
}
// 图片上传
const handleOpenUpload = () => ImageMainRef.value.openUploadFile()

const dialogVisible = ref(false)

const callbackFunction = ref(null)
const open = (callback = null) => {
  callbackFunction.value = callback
  dialogVisible.value = true
}
const close = () => {
  dialogVisible.value = false
  ImageMainRef.value.clearChooseImage()
}

const props = defineProps({
  modelValue: [String, Array],
  limit: {
    type: Number,
    default: 1,
  },
  preview: {
    type: Boolean,
    default: true,
  },
})
const emit = defineEmits(['update:modelValue'])

let urls = []
const handleChoose = (e) => {
  urls = e.map((o) => o.url)
}

//图片拖拽
const clickVal = ref()
const moveVal = ref()
const endVal = ref()
const dragstart = (item) => {
  clickVal.value = item
}
const dragenter = (item) => {
  moveVal.value = item
}
const dragend = (item) => {
  endVal.value = item
  let index = props.modelValue.indexOf(item) //移动元素的当前位置
  let moveObj = moveVal.value ? moveVal.value : ''
  let addIndex = props.modelValue.indexOf(moveObj) //要移动后的位置
  props.modelValue.splice(index, 1)
  props.modelValue.splice(addIndex, 0, item)
}

const submit = () => {
  let value = []
  if (props.limit == 1) {
    value = urls[0]
  } else {
    value = props.preview ? [...props.modelValue, ...urls] : [...urls]
    if (value.length > props.limit) {
      let limit = props.preview ? props.limit - props.modelValue.length : props.limit
      return toast('最多还能选择' + limit + '张')
    }
  }
  if (value && props.preview) {
    emit('update:modelValue', value)
  }
  if (!props.preview && typeof callbackFunction.value === 'function') {
    callbackFunction.value(value)
  }
  close()
}

const removeImage = (url) =>
  emit(
    'update:modelValue',
    props.modelValue.filter((u) => u != url)
  )

defineExpose({
  open,
})
</script>
<style lang="scss" scoped>
.privew-image {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  border: 1px solid #eee;
  margin-right: 10px;
}
.choose-image-btn {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  border: 1px solid #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  .el-icon {
    color: #eee;
  }
}
.image-lists {
  display: flex;
  height: 100px;
  align-items: center;
}
.image-list {
  width: 100px;
  height: 100px;
  position: relative;
  margin-right: 10px;
  overflow: hidden;
  img {
    width: 100%;
  }
  .el-icon {
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
    background-color: #fff;
    border-radius: 50%;
  }
}
.image-container {
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
