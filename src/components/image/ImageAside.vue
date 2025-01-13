<template>
  <el-aside width="200px" class="image-aside" v-loading="loading" style="position:relative;">
    <el-scrollbar style="padding-bottom: 30px;">
      <AsideList :active="activeId == item.id" :class_id="item.id" v-for="(item, index) in list"
        :key="index" @edit="handleEdit(item)" @delete="handleDelete(item.id)"
        @click="handleChangeActiveId(item.id)">
        {{ item.name }}
      </AsideList>
    </el-scrollbar>
    <el-button class="create-class" link type="primary" v-permission="165"
      @click="handleCreate">新增分组
    </el-button>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" @close="dialogClosed" destroy-on-close>
      <el-form :model="form" ref="formRef" :rules="rules" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="排序号" prop="sort_no">
          <el-input type="number" v-model="form.sort_no" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </el-aside>
</template>
<script setup>
import { ref, computed, reactive } from 'vue'
import image from '@/api/image'
import AsideList from './AsideList.vue'
import { showModal, toast } from '@/utils/utils'

// 加载动画
const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const list = ref([])
const editId = ref(0)
const dialogTitle = computed(() => (editId.value ? '分组修改' : '分组新增'))
const formRef = ref(null)
const form = reactive({
  name: '',
  sort_no: 100,
})
const rules = {
  name: [
    {
      required: true,
      message: '图库分类名称不能为空',
      trigger: 'blur',
    },
  ],
}
// 图库分类数据
const getClassData = () => {
  loading.value = true
  image
    .getClassList()
    .then((res) => {
      list.value = res.result
      list.value.unshift({ id: 0, name: '全部' })
    })
    .finally(() => {
      loading.value = false
    })
}

getClassData()

// 默认选中图库分类ID
const activeId = ref(0)
const emit = defineEmits(['change'])
// 切换分类
function handleChangeActiveId(id) {
  activeId.value = id
  emit('change', id)
}
// 新增
const handleCreate = () => {
  editId.value = 0
  dialogVisible.value = true
}
// 编辑分类，重要内容请求服务器获取item
const handleEdit = (item) => {
  editId.value = item.id
  form.name = item.name
  form.sort_no = item.sort_no
  dialogVisible.value = true
}
// 删除分类
const handleDelete = (id) => {
  showModal('确认要删除该数据吗？')
    .then((res) => {
      loading.value = true
      image
        .deleteClass(id)
        .then((res) => {
          if (res.code > 0) {
            toast('数据删除成功')
          } else {
            toast(res.message, 'error')
          }
          getClassData()
        })
        .finally(() => {
          loading.value = false
        })
    })
    .catch((err) => console.log(err))
  return
}

// 提交
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    submitLoading.value = true
    if (editId.value) {
      image
        .updateClass(editId.value, form)
        .then((res) => {
          if (res.code > 0) {
            toast('数据更新成功')
            dialogVisible.value = false
            getClassData()
          } else {
            toast(res.message, 'error')
          }
        })
        .finally(() => {
          dialogVisible.value = false
        })
    } else {
      image
        .createClass(form)
        .then((res) => {
          if (res.code > 0) {
            toast('数据新增成功')
            dialogVisible.value = false
            getClassData()
          } else {
            toast(res.message, 'error')
          }
        })
        .finally(() => {
          submitLoading.value = false
        })
    }
  })
}
// 弹窗关闭重置表单
const dialogClosed = () => {
  submitLoading.value = false
  // formRef.value.resetFields()
  form.name = ''
  form.sort_no = 100
}
defineExpose({
  formRef,
})
</script>
<style lang="scss" scoped>
.image-aside {
  height: 100%;
  border-right: 1px solid #eee;
  overflow-y: hidden;
}
.create-class {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  padding: 10px 0 10px 8px;
}
</style>
