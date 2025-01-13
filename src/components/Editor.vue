<template>
  <div class="publish_content">
    <!-- 查看编辑器html -->
    <!-- <div v-text="valueHtml"></div> -->
    <div style="border: 1px solid #ccc;">
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef"
        :defaultConfig="toolbarConfig" :mode="mode" />
      <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml"
        :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated"
        @onChange="handleChange" />
    </div>
    <ChooseImage :limit="9" :preview="false" ref="ChooseImageRef" />
  </div>
</template>
  <script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, ref, shallowRef, onMounted, nextTick } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { toast } from '@/utils/utils'
import ChooseImage from '@/components/ChooseImage.vue'
import axios from 'axios'

const ChooseImageRef = ref('')

const props = defineProps({
  content: String,
})

const emits = defineEmits(['getEditorContent'])
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

const mode = ref('default') // default  simple

// 内容 HTML
const valueHtml = ref('')

// 模拟 ajax 异步获取内容
onMounted(() => {
  setTimeout(() => {
    // valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
    nextTick(() => {
      // 界面节点更新完当前再批改值。
      valueHtml.value = props.content
      const editor = editorRef.value
      const config = editor.getConfig()
      const toolbar = editor.getAllMenuKeys() // 工具栏的默认配置
      // console.log(toolbar)
      // console.log(editor.getAllMenuKeys())
    })
  }, 500)
})

const toolbarConfig = {
  toolbarKeys: [
    // 菜单 key
    'headerSelect',
    'bold', // 加粗
    'italic', // 斜体
    'through', // 删除线
    'underline', // 下划线
    'bulletedList', // 无序列表
    'numberedList', // 有序列表
    'color', // 文字色彩
    'bgColor',
    'insertLink', // 插入链接
    'fontSize', // 字体大小
    'lineHeight', // 行高
    '|',
    'uploadImage', // 上传图片
    'uploadVideo',
    'delIndent', // 缩进
    'indent', // 增进
    'deleteImage', //删除图片
    'divider', // 分割线
    'insertTable', // 插入表格
    'justifyCenter', // 居中对齐
    'justifyJustify', // 两端对齐
    'justifyLeft', // 左对齐
    'justifyRight', // 右对齐
    'undo', // 撤销
    'redo', // 重做
    'clearStyle', // 革除格局
    'fullScreen', // 全屏
  ],
}
// 在指定位置插入新菜单
// toolbarConfig.insertKeys = {
//   index: 0,
//   keys: ['code'],
// }
const editorConfig = {
  placeholder: '请输入内容...',
  // autoFocus: false,
  MENU_CONF: {
    uploadImage: {
      // 自定义上传
      // async customUpload(file, insertFn) {
      //   const formData = new FormData()
      //   formData.set('file', file)
      //   // axios.defaults.headers.token = token
      //   let result = await axios.post('/order/image/upload', formData)
      //   console.log(result)
      //   if (result.status === 200 && result.data.code > 0) {
      //     insertFn(result.data.result.url)
      //   }
      // },
      // 自定义选择图片,https://www.wangeditor.com/v5/menu-config.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%8A%9F%E8%83%BD
      customBrowseAndUpload(insertFn) {
        ChooseImageRef.value.open((data) => {
          data.forEach((item) => {
            // insertFn(item)
            // let html = editorRef.value.getHtml()
            // html += '<p><img src="' + item + '" style="max-width:100%;display:block;" /></p>'
            // editorRef.value.setHtml(html)
            editorRef.value.dangerouslyInsertHtml('<p><img src="' + item + '" /></p>')
          })
        })
      },
    },
  },
}

const handleChange = (info) => {
  // info.children 数组蕴含了数据类型和内容，valueHtml.value内容的html格局
  emits('getEditorContent', info.children, valueHtml.value)
}

const destroy = () => {
  const editor = editorRef.value
  if (editor == null) return
  editor.setHtml('')
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

defineExpose({
  destroy,
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
</script>
  <style lang="scss" scoped>
.w-e-full-screen-container {
  z-index: 100;
}
.editor-content-view img {
  display: block !important;
}
:deep(.w-e-scroll) {
  height: 500px !important;
}
</style>