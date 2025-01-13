<template>
  <div :class="$store.state.isMobile && params.tab == 'store' ? 'scroll-container' : ''">
    <div class="app-container" @scroll="handleScroll">
      <el-card class="analysis-card" shadow="hover" :class="params.tab === 'state' ? 'state' : ''">
        <el-tabs v-model="params.tab" @tab-change="handleTabChange" v-permission="195">
          <el-tab-pane :label="item.name" :name="item.key" v-for="item in tabbars" :key="item.key">
          </el-tab-pane>
        </el-tabs>
        <el-form :model="params" ref="formRef" label-width="70px"
          :class="$store.state.isMobile ? 'el-form-m' : 'el-form-p'"
          :label-position="$store.state.isMobile ? 'top' : 'left'">
          <el-form-item label="下单时间">
            <el-button-group v-show="!$store.state.isMobile">
              <el-button :type="params.scope === 'all' ? 'primary' : ''" @click="setScope('all')">
                全部
              </el-button>
              <el-button :type="params.scope === 'today' ? 'primary' : ''"
                @click="setScope('today')">
                今日</el-button>
              <el-button :type="params.scope === 'yestoday' ? 'primary' : ''"
                @click="setScope('yestoday')">昨日</el-button>
              <el-button :type="params.scope === 'last7day' ? 'primary' : ''"
                @click="setScope('last7day')">近7日</el-button>
              <el-button :type="params.scope === 'last30day' ? 'primary' : ''"
                @click="setScope('last30day')">近30日</el-button>
              <el-button :type="params.scope === 'month' ? 'primary' : ''"
                @click="setScope('month')">
                本月</el-button>
              <el-button :type="params.scope === 'year' ? 'primary' : ''"
                @click="setScope('year')">本年
              </el-button>
            </el-button-group>
            <template v-if="!$store.state.isMobile">
              <el-date-picker v-model="params.create_time" value-format="YYYY-MM-DD"
                :editable="false" type="daterange" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" @change="switchTime" />
            </template>
            <template v-else>
              <el-date-picker style="width: 100%;margin-bottom: 10px;"
                v-model="params.create_time_start" type="date" placeholder="开始日期"
                format="YYYY-MM-DD" value-format="YYYY-MM-DD" :editable="false" @change="switchTime"
                clearable />
              <el-date-picker style="width: 100%" v-model="params.create_time_end" type="date"
                placeholder="结束日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                @change="switchTime" :editable="false" clearable />
            </template>
          </el-form-item>
          <!-- <el-form-item v-if="params.tab === 'order'" label="订单类型">
            <el-select v-model="params.order_type" placeholder="选择或搜索订单类型" clearable
              :collapse-tags="$store.state.isMobile" :max-collapse-tags="3" collapse-tags-tooltip>
              <el-option :value="item.id" :label="item.name" v-for="item in orderType"
                :key="item.id">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button @click="onReset">重置</el-button>
            <el-button type="primary" @click="onSubmit" :loading="loading">生成报表</el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="20"
          v-if="dataOrderList.length > 0 || dataGoodsList.length > 0 || dataUserList.length > 0 || dataStoreList.length > 0">
          <el-col :span="24" :offset="0" style="text-align: right; margin-bottom: 15px">
            <el-button v-permission="196" type="danger" @click="handExport"
              :loading="loading">导出</el-button>
          </el-col>
        </el-row>
        <div class="tableData" style="padding-bottom: 15px" v-loading="loading"
          element-loading-text="数据加载中......">
          <!-- 订单 -->
          <el-table id="orderTable" v-if="dataOrderList.length > 0" :data="dataOrderList" border
            stripe :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }">
            <el-table-column prop="total" label="总订单数" min-width="90" />
            <el-table-column prop="notPay" label="待支付订单数" />
            <el-table-column prop="notDeliver" label="待发货订单数" />
            <el-table-column prop="totalPrice" label="总金额" />
          </el-table>
          <!-- 商品 -->
          <el-table id="goodsTable" v-if="dataGoodsList.length > 0" :data="dataGoodsList" border
            stripe :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }">
            <el-table-column prop="goods_name" label="商品名称" min-width="90" />
            <el-table-column prop="total_sales_num" label="销量 (件)" />
            <el-table-column prop="sales_volume" label="销售额 (元)" />
          </el-table>
          <!-- 用户 -->
          <el-table id="userTable" v-if="dataUserList.length > 0" :data="dataUserList" border stripe
            :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }">
            <el-table-column prop="user_mobile" label="用户信息" min-width="90" />
            <el-table-column prop="order_number" label="订单数" />
            <el-table-column prop="sales_volume" label="实际支付金额 (元)" />
          </el-table>
          <!-- 公司 -->
          <el-table id="storeTable" v-if="dataStoreList.length > 0" :data="dataStoreList" border
            stripe :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }">
            <el-table-column prop="store_name" label="公司名称" min-width="90" />
            <el-table-column prop="order_number" label="订单数" />
            <el-table-column prop="sales_volume" label="实际支付金额 (元)" />
          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import moment from 'moment'
