<template>
  <div class="app-container">
    <el-card class="admin-card" shadow="hover">
      <ListHeader :rule="{ create: 8 }" @add="handleAdd">
        <el-form class="search-form" :model="params" ref="searchRef" label-width="0px"
          size="default">
          <el-form-item label="" v-show="!$store.state.isMobile">
            <el-select v-model="params.coupon_type" placeholder="优惠券类型" clearable
              @clear="getData(1)">
              <el-option value="10" label="满减券"></el-option>
              <el-option value="20" label="折扣券"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="params.name" placeholder="输入优惠券名称" clearable @clear="getData(1)">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getData(1)">搜索</el-button>
          </el-form-item>
        </el-form>
      </ListHeader>
      <el-table ref="multipleTableRef" :data="dataList" stripe style="width: 100%"
        :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }"
        @sort-change="sortChange" @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column type="selection" prop="coupon_id" width="55"> </el-table-column>
        <el-table-column prop="coupon_id" label="优惠券ID" min-width="80"> </el-table-column>
        <el-table-column prop="name" label="优惠券名称" min-width="140"> </el-table-column>
        <el-table-column label="优惠券类型" min-width="140">
          <template #default="scope">
            <el-tag size="small" v-if="scope.row.coupon_type == 10">满减券</el-tag>
            <el-tag size="small" type="warning" v-if="scope.row.coupon_type == 20">折扣券</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="min_price" label="最低消费金额" min-width="160"> </el-table-column>
        <el-table-column prop="describe" label="优惠方式" min-width="140" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="已发放/领取数量" min-width="140">
          <template #default="scope">
            <span style="text-decoration: underline;color: #004c59;cursor: pointer;"
              @click="handleReceive(scope.row.coupon_id)">{{scope.row.receive_num}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" v-permission="32">
          <template #default="scope">
            <el-switch :modelValue="scope.row.status" :active-value="1" :inactive-value="0"
              :loading="scope.row.statusLoading"
              @change="handleSwitch($event, scope.row, 'coupon_id')" />
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" min-width="80"> </el-table-column>
        <el-table-column prop="create_time" label="添加时间" min-width="140" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template #default="scope">
            <el-button v-permission="31" size="small" type="primary"
              @click="handleEdit(scope.row, 'coupon_id')">编辑 </el-button>
            <el-button v-permission="33" size="small" type="danger"
              @click="handleDelete(scope.row.coupon_id)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" :current-page="params.page"
        :page-size="params.pageSize" :background="true"
        :layout="$store.state.isMobile? 'total,prev, next' : 'total,prev, pager, next'"
        :total="count" class="fenye">
      </el-pagination>
    </el-card>
    <FormDialog destroyOnClose :title="'优惠券' + dialogTitle" ref="formDialogRef"
      @dialogClosed="dialogClosed" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="140px" :inline="false"
        :label-position="$store.state.isMobile ? 'top' : 'right'">
        <el-form-item label="优惠券名称" prop="name">
          <el-input minlength="2" maxlength="20" show-word-limit v-model="form.name"
            :disabled="editId != 0"></el-input>
        </el-form-item>
        <!-- <el-form-item label="发送方式" prop="send_type">
          <el-radio-group v-model="form.send_type">
            <el-radio :label="10">用户领取</el-radio>
            <el-radio :label="20">自动赠送</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="优惠券类型" prop="coupon_type">
          <el-radio-group v-model="form.coupon_type">
            <el-radio :label="10">满减券</el-radio>
            <el-radio :label="20">折扣券</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="减免金额" prop="reduce_price" v-if="form.coupon_type == 10">
          <el-input type="number" v-model="form.reduce_price"></el-input>
        </el-form-item>
        <el-form-item label="折扣率" prop="discount" v-if="form.coupon_type == 20">
          <el-input type="number" v-model="form.discount">
            <template #append>%</template>
          </el-input>
          <view class="notice">折扣率范围 0-9.9，8代表打8折，0代表不折扣</view>
        </el-form-item>
        <el-form-item label="最低消费金额" prop="min_price">
          <el-input type="number" v-model="form.min_price"></el-input>
        </el-form-item>
        <el-form-item label="到期类型" prop="expire_type">
          <el-radio-group v-model="form.expire_type">
            <el-radio :label="10">领取后生效</el-radio>
            <el-radio :label="20">固定时间</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" v-if="form.expire_type == 10">
          <el-input type="number" v-model="form.expire_day">
            <template #prepend>有效期</template>
            <template #append>天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="" v-if="form.expire_type == 20">
          <el-date-picker v-model="form.betweenTime" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
            type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
            clearable />
        </el-form-item>
        <el-form-item label="适用范围" prop="apply_range">
          <el-radio-group v-model="form.apply_range">
            <el-radio :label="10">全场通用</el-radio>
            <el-radio :label="20">指定商品</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" v-if="goods_item.length > 0">
          <el-table ref="multipleTableRefs" :data="goods_item" stripe style="width: 100%"
            :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }"
            row-key="goods_id">
            <el-table-column prop="goods_id" label="商品ID" width="80" />
            <el-table-column label="商品图片" width="100">
              <template #default="scope">
                <el-image style="width: 50px; height: 50px" :src="scope.row.goods_thumb" fit="fill"
                  :initial-index="0" :preview-src-list="scope.row.imageList" preview-teleported />
              </template>
            </el-table-column>
            <el-table-column prop="goods_name" label="商品名称" min-width="140" />
            <!-- <el-table-column prop="goods_price" label="商品价格" :formatter="priceFormatter"
              min-width="100" />
            <el-table-column prop="stock_num" label="商品库存" min-width="100" /> -->
            <el-table-column label="操作" min-width="60">
              <template #default="scope">
                <el-button @click="handleDeleteRow(scope.row.goods_id)"> 删除 </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="" v-if="form.apply_range == 20">
          <el-button type="primary" @click="choose_goods">点击选择(共：<span
              style="color:#f00;padding-right: 5px;">{{ goods_item.length }}</span>个商品)</el-button>
        </el-form-item>
        <el-form-item label="发放总数量" prop="total_num">
          <el-input type="number" v-model="form.total_num" placeholder="发放的优惠券总数量，-1为不限制">
            <template #append>张</template>
          </el-input>
          <view class="notice">发放的优惠券总数量，-1为不限制</view>
        </el-form-item>
        <el-form-item label="显示状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="优惠券描述" prop="describe">
          <el-input minlength="2" maxlength="40" show-word-limit v-model="form.describe"
            :disabled="editId != 0"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input type="number" v-model="form.sort"></el-input>
        </el-form-item>
      </el-form>
    </FormDialog>
    <choose ref="chososeRef" :category="categoryList" @choose="chooseSure" />
    <receive ref="receiveRef" />
  </div>
