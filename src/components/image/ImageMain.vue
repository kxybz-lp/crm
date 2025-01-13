<template>
  <el-main class="image-main" v-loading="loading">
    <div class="images-tool">
      <div class="tool">
        <el-button type="warning" @click="handleEdit" v-permission="161">移动至</el-button>
        <el-button type="danger" plain @click="handleDelete" v-permission="163">删除</el-button>
      </div>
      <UploadFile v-permission="162" :data="{ class_id: params.class_id }"
        @success="handleUploadSuccess" />
    </div>
    <div class="image-lists">
      <el-scrollbar>
        <el-empty description="暂无图片" v-if="!imageList.length" />
        <el-row :gutter="10">
          <el-col :sm="12" :md="6" :offset="0" v-for="item in imageList" :key="item.id"
            style="margin-bottom: 15px">
            <el-card class="img-item" shadow="hover" :body-style="{ padding: 0 }"
              :class="item.checked ? 'checked' : ''" @click="handleChooseChange(item)">
              <div class="img">
                <el-image :src="item.url" fit="cover" style="width: 100%; height: 100px"></el-image>
              </div>
              <div class="title">{{ item.name }}</div>
              <div class="mask" v-if="item.checked">
                <el-icon>
                  <Check />
                </el-icon>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
    <div class="image-page">
      <el-pagination background layout="prev, pager, next" :total="count"
        :current-page="params.page" :page-size="params.pageSize" @current-change="getData" />
    </div>
    <el-dialog title="移动" v-model="dialogVisible" @close="dialogClosed" destroy-on-close>
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="所属分组" prop="form.class_id">
          <el-select style="width: 100%" v-model="form.class_id" placeholder="请选择">
            <el-option :value="item.id" :label="item.name" v-for="item in classList" :key="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </el-main>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'
import { toast, showModal } from '@/utils/utils'
import image from '@/api/image'
const loading = ref(false)
const imageList = ref([])
const formRef = ref()
const submitLoading = ref(false)
const dialogVisible = ref(false)
const classList = ref([])
const image_id = ref(0)
const count = ref(0)
const params = reactive({
  page: 1,
  pageSize: 12,
  class_id: 0,
})
const form = reactive({
  class_id: '',
})
const props = defineProps({
  openChoose: {
    type: Boolean,
    default: false,
  },
  limit: {
    type: Number,
    default: 100,
  },
})

// 选中的图片
const emit = defineEmits(['choose'])
const checkedImage = computed(() => imageList.value.filter((o) => o.checked))
const handleChooseChange = (item) => {
  item.checked = !item.checked
  if (checkedImage.value.length > props.limit) {
    item.checked = false
    return toast(`最多只能选中${props.limit}张`, 'error')
  }
  emit('choose', checkedImage.value)
}
getData()
// 获取数据
function getData(p = null) {
  if (typeof p == 'number') {
    params.page = p
  }

  loading.value = true
  image
    .getList(params)
    .then((res) => {
      if (res.code > 0) {
        count.value = res.result.total
        imageList.value = res.result.data.map((o) => {
          o.checked = false
          return o
        })
      } else {
        toast(res.message || 'Error', 'error')
      }
    })
    .finally(() => {
      loading.value = false
    })
}
// 根据分类ID重新加载图片列表
const loadData = (id) => {
  params.page = 1
  params.class_id = id
  getData()
}
const rules = {
  class_id: [
    {
      required: true,
      message: '图库分组不能为空',
      trigger: 'blur',
    },
  ],
}

// 设置分类
const handleEdit = () => {
  if (checkedImage.value.length === 0) {
    toast('请选择需要移动的数据', 'error')
    return
  }
  image.getClassList().then((res) => {
    classList.value = res.result
    dialogVisible.value = true
  })
}
// 删除
const handleDelete = () => {
  if (checkedImage.value.length === 0) {
    toast('请选择需要删除的数据', 'error')
    return
  }

  showModal('确认要删除该数据吗？')
    .then((res) => {
      loading.value = true
      let ids = checkedImage.value.map((item) => item.id)
      image
        .remove(ids)
        .then((res) => {
          if (res.code > 0) {
            toast('数据删除成功')
            getData()
          } else {
            toast(res.message, 'error')
          }
        })
        .finally(() => {
          loading.value = true
        })
    })
    .catch((err) => console.log(err))
}
// 图片上传成功回调
const handleUploadSuccess = (res) => {
  if (res.response.code > 0) {
    toast('图片上传成功')
    getData(1)
  } else {
    toast(res.response.message, 'error')
    return
  }
}
// 提交
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    if (!form.class_id) {
      toast('请选择分组', 'error')
      return
    }
    dialogVisible.value = true
    let ids = checkedImage.value.map((item) => item.id)
    form.ids = ids
    image
      .move(form)
      .then((res) => {
        if (res.code > 0) {
          toast('数据移动成功')
          dialogVisible.value = false
          getData()
        } else {
          toast(res.message, 'error')
        }
      })
      .finally(() => {
        dialogVisible.value = false
      })
  })
}
// 弹窗关闭重置表单
const dialogClosed = () => {
  form.class_id = ''
}
// 清空选中
const clearChooseImage = () => {
  imageList.value.forEach((item) => {
    item.checked = false
  })
}

defineExpose({
  loadData,
  clearChooseImage,
})
</script>
<style lang="scss" scoped>
.image-main {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .image-lists {
    flex: 1;
    overflow: hidden;
    .checked {
      border: 1px solid var(--color);
    }
    .img-item {
      padding: 3px;
      position: relative;
    }
    .img-item:hover {
      border: 1px solid var(--color);
    }
    .mask {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba($color: #000000, $alpha: 0.5);
    }
    .mask .el-icon {
      font-size: 30px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
    }
    .img {
      height: 100px;
      overflow: hidden;
      position: relative;
    }
    .title {
      color: #999;
      font-size: 12px;
      text-align: center;
      padding: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px 0;
      .el-button {
        margin-left: 0 !important;
      }
    }
  }
  .image-page {
    height: 50px;
  }
}
.el-button.is-text:hover {
  color: #036879;
}
.images-tool {
  height: 40px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>