import order from '@/api/order'
import { closeElLoading, createUniqueString, elLoading, showModal, showPrompt, toast, time_init } from '@/utils/utils'
import search from '@/api/search'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { useStore } from 'vuex'

const store = useStore()

// 当天
const currentDay = moment().format('YYYY-MM-DD')
// 昨天
const lastDay = moment().add(-1, 'd').format('YYYY-MM-DD')
// 近7天
const week7Day = moment().add(-6, 'd').format('YYYY-MM-DD')
// 近30日
const week30Day = moment().add(-29, 'd').format('YYYY-MM-DD')
// 当月1号
const monthStartDay = moment().startOf('month').format('YYYY-MM-DD')
// 当月最后一天
const monthEndDay = moment().endOf('month').format('YYYY-MM-DD')
// 当年第一天
const yearStartDay = moment().startOf('year').format('YYYY-MM-DD')

const loading = ref(false)
const formRef = ref(null)
const params = reactive({
  tab: 'order',
  create_time: '',
  create_time_start: '',
  create_time_end: '',
  order_type: '',
  province_id: '',
  city_id: '',
  region_id: '',
  store_id: '',
  scope: 'all',
})

const dealPage = reactive({
  page: 1,
  pageSize: 20,
  countPage: 1,
})

// tabs
let tabbars = [
  {
    key: 'order',
    name: '订单',
  },
  {
    key: 'goods',
    name: '商品',
  },
  {
    key: 'user',
    name: '用户',
  },
  {
    key: 'store',
    name: '公司',
  },
]

const orderType = [
  {
    id: 1,
    name: '待发货',
  },
  {
    id: 2,
    name: '待收货',
  },
  {
    id: 3,
    name: '待付款',
  },
  {
    id: 4,
    name: '已完成',
  },
  {
    id: 5,
    name: '待取消',
  },
  {
    id: 6,
    name: '已取消',
  },
]
// 渠道报表数据
const dataOrderList = ref([])
const dataGoodsList = ref([])
const dataUserList = ref([])
const dataStoreList = ref([])

const handleScroll = () => {
  if (store.state.isMobile) {
    // setTimeout(() => {
    //   let appContainer = document.querySelector('.app-container')
    //   if (appContainer.scrollTop + appContainer.clientHeight + 10 >= appContainer.scrollHeight && !loadMore.value && dataDealList.value.length > 0 && dealPage.page < dealPage.countPage) {
    //     loadMore.value = true
    //     dealPage.page++
    //     let start = (dealPage.page - 1) * dealPage.pageSize
    //     let list = JSON.parse(JSON.stringify(dataDealList2.value))
    //     list = list.splice(start, dealPage.pageSize)
    //     dataDealList.value = [...dataDealList.value, ...list]
    //     loadMore.value = false
    //   }
    // }, 100)
  }
}

