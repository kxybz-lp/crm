<template>
  <el-drawer custom-class="detail" v-model="showDrawer" size="100%" :close-on-click-modal="false"
    destroy-on-close @closed="drawerClosed">
    <template #header="{ }">
      <div class="detail-header">
        <h4>售后订单详情</h4>
      </div>
    </template>
    <div class="detailDrawer" style="padding: 5px 15px;">
      <el-row class="detail_body">
        <el-col :span="24">
          <el-card class="order_info">
            <template #header>
              <div class="card-header">
                <span>售后单信息</span>
              </div>
            </template>
            <el-descriptions :column="3">
              <el-descriptions-item
                label="订单号：">{{ detail.order_data.order_no }}</el-descriptions-item>
              <el-descriptions-item label="买家信息：">{{ detail.user.mobile }}</el-descriptions-item>
              <el-descriptions-item
                label="订单支付总额：">{{ detail.order_data.pay_price }}</el-descriptions-item>
              <el-descriptions-item label="售后类型：">
                <el-tag size="small" v-if="detail.type == 10">退款退货</el-tag>
                <el-tag size="small" v-if="detail.type == 20">换货</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="售后单状态：">
                <el-tag size="small" v-if="detail.status == 0">进行中</el-tag>
                <el-tag size="small" type="danger" v-if="detail.status == 10">已拒绝</el-tag>
                <el-tag size="small" type="success" v-if="detail.status == 20">已完成</el-tag>
                <el-tag size="small" type="danger" v-if="detail.status == 30">已取消</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="申请时间：">{{ detail.create_time }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :span="24">
          <el-card class="order_info">
            <template #header>
              <div class="card-header">
                <span>处理进度</span>
              </div>
            </template>
            <el-descriptions :column="3">
              <el-descriptions-item label="商家审核">
                <el-tag size="small" type="info" v-if="detail.audit_status == 0">待审核</el-tag>
                <el-tag size="small" type="success" v-if="detail.audit_status == 10">已同意</el-tag>
                <el-tag size="small" type="danger" v-if="detail.audit_status == 20">已拒绝</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="用户发货" v-if="detail.type == 10">
                <el-tag size="small" type="info" v-if="detail.is_user_send == 0">未发货</el-tag>
                <el-tag size="small" type="success" v-if="detail.is_user_send == 1">已发货</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="商家收货" v-if="detail.type == 10">
                <el-tag size="small" type="info" v-if="detail.is_receipt == 0">未收货</el-tag>
                <el-tag size="small" type="success" v-if="detail.is_receipt == 1">已收货</el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :span="24">
          <el-card class="order_info">
            <template #header>
              <div class="card-header">
                <span>买家申请原因</span>
              </div>
            </template>
            <el-descriptions :column="3">
              <el-descriptions-item label="申请描述">{{ detail.apply_desc }}</el-descriptions-item>
            </el-descriptions>
            <div class="imgs" v-if="detail.images.length > 0"
              style="overflow: hidden;margin-bottom: 10px;">
              <h6 style="    font-weight: normal;font-size: 16px;padding: 20px 0;">申请凭证</h6>
              <p style="float: left;margin-right: 10px;" v-for="item in detail.images"
                :key="item.id"><el-image style="width: 200px;" :src="item.image" :fit="fit" /></p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="24">
          <el-card class="order_goods">
            <template #header>
              <div class="card-header">
                <span>售后商品</span>
              </div>
            </template>
            <el-table ref="multipleTableRef" :data="detail.order_goods" stripe style="width: 100%"
              tooltip-effect="light"
              :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }">
              <el-table-column label="商品信息" width="360">
                <template #default="scope">
                  <el-row align="middle" :gutter="30">
                    <el-col :span="5">
                      <el-image style="width: 60px; height: 60px" :src="scope.row.goods_thumb" />
                    </el-col>
                    <el-col :span="19">
                      <el-row style="overflow: hidden;"><span
                          style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{ scope.row.goods_name }}</span></el-row>
                      <el-row>
                        <span style="color:#999" v-for="itm in scope.row.goods_props"
                          :key="itm.id">{{ itm.value.name }}</span>
                      </el-row>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column prop="goods_price" label="商品单价" />
              <el-table-column prop="total_num" label="购买数量" />
              <el-table-column prop="goods_price" label="商品总价" />
              <el-table-column prop="total_pay_price" label="实际付款金额" />
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="24" v-if="detail.address">
          <el-card class="order_info">
            <template #header>
              <div class="card-header">
                <span>商家退货地址</span>
              </div>
            </template>
            <el-descriptions :column="3">
              <el-descriptions-item label="收货人姓名">{{ detail.address.name }}</el-descriptions-item>
              <el-descriptions-item label="联系电话">{{ detail.address.phone }}</el-descriptions-item>
              <el-descriptions-item label="所在地区">{{ detail.address.region.province }}
                {{ detail.address.region.city }}
                {{ detail.address.region.district }}</el-descriptions-item>
              <el-descriptions-item label="详细地址">{{ detail.address.detail }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :span="24" v-if="detail.type == 10 && detail.status != 10">
          <el-card class="order_info">
            <template #header>
              <div class="card-header">
                <span>退货物流信息</span>
              </div>
            </template>
            <el-descriptions :column="3">
              <el-descriptions-item
                label="物流公司">{{ detail.express.express_name }}</el-descriptions-item>
              <el-descriptions-item label="物流单号">{{ detail.express_no }}</el-descriptions-item>
              <el-descriptions-item label="	发货状态">
                <el-tag type="success" size="small" v-if="detail.is_user_send == 1">已发货</el-tag>
                <el-tag size="small" v-if="detail.is_user_send == 0">未发货</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="发货时间">{{ detail.send_time }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </el-drawer>
</template>
    <script setup>
import { ref } from 'vue'
const prop = defineProps({
  detail: {
    type: Object,
    default: '',
  },
})

const showDrawer = ref(false)

const loading = ref(false)
const showLoading = () => (loading.value = true)
const hideLoading = () => (loading.value = false)
const order_status = ref(1)

// 打开
const openDrawer = () => {
  showDrawer.value = true
}

// 关闭
const drawerClosed = () => {}

defineExpose({
  openDrawer,
  showLoading,
  hideLoading,
})
</script>
    <style lang="scss" scoped>
:deep(.el-descriptions__label:not(.is-bordered-label)) {
  display: inline-block;
  width: 100px;
}
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 10px;
}
.detail-header h4 {
  font-size: 18px;
  color: 303133;
}
.detail-header .button {
  margin-top: 4px;
  cursor: pointer;
}
.order_status {
  padding: 30px 0;
  background: #fff;
  margin: 20px 0;
}
.detailDrawer {
  background-color: #f0f2f5;
}
.order_info {
  margin: 10px 0;
}
.order_goods {
  margin: 20px 0;
}
.order_address {
  margin-bottom: 20px;
}
.order_goods_notes {
  margin-top: 30px;
}
.order_goods_note {
  text-align: right;
  font-size: 14px;
  color: #666;
  padding-top: 2px;
}
</style>
    