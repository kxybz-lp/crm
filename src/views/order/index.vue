<template>
  <div class="app-container">
    <el-card class="admin-card" shadow="hover">
      <el-form class="search-more" :model="params" ref="searchMoreRef" size="default"
        label-width="68px" v-if="showSearch"
        :label-position="$store.state.isMobile ? 'top' : 'left'">
        <el-row :gutter="20">
          <el-col :md="6" :offset="0">
            <el-form-item label="关键词">
              <el-input v-model="params.keywords" style="max-width: 600px" placeholder="请输入关键词"
                class="input-with-select">
                <template #prepend>
                  <el-select v-model="params.keywords_type" placeholder="Select"
                    style="width: 115px">
                    <el-option label="订单号" :value="1" />
                    <el-option label="会员电话" :value="2" />
                    <el-option label="会员ID" :value="3" />
                    <el-option label="收货人姓名" :value="4" />
                    <el-option label="收货人电话" :value="5" />
                    <!-- <el-option label="商品名称" :value="6" /> -->
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="6" :offset="0">
            <el-form-item label="订单状态">
              <el-select v-model="params.order_type" placeholder="选择订单状态" clearable
                @clear="getData(1)">
                <el-option value="delivery" label="待发货"></el-option>
                <el-option value="receipt" label="待收货"></el-option>
                <el-option value="pay" label="待付款"></el-option>
                <el-option value="complete" label="已完成"></el-option>
                <el-option value="apply-cancel" label="待取消"></el-option>
                <el-option value="cancel" label="已取消"></el-option>
                <!-- <el-option value="receipt" label="售后管理"></el-option> -->
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :md="6" :offset="0">
            <el-form-item label="支付状态">
              <el-select v-model="params.pay_status" placeholder="选择订单状态" clearable
                @clear="getData(1)">
                <el-option value="10" label="未付款"></el-option>
                <el-option value="20" label="已付款"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="6" :offset="0">
            <el-form-item label="发货状态">
              <el-select v-model="params.delivery_status" placeholder="选择发货状态" clearable
                @clear="getData(1)">
                <el-option value="10" label="未发货"></el-option>
                <el-option value="20" label="已发货"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :md="6" :offset="0">
            <el-form-item label="下单时间">
              <template v-if="!$store.state.isMobile">
                <el-date-picker style="width: 45%" v-model="params.create_time"
                  value-format="YYYY-MM-DD HH:mm:ss" :editable="false" type="datetimerange"
                  range-separator="至" clearable start-placeholder="开始时间" end-placeholder="结束时间" />
              </template>
              <template v-else>
                <el-date-picker style="width: 100%;margin-bottom: 10px;"
                  v-model="params.create_time_start" type="datetime" placeholder="开始时间"
                  format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" :editable="false"
                  clearable />
                <el-date-picker style="width: 100%" v-model="params.create_time_end" type="datetime"
                  placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"
                  :editable="false" clearable />
              </template>
            </el-form-item>
          </el-col>
          <el-col :md="6" :offset="0">
            <el-form-item label="收货公司">
              <el-select v-model="params.store_id" placeholder="选择收货公司" filterable clearable
                @clear="getData(1)">
                <el-option :value="item.id" :label="item.name" v-for="item in storeList"
                  :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <!-- <el-col :md="6" :offset="0">
            <el-form-item label="收货状态">
              <el-select v-model="params.receipt_status" placeholder="选择收货状态" clearable
                @clear="getData(1)">
                <el-option value="10" label="未收货"></el-option>
                <el-option value="20" label="已收货"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->

        </el-row>
        <el-row :gutter="2">
          <el-col :span="24" :offset="0">
            <el-form-item label="">
              <el-button type="primary" @click="getData(1)">搜索</el-button>
              <el-button @click="resetFrom">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <ListHeader ref="headerRef" :rule="{ export: 194 }" @add="handleAdd" @export="exportExcel">
        <el-form class="search-form" :model="params" ref="searchRef" label-width="0px"
          size="default">
          <el-form-item label="" v-show="!showSearch && !$store.state.isMobile">
            <el-input v-model="params.order_no" placeholder="输入订单号" clearable @clear="getData(1)">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-show="!showSearch && !$store.state.isMobile" type="primary"
              @click="getData(1)">搜索</el-button>
            <el-button v-permission="193" type="primary" text @click="showSearch = !showSearch">
              {{ showSearch ? '收起' : '展开搜索' }}
              <el-icon>
                <ArrowUp v-if="showSearch" />
                <ArrowDown v-else />
              </el-icon>
            </el-button>
          </el-form-item>
        </el-form>
      </ListHeader>
      <el-table ref="multipleTableRef" :data="dataList" stripe style="width: 100%"
        tooltip-effect="light" :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }"
        @sort-change="sortChange" @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column type="selection" prop="order_id" width="55" />
        <!-- <el-table-column prop="order_id" width="180" show-overflow-tooltip label="订单号" /> -->
        <el-table-column prop="order_no" width="180" show-overflow-tooltip label="订单编号" />
        <el-table-column label="商品信息" width="360">
          <template #default="scope">
            <el-row v-for="item in scope.row.goods" :key="item.order_goods_id" align="middle"
              :gutter="30">
              <el-col :span="5">
                <el-image style="width: 60px; height: 60px" :src="item.goods_thumb" />
              </el-col>
              <el-col :span="19">
                <el-row style="overflow: hidden;"><span
                    style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{ item.goods_name }}</span></el-row>
                <el-row>
                  <span style="color:#999" v-for="itm in item.goods_props"
                    :key="itm.id">{{ itm.value.name }}</span>
                </el-row>
                <el-row>
                  <span style="padding-right: 10px;">{{ item.goods_price }}</span>
                  <span style="color:#999">X{{ item.total_num }}</span>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="user_mobile" show-overflow-tooltip label="用户信息">
          <template #default="scope">
            <el-row style="margin-bottom: 10px;"><span>{{ scope.row.user_name }}</span></el-row>
            <el-row><span>{{ scope.row.user_mobile }}</span></el-row>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="total_price" show-overflow-tooltip label="订单金额" /> -->
        <el-table-column prop="pay_price" show-overflow-tooltip label="实付款" />
        <el-table-column sortable label="交易状态">
          <template #default="scope">
            <el-row style="margin-bottom: 10px;">
              <el-tag size="small" type="success" v-if="scope.row.pay_status == 20">已支付</el-tag>
              <el-tag size="small" type="danger" v-if="scope.row.pay_status == 10">待支付</el-tag>
            </el-row>
            <el-row style="margin-bottom: 10px;">
              <el-tag size="small" type="success"
                v-if="scope.row.delivery_status == 20">已发货</el-tag>
              <el-tag size="small" type="danger" v-if="scope.row.delivery_status == 10">待发货</el-tag>
              <el-tag size="small" type="warning"
                v-if="scope.row.delivery_status == 30">部分发货</el-tag>
            </el-row>
            <el-row>
              <el-tag size="small" type="success" v-if="scope.row.receipt_status == 20">已收货</el-tag>
              <el-tag size="small" type="info" v-if="scope.row.receipt_status == 10">待收货</el-tag>
            </el-row>
            <el-row style="margin-top: 10px;">
              <el-tag size="small" type="danger" v-if="scope.row.order_status == 20">已取消</el-tag>
              <el-tag size="small" type="danger" v-if="scope.row.order_status == 21">申请取消</el-tag>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" show-overflow-tooltip label="下单时间" />
        <el-table-column label="操作" fixed="right" width="240">
          <template #default="scope">
            <el-button size="small" type="success" v-permission="170"
              @click="handleDetail(scope.row.order_id)">
              详情 </el-button>
            <el-button v-permission="171"
              v-if="scope.row.pay_status == 20 && scope.row.delivery_status != 20 && scope.row.order_status == 10"
              size="small" type="danger" @click="handleDeliver2(scope.row)"> 发货 </el-button>
            <el-button v-permission="171"
              v-if="scope.row.pay_status == 20 && scope.row.delivery_status == 10 && scope.row.order_status == 21"
              size="small" type="warning" @click="handleCancel(scope.row)"> 审核取消
            </el-button>
            <el-dropdown v-permission="173">
              <el-button type="primary" size="small" style="color: #fff">
                更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <!-- <el-dropdown-item>小票打印</el-dropdown-item> -->
                  <!-- <el-dropdown-item>订单备注</el-dropdown-item> -->
                  <el-dropdown-item
                    v-if="scope.row.pay_status == 10 && scope.row.order_status == 10"
                    @click="handleUpdate(scope.row)">订单改价</el-dropdown-item>
                  <el-dropdown-item>立即退款</el-dropdown-item>
                  <el-dropdown-item
                    @click="handleDelete(scope.row.order_id)">删除订单</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="params.page" v-model:page-size="params.pageSize"
        :page-sizes="[10, 15, 50, 100, 200]" :background="true"
        layout="total, sizes, prev, pager, next,slot, jumper" :total="count"
        @current-change="handleCurrentChange" @size-change="handleSizeChange"
        v-show="!$store.state.isMobile" />
      <el-pagination @current-change="handleCurrentChange" :current-page="params.page"
        :page-size="params.pageSize" :background="true" :layout="'total, prev, next'" :total="count"
        class="fenye" v-show="$store.state.isMobile" />
    </el-card>
    <FormDialog destroyOnClose title="订单发货" ref="formDialogRef" @dialogClosed="dialogClosed"
      @submit="handleDeliverySubmit">
      <el-form :model="deliveryForm" ref="deliveryFormRef" :rules="deliverRules" label-width="140px"
        :label-position="$store.state.isMobile ? 'top' : 'right'">
        <!-- <el-form-item label="订单ID" prop="order_id">
          <el-input show-word-limit v-model="deliveryForm.order_id" disabled></el-input>
        </el-form-item> -->
        <el-form-item label="发货方式" prop="delivery_method">
          <el-radio-group v-model="deliveryForm.delivery_method">
            <el-radio :label="10" border>快递信息</el-radio>
            <el-radio :label="20" border>无需快递</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="快递公司" prop="express_id" v-if="deliveryForm.delivery_method == 10">
          <el-select v-model="deliveryForm.express_id" placeholder="选择快递公司">
            <el-option :value="item.express_id" :label="item.express_name"
              v-for="item in expressList" :key="item.express_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="express_no" v-if="deliveryForm.delivery_method == 10">
          <el-input show-word-limit v-model="deliveryForm.express_no"></el-input>
        </el-form-item>
      </el-form>
    </FormDialog>
    <el-dialog v-model="deliveryDialogVisible" title="订单发货"
      :width="$store.state.isMobile? '90%' : '50%'" :destroy-on-close="true"
      @closed="deliveryDialogClosed" :close-on-click-modal="false">
      <el-scrollbar>
        <el-tabs v-model="activeName">
          <el-tab-pane label="未发货商品" name="notDelivery">
            <el-table :data="deliveryGoodsNotDelivery" ref="deliveryMultipleTableRef"
              style="width: 100%"
              :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }"
              :row-key="getRowKeys" @select="handleDeliverySelectionChange"
              @select-all="handleDeliverySelectionAll">
              <el-table-column type="selection" prop="order_goods_id" :reserve-selection="true"
                width="55" />
              <el-table-column label="商品信息">
                <template #default="scope">
                  <div class="goods_info" style="display: flex;align-items: center;">
                    <div class="goods_info_pic" style="width:60px;height: 60px;margin-right:15px">
                      <el-image style="width: 60px; height: 60px" :src="scope.row.goods_thumb" />
                    </div>
                    <div class="goods_info_text">
                      <div class="goods_info_name">{{ scope.row.goods_name }}</div>
                      <div class="goods_info_spec"><span style="color:#999"
                          v-for="itm in scope.row.goods_props"
                          :key="itm.id">{{ itm.value.name }}</span>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="allowDeliveryNum" label="可发货数量" width="120" />
              <el-table-column label="发货数量" width="180">
                <template #default="scope">
                  <el-input-number v-model="scope.row.deliveryNum" :min="1"
                    :max="scope.row.allowDeliveryNum" />
                </template>
              </el-table-column>
            </el-table>
            <div class="dialog-form" style="width: 80%;margin: 30px auto 0;">
              <el-form :model="deliveryForm2" ref="deliveryFormRef2" :rules="deliverRules"
                label-width="140px" :label-position="$store.state.isMobile ? 'top' : 'right'">
                <!-- <el-form-item label="订单ID" prop="order_id">
                  <el-input show-word-limit v-model="deliveryForm2.order_id" disabled></el-input>
                </el-form-item> -->
                <el-form-item label="发货方式" prop="delivery_method">
                  <el-radio-group v-model="deliveryForm2.delivery_method">
                    <el-radio :label="10" border>快递信息</el-radio>
                    <el-radio :label="20" border disabled>无需快递</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="快递公司" prop="express_id"
                  v-if="deliveryForm2.delivery_method == 10">
                  <el-select v-model="deliveryForm2.express_id" placeholder="选择快递公司">
                    <el-option :value="item.express_id" :label="item.express_name"
                      v-for="item in expressList" :key="item.express_id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="快递单号" prop="express_no"
                  v-if="deliveryForm2.delivery_method == 10">
                  <el-input show-word-limit v-model="deliveryForm2.express_no"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="已发货商品" name="isDelivery">
            <el-table :data="deliveryGoodsIsDelivery" style="width: 100%"
              :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }">
              <el-table-column type="selection" prop="order_goods_id" width="55" />
              <el-table-column label="商品信息">
                <template #default="scope">
                  <div class="goods_info" style="display: flex;align-items: center;">
                    <div class="goods_info_pic" style="width:60px;height: 60px;margin-right:15px">
                      <el-image style="width: 60px; height: 60px" :src="scope.row.goods_thumb" />
                    </div>
                    <div class="goods_info_text">
                      <div class="goods_info_name">{{ scope.row.goods_name }}</div>
                      <div class="goods_info_spec"><span style="color:#999"
                          v-for="itm in scope.row.goods_props"
                          :key="itm.id">{{ itm.value.name }}</span>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="total_num" label="购买数量" width="120" />
              <el-table-column prop="delivery_num" label="已发货数量" width="120" />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-scrollbar>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deliveryDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="deliverySubmit">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 审核取消订单 -->
    <FormDialog destroyOnClose title="审核取消订单" ref="cancelFormDialogRef"
      @submit="handleCancelSubmit">
      <el-form :model="cancelForm" ref="cancelFormRef" :rules="cancelRules" label-width="140px"
        :label-position="$store.state.isMobile ? 'top' : 'right'">
        <el-form-item label="订单ID" prop="order_id">
          <el-input show-word-limit v-model="cancelForm.order_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="实际支付金额" prop="pay_price">
          <el-input show-word-limit v-model="cancelForm.pay_price" disabled></el-input>
        </el-form-item>
        <el-form-item label="审核意见" prop="status">
          <el-radio-group v-model="cancelForm.status">
            <el-radio :label="1" border>同意</el-radio>
            <el-radio :label="0" border>拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="">
          同意后将退回付款金额并关闭订单
        </el-form-item>
      </el-form>
    </FormDialog>
    <!-- 订单改价 -->
    <FormDialog destroyOnClose title="订单改价" ref="updateFormDialogRef" @submit="handleUpdateSubmit">
      <el-form :model="updateForm" ref="updateFormRef" :rules="updateRules" label-width="140px"
        :label-position="$store.state.isMobile ? 'top' : 'right'">
        <el-form-item label="订单ID" prop="order_id">
          <el-input show-word-limit v-model="updateForm.order_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单金额" prop="pay_price">
          <el-input show-word-limit v-model="updateForm.pay_price"></el-input>
        </el-form-item>
        <el-form-item label="运费金额" prop="express_price">
          <el-input show-word-limit v-model="updateForm.express_price"></el-input>
        </el-form-item>
      </el-form>
    </FormDialog>
    <detail ref="detailRef" :detail="details" />
  </div>
