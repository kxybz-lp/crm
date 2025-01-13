<template>
  <div class="choose-goods">
    <el-dialog v-model="goodsDialogVisible" title="选题" :width="$store.state.isMobile? '90%' : '60%'"
      :destroy-on-close="true" :show-close="false" :close-on-click-modal="false"
      @close="dialogClose">
      <el-row style="margin: -20px 0 10px;">
        <el-col :span="6">已选中：<span
            style="color:#f00;padding-right: 5px;">{{ goodsChooseList.length }}</span>个商品</el-col>
        <el-col :span="18">
          <el-form class="search-form" :model="params" ref="searchRef" label-width="0px"
            size="default">
            <el-form-item label="" v-show="!$store.state.isMobile">
              <el-select v-model="params.category_id" placeholder="选择分类" clearable
                @clear="getGoodsData(1)">
                <el-option :value="item.id" :label="item.name" v-for="item in category"
                  :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="params.goods_name" placeholder="输入商品名称" clearable
                @clear="getGoodsData(1)">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getGoodsData(1)">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-table ref="multipleTableRefs" :data="goodsList" stripe style="width: 100%"
        :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }"
        @select="handleGoodsSelectionChange" @select-all="handleGoodsSelectionAll"
        v-loading="goodsLoading" :row-key="getRowKeys">
        <el-table-column type="selection" prop="goods_id" width="55" :reserve-selection="true" />
        <el-table-column prop="goods_id" label="商品ID" width="80" />
        <el-table-column label="商品图片" width="100">
          <template #default="scope">
            <el-image style="width: 50px; height: 50px" :src="scope.row.goods_thumb" fit="fill"
              :initial-index="0" :preview-src-list="scope.row.imageList" preview-teleported />
          </template>
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" min-width="140" />
        <el-table-column prop="goods_price" label="商品价格" :formatter="priceFormatter"
          min-width="100" />
        <el-table-column prop="stock_num" label="商品库存" min-width="100" />
        <el-table-column label="商品状态">
          <template #default="scope">
            <el-switch :modelValue="scope.row.goods_status" :active-value="10" :inactive-value="20"
              inline-prompt active-text="上架" inactive-text="下架" />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleGoodsCurrentChange" :current-page="params.page"
        :page-size="params.pageSize" :background="true"
        :layout="$store.state.isMobile? 'total,prev, next' : 'total,prev, pager, next'"
        :total="count" class="fenye">
      </el-pagination>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClose"> 取消 </el-button>
          <el-button type="primary" @click="handleChooseGoods"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
  <script setup>
import goods from '@/api/goods'
import { toast } from '@/utils/utils'
import { ref, reactive, nextTick } from 'vue'
const goodsChooseList = ref([])
// const categoryList = ref([])
const prop = defineProps({
  category: {
    type: Array,
    default: [],
  },
})
//手动选择商品
const multipleTableRefs = ref('')
const goodsLoading = ref(false)
const goodsDialogVisible = ref(false)
const goodsList = ref([])
const goods_item = ref([])
const count = ref(0)
const params = reactive({
  page: 1,
  pageSize: 5,
  goods_name: '',
  category_id: '',
  tab: 'all',
})

//切换分页时保留选中项
const getRowKeys = (row) => {
  return row.goods_id //行唯一标识
}

const dialogClose = () => {
  goodsChooseList.value = []
  goodsList.value = []
  goods_item.value = []
  goodsDialogVisible.value = false
}

const handleGoodsCurrentChange = (page) => {
  params.page = page
  getGoodsData(page)
}
const emit = defineEmits(['choose'])

// 多选选中ID
const handleGoodsSelectionChange = (selection, row) => {
  let index = goodsChooseList.value.findIndex((item) => item.goods_id == row.goods_id)
  if (index == -1) {
    goodsChooseList.value.push(row)
  } else {
    goodsChooseList.value.splice(index, 1)
  }
  emit('choose', goodsChooseList.value)
}

// 全选
const handleGoodsSelectionAll = (selection) => {
  if (selection.length == 0) {
    goodsList.value.forEach((row) => {
      let index = goodsChooseList.value.findIndex((item) => item.goods_id == row.goods_id)
      if (index != -1) goodsChooseList.value.splice(index, 1)
    })
  } else {
    goodsList.value.forEach((row) => {
      let index = goodsChooseList.value.findIndex((item) => item.goods_id == row.goods_id)
      if (index == -1) goodsChooseList.value.push(row)
    })
  }
}

const getGoodsData = (page = null) => {
  goodsLoading.value = true
  if (typeof page == 'number') {
    params.page = page
  }
  goods
    .getList(params)
    .then((res) => {
      if (res.code > 0) {
        count.value = res.result.total
        goodsList.value = res.result.data
        nextTick(() => {
          // toggleRowSelection第二个参数true表示勾选，不写则是切换勾选
          goodsList.value.forEach((row) => {
            if (goodsChooseList.value.find((item) => item.id == row.id)) multipleTableRefs.value.toggleRowSelection(row, true)
          })
        })
      } else {
        toast(res.message || 'Error', 'error')
      }
    })
    .finally(() => {
      goodsLoading.value = false
    })
}

const priceFormatter = (row, column) => {
  return row.goods_price_min == row.goods_price_max ? row.goods_price_min : row.goods_price_min + '-' + row.goods_price_max
}

// 打开
const openGoodsDialog = (goods_item) => {
  goodsChooseList.value = goods_item
  getGoodsData(1)
  goodsDialogVisible.value = true
}

// 确认选择
const handleChooseGoods = (goods_ids) => {
  // if (goodsChooseList.value.length == 0) {
  //   toast('请选择试题', 'error')
  //   return
  // }
  // emit('choose', goodsChooseList.value)
  goodsDialogVisible.value = false
}

defineExpose({
  openGoodsDialog,
})
</script>
  <style lang="scss" scoped></style>