// tabs切换
const handleTabChange = (val) => {
  params.create_time = ''
  params.create_time_start = ''
  params.create_time_end = ''
  params.order_type = ''
  params.province_id = ''
  params.city_id = ''
  params.region_id = ''
  params.store_id = ''
  params.scope = 'all'
  dataOrderList.value = []
  dataGoodsList.value = []
  dataUserList.value = []
  dataStoreList.value = []
}
// 时间按钮切换
const setScope = (val) => {
  switch (val) {
    case 'all':
      params.create_time = ''
      break
    case 'today':
      params.create_time = [currentDay, currentDay]
      break
    case 'yestoday':
      params.create_time = [lastDay, lastDay]
      break
    case 'last7day':
      params.create_time = [week7Day, currentDay]
      break
    case 'last30day':
      params.create_time = [week30Day, currentDay]
      break
    case 'month':
      params.create_time = [monthStartDay, currentDay]
      break
    case 'year':
      params.create_time = [yearStartDay, currentDay]
      break
    default:
      params.create_time = ''
      break
  }
  params.scope = val
  dataOrderList.value = []
  dataGoodsList.value = []
  dataUserList.value = []
  dataStoreList.value = []
  // getBarData()
}

// 时间选择器切换
const switchTime = (val) => {
  if (val) {
    params.scope = ''
  } else {
    params.scope = 'all'
  }
  dataOrderList.value = []
  dataGoodsList.value = []
  dataUserList.value = []
  dataStoreList.value = []
  // getBarData()
}
// 重置
const onReset = () => {
  params.create_time = ''
  params.create_time_start = ''
  params.create_time_end = ''
  params.order_type = ''
  params.province_id = ''
  params.city_id = ''
  params.region_id = ''
  params.store_id = ''
  params.scope = 'all'
  dataOrderList.value = []
  dataGoodsList.value = []
  dataUserList.value = []
  dataStoreList.value = []
}

// 生成报表
const onSubmit = () => {
  // if (params.tab === 'source') {
  //   toast('请选择渠道', 'error')
  //   return
  // }
  getData(params)
}

// 获取查询数据
const getData = (param) => {
  loading.value = true
  order
    .getAnalysis(param)
    .then((res) => {
      if (res.code > 0) {
        if (param.tab === 'order') {
          dataOrderList.value = res.result
        } else if (param.tab === 'goods') {
          dataGoodsList.value = res.result
        } else if (param.tab === 'user') {
          dataUserList.value = res.result
        } else if (param.tab === 'store') {
          dataStoreList.value = res.result
        }
      } else {
        let msg = res.message || '数据请求失败'
        toast(msg, 'error')
      }
    })
    .finally(() => {
      loading.value = false
    })
}

// 导出报表
const handExport = () => {
  let filename = time_init(true) + '-' + createUniqueString() + '.xlsx'
  exports(filename).then((res) => {
    closeElLoading()
  })
}
</script>
<style lang="scss" scoped>
.el-form-p {
  width: 80%;
}
.el-form-m {
  width: 100%;
}
.el-form-m :deep(.el-input__wrapper),
.state :deep(.el-input__wrapper) {
  width: 100%;
}
.el-button-group {
  margin-right: 10px;
}
.el-form-item__label {
  font-weight: 700;
}
.search-tag {
  margin-bottom: 20px;
}
.search-tag .el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
  cursor: pointer;
}
:deep(.el-form-item__label) {
  font-weight: 700 !important;
}
// :deep(.el-table__expand-icon) {
//   display: none;
// }
.scroll-container {
  height: 100%;
  overflow-y: hidden;
}
.app-container {
  height: 100%;
  overflow-y: scroll;
}
.app-container::-webkit-scrollbar-track-piece {
  background-color: rgba(255, 255, 255, 0.6);
}
.app-container::-webkit-scrollbar {
  width: 5px !important;
  height: 3px;
}
.app-container::-webkit-scrollbar-thumb {
  background-color: #999;
  background-clip: padding-box;
  min-height: 28px;
  overflow-x: hidden;
}
.app-container::-webkit-scrollbar-thumb:hover {
  background-color: #000;
}
</style>
