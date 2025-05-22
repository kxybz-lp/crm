<template>
  <div class="app-container">
    <el-card class="goods-card" shadow="hover">
      <el-tabs v-model="params.tab" @tab-change="getData(1)" v-permission="156">
        <el-tab-pane :label="item.name" :name="item.key" v-for="item in tabbars" :key="item.key" />
      </el-tabs>
      <ListHeader :rule="{ create: 157, move2: 179 }" @add="handleAdd" @move="handMove">
        <el-form class="search-form" :model="params" ref="searchRef" label-width="0px"
          size="default">
          <el-form-item label="">
            <el-input v-model="params.goods_name" placeholder="输入商品名" clearable @clear="getData(1)">
            </el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="params.category_id" placeholder="选择商品分类" filterable clearable
              @clear="getData(1)">
              <el-option :value="item.id" :label="item.name" v-for="item in categoryList"
                :key="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getData(1)">搜索</el-button>
          </el-form-item>
        </el-form>
      </ListHeader>
      <el-table ref="multipleTableRef" :data="dataList" style="width: 100%"
        :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }"
        @sort-change="sortChange" @selection-change="handleSelectionChange" v-loading="loading"
        :element-loading-text="loadingText" tooltip-effect="light">
        <el-table-column type="selection" prop="goods_id" width="55" />
        <el-table-column prop="goods_id" label="商品ID" width="80" />
        <el-table-column label="商品图片" width="100">
          <template #default="scope">
            <el-image style="width: 50px; height: 50px" :src="scope.row.goods_thumb" fit="fill"
              :initial-index="0" :preview-src-list="scope.row.imageList" preview-teleported />
          </template>
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="goods_price" :formatter="priceFormatter" label="商品价格" sortable
          min-width="140" />
        <el-table-column prop="sales_actual" label="商品销量" min-width="100" />
        <el-table-column prop="stock_num" label="商品总库存" min-width="100" />
        <el-table-column label="商品状态" v-permission="158">
          <template #default="scope">
            <el-switch :modelValue="scope.row.goods_status" :active-value="10" :inactive-value="20"
              inline-prompt active-text="上架" inactive-text="下架" :loading="scope.row.statusLoading"
              @change="handleSwitch($event, scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="goods_sort" label="排序" width="100" />
        <el-table-column prop="create_time" label="添加时间" min-width="140" show-overflow-tooltip />
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <el-button v-permission="180" v-if="params.tab !== 'recyc'" size="small" type="warning"
              @click="handlEwm(scope.row.goods_id)"> 生成二维码 </el-button>
            <el-button v-permission="158" v-if="params.tab !== 'recyc'" size="small" type="primary"
              @click="$router.push('/goods/edit/' + scope.row.goods_id)">
              编辑 </el-button>
            <el-button v-permission="180" v-if="params.tab !== 'recyc'" size="small" type="danger"
              @click="handleDelete(scope.row.goods_id)"> 删除 </el-button>
            <el-button v-if="params.tab == 'recyc'" v-permission="181" size="small" type="success"
              @click="handleResave(scope.row.goods_id)">恢复 </el-button>
            <el-button v-if="params.tab == 'recyc'" v-permission="182" size="small" type="danger"
              @click="handleDel(scope.row.goods_id)"> 彻底删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="params.page" v-model:page-size="params.pageSize"
        :page-sizes="[10, 50, 100, 200]" :background="true"
        layout="total, sizes, prev, pager, next,slot, jumper" :total="count"
        @current-change="handleCurrentChange" @size-change="handleSizeChange" />
    </el-card>
    <el-dialog v-model="dialogMoveVisible" destroy-on-close title="批量操作" width="60%"
      @close="moveDialogClose">
      <div class="main">
        <el-form :model="moveForm" ref="moveFormRef" label-width="80px">
          <el-form-item label="分类" prop="category_id" v-if="moveTab == 1">
            <el-select v-model="moveForm.category_id" placeholder="选择商品分类" filterable clearable
              @clear="getData(1)">
              <el-option :value="item.id" :label="item.name" v-for="item in categoryList"
                :key="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogMoveVisible = false"> 取消 </el-button>
          <el-button type="primary" @click="moveSubmit" :loading="loading"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 图片预览 -->
    <div class="goods-image__preview">
      <!-- <el-image ref="imageRef" style="width: 100px; height: 100px" :src="url" :zoom-rate="1.2"
        :max-scale="7" :min-scale="0.2" :preview-src-list="srcList" show-progress :initial-index="0"
        fit="cover" /> -->
      <el-image-viewer v-if="showPreview" :url-list="srcList" :initial-index="0"
        @close="hidePreview" />
    </div>
  </div>
</template>
  <script setup>
