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
          <el-col :md="6" :offset="0">
            <el-form-item label="申请时间">
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
      <ListHeader ref="headerRef" :rule="{}">
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
        @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column type="selection" prop="order_refund_id" width="55" />
        <el-table-column prop="order_no" width="180" show-overflow-tooltip label="订单编号" />
        <el-table-column label="商品信息" width="360">
          <template #default="scope">
            <el-row align="middle" :gutter="30">
              <el-col :span="5">
                <el-image style="width: 60px; height: 60px"
                  :src="scope.row.order_goods.goods_thumb" />
              </el-col>
              <el-col :span="19">
                <el-row style="overflow: hidden;"><span
                    style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{ scope.row.order_goods.goods_name }}</span></el-row>
                <el-row>
                  <span style="color:#999" v-for="itm in scope.row.order_goods.goods_props"
                    :key="itm.id">{{ itm.value.name }}</span>
                </el-row>
                <el-row>
                  <span style="padding-right: 10px;">{{ scope.row.order_goods.goods_price }}</span>
                  <span style="color:#999">X{{ scope.row.order_goods.total_num }}</span>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="user_mobile" show-overflow-tooltip label="用户信息">
          <template #default="scope">
            <el-row style="margin-bottom: 10px;"><span>{{ scope.row.user.name }}</span></el-row>
            <el-row><span>{{ scope.row.user.mobile }}</span></el-row>
          </template>
        </el-table-column>
        <el-table-column prop="user_mobile" show-overflow-tooltip label="售后类型">
          <template #default="scope">
            <el-tag size="small" type="danger" v-if="scope.row.type == 20">换货</el-tag>
            <el-tag size="small" type="danger" v-if="scope.row.type == 10">退货退款</el-tag>
          </template>
        </el-table-column>
        <el-table-column sortable label="处理进度">
          <template #default="scope">
            <el-row style="margin-bottom: 10px;">
              商家审核：
              <el-tag size="small" type="info" v-if="scope.row.audit_status == 0">待审核</el-tag>
              <el-tag size="small" type="success" v-if="scope.row.audit_status == 10">已同意</el-tag>
              <el-tag size="small" type="danger" v-if="scope.row.audit_status == 20">已拒绝</el-tag>
            </el-row>
            <el-row style="margin-bottom: 10px;" v-if="scope.row.type == 10">
              用户发货：
              <el-tag size="small" type="info" v-if="scope.row.is_user_send == 0">未发货</el-tag>
              <el-tag size="small" type="success" v-if="scope.row.is_user_send == 1">已发货</el-tag>
            </el-row>
            <el-row style="margin-bottom: 10px;" v-if="scope.row.type == 10">
              商家收货：
              <el-tag size="small" type="info" v-if="scope.row.is_receipt == 0">未收货</el-tag>
              <el-tag size="small" type="success" v-if="scope.row.is_receipt == 1">已收货</el-tag>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="售后单状态">
          <template #default="scope">
            <el-tag size="small" v-if="scope.row.status == 0">进行中</el-tag>
            <el-tag size="small" type="danger" v-if="scope.row.status == 10">已拒绝</el-tag>
            <el-tag size="small" type="success" v-if="scope.row.status == 20">已完成</el-tag>
            <el-tag size="small" type="danger" v-if="scope.row.status == 30">已取消</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" width="180" show-overflow-tooltip label="申请时间" />
        <el-table-column label="操作" fixed="right" width="160">
          <template #default="scope">
            <el-button size="small" type="success" v-permission="205"
              @click="handleDetail(scope.row.order_refund_id)">
              详情 </el-button>
            <el-button v-permission="206" v-if="scope.row.audit_status == 0" size="small"
              type="danger" @click="handleAudit(scope.row)"> 审核 </el-button>
            <el-button v-permission="207"
              v-if="scope.row.is_user_send == 1 && scope.row.status == 0" size="small" type="danger"
              @click="handleReceipt(scope.row)"> 确认收货 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 审核订单 -->
    <FormDialog destroyOnClose title="售后单审核" ref="auditFormDialogRef" @submit="handleAuditSubmit">
      <el-form :model="auditForm" ref="auditFormRef" :rules="auditRules" label-width="140px"
        :label-position="$store.state.isMobile ? 'top' : 'right'">
        <el-form-item label="售后订单ID" prop="order_id">
          <el-input show-word-limit v-model="auditForm.order_refund_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="售后类型" prop="type">
          <el-tag size="small" v-if="auditForm.type == 10">退货退款</el-tag>
          <el-tag size="small" v-if="auditForm.type == 20">换货</el-tag>
        </el-form-item>
        <el-form-item label="审核状态" prop="audit_status">
          <el-radio-group v-model="auditForm.audit_status">
            <el-radio :label="10" border>同意</el-radio>
            <el-radio :label="20" border>拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="收货地址" prop="address" v-if="auditForm.audit_status == 10">
          <el-input show-word-limit v-model="auditForm.address" disabled></el-input>
        </el-form-item>
        <el-form-item label="拒绝原因" prop="refuse_desc" v-if="auditForm.audit_status == 20">
          <el-input show-word-limit v-model="auditForm.refuse_desc"></el-input>
        </el-form-item>
      </el-form>
    </FormDialog>
    <!-- 确认收货订单 -->
    <FormDialog destroyOnClose title="确认收货并退款" ref="receiptFormDialogRef"
      @submit="handleReceiptSubmit">
      <el-form :model="receiptForm" ref="receiptFormRef" :rules="receiptRules" label-width="140px"
        :label-position="$store.state.isMobile ? 'top' : 'right'">
        <el-form-item label="">
          请确认已收到寄回的商品，确认后自动退回付款金额(原路退款)并关闭当前售后后单
        </el-form-item>
        <el-form-item label="售后订单ID" prop="order_id">
          <el-input show-word-limit v-model="receiptForm.order_refund_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="售后类型" prop="type">
          <el-tag size="small" v-if="receiptForm.type == 10">退货退款</el-tag>
          <el-tag size="small" v-if="receiptForm.type == 20">换货</el-tag>
        </el-form-item>
        <el-form-item label="订单金额" prop="pay_price">
          <el-input show-word-limit v-model="receiptForm.pay_price" disabled></el-input>
        </el-form-item>
        <el-form-item label="退款金额" prop="refund_money">
          <el-input type="number" show-word-limit v-model="receiptForm.refund_money"></el-input>
        </el-form-item>
      </el-form>
    </FormDialog>
    <!-- 详情 -->
    <detail ref="detailRef" :detail="details" />
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import ListHeader from '@/components/ListHeader.vue'
import detail from './compontens/detail.vue'
import refund from '@/api/refund'
import { toast, elLoading, closeElLoading } from '@/utils/utils'
import { useInitTable } from '@/hooks/useCommon'

