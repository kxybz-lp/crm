<template>
  <div class="app-container">
    <el-card class="admin-card" shadow="hover">
      <el-tabs v-model="params.tab" @tab-change="handleTabChange">
        <el-tab-pane :label="item.name" :name="item.key" v-for="item in tabbars" :key="item.key"> </el-tab-pane>
      </el-tabs>
      <el-form :model="params" ref="formRef" label-width="60px" size="small">
        <el-form-item v-if="params.tab === 'channel' || params.tab === 'source'" label="下单时间">
          <el-button-group>
            <el-button :type="params.scope === 'all' ? 'primary' : ''" @click="setScope('all')">全部</el-button>
            <el-button :type="params.scope === 'today' ? 'primary' : ''" @click="setScope('today')">今日</el-button>
            <el-button :type="params.scope === 'yestoday' ? 'primary' : ''" @click="setScope('yestoday')">昨日</el-button>
            <el-button :type="params.scope === 'last7day' ? 'primary' : ''" @click="setScope('last7day')">近7日</el-button>
            <el-button :type="params.scope === 'last30day' ? 'primary' : ''" @click="setScope('last30day')">近30日</el-button>
            <el-button :type="params.scope === 'month' ? 'primary' : ''" @click="setScope('month')">本月</el-button>
            <el-button :type="params.scope === 'year' ? 'primary' : ''" @click="setScope('year')">本年</el-button>
          </el-button-group>
          <el-date-picker
            v-model="params.order_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="switchTime"
            size="small"
          />
        </el-form-item>
        <el-form-item v-if="params.tab === 'area' || params.tab === 'arrange'" label="派单时间">
          <el-button-group>
            <el-button :type="params.scope === 'all' ? 'primary' : ''" @click="setScope('all')">全部</el-button>
            <el-button :type="params.scope === 'today' ? 'primary' : ''" @click="setScope('today')">今日</el-button>
            <el-button :type="params.scope === 'yestoday' ? 'primary' : ''" @click="setScope('yestoday')">昨日</el-button>
            <el-button :type="params.scope === 'last7day' ? 'primary' : ''" @click="setScope('last7day')">近7日</el-button>
            <el-button :type="params.scope === 'last30day' ? 'primary' : ''" @click="setScope('last30day')">近30日</el-button>
            <el-button :type="params.scope === 'month' ? 'primary' : ''" @click="setScope('month')">本月</el-button>
            <el-button :type="params.scope === 'year' ? 'primary' : ''" @click="setScope('year')">本年</el-button>
          </el-button-group>
          <el-date-picker
            v-model="params.arrange_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="switchTime"
            size="small"
          />
        </el-form-item>
        <el-form-item v-if="params.tab === 'deal'" label="交定时间">
          <el-button-group>
            <el-button :type="params.scope === 'all' ? 'primary' : ''" @click="setScope('all')">全部</el-button>
            <el-button :type="params.scope === 'today' ? 'primary' : ''" @click="setScope('today')">今日</el-button>
            <el-button :type="params.scope === 'yestoday' ? 'primary' : ''" @click="setScope('yestoday')">昨日</el-button>
            <el-button :type="params.scope === 'last7day' ? 'primary' : ''" @click="setScope('last7day')">近7日</el-button>
            <el-button :type="params.scope === 'last30day' ? 'primary' : ''" @click="setScope('last30day')">近30日</el-button>
            <el-button :type="params.scope === 'month' ? 'primary' : ''" @click="setScope('month')">本月</el-button>
            <el-button :type="params.scope === 'year' ? 'primary' : ''" @click="setScope('year')">本年</el-button>
          </el-button-group>
          <el-date-picker
            v-model="params.deal_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="switchTime"
            size="small"
          />
        </el-form-item>
        <el-form-item v-if="params.tab === 'channel' || params.tab === 'source'" label="渠道">
          <el-select v-model="params.channel_id" placeholder="选择或搜索渠道" filterable clearable multiple>
            <el-option :value="item.id" :label="item.name" v-for="item in channel" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="params.tab === 'source'" label="来源">
          <el-select v-model="params.source_id" placeholder="选择或搜索来源" filterable clearable multiple>
            <el-option-group v-for="group in source" :key="group.label" :label="group.label">
              <el-option :value="item.id" :label="item.name" v-for="item in group.options" :key="item.id"></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item v-if="params.tab === 'area'" label="所在省">
          <el-select v-model="params.province_id" filterable placeholder="选择或搜索省" clearable>
            <el-option :value="item.id" :label="item.areaname" v-for="item in province" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="params.tab === 'area'" label="所在市">
          <el-select v-model="params.city_id" placeholder="选择或搜索市" filterable clearable>
            <el-option :value="item.id" :label="item.areaname" v-for="item in city" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="params.tab === 'arrange' || params.tab === 'deal'" label="接单公司">
          <el-select v-model="params.receive_company" placeholder="选择或搜索公司" clearable multiple filterable>
            <el-option :value="item.id" :label="item.name" v-for="item in branch" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="params.tab !== 'other'">
          <el-button @click="onReset">重置</el-button>
          <el-button type="primary" @click="onSubmit">生成报表</el-button>
        </el-form-item>
      </el-form>
      <!-- 渠道报表 -->
      <el-table v-if="params.tab === 'channel'" :data="dataChannelList" style="width: 100%">
        <el-table-column align="center" label="/" width="150">共计</el-table-column>
        <el-table-column align="center" prop="order_number" label="总下单数" width="150" />
        <el-table-column align="center" prop="arrange_number" label="总派单数" width="150" />
        <el-table-column align="center" prop="signing_number" label="总签单数" width="150" />
        <el-table-column align="center" :label="item.name" v-for="item in dataChannelList[0].channel" :key="item.id">
          <el-table-column align="center" label="下单数" width="120">
            {{ item.order_number }}
          </el-table-column>
          <el-table-column align="center" label="派单数" width="120">
            {{ item.arrange_number }}
          </el-table-column>
          <el-table-column align="center" label="签单数" width="120">
            {{ item.signing_number }}
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- 来源报表 -->
      <el-table v-if="params.tab === 'source'" :data="dataSourcelList" style="width: 100%">
        <el-table-column align="center" label="/" width="150">共计</el-table-column>
        <el-table-column align="center" prop="order_number" label="总下单数" width="150" />
        <el-table-column align="center" prop="arrange_number" label="总派单数" width="150" />
        <el-table-column align="center" prop="signing_number" label="总签单数" width="150" />
        <el-table-column align="center" :label="item.name" v-for="item in dataSourcelList[0].channel" :key="item.id">
          <el-table-column align="center" :label="itm.name" v-for="itm in item.source" :key="itm.id">
            <el-table-column align="center" label="下单数" width="120">
              {{ itm.order_number }}
            </el-table-column>
            <el-table-column align="center" label="派单数" width="120">
              {{ itm.arrange_number }}
            </el-table-column>
            <el-table-column align="center" label="签单数" width="120">
              {{ itm.signing_number }}
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- 区域报表，单列的行合并 -->
      <el-table
        v-if="params.tab === 'area'"
        :data="dataAreaList"
        style="width: 100%"
        :span-method="objectSpanMethod"
        border
        :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }"
        show-summary
      >
        <!-- 表头 -->
        <el-table-column :prop="item.prop" :label="item.label" v-for="(item, index) in tableHeader" :key="index"></el-table-column>
      </el-table>
      <!-- 区域报表，多列的行合并 -->
      <el-table v-if="params.tab === 'area'" :data="tableData" style="width: 100%" :span-method="objectSpanMethod2" border :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }">
        <el-table-column :prop="item.prop" :label="item.label" v-for="(item, index) in tableHeader2" :key="index"></el-table-column>
      </el-table>
      <!-- 反馈签单报表 -->
      <el-table v-if="params.tab === 'deal'" :data="dataSignList" border stripe show-summary :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }">
        <el-table-column prop="name" label="分公司" />
        <el-table-column prop="arrange_number" label="派单数" />
        <el-table-column prop="signing_number" label="签单数" />
        <el-table-column prop="per" label="下单签单率数" />
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { reactive, ref, computed, watch } from 'vue'
import moment from 'moment'
import order from '@/api/order'

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