</template>

<script setup>
import { nextTick, reactive, ref } from 'vue'
import ListHeader from '@/components/ListHeader.vue'
import detail from './compontens/detail.vue'
import order from '@/api/order'
import { toast, elLoading, closeElLoading } from '@/utils/utils'
import { useInitTable, useInitForm } from '@/hooks/useCommon'
import { useRoute } from 'vue-router'

const route = useRoute()
let delivery__status = null
if (route.query.delivery_status) {
  delivery__status = route.query.delivery_status
}
let pay__status = null
if (route.query.pay_status) {
  pay__status = route.query.pay_status
}

const { loading, count, dataList, params, getData, handleCurrentChange, handleSizeChange, sortChange, handleDelete, handleSelectionChange, multipleTableRef, handleMultiDelete } = useInitTable({
  api: order,
  params: {
    page: 1,
    pageSize: 15,
    order_no: '',
    keywords: '',
    keywords_type: 1,
    order_type: '',
    pay_status: pay__status,
    delivery_status: delivery__status,
    receipt_status: '',
    create_time: '',
    store_id: '',
  },
})

const showSearch = ref(false) // 高级搜索
const searchMoreRef = ref()

const { dialogTitle, formDialogRef, formRef, rules, form, editId, handleAdd, handleSubmit, dialogClosed } = useInitForm({
  api: order,
  getData,
  form: {
    order_id: '',
    order_no: '',
    delivery_method: '',
    express_price: '',
    city_id: '',
    district_id: '',
    mobile: '',
    address: '',
    status: 1,
    sort: 100,
  },
  rules: {
    order_id: [
      {
        required: true,
        message: '订单ID不能为空',
        trigger: 'blur',
      },
    ],
  },
  fliterParam(row) {
    for (const key in row) {
      form[key] = row[key]
    }
  },
})

