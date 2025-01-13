<template>
  <div class="receive">
    <el-dialog v-model="receiveDialogVisible" title="领券记录"
      :width="$store.state.isMobile? '90%' : '60%'" :destroy-on-close="true" :show-close="true"
      :close-on-click-modal="false" @close="receiveDialogClose">
      <el-row style="margin: -20px 0 10px;">
        <el-col :span="24">
          <el-form class="search-form" :model="params" label-width="0px" size="default">
            <el-form-item label="">
              <el-input v-model="params.coupon_name" placeholder="输入优惠券名称" clearable
                @clear="getData(1)">
              </el-input>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="params.user_mobile" placeholder="会员手机号" clearable
                @clear="getData(1)">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getData(1)">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-table ref="multipleTableRef" :data="receiveList" style="width: 100%"
        :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }"
        v-loading="receiveLoading" tooltip-effect="light" :row-key="getRowKeys">
        <!-- <el-table-column type="selection" prop="user_coupon_id" width="55"
          :reserve-selection="true" /> -->
        <el-table-column label="会员信息" min-width="120">
          <template #default="scope">
            <!-- <span v-if="scope.row.user.name">{{scope.row.user.name}}|</span> -->
            <span>{{ scope.row.user.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="优惠券名称" min-width="120" />
        <!-- <el-table-column label="优惠券类型" min-width="140">
          <template #default="scope">
            <el-tag size="small" v-if="scope.row.coupon_type == 10">满减券</el-tag>
            <el-tag size="small" type="warning" v-if="scope.row.coupon_type == 20">折扣券</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="min_price" label="最低消费金额" min-width="120" />
        <el-table-column label="优惠方式" min-width="120">
          <template #default="scope">
            <span v-if="scope.row.coupon_type == 10">立减<i
                style="color: #004c59;">{{scope.row.reduce_price}}</i>元</span>
            <span v-if="scope.row.coupon_type == 20">打<i
                style="color: #004c59;">{{ scope.row.discount }}</i>折</span>
          </template>
        </el-table-column>
        <el-table-column label="有效期" min-width="120">
          <template #default="scope">
            <span v-if="scope.row.expire_type == 10">领取<i
                style="color: #004c59;">{{scope.row.expire_day}}</i>天内有效</span>
            <span
              v-if="scope.row.expire_type == 20">{{ scope.row.start_time }}-{{ scope.row.end_time }}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="create_time" label="领取时间" min-width="160" />
      </el-table>
      <el-pagination @current-change="handleReceiveCurrentChange" :current-page="params.page"
        :page-size="params.pageSize" :background="true"
        :layout="$store.state.isMobile? 'total,prev, next' : 'total,prev, pager, next'"
        :total="count" class="fenye">
      </el-pagination>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import coupon from '@/api/coupon'
import { toast } from '@/utils/utils'

const receiveLoading = ref(false)
const count = ref(0)
const receiveDialogVisible = ref(false)
const receiveList = ref([])
const params = reactive({
  page: 1,
  pageSize: 10,
  coupon_name: '',
  user_name: '',
  user_mobile: '',
})

const receiveDialogClose = () => {
  params.page = 1
  params.pageSize = 10
  params.coupon_name = ''
  receiveList.value = []
  receiveDialogVisible.value = false
}

//切换分页时保留选中项
const getRowKeys = (row) => {
  return row.user_coupon_id //行唯一标识
}

// 打开
const openReceiveDialog = (coupon_id) => {
  params.coupon_id = coupon_id
  getData(1)
  // receiveDialogVisible.value = true
}

const handleReceiveCurrentChange = (page) => {
  params.page = page
  getData(page)
}

const getData = (page = null) => {
  receiveLoading.value = true
  if (typeof page == 'number') {
    params.page = page
  }
  coupon
    .getReceive(params)
    .then((res) => {
      if (res.code > 0) {
        count.value = res.result.total
        receiveList.value = res.result.data
        if (!receiveDialogVisible.value) receiveDialogVisible.value = true
      } else {
        toast(res.message || 'Error', 'error')
      }
    })
    .finally(() => {
      receiveLoading.value = false
    })
}

defineExpose({
  openReceiveDialog,
})
</script>
<style lang="scss" scoped></style>