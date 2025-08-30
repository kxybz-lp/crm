<template>
  <div class="app-container">
    <el-card class="card" shadow="hover">
      <el-form :model="params" ref="formRef" label-width="70px" :class="$store.state.isMobile ? 'el-form-m' : 'el-form-p'" :label-position="$store.state.isMobile ? 'top' : 'left'">
        <el-form-item label="类别">
          <el-radio-group v-model="params.type" @change="setType">
            <el-radio-button label="store">按公司</el-radio-button>
            <el-radio-button label="region">按区域</el-radio-button>
            <el-radio-button label="report">日报表</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="时间" v-if="params.type != 'report'">
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
        <el-form-item label="阶段" v-if="params.type != 'report'">
          <el-radio-group v-model="params.stage" @change="setStage">
            <el-radio-button label="0">全部</el-radio-button>
            <el-radio-button label="1">第一阶段</el-radio-button>
            <el-radio-button label="2">第二阶段</el-radio-button>
            <el-radio-button label="3">第三阶段</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="区域" v-if="params.type == 'store' && params.type != 'report'">
          <el-select v-model="params.region_id" placeholder="选择或搜索区域" clearable multiple collapse-tags :max-collapse-tags="3" collapse-tags-tooltip filterable @change="regionChange">
            <el-option :value="item.id" :label="item.name" v-for="item in regionList" :key="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司" v-if="params.type == 'store' && params.type != 'report'">
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
          <el-button v-permission="237" type="danger" @click="handExport" :loading="loading">导出</el-button>
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
          :span-method="objectSpanMethod"
          @sort-change="handleSortChange"
        >
          <el-table-column prop="region_name" label="区域" min-width="100" />
          <el-table-column prop="store_name" label="公司" min-width="100" v-if="params.type !== 'region'" />
          <el-table-column prop="goal" label="签单目标" sortable min-width="100" v-if="params.type !== 'report'" />
          <el-table-column prop="order_count" label="签单数" sortable min-width="100" v-if="params.type !== 'report'" />
          <el-table-column prop="per" label="完成率" sortable min-width="100" v-if="params.type !== 'report'">
            <template #default="scope"> {{ scope.row.per }}% </template>
          </el-table-column>
          <el-table-column prop="order_count_today" label="昨日签单数" sortable min-width="100" v-if="params.type === 'report'" />
          <el-table-column prop="order_count" label="累计签单数" sortable min-width="100" v-if="params.type === 'report'" />
          <el-table-column prop="per" label="总目标完成率" sortable min-width="100" v-if="params.type === 'report'">
            <template #default="scope"> {{ scope.row.per }}% </template>
          </el-table-column>
          <el-table-column prop="order_count_state" label="一阶段签单数" sortable min-width="100" v-if="params.type === 'report'" />
          <el-table-column prop="per_state" label="一阶段完成率" sortable min-width="100" v-if="params.type === 'report'">
            <template #default="scope"> {{ scope.row.per_state }}% </template>
          </el-table-column>
          <el-table-column prop="goal" label="活动总目标" sortable min-width="100" v-if="params.type === 'report'" />
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
  const sums = []
  const summaryData = {
    goal: 0,
    order_count: 0,
    order_count_today: 0,
    order_count_state: 0,
  }

  // 先计算数值型列的总和
  data.forEach((item) => {
    if (item.store_name != '合计') {
      summaryData.goal += item.goal || 0
      summaryData.order_count += item.order_count || 0
      summaryData.order_count_today += item.order_count_today || 0
      summaryData.order_count_state += item.order_count_state || 0
    }
  })

  // 计算完成率（基于汇总值计算）
  const completionRate = summaryData.goal > 0 ? summaryData.order_count / summaryData.goal : 0
  // 计算阶段完成率（基于汇总值计算）
  const completionRateState = summaryData.goal > 0 ? summaryData.order_count_state / summaryData.goal : 0

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
      case 'order_count_today':
        sums[index] = summaryData.order_count_today
        break
      case 'order_count_state':
        sums[index] = summaryData.order_count_state
        break
      case 'per':
        sums[index] = `${(completionRate * 100).toFixed(2)}%`
        break
      case 'per_state':
        sums[index] = `${(completionRateState * 100).toFixed(2)}%`
        break
      default:
        sums[index] = '—'
        break
    }
  })

  return sums
}