// 将字符串日期转时间戳， 2020-09-12 12:11:22
// let time = (new Date(row.create_time)).getTime()
// 当前时间戳
let time_current = new Date().getTime()
// console.log(time_current)
// const params_order = reactive({
//   page: 1,
//   pageSize: 10,
// })
// 时间戳格式化
const detailRef = ref(null)
const details = ref(null)
// 详情
const handleDetail = (order_id) => {
  order
    .read(order_id)
    .then((res) => {
      if (res.code > 0) {
        details.value = res.result

        detailRef.value.openDrawer()
      } else {
        toast(res.message || 'error', 'error')
        return false
      }
    })
    .finally(() => {
      loading.value = false
    })
}

// 发货-带商品
const deliveryFormRef2 = ref('')
const deliveryMultipleTableRef = ref('')
const deliveryGoods = ref([])
const deliveryGoodsNotDelivery = ref([]) //可发货的商品
const deliveryGoodsIsDelivery = ref([]) // 已经发货的商品
const activeName = ref('notDelivery')
const deliveryDialogVisible = ref(false)
let deliveryChooseList = ref([]) //选中发货的商品

//切换分页时保留选中项
const getRowKeys = (row) => {
  return row.order_goods_id //行唯一标识
}
const deliveryForm2 = reactive({
  order_id: '',
  delivery_method: 10,
  express_id: '',
  express_no: '',
  packGoodsData: [],
})
const handleDeliver2 = (row) => {
  deliveryForm2.order_id = row.order_id
  row.goods.forEach((item) => {
    let allowDeliveryNum = item.total_num - item.delivery_num
    item.allowDeliveryNum = allowDeliveryNum
    item.deliveryNum = allowDeliveryNum // 本次可发货的数量
    if (allowDeliveryNum > 0) {
      deliveryGoodsNotDelivery.value.push(item)
      if (item.delivery_num > 0) deliveryGoodsIsDelivery.value.push(item)
    } else {
      deliveryGoodsIsDelivery.value.push(item)
    }
  })
  deliveryChooseList.value = JSON.parse(JSON.stringify(deliveryGoodsNotDelivery.value))
  deliveryDialogVisible.value = true
  nextTick(() => {
    deliveryGoodsNotDelivery.value.forEach((row) => {
      if (deliveryChooseList.value.find((item) => item.order_goods_id == row.order_goods_id)) deliveryMultipleTableRef.value.toggleRowSelection(row, true)
    })
  })
}