</template>
  
  <script setup>
import { ref } from 'vue'
import FormDialog from '@/components/FormDialog.vue'
import ListHeader from '@/components/ListHeader.vue'
import choose from './components/choose.vue'
import receive from './components/receive.vue'
import coupon from '@/api/coupon'
import goods from '@/api/goods'
import { toast } from '@/utils/utils'
import { useInitTable, useInitForm } from '@/hooks/useCommon'
const { loading, count, dataList, params, getData, handleCurrentChange, handleSwitch, sortChange, handleDelete, handleSelectionChange } = useInitTable({
  api: coupon,
  params: {
    page: 1,
    pageSize: 15,
    name: '',
    coupon_type: '',
  },
  onGetListSuccess: (res) => {
    count.value = res.result.total
    dataList.value = res.result.data.map((o) => {
      // o.last_login_time = dateFormart(o.last_login_time, 'hour')
      if (o.start_time && o.end_time) {
        o.betweenTime = [o.start_time, o.end_time]
      }
      o.statusLoading = false
      return o
    })
  },
})
const { dialogTitle, formDialogRef, formRef, rules, form, editId, handleAdd, handleEdit, handleSubmit } = useInitForm({
  api: coupon,
  getData,
  form: {
    name: '',
    coupon_type: 10,
    reduce_price: 0,
    discount: 0,
    min_price: '',
    expire_type: 10,
    betweenTime: [],
    apply_range_config: [],
    expire_day: 7,
    status: 1,
    start_time: '',
    end_time: '',
    apply_range: 10,
    total_num: -1,
    describe: '',
    sort: 100,
  },
  rules: {
    name: [
      {
        required: true,
        message: '优惠券名称不能为空',
        trigger: 'blur',
      },
    ],
    coupon_type: [
      {
        required: true,
        message: '优惠券类型不能为空',
        trigger: 'blur',
      },
    ],
    reduce_price: [
      {
        required: true,
        message: '减免金额不能为空',
        trigger: 'blur',
      },
    ],
    discount: [
      {
        required: true,
        message: '折扣率不能为空',
        trigger: 'blur',
      },
    ],
    min_price: [
      {
        required: true,
        message: '最低消费金额不能为空',
        trigger: 'blur',
      },
    ],
    expire_type: [
      {
        required: true,
        message: '到期类型不能为空',
        trigger: 'blur',
      },
    ],
    apply_range: [
      {
        required: true,
        message: '适用范围不能为空',
        trigger: 'blur',
      },
    ],
    total_num: [
      {
        required: true,
        message: '发放数量不能为空',
        trigger: 'blur',
      },
    ],
    status: [
      {
        required: true,
        message: '状态不能为空',
        trigger: 'blur',
      },
    ],
  },
  fliterParam: (row) => {
    // row['store_id'] = row['store_id'].split(',').map((o) => parseInt(o))
    for (const key in form) {
      form[key] = row[key]
    }
    if (row.apply_range_config.applyGoodsIds) {
      goods_item.value = row.goods_list
    } else {
      goods_item.value = []
    }
  },
})

// 指定商品
const chososeRef = ref('')
const goods_item = ref([])
const categoryList = ref([])
const choose_goods = () => {
  chososeRef.value.openGoodsDialog(goods_item.value)
}
const chooseSure = (row) => {
  let count = row.length
  row.map((item) => {
    // if (Array.isArray(item.answer)) item.answer = item.answer.join(',')
    // item.score = count > 75 ? 1 : 2
    return item
  })
  goods_item.value = row
  form.apply_range_config.applyGoodsIds = row.map((item) => parseInt(item.goods_id))
}

const dialogClosed = () => {
  goods_item.value = []
  form.apply_range_config = []
  formRef.value.resetFields()
}

const handleDeleteRow = (goods_id) => {
  let index = goods_item.value.findIndex((item) => item.goods_id == goods_id)
  goods_item.value.splice(index, 1)
  form.apply_range_config.applyGoodsIds = goods_item.value.map((item) => parseInt(item.goods_id))
}

const receiveRef = ref('')
// 展示优惠券领取记录
const handleReceive = (coupon_id) => {
  receiveRef.value.openReceiveDialog(coupon_id)
}
// select数据
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
const priceFormatter = (row, column) => {
  return row.goods_price_min == row.goods_price_max ? row.goods_price_min : row.goods_price_min + '-' + row.goods_price_max
}
</script>
  <style lang="scss" scoped></style>
  