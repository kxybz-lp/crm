<template>
  <el-drawer custom-class="detail" v-model="showDrawer" size="100%" :close-on-click-modal="false"
    destroy-on-close @closed="drawerClosed">
    <template #header="{ }">
      <div class="detail-header">
        <h4>订单详情</h4>
      </div>
    </template>
    <div class="detailDrawer" style="padding: 5px 15px;">
      <el-row class="detail_body">
        <el-col :span="24">
          <el-card class="order_status">
            <el-steps :active="order_status" finish-status="success" align-center>
              <el-step title="下单" />
              <el-step title="付款" />
              <el-step title="发货" />
              <el-step title="收货" />
              <el-step title="完成" />
            </el-steps>
          </el-card>
        </el-col>
        <el-col :span="24">
          <el-card class="order_info">
            <template #header>
              <div class="card-header">
                <span>订单信息</span>
              </div>
            </template>
            <el-descriptions :column="3">
              <el-descriptions-item label="订单号：">{{ detail.order_no }}</el-descriptions-item>
              <el-descriptions-item label="下单时间：">{{ detail.create_time }}</el-descriptions-item>
              <el-descriptions-item label="订单状态：">
                <el-tag size="small" type="danger">{{ detail.state_text }}</el-tag>
                <!-- <el-tag size="small" type="success" v-if="detail.pay_status == 20">已支付</el-tag>
                <el-tag size="small" type="danger" v-if="detail.pay_status == 10">待支付</el-tag> -->
              </el-descriptions-item>
              <el-descriptions-item label="	订单金额：">{{ detail.total_price }}</el-descriptions-item>
              <el-descriptions-item label="	实付款金额：">{{ detail.pay_price }}</el-descriptions-item>
              <el-descriptions-item label="买家信息：">{{ detail.user.mobile }}</el-descriptions-item>
              <el-descriptions-item label="买家留言：">{{ detail.buyer_remark }}</el-descriptions-item>
              <el-descriptions-item label="配送方式：">
                <el-tag size="small" v-if="detail.delivery_type == 10">快递配送</el-tag>
                <el-tag size="small" v-if="detail.delivery_type == 20">门店自提</el-tag>
                <el-tag size="small" v-if="detail.delivery_type == 30">无需配送</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="运费金额：">￥{{ detail.express_price }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :span="24">
          <el-card class="order_goods">
            <template #header>
              <div class="card-header">
                <span>商品信息</span>
              </div>
            </template>
            <el-table ref="multipleTableRef" :data="detail.goods" stripe style="width: 100%"
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
                      <!-- <el-row>
                        <span style="padding-right: 10px;">{{ scope.row.goods_price }}</span>
                        <span style="color:#999">X{{ scope.row.total_num }}</span>
                      </el-row> -->
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column prop="goods_price" label="商品单价" />
              <el-table-column prop="total_num" label="购买数量" />
              <el-table-column prop="total_price" label="商品总价" />
            </el-table>
            <el-row class="order_goods_notes">
              <el-col class="order_goods_note" :span="24">订单总额： ￥{{ detail. total_price}}</el-col>
              <!-- <el-col class="order_goods_note" :span="24">商家改价： -￥2.00</el-col> -->
              <el-col class="order_goods_note" :span="24" v-if="detail.coupon_id">优惠券抵扣：
                -￥{{ detail.coupon_money}}</el-col>
              <el-col class="order_goods_note" :span="24">运费金额：
                +￥{{ detail.express_price}}</el-col>
              <el-col class="order_goods_note" :span="24"
                v-if="detail.update_price.value != 0">后台改价：
                {{ detail.update_price.symbol}}￥{{ detail.update_price.value}}</el-col>
              <el-col class="order_goods_note" :span="24">实付款金额： <span
                  style="color: #333;font-weight: bold;">￥{{ detail. pay_price}}</span></el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="24">
          <el-card class="order_address">
            <template #header>
              <div class="card-header">
                <span>买家信息</span>
              </div>
            </template>
            <el-descriptions :column="3">
              <el-descriptions-item label="收货人姓名：">{{ detail.address.name }}</el-descriptions-item>
              <el-descriptions-item
                label="	收货人电话：">{{ detail.address.phone }}</el-descriptions-item>
              <el-descriptions-item
                label="		收货地区：">{{ detail.address.region.province }}{{ detail.address.region.city }}{{ detail.address.region.district }}</el-descriptions-item>
              <el-descriptions-item label="详细地址：">{{ detail.address.detail }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :span="24" v-if="order_status == 3 || order_status == 4 || order_status == 5">
          <el-card class="order_address">
            <template #header>
              <div class="card-header">
                <span>发货信息</span>
              </div>
            </template>
            <div v-if="detail.deliverys.length == 1">
              <el-descriptions :column="3">
                <el-descriptions-item
                  label="快递公司：">{{ detail.deliverys[0].express.express_name }}</el-descriptions-item>
                <el-descriptions-item
                  label="	快递单号：">{{ detail.deliverys[0].express_no }}</el-descriptions-item>
                <el-descriptions-item
                  label="发货时间：">{{ detail.deliverys[0].create_time }}</el-descriptions-item>
                <el-descriptions-item label="">
                  <div class="delivery_goods" style="display: flex;">
                    <div v-for="(item) in detail.deliverys[0].goods" :key="item.id"
                      style="margin: 0 15px 15px 0;width: 100px; height: 100px;overflow: hidden;background: #f1f1f1;position: relative;">
                      <el-image style="width: 100px; height: 100px" :src="item.goods_thumb"
                        fit="fill"></el-image>
                      <div
                        style="position: absolute;left: 0;right: 0;bottom: 0;text-align: center;font-size: 12px;background: rgba(0, 0, 0, .5);color: #fff;padding: 3px 0;">
                        共{{item.delivery_num}}件</div>
                    </div>
                  </div>
                </el-descriptions-item>
              </el-descriptions>
            </div>
            <div v-else>
              <el-tabs>
                <el-tab-pane :label="'包裹'+ (index + 1)" :name="item.id"
                  v-for="(item, index) in detail.deliverys" v-bind:key="item.id">
                  <el-descriptions :column="3">
                    <el-descriptions-item
                      label="快递公司：">{{ item.express.express_name }}</el-descriptions-item>
                    <el-descriptions-item
                      label="	快递单号：">{{ item.express_no }}</el-descriptions-item>
                    <el-descriptions-item
                      label="发货时间：">{{ item.create_time }}</el-descriptions-item>
                    <el-descriptions-item label="">
                      <div class="delivery_goods" style="display: flex;">
                        <div v-for="(item) in item.goods" :key="item.id"
                          style="margin: 0 15px 15px 0;width: 100px; height: 100px;overflow: hidden;background: #f1f1f1;position: relative;">
                          <el-image style="width: 100px; height: 100px" :src="item.goods_thumb"
                            fit="fill"></el-image>
                          <div
                            style="position: absolute;left: 0;right: 0;bottom: 0;text-align: center;font-size: 12px;background: rgba(0, 0, 0, .5);color: #fff;padding: 3px 0;">
                            共{{item.delivery_num}}件</div>
                        </div>
                      </div>
                    </el-descriptions-item>
                  </el-descriptions>
                </el-tab-pane>
              </el-tabs>
            </div>

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

const detailTab = ref('detail_order')
const showDrawer = ref(false)

const loading = ref(false)
const showLoading = () => (loading.value = true)
const hideLoading = () => (loading.value = false)
const order_status = ref(1)

// 打开
const openDrawer = () => {
  showDrawer.value = true
  setTimeout(() => {
    if (prop.detail.pay_status == 20) order_status.value = 2
    if (prop.detail.delivery_status != 10) order_status.value = 3
    if (prop.detail.receipt_status == 20) order_status.value = 4
    if (prop.detail.order_status == 30) order_status.value = 5
  }, 200)
}

// 关闭
const drawerClosed = () => {
  detailTab.value = 'detail_order'
  order_status.value = 1
}

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
  