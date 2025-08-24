<template>
  <div class="app-container">
    <el-card class="card" shadow="hover">
      <el-form :model="params" ref="formRef" label-width="70px" :class="$store.state.isMobile ? 'el-form-m' : 'el-form-p'" :label-position="$store.state.isMobile ? 'top' : 'left'">
        <el-form-item label="类别">
          <el-radio-group v-model="params.type" @change="setType">
            <el-radio-button label="store">按公司</el-radio-button>
            <el-radio-button label="region">按区域</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="时间">
          <el-button-group v-show="!$store.state.isMobile">
            <el-button :type="params.scope === 'all' ? 'primary' : ''" @click="setScope('all')"> 全部 </el-button>
            <el-button :type="params.scope === 'today' ? 'primary' : ''" @click="setScope('today')"> 今日</el-button>
            <el-button :type="params.scope === 'yestoday' ? 'primary' : ''" @click="setScope('yestoday')">昨日</el-button>
            <el-button :type="params.scope === 'last7day' ? 'primary' : ''" @click="setScope('last7day')">近7日</el-button>
            <el-button :type="params.scope === 'last30day' ? 'primary' : ''" @click="setScope('last30day')">近30日</el-button>
            <el-button :type="params.scope === 'month' ? 'primary' : ''" @click="setScope('month')"> 本月</el-button>
            <el-button :type="params.scope === 'year' ? 'primary' : ''" @click="setScope('year')">本年 </el-button>
          </el-button-group>
          <template v-if="!$store.state.isMobile">
            <el-date-picker
              v-model="params.create_time"
              value-format="YYYY-MM-DD"
              :editable="false"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="switchTime"
            />
          </template>
          <template v-else>
            <el-date-picker
              style="width: 100%; margin-bottom: 10px"
              v-model="params.create_time_start"
              type="date"
              placeholder="开始日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :editable="false"
              @change="switchTime"
              clearable
            />
            <el-date-picker
              style="width: 100%"
              v-model="params.create_time_end"
              type="date"
              placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :editable="false"
              @change="switchTime"
              clearable
            />
          </template>
        </el-form-item>
        <el-form-item label="阶段">
          <el-radio-group v-model="params.stage" @change="setStage">
            <el-radio-button label="0">全部</el-radio-button>
            <el-radio-button label="1">第一阶段</el-radio-button>
            <el-radio-button label="2">第二阶段</el-radio-button>
            <el-radio-button label="3">第三阶段</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="区域" v-if="params.type == 'store'">
          <el-select v-model="params.region_id" placeholder="选择或搜索区域" clearable multiple collapse-tags :max-collapse-tags="3" collapse-tags-tooltip filterable @change="regionChange">
            <el-option :value="item.id" :label="item.name" v-for="item in regionList" :key="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司" v-if="params.type == 'store'">
          <el-select v-model="params.report_store_id" placeholder="选择或搜索公司" clearable multiple collapse-tags :max-collapse-tags="3" collapse-tags-tooltip filterable @change="storeChange">
            <el-option label="全选" :value="0" @click="selectAllStore"></el-option>
            <el-option :value="item.id" :label="item.name" v-for="item in storeList" :key="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="params.tab !== 'other'">
          <el-button @click="onReset">重置</el-button>
          <el-button type="primary" @click="onSubmit" :loading="loading">生成报表</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="20" v-if="dataList.length > 0">
        <el-col :span="24" :offset="0" style="text-align: right; margin-bottom: 15px">
          <el-button v-permission="120" type="danger" @click="handExport" :loading="loading">导出</el-button>
        </el-col>
      </el-row>
      <div class="tableData" style="padding-bottom: 15px" v-loading="loading" element-loading-text="数据加载中......">
        <el-table
          id="execTable"
          v-if="dataList.length > 0"
          :data="dataList"
          border
          stripe
          :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }"
          show-summary
          :summary-method="getSummaries"
          @sort-change="handleSortChange"
        >
          <el-table-column prop="region_name" label="区域" min-width="100" />
          <el-table-column prop="store_name" label="公司" min-width="100" v-if="params.type === 'store'" />
          <el-table-column prop="goal" label="签单目标" sortable min-width="100" />
          <el-table-column prop="order_count" label="签单数" sortable min-width="100" />
          <el-table-column prop="per" label="完成率" sortable min-width="100">
            <template #default="scope"> {{ scope.row.per }}% </template>
          </el-table-column>
          <!-- <el-table-column label="完成率">
            <template #default="{ row }"> {{ ((row.order_count / row.goal) * 100).toFixed(2) }}% </template>
          </el-table-column> -->
        </el-table>
      </div>
    </el-card>
  </div>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'
import moment from 'moment'
import report_order from '@/api/report_order'
import { closeElLoading, createUniqueString, elLoading, toast, time_init, changeTimeType, param } from '@/utils/utils'
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
  type: 'store',
  create_time: '',
  create_time_start: '',
  create_time_end: '',
  region_id: '',
  report_store_id: '',
  stage: 0,
  scope: 'all',
})