const handleDeliverySelectionChange = (selection, row) => {
  let index = deliveryChooseList.value.findIndex((item) => item.order_goods_id == row.order_goods_id)
  if (index == -1) {
    deliveryChooseList.value.push(row)
  } else {
    deliveryChooseList.value.splice(index, 1)
  }
}
const handleDeliverySelectionAll = (selection) => {
  if (selection.length == 0) {
    deliveryGoodsNotDelivery.value.forEach((row) => {
      let index = deliveryChooseList.value.findIndex((item) => item.order_goods_id == row.order_goods_id)
      if (index != -1) deliveryChooseList.value.splice(index, 1)
    })
  } else {
    deliveryGoodsNotDelivery.value.forEach((row) => {
      let index = deliveryChooseList.value.findIndex((item) => item.order_goods_id == row.order_goods_id)
      if (index == -1) deliveryChooseList.value.push(row)
    })
  }
}
const deliveryDialogClosed = () => {
  deliveryGoods.value = []
  deliveryGoodsNotDelivery.value = []
  deliveryGoodsIsDelivery.value = []
  deliveryChooseList.value = []
  activeName.value = 'notDelivery'
  deliveryForm2.order_id = ''
  deliveryForm2.delivery_method = 10
  deliveryForm2.express_id = ''
  deliveryForm2.express_no = ''
  deliveryForm2.packGoodsData = []
}