const formRef = ref(null)
const params = reactive({
  tab: 'deal',
  order_time: '',
  arrange_time: '',
  deal_time: '',
  channel_id: '',
  source_id: '',
  province_id: '',
  city_id: '',
  receive_company: '',
  scope: 'all',
})

// tabs
const tabbars = [
  {
    key: 'channel',
    name: '渠道',
  },
  {
    key: 'source',
    name: '来源',
  },
  {
    key: 'area',
    name: '区域',
  },
  {
    key: 'deal',
    name: '签单',
  },
  {
    key: 'other',
    name: '常用查询',
  },
]
// 签单报表数据
const dataSignList = [
  {
    name: '广州公司',
    arrange_number: 180,
    signing_number: 180,
    per: '10%',
  },
  {
    name: '深圳公司',
    arrange_number: 180,
    signing_number: 180,
    per: '10.88%',
  },
]

// 渠道报表数据
const dataChannelList = [
  {
    order_number: 180,
    arrange_number: 80,
    signing_number: 30,
    channel: [
      {
        id: 1,
        name: '官网',
        order_number: '50',
        arrange_number: '30',
        signing_number: '20',
      },
      {
        id: 2,
        name: '头条',
        order_number: '90',
        arrange_number: '60',
        signing_number: '28',
      },
    ],
  },
]
// 来源报表数据
const dataSourcelList = [
  {
    order_number: 180,
    arrange_number: 80,
    signing_number: 30,
    channel: [
      {
        id: 1,
        name: '官网',
        order_number: '50',
        arrange_number: '30',
        signing_number: '20',
        source: [
          {
            id: 111,
            name: '希百信息流',
            order_number: 180,
            arrange_number: 80,
            signing_number: 30,
          },
          {
            id: 112,
            name: '在线下单',
            order_number: 180,
            arrange_number: 80,
            signing_number: 30,
          },
        ],
      },
      {
        id: 2,
        name: '头条',
        order_number: '90',
        arrange_number: '60',
        signing_number: '28',
        source: [
          {
            id: 211,
            name: '皮厂抖音',
            order_number: 180,
            arrange_number: 80,
            signing_number: 30,
          },
          {
            id: 212,
            name: '在线咨询',
            order_number: 180,
            arrange_number: 80,
            signing_number: 30,
          },
        ],
      },
    ],
  },
]
// 区域报表数据  参考https://blog.csdn.net/weixin_48201324/article/details/125192153 合并行数据
const dataAreaList = ref([
  {
    province_name: '广东省',
    city_name: '广州市',
    order_number: 180,
    arrange_number: 150,
    signing_number: 120,
  },
  {
    province_name: '广东省',
    city_name: '深圳市',
    order_number: 140,
    arrange_number: 120,
    signing_number: 100,
  },
  {
    province_name: '广东省',
    city_name: '佛山市',
    order_number: 110,
    arrange_number: 66,
    signing_number: 33,
  },
  {
    province_name: '广东省',
    city_name: '合计',
    order_number: 430,
    arrange_number: 336,
    signing_number: 253,
  },
  {
    province_name: '江苏省',
    city_name: '南京市',
    order_number: 180,
    arrange_number: 150,
    signing_number: 120,
  },
  {
    province_name: '江苏省',
    city_name: '昆山市',
    order_number: 180,
    arrange_number: 150,
    signing_number: 120,
  },
  {
    province_name: '江苏省',
    city_name: '合计',
    order_number: 360,
    arrange_number: 300,
    signing_number: 240,
  },
  {
    province_name: '江西省',
    city_name: '南昌市',
    order_number: 180,
    arrange_number: 150,
    signing_number: 120,
  },
  {
    province_name: '江西省',
    city_name: '合计',
    order_number: 180,
    arrange_number: 150,
    signing_number: 120,
  },
])
let pos = 0
let spanArr = []
const tableHeader = [
  {
    prop: 'province_name',
    label: '省份',
  },
  {
    prop: 'city_name',
    label: '城市',
  },
  {
    prop: 'order_number',
    label: '下单数',
  },
  {
    prop: 'arrange_number',
    label: '派单数',
  },
  {
    prop: 'signing_number',
    label: '签单数',
  },
]
/**
 * 合并省名相同的单元格，[4, 0, 0, 0, 3, 0, 0, 2, 0]，
 * 0表示删除该单元格，1为默认不合并，大于1则为需要合并的行数
 * 如有4个广东省的单元格，第一个单元格合并4行，再删除3个同名的单元格
 */