// 存储每个区域的合并行数（索引对应tableData的行索引）
const regionSpanArr = ref([])
// 数据预处理：统计每个区域的合并行数
const handleRegionSpan = (data) => {
  if (!data.length) return
  // 按region_id排序，确保同区域数据连续
  //const sortedData = rawData.sort((a, b) => a.region_id - b.region_id);
  regionSpanArr.value = []
  let currentRegion = data[0].region_name // 当前区域名称
  let spanCount = 1 // 当前区域的重复次数（初始为1）

  // 从第2行开始遍历，对比当前行与上一行的区域名称
  for (let i = 1; i < data.length; i++) {
    if (data[i].region_name === currentRegion) {
      // 区域相同：累计次数
      spanCount++
    } else {
      // 区域不同：记录上一区域的合并行数，重置当前区域和次数
      regionSpanArr.value.push(spanCount)
      currentRegion = data[i].region_name
      spanCount = 1
    }
    // 处理最后一行数据
    if (i === data.length - 1) {
      regionSpanArr.value.push(spanCount)
    }
  }
}

// 合并规则函数：Element Plus表格调用
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  // 非日报表不合并
  if (params.type != 'report') return { rowspan: 1, colspan: 1 }
  // 只处理第一列（区域名称列，columnIndex为0）
  if (columnIndex === 0) {
    // 计算当前行在regionSpanArr中的“分组索引”（累计合并行数的总和）
    const groupIndex = regionSpanArr.value.reduce((acc, curr, index) => {
      if (rowIndex < acc) return acc
      return acc + curr
    }, 0)
    // 找到当前行所属分组的合并行数
    const span = regionSpanArr.value.find((_, idx) => {
      const sum = regionSpanArr.value.slice(0, idx + 1).reduce((a, b) => a + b, 0)
      return rowIndex < sum
    })
    // 若为分组的第一条数据：合并span行；否则：隐藏单元格
    return rowIndex === groupIndex - span ? { rowspan: span, colspan: 1 } : { rowspan: 0, colspan: 0 }
  }
  // 其他列：不合并
  return { rowspan: 1, colspan: 1 }
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
        // 合并区域相同的列
        handleRegionSpan(dataList.value)
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

// 日报表导出
const exports_report = (filename) => {
  return new Promise((resolve, reject) => {
    elLoading('数据导出中...')

    // 准备导出数据
    const exportData = dataList.value.map((item) => ({
      区域: item.region_name,
      公司: item.store_name,
      昨日签单数: item.order_count_today,
      累计签单数: item.order_count,
      总目标完成率: item.per,
      一阶段签单数: item.order_count_state,
      一阶段完成率: item.per_state,
      总目标: item.goal,
    }))

    // 创建工作簿和工作表
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '报单数据')

    // 设置列宽 (字符宽度)
    const columnWidths = [{ wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }]
    worksheet['!cols'] = columnWidths

    // 设置表头样式，需要使用xlsx-style库扩展样式功能
    setHeaderStyle(worksheet)

    try {
      // 生成文件并导出
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
        cellStyles: true, // 启用样式
      })
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
      saveAs(blob, '报表数据_' + new Date().toLocaleDateString() + '.xlsx')
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

// 设置表头样式
const setHeaderStyle = (worksheet) => {
  // 获取表头单元格地址 (默认是A1, B1, C1...)
  const headerCells = Object.keys(worksheet).filter((key) => key.replace(/[0-9]/g, '') !== '' && parseInt(key.replace(/[A-Z]/g, '')) === 1)

  headerCells.forEach((cell) => {
    worksheet[cell].s = {
      fill: { fgColor: { rgb: '409EFF' } }, // 表头背景色(蓝色)
      font: {
        color: { rgb: 'FFFFFF' }, // 字体颜色(白色)
        sz: 12, // 字体大小
        bold: true, // 加粗
      },
      alignment: { horizontal: 'center' }, // 水平居中
    }
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