const deliverySubmit = () => {
  deliveryFormRef2.value.validate((valid) => {
    if (!valid) return
    if (deliveryChooseList.value.length == 0) {
      toast('请选择要发货的商品', 'error')
      return false
    }
    deliveryForm2.packGoodsData = []
    deliveryChooseList.value.forEach((item) => {
      let index = deliveryGoodsNotDelivery.value.findIndex((itm) => itm.order_goods_id == item.order_goods_id)
      item.deliveryNum = deliveryGoodsNotDelivery.value[index].deliveryNum
      if (item.deliveryNum > item.allowDeliveryNum) {
        toast('发货数量不能大于可发货数量', 'error')
        return false
      }
      deliveryForm2.packGoodsData.push({ orderGoodsId: item.order_goods_id, deliveryNum: item.deliveryNum })
    })

    order
      .delivery(deliveryForm2.order_id, deliveryForm2)
      .then((res) => {
        if (res.code > 0) {
          toast('订单发货成功')
          deliveryDialogVisible.value = false
          getData()
        } else {
          toast(res.message || 'error', 'error')
          return false
        }
      })
      .finally(() => {
        loading.value = false
        deliveryDialogVisible.value = false
      })
  })
}
// 发货
const deliveryFormRef = ref(null)
const deliveryForm = reactive({
  order_id: '',
  delivery_method: 10,
  express_id: '',
  express_no: '',
})
const deliverRules = reactive({
  order_id: [
    {
      required: true,
      message: '订单ID不能为空',
      trigger: 'blur',
    },
  ],
  express_id: [
    {
      required: true,
      message: '请选择快递公司',
      trigger: 'blur',
    },
  ],
  express_no: [
    {
      required: true,
      message: '快递单号不能为空',
      trigger: 'blur',
    },
  ],
})
const handleDeliver = (row) => {
  deliveryGoods.value = row.goods
  deliveryForm.order_id = row.order_id
  formDialogRef.value.openFormDialog()
}
const handleDeliverySubmit = () => {
  deliveryFormRef.value.validate((valid) => {
    if (!valid) return
    order
      .delivery(deliveryForm.order_id, deliveryForm)
      .then((res) => {
        if (res.code > 0) {
          toast('订单发货成功')
          formDialogRef.value.closeFormDialog()
          getData()
        } else {
          toast(res.message || 'error', 'error')
          return false
        }
      })
      .finally(() => {
        loading.value = false
        formDialogRef.value.closeFormDialog()
      })
  })
}