const getSpanArr = (data) => {
  for (var i = 0; i < data.length; i++) {
    if (i === 0) {
      spanArr.push(1) //第一行的第一个单元格初始化不合并
      pos = 0
    } else {
      if (data[i].province_name === data[i - 1].province_name) {
        spanArr[pos] += 1
        spanArr.push(0)
      } else {
        spanArr.push(1)
        pos = i
      }
    }
  }
}
getSpanArr(dataAreaList.value)
// console.log(spanArr)
/**
 * 单行或对行合并参考：https://blog.csdn.net/weixin_48201324/article/details/125192153
 */
const objectSpanMethod = ({ rowIndex, columnIndex }) => {
  //只对第一列的数据合并
  if (columnIndex === 0) {
    const _row = spanArr[rowIndex]
    // 合并数为0则删除该单元格，为1则不进行合并，如广东省的所有行[4,1],[0,0],[0,0],[0,0]
    const _col = _row > 0 ? 1 : 0
    return {
      rowspan: _row,
      colspan: _col,
    }
  }
}

// 区域报表多列的行合并,如果两个省的某个合并字段的值相同时，会导致合并错误，可以在可能相同的合并列值加个标识，然后渲染的时候处理标识，或者使用合并单列行合并的方法
const tableData = ref([
  {
    province_name: '广东省',
    order_number_total: 500,
    arrange_number_total: 350,
    signing_number_total: 150,
    city_name: '广州市',
    order_number: 180,
    arrange_number: 150,
    signing_number: 120,
  },
  {
    province_name: '广东省',
    order_number_total: 500,
    arrange_number_total: 350,
    signing_number_total: 150,
    city_name: '深圳市',
    order_number: 140,
    arrange_number: 120,
    signing_number: 100,
  },
  {
    province_name: '广东省',
    order_number_total: 500,
    arrange_number_total: 350,
    signing_number_total: 150,
    city_name: '佛山市',
    order_number: 110,
    arrange_number: 66,
    signing_number: 33,
  },
  {
    province_name: '江苏省',
    order_number_total: 400,
    arrange_number_total: 250,
    signing_number_total: 110,
    city_name: '南京市',
    order_number: 180,
    arrange_number: 150,
    signing_number: 120,
  },
  {
    province_name: '江苏省',
    order_number_total: 400,
    arrange_number_total: 250,
    signing_number_total: 110,
    city_name: '昆山市',
    order_number: 180,
    arrange_number: 150,
    signing_number: 120,
  },
  {
    province_name: '江西省',
    order_number_total: 200,
    arrange_number_total: 150,
    signing_number_total: 100,
    city_name: '南昌市',
    order_number: 180,
    arrange_number: 150,
    signing_number: 120,
  },
])
let position = 0
let spanMap = {}
// 需要合并的列
let mergedColumns = ['province_name', 'order_number_total', 'arrange_number_total', 'signing_number_total']

