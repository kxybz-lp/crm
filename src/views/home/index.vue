<template>
  <div class="app-container">
    <el-row v-permission="54" :gutter="$store.state.isMobile ? 10 : 20" class="panels">
      <template v-if="panels.length == 0">
        <el-col :xs="12" :md="12" :lg="6" v-for="i in 4" :key="i">
          <el-skeleton style="width: 100%" animated loading>
            <template #template>
              <el-card shadow="hover" class="border-0">
                <div class="el-card-header">
                  <el-skeleton-item variant="text" style="width: 20%" />
                  <el-skeleton-item variant="text" style="width: 10%" />
                </div>
                <div class="el-card-body">
                  <div class="number">
                    <el-skeleton-item variant="text" style="width: 60%" />
                  </div>
                </div>
                <div class="el-card-footer">
                  <el-skeleton-item variant="text" style="width: 100%" />
                </div>
              </el-card>
            </template>
          </el-skeleton>
        </el-col>
      </template>
      <el-col :xs="12" :sm="12" :lg="6" :offset="0" v-for="(item) in panels" :key="item.title">
        <el-card shadow="hover" class="border-0" @click="$router.push(item.url)">
          <div class="el-card-header">
            <span>{{ item.title }}</span>
            <el-tooltip :content="item.tooltip" placement="top">
              <el-icon>
                <Warning />
              </el-icon>
            </el-tooltip>
          </div>
          <div class="el-card-body">
            <div class="number">
              <span>{{ item.number }}</span>
            </div>
          </div>
          <div class="el-card-footer">
            <el-row style="width:100%;justify-content: space-between;padding-top: 10px;">
              <el-col :xs="24" :sm="10" :lg="10">
                <div class="s">
                  <span style="color:#999;">今日</span>
                  <i>{{ item.current }}</i>
                </div>
              </el-col>
              <el-col :xs="24" :sm="14" :lg="14" :class="$store.state.isMobile ? 'tal' : 'tar'">
                <div class="c">
                  <i style="font-size:12px;color:#999;padding-left: 0;">较昨日</i>
                  <el-icon v-if="item.type === 'up'" class="fail">
                    <CaretTop />
                  </el-icon>
                  <el-icon v-else class="success">
                    <CaretBottom />
                  </el-icon>
                  <span style="padding-left: 5px">{{ item.diff }}</span>
                </div>
              </el-col>
            </el-row>
            <!-- <div class="s">
              <span>今日</span>
              <i>{{ item.current }}</i>
            </div>
            <div class="c">
              <i style="font-size:12px;color:#999;">较昨日</i>
              <el-icon v-if="item.type === 'up'" class="success">
                <CaretTop />
              </el-icon>
              <el-icon v-else class="fail">
                <CaretBottom />
              </el-icon>
              <span style="padding-left: 5px">{{ item.diff }}</span>
            </div> -->
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row v-permission="55" :gutter="20" class="panels-order">
      <el-card shadow="hover" class="border-0">
        <el-row :gutter="20">
          <el-col :md="12" :lg="6" :offset="0" v-permission="127"
            @click="$router.push('/goods/order?delivery_status=11')" style="cursor: pointer;">
            <p class="key" style="font-weight: bold;">待发货订单（笔）</p>
            <p class="val">{{ pending.notDeliver }}</p>
          </el-col>
          <el-col :md="12" :lg="6" :offset="0" v-permission="127">
            <p class="key">售后订单（笔）</p>
            <p class="val">{{ pending.refundTotal }}</p>
          </el-col>
          <el-col :md="12" :lg="6" :offset="0" v-permission="127"
            @click="$router.push('/goods/order?pay_status=10')" style="cursor: pointer;">
            <p class="key">待付款订单（笔）</p>
            <p class="val">{{ pending.notPay }}</p>
          </el-col>
          <el-col :md="12" :lg="6" :offset="0" v-permission="127"
            @click="$router.push('/goods/index?sale_out=1')" style="cursor: pointer;">
            <p class="key">已售罄商品</p>
            <p class="val">{{ pending.soldoutGoodsTotal }}</p>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
    <el-row v-permission="56" :gutter="20" class="panels-order">
      <el-card shadow="hover" class="border-0">
        <template #header>
          <div class="card-header">
            <span>常用功能</span>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :md="12" :lg="6" :offset="0" v-permission="127" class="operation-tool">
            <el-link href="/goods/add" :underline="false">
              <p class="operation-tool-icon"> <el-icon :size="16" color="#fff">
                  <Goods />
                </el-icon></p>
              <p>发布商品</p>
            </el-link>
          </el-col>
          <el-col :md="12" :lg="6" :offset="0" v-permission="127" class="operation-tool">
            <el-link href="/goods/index" :underline="false">
              <p class="operation-tool-icon" style="background: #f15858;"> <el-icon :size="16"
                  color="#fff">
                  <GoodsFilled />
                </el-icon></p>
              <p>商品管理</p>
            </el-link>
          </el-col>
          <el-col :md="12" :lg="6" :offset="0" v-permission="127" class="operation-tool">
            <el-link href="/goods/category" :underline="false">
              <p class="operation-tool-icon" style="background: #004c59;"> <el-icon :size="16"
                  color="#fff">
                  <Menu />
                </el-icon></p>
              <p>商品分类</p>
            </el-link>
          </el-col>
          <el-col :md="12" :lg="6" :offset="0" v-permission="127" class="operation-tool">
            <el-link href="/system/store" :underline="false">
              <p class="operation-tool-icon" style="background: #139dff;"> <el-icon :size="16"
                  color="#fff">
                  <School />
                </el-icon></p>
              <p>门店管理</p>
            </el-link>
          </el-col>
          <el-col :md="12" :lg="6" :offset="0" v-permission="127" class="operation-tool">
            <el-link href="/goods/order" :underline="false">
              <p class="operation-tool-icon"> <el-icon :size="16" color="#fff">
                  <Briefcase />
                </el-icon></p>
              <p>订单管理</p>
            </el-link>
          </el-col>
          <el-col :md="12" :lg="6" :offset="0" v-permission="127" class="operation-tool">
            <el-link href="/goods/analysis" :underline="false">
              <p class="operation-tool-icon" style="background: #f15858;"> <el-icon :size="16"
                  color="#fff">
                  <DataAnalysis />
                </el-icon></p>
              <p>数据统计</p>
            </el-link>
          </el-col>
          <el-col :md="12" :lg="6" :offset="0" v-permission="127" class="operation-tool">
            <el-link href="/express" :underline="false">
              <p class="operation-tool-icon" style="background: #004c59;"> <el-icon :size="16"
                  color="#fff">
                  <Van />
                </el-icon></p>
              <p>物流公司</p>
            </el-link>
          </el-col>
          <el-col :md="12" :lg="6" :offset="0" v-permission="127" class="operation-tool">
            <el-link href="/goods/sku" :underline="false">
              <p class="operation-tool-icon" style="background: #139dff;"> <el-icon :size="16"
                  color="#fff">
                  <Flag />
                </el-icon></p>
              <p>商品规格</p>
            </el-link>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
    <el-row v-permission="55" :gutter="20" class="statistical">
      <el-col :sapn="24">
        <el-card shadow="hover" :body-style="{ padding: 0 }">
          <template #header>
            <div class="statistical-header">
              <div class="type">
                <span :class="params.type == 'order' ? 'current_type' : ''"
                  @click="setType('order')">订单数</span>
                <span :class="params.type == 'price' ? 'current_type' : ''"
                  @click="setType('price')">销售额</span>
              </div>
              <div class="date" v-show="!$store.state.isMobile">
                <span :class="params.scope == 'week' ? 'current_scope' : ''"
                  @click="setScope('week')">近7日</span>
                <span :class="params.scope == 'month' ? 'current_scope' : ''"
                  @click="setScope('month')">近30日</span>
                <span :class="params.scope == 'current_month' ? 'current_scope' : ''"
                  @click="setScope('current_month')">本月</span>
                <span :class="params.scope == 'year' ? 'current_scope' : ''"
                  @click="setScope('year')">本年</span>
                <el-date-picker v-model="params.range_time" type="daterange" range-separator="至"
                  start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD" @change="switchRangeTime" size="default" />
              </div>
            </div>
          </template>
          <div class="statistical-body">
            <el-row :gutter="20">
              <el-col :md="24" :lg="24" :offset="0">
                <div ref="chatBar" id="chart"></div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="15" v-permission="55">
      <el-col :md="24" :lg="8" :offset="0">
        <el-card shadow="hover">
          <template #header>
            <div>
              <span>公司消费榜</span>
            </div>
          </template>
          <el-table :data="store" border stripe
            :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }" id="card-rank">
            <el-table-column prop="store_name" label="公司名称" min-width="90" />
            <el-table-column prop="order_number" label="订单数" />
            <el-table-column prop="sales_volume" label="实际支付金额 (元)" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :md="24" :lg="8" :offset="0">
        <el-card shadow="hover">
          <template #header>
            <div>
              <span>会员消费榜</span>
            </div>
          </template>
          <el-table :data="userRank" border stripe
            :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }" id="card-rank">
            <el-table-column prop="user_mobile" label="会员信息" min-width="90" />
            <el-table-column prop="order_number" label="订单数" />
            <el-table-column prop="sales_volume" label="实际支付金额 (元)" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :md="24" :lg="8" :offset="0">
        <el-card shadow="hover">
          <template #header>
            <div>
              <span>商品销售榜</span>
            </div>
          </template>
          <el-table :data="goodsRank" border stripe
            :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }" id="card-rank">
            <el-table-column prop="goods_name" label="商品名称" min-width="180" show-overflow-tooltip />
            <el-table-column prop="total_sales_num" label="销量 (件)" />
            <el-table-column prop="sales_volume" label="销售额 (元)" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog v-model="dialogVisible" :title="noticeDetail.title"
      :width="$store.state.isMobile? '90%' : '40%'">
      <div class="main">
        <div style="font-size: 14px; color: #333; line-height: 24px; margin: 0 0 15px">
          {{ noticeDetail.content }}</div>
        <div style="font-size: 14px; color: #666">发布时间:{{ noticeDetail.create_time }}</div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 订单未跟进公司展示 -->
    <!-- <el-dialog v-model="dialogFollowVisible" title="订单未跟进公司"
      :width="$store.state.isMobile? '90%' : '40%'" class="follow">
      <el-scrollbar class="follow-main">
        <el-table :data="followData" style="width: 100%">
          <el-table-column prop="branch_name" label="公司名称" />
          <el-table-column prop="total" label="未跟进订单数" />
        </el-table>
      </el-scrollbar>
      <template #footer>
        <div class="notice">
          <span>注：</span>列表中显示2021.1.1至{{threeDay}}从未反馈订单跟进情况的数据，请各分公司如实并及时反馈订单跟进情况，以免影响集团广告投放！！
        </div>
      </template>
    </el-dialog> -->
  </div>