// 订单取消审核
const cancelFormDialogRef = ref(null)
const cancelFormRef = ref(null)
const cancelForm = reactive({
  order_id: '',
  status: 1,
  pay_price: '',
})
const cancelRules = reactive({
  order_id: [
    {
      required: true,
      message: '订单ID不能为空',
      trigger: 'blur',
    },
  ],
})
const handleCancel = (order) => {
  cancelForm.order_id = order.order_id
  cancelForm.pay_price = order.pay_price
  cancelFormDialogRef.value.openFormDialog()
}
const handleCancelSubmit = () => {
  cancelFormRef.value.validate((valid) => {
    if (!valid) return
    order
      .cancel(cancelForm.order_id, cancelForm)
      .then((res) => {
        if (res.code > 0) {
          toast('订单操作成功')
          getData()
        } else {
          toast(res.message || 'error', 'error')
          return false
        }
      })
      .finally(() => {
        loading.value = false
        cancelFormDialogRef.value.closeFormDialog()
      })
  })
}

// 订单改价
const updateFormDialogRef = ref(null)
const updateFormRef = ref(null)
const updateForm = reactive({
  order_id: '',
  pay_price: '',
  order_price: '',
  express_price: '',
})
const updateRules = reactive({
  order_id: [
    {
      required: true,
      message: '订单ID不能为空',
      trigger: 'blur',
    },
  ],
})
const handleUpdate = (order) => {
  updateForm.order_id = order.order_id
  updateForm.order_price = order.order_price
  updateForm.pay_price = order.pay_price
  updateForm.express_price = order.express_price
  updateFormDialogRef.value.openFormDialog()
}
const handleUpdateSubmit = () => {
  updateFormRef.value.validate((valid) => {
    if (!valid) return
    order
      .update_price(updateForm.order_id, updateForm)
      .then((res) => {
        if (res.code > 0) {
          toast('订单操作成功')
          getData()
        } else {
          toast(res.message || 'error', 'error')
          return false
        }
      })
      .finally(() => {
        loading.value = false
        updateFormDialogRef.value.closeFormDialog()
      })
  })
}
const storeList = ref([])
const expressList = ref([])