const tableHeader2 = [
  {
    prop: 'province_name',
    label: '省份',
  },
  {
    prop: 'order_number_total',
    label: '总下单数',
  },
  {
    prop: 'arrange_number_total',
    label: '总派单数',
  },
  {
    prop: 'signing_number_total',
    label: '总签单数',
  },
  {
    prop: 'city_name',
    label: '城市',
  },
  {
    prop: 'order_number',
    label: '下单数',
  },
  {
    prop: 'arrange_number',
    label: '派单数',
  },
  {
    prop: 'signing_number',
    label: '签单数',
  },
]
const getSpanArr2 = (data) => {
  for (var i = 0; i < data.length; i++) {
    if (i === 0) {
      mergedColumns.forEach((column) => {
        spanMap[column] = {
          spanArr: [1],
          position: 0,
        }
      })
    } else {
      mergedColumns.forEach((column) => {
        if (data[i][column] === data[i - 1][column]) {
          spanMap[column].spanArr[spanMap[column].position] += 1
          spanMap[column].spanArr.push(0)
        } else {
          spanMap[column].spanArr.push(1)
          spanMap[column].position = i
        }
      })
    }
  }
}
getSpanArr2(tableData.value)
const objectSpanMethod2 = ({ column, rowIndex }) => {
  if (spanMap[column.property]) {
    const _row = spanMap[column.property].spanArr[rowIndex]
    const _col = _row > 0 ? 1 : 0
    return {
      rowspan: _row,
      colspan: _col,
    }
  }
}