const { loading, count, dataList, params, getData, handleCurrentChange, handleSizeChange, sortChange, handleDelete, handleSelectionChange, multipleTableRef, handleMultiDelete } = useInitTable({
  api: refund,
  params: {
    page: 1,
    pageSize: 15,
    keywords: '',
    keywords_type: 1,
    searchType: '',
    refundType: '',
    refundStatus: '',
    create_time: '',
  },
})

const showSearch = ref(false) // 高级搜索
const searchMoreRef = ref()

const detailRef = ref(null)
const details = ref(null)
// 详情
const handleDetail = (order_refund_id) => {
  refund
    .read(order_refund_id)
    .then((res) => {
      if (res.code > 0) {
        // res.result.arrange_time = parseTime(res.result.arrange_time)
        // res.result.order_money = res.result.order_money == 0 ? '' : res.result.order_money
        // res.result.contract_money = res.result.contract_money == 0 ? '' : res.result.contract_money
        res.result.order_goods = [res.result.order_goods]
        details.value = res.result
        console.log(details.value)

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

// 审核
const auditFormDialogRef = ref(null)
const auditFormRef = ref(null)
const auditForm = reactive({
  order_refund_id: '',
  type: '',
  address_id: 1,
  address: '广东星艺装饰集团有限公司',
  audit_status: 10,
  refuse_desc: '',
})
const auditRules = reactive({
  order_refund_id: [
    {
      required: true,
      message: '售后订单ID不能为空',
      trigger: 'blur',
    },
  ],
})
const handleAudit = (order) => {
  auditForm.order_refund_id = order.order_refund_id
  auditForm.type = order.type
  auditFormDialogRef.value.openFormDialog()
}
const handleAuditSubmit = () => {
  auditFormRef.value.validate((valid) => {
    if (!valid) return
    refund
      .audit(auditForm.order_refund_id, auditForm)
      .then((res) => {
        if (res.code > 0) {
          toast('订单操作成功')
          getData()
          auditFormDialogRef.value.closeFormDialog()
        } else {
          toast(res.message || 'error', 'error')
          return false
        }
      })
      .finally(() => {
        loading.value = false
      })
  })
}

// 确认售后
const receiptFormDialogRef = ref(null)
const receiptFormRef = ref(null)
const receiptForm = reactive({
  order_refund_id: '',
  type: '',
  pay_price: 0.0,
  refund_money: 0.0,
})
const receiptRules = reactive({
  order_refund_id: [
    {
      required: true,
      message: '售后订单ID不能为空',
      trigger: 'blur',
    },
  ],
})
const handleReceipt = (order) => {
  receiptForm.order_refund_id = order.order_refund_id
  receiptForm.type = order.type
  receiptForm.pay_price = order.order_goods.total_pay_price
  receiptFormDialogRef.value.openFormDialog()
}
const handleReceiptSubmit = () => {
  receiptFormRef.value.validate((valid) => {
    if (!valid) return
    refund
      .receipt(receiptForm.order_refund_id, receiptForm)
      .then((res) => {
        if (res.code > 0) {
          toast('订单操作成功')
          getData()
          receiptFormDialogRef.value.closeFormDialog()
        } else {
          toast(res.message || 'error', 'error')
          return false
        }
      })
      .finally(() => {
        loading.value = false
      })
  })
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