// select数据,合并远程请求
order.getSelect().then((res) => {
  if (res.code > 0) {
    storeList.value = res.result.store
    expressList.value = res.result.express
  } else {
    toast(res.message || 'Error', 'error')
  }
})

// 表单重置
const resetFrom = () => {
  if (!searchMoreRef.value) return
  // searchMoreRef.value.resetFields()  order_no: '',
  params.page = 1
  params.pageSize = 15
  params.keywords = ''
  params.keywords_type = 1
  params.order_type = ''
  params.pay_status = ''
  params.delivery_status = ''
  params.receipt_status = ''
  params.create_time = ''
  params.store_id = ''
  getData(1)
}

// 导出
const exportExcel = () => {
  elLoading('数据导出中...')
  order
    .export(params)
    .then((res) => {
      if (res.code > 0) {
        location.href = res.result.url
      } else {
        toast(res.message || 'Error', 'error')
      }
    })
    .finally(() => {
      closeElLoading()
    })
}

// 导入
const importExcel = (e) => {
  getData(1)
}
</script>
<style lang="scss" scoped>
.search-more {
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #eee;
}
:deep(.el-input__wrapper) {
  width: 100%;
}
.el-dropdown {
  margin-left: 10px;
}
.el-dropdown .el-icon {
  color: #fff;
}
:deep(.el-form-item__label) {
  font-weight: bold;
}
</style>