// tabs切换
const handleTabChange = (val) => {
  console.log(val, params.tab)
}
// 时间按钮切换
const setScope = (val) => {
  switch (val) {
    case 'all':
      if (params.tab === 'channel' || params.tab === 'source') {
        params.order_time = ''
      } else if (params.tab === 'area') {
        params.arrange_time = ''
      } else if (params.tab === 'deal') {
        params.deal_time = ''
      }
      params.order_time = params.arrange_time = params.deal_time = ''
      break
    case 'today':
      if (params.tab === 'channel' || params.tab === 'source') {
        params.order_time = [currentDay, currentDay]
      } else if (params.tab === 'area') {
        params.arrange_time = [currentDay, currentDay]
      } else if (params.tab === 'deal') {
        params.deal_time = [currentDay, currentDay]
      }
      break
    case 'yestoday':
      if (params.tab === 'channel' || params.tab === 'source') {
        params.order_time = [lastDay, lastDay]
      } else if (params.tab === 'area') {
        params.arrange_time = [lastDay, lastDay]
      } else if (params.tab === 'deal') {
        params.deal_time = [lastDay, lastDay]
      }
      break
    case 'last7day':
      if (params.tab === 'channel' || params.tab === 'source') {
        params.order_time = [week7Day, currentDay]
      } else if (params.tab === 'area') {
        params.arrange_time = [week7Day, currentDay]
      } else if (params.tab === 'deal') {
        params.deal_time = [week7Day, currentDay]
      }
      break
    case 'last30day':
      if (params.tab === 'channel' || params.tab === 'source') {
        params.order_time = [week30Day, currentDay]
      } else if (params.tab === 'area') {
        params.arrange_time = [week30Day, currentDay]
      } else if (params.tab === 'deal') {
        params.deal_time = [week30Day, currentDay]
      }
      break
    case 'month':
      if (params.tab === 'channel' || params.tab === 'source') {
        params.order_time = [monthStartDay, currentDay]
      } else if (params.tab === 'area') {
        params.arrange_time = [monthStartDay, currentDay]
      } else if (params.tab === 'deal') {
        params.deal_time = [monthStartDay, currentDay]
      }
      break
    case 'year':
      if (params.tab === 'channel' || params.tab === 'source') {
        params.order_time = [yearStartDay, currentDay]
      } else if (params.tab === 'area') {
        params.arrange_time = [yearStartDay, currentDay]
      } else if (params.tab === 'deal') {
        params.deal_time = [yearStartDay, currentDay]
      }
      break
    default:
      params.order_time = params.arrange_time = params.deal_time = ''
      break
  }
  params.scope = val
  console.log(val)
  // getBarData()
}
// 时间选择器切换
const switchTime = (val) => {
  if (val) {
    params.scope = ''
  } else {
    params.scope = 'all'
  }
  // getBarData()
}
// 生成报表
const onSubmit = () => {
  console.log(params)
}
// 重置
const onReset = () => {}

// 获取select数据
const channelList = ref([])
const channel = ref([])
const areaList = ref([])
const province = ref([])
const branchList = ref([])
const branch = ref([])
const source = computed(() => {
  params.source_id = ''
  if (params.channel_id) {
    let source = []
    channelList.value.forEach((item) => {
      if (params.channel_id.includes(item.id)) {
        source.push({ label: item.name, options: [...item.children] })
      }
    })
    return source
  } else {
    return []
  }
})
const city = computed(() => {
  params.city_id = ''
  if (params.province_id) {
    let city = []
    try {
      areaList.value.forEach((item) => {
        if (item.id === params.province_id) {
          city = item.children
          throw new Error('break')
        }
      })
    } catch (error) {
      // 终止循环执行
    }
    return city
  } else {
    return []
  }
})

// 监听省市变化更新branch数据
watch([() => params.province_id, () => params.city_id], (newValue, oldValue) => {
  params.receive_company = ''
  if (newValue[1]) {
    branch.value = branchList.value.filter((o) => o.city_id === newValue[1])
  } else if (newValue[0]) {
    branch.value = branchList.value.filter((o) => o.province_id === newValue[0])
  } else {
    branch.value = branchList.value
  }
})

const getSelectData = () => {
  order.getSelect().then((res) => {
    if (res.code > 0) {
      channelList.value = res.result.channel
      res.result.channel.forEach((item) => {
        channel.value.push({ id: item.id, name: item.name })
      })
      areaList.value = res.result.area
      res.result.area.forEach((item) => {
        province.value.push({ id: item.id, areaname: item.areaname })
      })
      branch.value = branchList.value = res.result.branch
    } else {
      toast(res.message || 'Error', 'error')
    }
  })
}
getSelectData()
</script>
<style lang="scss" scoped>
.el-form {
  width: 80%;
}
.el-button-group {
  margin-right: 10px;
}
.el-form-item__label {
  font-weight: 700;
}
</style>