const storeChange = (val) => {
  dataList.value = []
  // params.type = 'store'
}
const regionChange = (val) => {
  dataList.value = []
  // params.type = 'region'
}

// 公司全选
const selectAllStore = (e) => {
  let companys = storeList.value.map((item) => item.id)
  if (params.report_store_id.includes(0) && params.report_store_id.length - 1 < storeList.value.length) {
    params.report_store_id = companys
  } else {
    params.report_store_id = ''
  }
}

const dataList = ref([])

// 时间按钮切换
const setScope = (val) => {
  switch (val) {
    case 'all':
      params.create_time = ''
      break
    case 'today':
      params.create_time = [currentDay, currentDay]
      console.log(params.create_time)

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
  dataList.value = []
}

// 类型切换
const setType = (val) => {
  dataList.value = []
}
// 阶段切换
const setStage = (val) => {
  dataList.value = []
  params.scope = 'all'
  switch (val) {
    case '1':
      params.create_time = ['2025-08-29', '2025-09-14']
      break
    case '2':
      params.create_time = ['2025-09-15', '2025-09-28']
      break
    case '3':
      params.create_time = ['2025-09-29', '2025-10-19']
      break
    default:
      params.create_time = ''
  }
}

// 时间选择器切换
const switchTime = (val) => {
  if (val) {
    params.scope = ''
  } else {
    params.scope = 'all'
  }
  // params.create_time = params.create_time_start = params.create_time_end = ''
  dataList.value = []
}

// 合计
const getSummaries = (param) => {
  const { columns, data } = param
  console.log(columns)
  const sums = []
  const summaryData = {
    goal: 0,
    order_count: 0,
  }

  // 先计算数值型列的总和
  data.forEach((item) => {
    summaryData.goal += item.goal || 0
    summaryData.order_count += item.order_count || 0
  })

  // 计算完成率（基于汇总值计算）
  const completionRate = summaryData.goal > 0 ? summaryData.order_count / summaryData.goal : 0

  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }

    const property = column.property
    switch (property) {
      case 'goal':
        sums[index] = summaryData.goal
        break
      case 'order_count':
        sums[index] = summaryData.order_count
        break
      case 'per':
        sums[index] = `${(completionRate * 100).toFixed(2)}%`
        break
      default:
        sums[index] = '—'
        break
    }
  })

  return sums
}

// 生成报表
const onSubmit = () => {
  getData(params)
}
// 排序
const handleSortChange = ({ prop, order }) => {
  dataList.value.sort((a, b) => {
    // 处理排序顺序
    const modifier = order === 'ascending' ? 1 : -1

    // 根据属性类型进行比较
    if (a[prop] < b[prop]) return -1 * modifier
    if (a[prop] > b[prop]) return 1 * modifier
    return 0
  })
}

// 获取查询数据
const getData = (param) => {
  loading.value = true
  report_order
    .getAnalysis(param)
    .then((res) => {
      if (res.code > 0) {
        // dataList.value = res.result.filter((item) => item.order_number > 0 || item.arrange_number > 0 || item.docking_number > 0)
        res.result.forEach((element) => {
          element.per = parseFloat(element.per)
        })
        dataList.value = res.result
      } else {
        let msg = res.message || '数据请求失败'
        toast(msg, 'error')
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const exports = (filename) => {
  return new Promise((resolve, reject) => {
    elLoading('数据导出中...')
    /* 从表生成工作簿对象 */
    let dom
    if (dataList.value.length > 0) {
      dom = document.querySelector('#execTable')
    }
    var wb = XLSX.utils.table_to_book(dom)
    /* 获取二进制字符串作为输出 */
    var wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'array',
    })
    try {
      FileSaver.saveAs(
        new Blob([wbout], { type: 'application/octet-stream' }),
        //设置导出文件名称
        filename
      )
    } catch (e) {
      if (typeof console !== 'undefined') toast(e.wbout, 'error')
    }
    resolve()
    return wbout
  })
}

// 导出报表
const handExport = () => {
  let filename = time_init(true) + '-' + createUniqueString() + '.xlsx'
  exports(filename).then((res) => {
    closeElLoading()
  })
}

// 重置
const onReset = () => {
  params.create_time = ''
  params.create_time_start = ''
  params.create_time_end = ''
  params.region_id = ''
  params.report_store_id = ''
  params.stage = 0
  params.scope = 'all'
  params.type = 'store'
  dataList.value = []
}

// 获取select数据
const regionList = ref([])
const storeList = ref([])

const getSelectData = () => {
  report_order.getSelect().then((res) => {
    if (res.code > 0) {
      regionList.value = res.result.region
      storeList.value = res.result.store
    } else {
      toast(res.message || 'Error', 'error')
    }
  })
}
getSelectData()
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
</style>