import ListHeader from '@/components/ListHeader.vue'
import { ref, reactive, watch } from 'vue'
import goods from '@/api/goods'
import { toast } from '@/utils/utils'
import { useInitTable, useInitForm } from '@/hooks/useCommon'
import { useRoute } from 'vue-router'
const route = useRoute()
let sale__out = null
if (route.query.sale_out) {
  sale__out = route.query.sale_out
}
const {
  loading,
  count,
  dataList,
  params,
  getData,
  handleCurrentChange,
  handleSizeChange,
  sortChange,
  handleDelete,
  handleSelectionChange,
  multipleTableRef,
  multiSelectionIds,
  handleResave,
  handleDel,
} = useInitTable({
  api: goods,
  params: {
    page: 1,
    pageSize: 10,
    goods_name: '',
    category_id: '',
    sale_out: sale__out,
    tab: 'all',
  },
  onGetListSuccess: (res) => {
    count.value = res.result.total
    dataList.value = res.result.data.map((item) => {
      item.statusLoading = false
      item.imageList = item.image.map((item) => item.path)
      return item
    })
  },
})

const { editId, formDrawerRef, formRef, form, handleAdd, handleEdit, handleSubmit, drawerClosed } = useInitForm({
  api: goods,
  getData,
  form: {
    goods_name: '',
  },
})
const priceFormatter = (row, column) => {
  return row.goods_price_min == row.goods_price_max ? row.goods_price_min : row.goods_price_min + '-' + row.goods_price_max
}

// 批量操作
const dialogMoveVisible = ref(false)
const moveFormRef = ref(false)
const moveTab = ref(1)
const moveForm = reactive({
  category_id: '',
  goods_status: '',
  is_delete: '',
})
const handMove = (e) => {
  moveTab.value = e
  if (multiSelectionIds.value.length == 0) {
    toast('请选择需要操作的数据', 'error')
    return
  }
  // 分类
  if (e == 1) {
    dialogMoveVisible.value = true
  } else {
    // 下架
    if (e == 2) moveForm.goods_status = 20
    if (e == 3) moveForm.goods_status = 10
    if (e == 8) moveForm.is_delete = 1
    loading.value = true
    goods
      .move({ ids: multiSelectionIds.value, data: moveForm })
      .then((res) => {
        if (res.code > 0) {
          toast('数据操作成功')
          dialogMoveVisible.value = false
          moveDialogClose()
          getData()
        } else {
          toast(res.message || 'error', 'error')
          return false
        }
      })
      .finally(() => {
        loading.value = false
      })
  }
}
const moveDialogClose = () => {
  moveForm.category_id = ''
  moveForm.is_delete = ''
  moveForm.goods_status = ''
}
// 提交
const moveSubmit = () => {
  if (moveTab.value == 1 && !moveForm.category_id) {
    toast('请选择分类', 'error')
    return
  }

  loading.value = true
  goods
    .move({ ids: multiSelectionIds.value, data: moveForm })
    .then((res) => {
      if (res.code > 0) {
        toast('数据操作成功')
        dialogMoveVisible.value = false
        getData()
      } else {
        toast(res.message || 'error', 'error')
        return false
      }
    })
    .finally(() => {
      loading.value = false
    })
}

// select数据
const categoryList = ref([])
goods.getSelect().then((res) => {
  if (res.code > 0) {
    // categoryList.value = res.result.category
    let category = []
    res.result.category.forEach((item) => {
      // |-----
      categoryList.value.push({ id: item.id, name: '|-----' + item.name })
      if (item.children) {
        item.children.forEach((itm) => {
          categoryList.value.push({ id: itm.id, name: '|-----|-----' + itm.name })
        })
      }
    })
  } else {
    toast(res.message || 'Error', 'error')
  }
})

// tabs切换
const tabbars = [
  {
    key: 'all',
    name: '全部',
  },
  {
    key: 'on_sale',
    name: '出售中',
  },
  {
    key: 'off_sale',
    name: '已下架',
  },
  {
    key: 'recyc',
    name: '回收站中的商品',
  },
]

watch(
  route,
  () => {
    if (route.query.reload) {
      if (route.query.page) {
        getData(params.page)
      } else {
        getData()
      }
    }
  },
  { deep: true, immediate: true }
)
// 上架/下架
const handleSwitch = (val, row) => {
  row.statusLoading = true
  goods
    .status({ goods_id: row.goods_id, goods_status: val })
    .then((res) => {
      if (res.code > 0) {
        toast('数据更新成功')
        row.goods_status = val
      } else {
        toast(res.message, 'error')
      }
    })
    .finally(() => {
      row.statusLoading = false
    })
}
// 生成二维码
// const srcList = ref([])
// const url = 'https://xystcdn.xydec.com.cn/uploads/ewm/goods/goods_14.jpg'
const loadingText = ref('数据加载中...')
const srcList = ref([])
const showPreview = ref(false)
const handlEwm = (goods_id) => {
  loading.value = true
  goods
    .ewm({ goods_id })
    .then((res) => {
      if (res.code > 0) {
        srcList.value.push(res.result.path)
        toast('二维码生成成功')
        showPreview.value = true
      } else {
        toast(res.message, 'error')
      }
    })
    .finally(() => {
      loading.value = false
    })
}
const hidePreview = () => {
  srcList.value = []
  showPreview.value = false
}
</script>
<style lang="scss" scoped>
.goods-image__error .image-slot {
  font-size: 30px;
}
.goods-image__error .image-slot .el-icon {
  font-size: 30px;
}
.goods-image__error .el-image {
  width: 100%;
  height: 200px;
}
:deep(.el-image-viewer__canvas) img {
  width: 400px;
}
</style>