</template>

<script setup>
import * as echarts from 'echarts/core'
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
import { LabelLayout } from 'echarts/features'
import { BarChart, PieChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import home from '@/api/home'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import moment from 'moment'

const panels = ref([])
const pending = ref([])
const userRank = ref([])
const goodsRank = ref([])
// const notice = ref([])
const tooltip_name = ref('订单数')
const store = ref(null)
const chatBar = ref(null)
const threeDay = ref(null)
const params = reactive({
  type: 'order',
  scope: 'week',
  range_time: '',
})
// 当天日期
const currentDay = moment().format('YYYY-MM-DD')
// 3天前日期
threeDay.value = moment().add(-3, 'd').format('YYYY-MM-DD')
// 6天前日期,近7日
const weekDay = moment().add(-6, 'd').format('YYYY-MM-DD')
// 29天前日期,近3日
const week30Day = moment().add(-29, 'd').format('YYYY-MM-DD')
// 当月1号日期
const monthStartDay = moment().startOf('month').format('YYYY-MM-DD')
// 当月最后一天日期
const monthEndDay = moment().endOf('month').format('YYYY-MM-DD')
// 当年第一天日期
const yearStartDay = moment().startOf('year').format('YYYY-MM-DD')
// 设置默认近7日
params.range_time = [weekDay, currentDay]
// console.log(moment().format('YYYY-MM-DD'))
// console.log(currentDay, weekDay, monthStartDay, monthEndDay, yearStartDay)
// 面板数据
home.getData().then((res) => {
  panels.value = res.result.panels
  pending.value = res.result.pending
  store.value = res.result.store
  userRank.value = res.result.userRank
  goodsRank.value = res.result.goodsRank
})

// 公告数据
// home.getNotice().then((res) => {
//   notice.value = res.result
// })

// 未跟进订单公司数据
const followData = ref([])
// home.getFollowData().then((res) => {
//   followData.value = res.result
// })

const setType = (val) => {
  params.type = val
  switch (val) {
    case 'order':
      tooltip_name.value = '订单数'
      break
    case 'price':
      tooltip_name.value = '销售额'
      break
    default:
      tooltip_name.value = '订单数'
      break
  }
  getBarData()
}
const setScope = (val) => {
  switch (val) {
    case 'week':
      params.range_time = [weekDay, currentDay]
      break
    case 'month':
      params.range_time = [week30Day, currentDay]
      break
    case 'current_month':
      params.range_time = [monthStartDay, currentDay]
      break
    case 'year':
      params.range_time = [yearStartDay, currentDay]
      break
    default:
      params.range_time = [weekDay, currentDay]
      break
  }
  params.scope = val
  getBarData()
  //getSign()
}
const switchRangeTime = (val) => {
  if (val) {
    params.scope = ''
  } else {
    params.scope = 'week'
  }
  getBarData()
  //getSign()
}
echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer, LegendComponent, PieChart, LabelLayout])
let chartBar = null
let chartPie = null
onMounted(() => {
  if (chatBar.value && chatBar.value.offsetWidth > 0) {
    chartBar = echarts.init(chatBar.value)
    getBarData()
  }
})
onUnmounted(() => {
  // 页面卸载销毁echarts
  if (chartBar) {
    echarts.dispose()
  }
})
// 柱状图数据
const getBarData = () => {
  let option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '1%',
      right: '4%',
      bottom: '2%',
      top: '10%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: [],
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: '',
        type: 'bar',
        barWidth: '60%',
        itemStyle: {
          color: '#004c59',
        },
        data: [],
      },
    ],
  }
  chartBar.showLoading()
  home
    .getBarData(params)
    .then((res) => {
      option.xAxis[0].data = res.result.x
      option.series[0].data = res.result.y
      option.series[0].name = res.result.tooltip_name
      chartBar.setOption(option)
    })
    .finally(() => {
      chartBar.hideLoading()
    })
}

// 查看公告详情
const dialogVisible = ref(false)
const noticeDetail = ref([])
const readNotice = (item) => {
  noticeDetail.value = item
  dialogVisible.value = true
}
// 未跟进订单公司展示
const dialogFollowVisible = ref(false)
</script>

<style lang="scss" scoped>
.panels {
  .el-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
      line-height: 22px;
    }
    .el-icon {
      color: #999;
    }
  }
  .el-card-body {
    .number {
      height: 38px;
      margin-top: 4px;
      margin-bottom: 0;
      overflow: hidden;
      color: rgba(0, 0, 0, 0.85);
      font-size: 30px;
      line-height: 38px;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
    }
  }
  .el-card-footer {
    margin-top: 8px;
    padding-top: 9px;
    border-top: 1px solid #f0f0f0;
    font-size: 12px;
    height: 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    i {
      font-style: normal;
      padding-left: 8px;
      color: rgba(0, 0, 0, 0.85);
    }
    .el-icon {
      width: 20px;
      height: 20px;
      position: relative;
      top: 2px;
    }
    .success {
      color: #67c23a;
    }
    .fail {
      color: #f56c6c;
    }
  }
}
.panels-order {
  margin: 15px 0 !important;
}
.panels-order .el-card {
  width: 100%;
  padding: 20px 0;
}
.panels-order p {
  font-size: 14px;
}
.panels-order .val {
  color: #004c59;
  margin-top: 15px;
  font-size: 16px;
  font-weight: bold;
}
.panels .el-card {
  margin-bottom: 15px !important;
  cursor: pointer;
}
.tar {
  text-align: right;
}
.tal {
  text-align: left;
}
.statistical {
  margin: 0 0 15px;
  .statistical-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .type {
      cursor: pointer;
      span {
        padding-right: 15px;
      }
    }
    .date {
      cursor: pointer;
      span {
        padding-right: 15px;
      }
    }
    .current_type,
    .current_scope {
      color: var(--color);
    }
  }
  :deep(.el-card__body) {
    padding: 0 20px 20px !important;
  }
  .statistical-body {
    #chart {
      width: 100%;
      height: 370px;
    }
  }
}
.branch_sort {
  padding: 20px 0 0 0;
  .branch_sort-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    height: 22px;
    line-height: 22px;
    color: #333;
    margin-top: 10px;
    .sort-name {
      display: flex;
      align-items: center;
    }
    .sort {
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-top: 1.5px;
      margin-right: 16px;
      font-weight: 600;
      font-size: 12px;
      line-height: 20px;
      text-align: center;
      background-color: #fafafa;
      border-radius: 20px;
    }
    .active {
      color: #fff;
      background-color: var(--color);
    }
    .name {
      display: inline-block;
      max-width: 100px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
#pie,
#card-rank {
  height: 370px;
}
.notice-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  cursor: pointer;
  .title {
    font-size: 14px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .time {
    padding-left: 10px;
    font-size: 14px;
    color: #666;
  }
}
.notice-item:hover {
  .title,
  .time {
    color: var(--color);
  }
}
.follow-main {
  height: 300px;
  overflow: hidden;
}
:deep(.follow .el-dialog__footer) {
  text-align: left !important;
}
.follow .notice {
  font-size: 14px;
  color: #999;
}
.follow .notice span {
  color: #f56c6c;
}
:deep(.follow-main .el-table .el-table__cell) {
  text-align: center !important;
}
.operation-tool {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.operation-tool-icon {
  font-size: 12px;
  width: 28px;
  height: 28px;
  border-radius: 5px;
  background: #67c23a;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
}
</style>
