<template>
  <div class="app-container" v-loading="loading" element-loading-text="数据读取中...">
    <el-card class="menu-order-add" shadow="hover">
      <el-form class="order" :model="form" :rules="rules" ref="formRef" label-width="80px"
        :label-position="$store.state.isMobile ? 'top' : 'right'">
        <el-tabs v-model="activeTab" @tab-change="handleTabChange">
          <el-tab-pane label="订单信息" name="order">
            <el-form-item label="客户名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入客户名称" minlength="2" maxlength="20"
                show-word-limit />
            </el-form-item>
            <el-form-item label="联系方式" prop="mobile">
              <el-input v-model="form.mobile" placeholder="请输入客户电话" />
            </el-form-item>
            <el-row :gutter="2" style="width: 100%">
              <el-col :md="10" :offset="0">
                <el-form-item label="房屋地址" prop="city_id">
                  <el-cascader v-model="area" :options="areaList"
                    :props="{ value: 'id', label: 'areaname', children: 'children' }"
                    placeholder="请选择省/市" />
                </el-form-item>
              </el-col>
              <el-col :md="14" :offset="0">
                <el-form-item label="" label-width="0" prop="address">
                  <el-input v-model="form.address" placeholder="请输入详细地址" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="下单时间" prop="order_time">
              <el-date-picker style="width: 100%" v-model="form.order_time" type="datetime"
                placeholder="请选择下单时间" format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss" :editable="false" :disabled-date="disabledDate"
                clearable />
            </el-form-item>
            <el-form-item label="推广渠道" prop="channel_id">
              <el-select v-model="form.channel_id" filterable placeholder="请选择或搜索渠道">
                <el-option :disabled="item.status === 0" :value="item.id" :label="item.name"
                  v-for="item in channel" :key="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="客户来源" prop="source_id">
              <el-select v-model="form.source_id" filterable placeholder="请选择或搜索来源">
                <el-option :disabled="item.status === 0" :value="item.id" :label="item.name"
                  v-for="item in source" :key="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="房屋类型" prop="type_id">
              <el-select v-model="form.type_id" placeholder="请选择类型">
                <el-option :disabled="item.status === 0" :value="item.id" :label="item.name"
                  v-for="item in typeList" :key="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="房屋户型" prop="layout_id">
              <el-select v-model="form.layout_id" placeholder="请选择户型">
                <el-option :disabled="item.status === 0" :value="item.id" :label="item.name"
                  v-for="item in layoutList" :key="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="房屋面积" prop="size">
              <el-input v-model="form.size" placeholder="请输入房屋面积" />
            </el-form-item>
            <el-form-item label="是否交房" prop="is_making">
              <el-radio-group v-model="form.is_making">
                <el-radio :label="0">未获知</el-radio>
                <el-radio :label="1">未交房</el-radio>
                <el-radio :label="2">已交房</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="装修需求" prop="demand">
              <el-input v-model="form.demand" placeholder="请输入装修需求" minlength="2" maxlength="100"
                show-word-limit />
            </el-form-item>
            <el-form-item label="其他" prop="other">
              <el-input v-model="form.other" placeholder="请输入其他" minlength="2" maxlength="100"
                show-word-limit />
            </el-form-item>
            <el-form-item label="无效标签" prop="invalid_tag">
              <el-select v-model="form.invalid_tag" placeholder="请选择标签" @change="invalidTagChange">
                <el-option :value="item.name" :label="item.name" v-for="item in tagList"
                  :key="item.id"></el-option>
              </el-select>
              <el-input v-if="form.invalid_tag === '其他'" v-model="invalid_tags"
                placeholder="请输入无效标签" minlength="2" maxlength="20" show-word-limit />
            </el-form-item>
            <el-form-item label="百度标签" prop="mark_type" v-if="form.clue_id">
              <el-select v-model="form.mark_type" placeholder="请选择百度线索标签">
                <el-option :value="item.id" :label="item.name" v-for="item in markList"
                  :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="推广标识" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入推广标识" />
            </el-form-item>
            <el-form-item label="客户IP" prop="ip">
              <el-input v-model="form.ip" placeholder="请输入客户IP" />
            </el-form-item>
            <el-form-item label="">
              <el-button type="warning" size="default" @click="changeTab('arrange')">下一步</el-button>
              <el-button type="primary" size="default"
                v-if="form.is_audit === 1 || form.is_audit === 4" @click="submit"
                :loading="loading">提交
              </el-button>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="派单信息" name="arrange">
            <el-form-item label="派单时间" prop="arrange_time">
              <el-date-picker style="width: 100%" v-model="form.arrange_time" type="datetime"
                placeholder="请选择派单时间" format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss" :editable="false" :disabled-date="disabledDate"
                clearable />
            </el-form-item>
            <el-form-item label="派单人" prop="arrange_man">
              <el-select v-model="form.arrange_man" placeholder="请选择接派单人">
                <el-option :value="item.id.toString()" :label="item.name" v-for="item in kefuList"
                  :key="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="接单公司" prop="receive_company">
              <el-select v-model="form.receive_company" filterable placeholder="请选择或搜索接单公司"
                @change="getDockingMan">
                <el-option :disabled="item.status === 2 || item.status === 3" :value="item.id"
                  :label="item.name" v-for="item in branchList" :key="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="接单人" prop="receive_man">
              <el-input v-model="form.receive_man" placeholder="请输入接单人" />
            </el-form-item>
            <el-form-item label="">
              <el-button type="info" size="default" @click="changeTab('order')">上一步</el-button>
              <el-button type="warning" size="default" @click="changeTab('follow')">下一步</el-button>
              <el-button type="primary" size="default"
                v-if="form.is_audit === 1 || form.is_audit === 4" @click="submit"
                :loading="loading">提交
              </el-button>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="跟进信息" name="follow">
            <el-form-item label="设计师" prop="designer">
              <el-input v-model="form.designer" placeholder="请输入跟进设计师" />
            </el-form-item>
            <el-form-item label="跟进信息">
              <el-row :gutter="2" v-for="(item, index) in form.follows" :key="item.key"
                style="width: 100%">
                <el-col :md="8" :offset="0">
                  <el-date-picker style="width: 100%" v-model="item.follow_time" type="datetime"
                    placeholder="请选择跟进时间" format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss" :editable="false"
                    :disabled-date="disabledDate" clearable />
                </el-col>
                <el-col :md="15" :offset="0">
                  <el-input v-model="item.follow_note" placeholder="请输入跟进说明" minlength="2"
                    maxlength="100" show-word-limit />
                </el-col>
                <el-col :span="1" :offset="0">
                  <el-icon v-if="index == 0" @click="addFollow" size="24">
                    <Plus />
                  </el-icon>
                  <el-icon v-else @click="minusFollow(index)" size="24">
                    <Minus />
                  </el-icon>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="是否量房" prop="is_amount">
              <el-radio-group v-model="form.is_amount">
                <el-radio :label="0">未获知</el-radio>
                <el-radio :label="1">未量房</el-radio>
                <el-radio :label="2">已量房</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="订单状态" prop="status_id">
              <el-select v-model="form.status_id" placeholder="请选择订单状态" @change="statusChange">
                <el-option :disabled="item.status === 0" :value="item.id" :label="item.name"
                  v-for="item in statusList" :key="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="死单标签" prop="reason_id" v-if="form.status_id==8">
              <el-select v-model="form.reason_id" placeholder="请选择死单标签">
                <el-option :value="item.id" :label="item.name" v-for="item in reasonList"
                  :key="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="交定时间" prop="deal_time">
              <el-date-picker style="width: 100%" v-model="form.deal_time" type="datetime"
                :readonly="$store.state.adminInfo.role_id != 3 && $store.state.adminInfo.role_id != 22"
                placeholder="交定时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"
                :editable="false" :disabled-date="disabledDate" clearable />
            </el-form-item>
            <el-form-item label="定金金额" prop="order_money">
              <el-input v-model="form.order_money" type="number" placeholder="请输入定金金额" />
            </el-form-item>
            <el-form-item label="签约时间" prop="signing_time">
              <el-date-picker style="width: 100%" v-model="form.signing_time" type="datetime"
                placeholder="请选择签约时间" format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss" :disabled-date="disabledDate" :editable="false"
                clearable />
            </el-form-item>
            <el-form-item label="合同金额" prop="contract_money">
              <el-input v-model="form.contract_money" type="number" placeholder="请输入合同金额" />
            </el-form-item>
            <el-form-item label="开工时间" prop="start_time">
              <el-date-picker style="width: 100%" v-model="form.start_time" type="datetime"
                placeholder="请选择开工时间" format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss" :editable="false" clearable />
            </el-form-item>
            <el-form-item label="完工时间" prop="end_time">
              <el-date-picker style="width: 100%" v-model="form.end_time" type="datetime"
                placeholder="请选择完工时间" format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss" :editable="false" clearable />
            </el-form-item>
            <el-form-item label="施工经理" prop="construction_manager">
              <el-input v-model="form.construction_manager" placeholder="请输入施工经理" />
            </el-form-item>
            <el-form-item label="质检员" prop="quality_man">
              <el-input v-model="form.quality_man" placeholder="请输入质检员" />
            </el-form-item>
            <el-form-item label="">
              <el-button type="info" size="default" @click="changeTab('arrange')">上一步</el-button>
              <el-button type="warning" size="default" @click="changeTab('visit')">下一步</el-button>
              <el-button type="primary" size="default"
                v-if="form.is_audit === 1 || form.is_audit === 4" @click="submit"
                :loading="loading">提交
              </el-button>
              <el-button type="success" size="default"
                v-if="form.is_audit === 2 || form.is_audit === 3" @click="sh_success"
                :loading="loading">审核通过</el-button>
              <el-button type="danger" v-if="form.is_audit === 2 || form.is_audit === 3"
                size="default" @click="sh_fail" :loading="loading">审核不通过</el-button>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="回访信息" name="visit">
            <el-form-item label="客户回访" prop="is_visit">
              <el-radio-group v-model="form.is_visit">
                <el-radio :label="1">待回访</el-radio>
                <el-radio :label="2">无需回访</el-radio>
                <el-radio :label="3">已回访</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="回访信息">
              <el-row :gutter="2" v-for="(item, index) in form.visit" :key="item.key"
                style="width: 100%">
                <el-col :md="8" :offset="0">
                  <el-date-picker style="width: 100%" v-model="item.visit_time" type="datetime"
                    placeholder="请选择回访时间" format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss" :editable="false" clearable />
                </el-col>
                <el-col :md="15" :offset="0">
                  <el-input v-model="item.remark" placeholder="请输入回访说明" minlength="2"
                    maxlength="100" show-word-limit />
                </el-col>
                <el-col :span="1" :offset="0">
                  <el-icon v-if="index == 0" @click="addVisit" size="24">
                    <Plus />
                  </el-icon>
                  <el-icon v-else @click="minusVisit(index)" size="24">
                    <Minus />
                  </el-icon>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="">
              <el-button type="info" size="default" @click="changeTab('follow')">上一步</el-button>
              <el-button type="primary" size="default"
                v-if="form.is_audit === 1 || form.is_audit === 4" @click="submit"
                :loading="loading">提交
              </el-button>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- <el-button @click="goto">关闭当前并跳转</el-button> -->
    </el-card>
  </div>
</template>
<script setup>
import { reactive, ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import order from '@/api/order'
import { showPrompt, toast, parseTime, time_init } from '@/utils/utils'

const router = useRouter()
const route = useRoute()
const store = useStore()
const tabList = store.state.tabList
const formRef = ref('')
const loading = ref(false)

onMounted(() => {
  // 移动端打开新页面时返回页面顶部
  let elMain = document.querySelector('.el-main')
  elMain.scrollTop = 0
})

const form = reactive({
  name: '',
  mobile: '',
  province_id: '',
  city_id: '',
  area_id: '',
  address: '',
  type_id: '',
  layout_id: '',
  clue_id: '',
  mark_type: '',
  is_making: 0,
  size: '',
  demand: '',
  other: '',
  order_time: '',
  channel_id: '',
  source_id: '',
  invalid_tag: '',
  remark: '',
  ip: '',
  receive_company: '',
  receive_man: '',
  arrange_time: '',
  arrange_man: '',
  start_time: '',
  end_time: '',
  is_audit: 1,
  fail_reason: '',
  designer: '',
  follows: [{ follow_time: '', follow_note: '' }],
  is_amount: 0,
  status_id: 1,
  deal_time: '',
  order_money: '',
  signing_time: '',
  contract_money: '',
  start_time: '',
  end_time: '',
  construction_manager: '',
  quality_man: '',
  reason_id: 0,
  is_visit: 1,
  visit: [{ visit_time: '', remark: '' }],
})
// 手机号验证
// const validateMobile = (rule, value, callback) => {
//   if (!/^[1][3,4,5,6.7,8,9][0-9]{9}$/.test(value)) {
//     callback(new Error('手机号格式不正确'))
//   } else {
//     callback()
//   }
// }
const rules = {
  name: [
    {
      required: true,
      message: '客户名称不能为空',
      trigger: 'blur',
    },
  ],
  mobile: [
    {
      required: true,
      message: '联系方式不能为空',
      trigger: 'blur',
    },
  ],
  city_id: [
    {
      required: true,
      message: '省市区域不能为空',
      trigger: 'blur',
    },
  ],
  address: [
    {
      required: true,
      message: '详细地址不能为空',
      trigger: 'blur',
    },
  ],
  order_time: [
    {
      required: true,
      message: '下单时间不能为空',
      trigger: 'blur',
    },
  ],
  channel_id: [
    {
      required: true,
      message: '推广退渠道不能为空',
      trigger: 'blur',
    },
  ],
  source_id: [
    {
      required: true,
      message: '客户来源不能为空',
      trigger: 'blur',
    },
  ],
}

const disabledDate = (time) => {
  return time.getTime() > Date.now()
}

const loadData = (id) => {
  loading.value = true
  order
    .read(id)
    .then((res) => {
      if (res.code > 0) {
        const result = res.result
        if (!result) {
          toast('订单不存在', 'error')
          router.replace('/order/index').catch((err) => {})
          let index = tabList.findIndex((item) => item.path === '/order/edit/' + id)
          tabList.splice(index, 1)
          store.commit('setTabList', tabList)
        }
        for (const key in form) {
          form[key] = result[key]
        }
        form.order_time = parseTime(form.order_time)
        form.source_id = parseInt(form.source_id)
        form.arrange_time = parseTime(form.arrange_time)
        form.deal_time = parseTime(form.deal_time)
        form.signing_time = parseTime(form.signing_time)
        form.start_time = parseTime(form.start_time)
        form.end_time = parseTime(form.end_time)
        form.receive_company = form.receive_company === 0 ? '' : form.receive_company
        form.layout_id = form.layout_id === 0 ? '' : form.layout_id
        form.type_id = form.type_id === 0 ? '' : form.type_id
        form.reason_id = form.reason_id === 0 ? '' : form.reason_id
        form.order_money = form.order_money == 0 ? '' : form.order_money
        form.contract_money = form.contract_money == 0 ? '' : form.contract_money
        form.follows = form.follows.map((item) => {
          return { follow_time: parseTime(item.follow_time), follow_note: item.follow_note }
        })
        form.follows.push({ follow_time: time_init(), follow_note: '' })
        form.visit = form.visit.map((item) => {
          return { visit_time: parseTime(item.visit_time), remark: item.remark }
        })
        form.visit.push({ visit_time: '', remark: '' })

        if (form.is_audit === 2 || form.is_audit === 3) {
          activeTab.value = 'follow'
        }
      } else {
        toast(res.message || 'error', 'error')
        return false
      }
    })
    .finally(() => {
      loading.value = false
    })
}
let id = route.params.id
loadData(id)
// watch(
//   route,
//   () => {
//     if (route.name === 'OrderEdit') {
//       id = route.params.id
//       // 因为使用KeepAlice打开多个编辑页显示的是同一个订单内容，需要重新获取数据
//       loadData(id)
//     }
//   },
//   { deep: true, immediate: true }
// )

// tabs切换
const activeTab = ref('order')
const handleTabChange = (val) => {
  if (activeTab.value === 'arrange' && form.arrange_time === '') {
    form.arrange_time = time_init()
  }
  if (activeTab.value !== 'order') {
    formRef.value.validate((valid) => {
      if (!valid) {
        activeTab.value = 'order'
      }
    })
  }
}
const changeTab = (tab) => {
  activeTab.value = tab
}
// 获取公司对接人
const getDockingMan = (val) => {
  order.getDockingMan({ id: val }).then((res) => {
    if (res.code > 0) {
      form.receive_man = res.result.name
    } else {
      toast(res.message || 'error', 'error')
      return false
    }
  })
}
// 省市区联动
// const area = ref(['440000', '440100'])
const area = computed({
  get() {
    return form.province_id && form.city_id ? [form.province_id, form.city_id] : []
  },
  set(val) {
    form.province_id = val[0]
    form.city_id = val[1]
  },
})

// 无效标签
const invalid_tags = ref('')
const invalidTagChange = (val) => {
  if (val !== '其他' && invalid_tags.value) {
    invalid_tags.value = ''
  }
}
// 跟进信息
const addFollow = () => {
  form.follows.push({ follow_time: time_init(), follow_note: '' })
}
const minusFollow = (index) => {
  form.follows.splice(index, 1)
}

// 交定时间
const statusChange = (status_id) => {
  if (status_id === 3 || status_id === 4 || status_id === 5 || status_id === 6) {
    if (!form.deal_time) form.deal_time = time_init()
  } else {
    // form.deal_time = ''
  }
  if (status_id != 8) {
    form.reason_id = ''
  }
}

// 回访信息
const addVisit = () => {
  form.visit.push({ visit_time: '', remark: '' })
}
const minusVisit = (index) => {
  form.visit.splice(index, 1)
}
// select数据
const areaList = ref([])
const typeList = ref([])
const layoutList = ref([])
const channelList = ref([])
const channel = ref([])
const branchList = ref([])
const statusList = ref([])
const tagList = ref([])
const kefuList = ref([])
const reasonList = ref([])
const markList = ref([
  { id: 1001, name: '恶意/骚扰' },
  { id: 1002, name: '无效对话' },
  { id: 1003, name: '空错号' },
  { id: 1004, name: '回访电话3次未接通' },
  { id: 1005, name: '非本人' },
  { id: 1006, name: '无意向' },
  { id: 2001, name: '聊到相关业务' },
  { id: 2002, name: '留线索' },
  { id: 2003, name: '回访电话接通' },
  { id: 2004, name: '回访信息确认' },
  { id: 2005, name: '回访发现意向' },
  { id: 2006, name: '回访高潜成交' },
  { id: 2007, name: '回访成单客户' },
  { id: 2008, name: '服务购买成功' },
  { id: 2009, name: '微信加粉成功' },
  { id: 2010, name: '到店' },
])

const source = computed({
  get() {
    let source = []
    channelList.value.forEach((item) => {
      if (form.channel_id === item.id) {
        source = item.children
      }
    })
    return source
  },
  set() {
    form.source_id = ''
    if (form.channel_id) {
      let source = []
      channelList.value.forEach((item) => {
        if (form.channel_id === item.id) {
          source = item.children
        }
      })
      return source
    } else {
      return []
    }
  },
})

order.getSelect().then((res) => {
  if (res.code > 0) {
    // console.log(res)
    channelList.value = res.result.channel
    res.result.channel.forEach((item) => {
      channel.value.push({ id: item.id, name: item.name, status: item.status })
    })
    // areaList.value = res.result.area
    res.result.area.forEach((item, index) => {
      item.children.map((itm) => {
        itm.children = []
      })
    })
    areaList.value = res.result.area
    typeList.value = res.result.type
    layoutList.value = res.result.layout
    branchList.value = res.result.branch
    statusList.value = res.result.status
    reasonList.value = res.result.reason
    tagList.value = res.result.tag
    tagList.value.push({ id: 100, name: '其他' })
    kefuList.value = res.result.kefu
    //根据登录账户设置默认选择数据
  } else {
    toast(res.message || 'Error', 'error')
  }
})

// 表单提交
const submit = () => {
  formRef.value.validate((valid) => {
    console.log(valid)
    if (!valid) {
      activeTab.value = 'order'
      return false
    }
    // 无效标签数据处理
    if (form.invalid_tag === '其他') {
      if (!invalid_tags.value) {
        toast('请输入无效标签', 'error')
        return false
      } else {
        form.invalid_tag = invalid_tags.value
      }
    }
    // 跟进信息数据处理
    form.follows = form.follows.filter((item) => item.follow_time && item.follow_note)
    // 后台会自动删除空数组，导致报错
    form.follows = form.follows.length === 0 ? '' : form.follows
    // 回访信息数据处理
    form.visit = form.visit.filter((item) => item.visit_time && item.remark)
    form.visit = form.visit.length === 0 ? '' : form.visit
    // 死单标签处理
    if (form.status_id == 8 && !form.reason_id) {
      toast('请选择死单标签', 'error')
      return false
    }

    loading.value = true
    order
      .edit(id, form)
      .then((res) => {
        if (res.code > 0) {
          toast('数据更新成功')
          let index = tabList.findIndex((item) => item.path === '/order/edit/' + id)
          // resetFields 只对有prop属性的生效
          formRef.value.resetFields()
          //重置无prop属性的字段
          form.follows = [{ follow_time: '', follow_note: '' }]
          form.visit = [{ visit_time: '', remark: '' }]
          form.province_id = ''
          form.city_id = ''
          invalid_tags.value = ''
          activeTab.value = 'order'
          // router.replace({ path: '/order/index', query: { reload: true } }).catch((err) => {})
          router.replace({ path: '/order/index' }).catch((err) => {})
          tabList.splice(index, 1)
          store.commit('setTabList', tabList)
          //获取通知消息
          store.dispatch('getNote')
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

// 审核通过
const sh_success = () => {
  // 死单标签处理
  if (form.status_id == 8 && !form.reason_id) {
    toast('请选择死单标签', 'error')
    return false
  }
  form.is_audit = 4
  form.fail_reason = ''
  submit()
}
// 审核不通过
const sh_fail = () => {
  showPrompt('审核失败原因')
    .then((res) => {
      form.fail_reason = res.value
      form.is_audit = 3
      submit()
    })
    .catch((err) => console.log(err))
}
</script>
<script>
export default {
  name: 'OrderEdit',
}
</script>
<style lang="scss" scoped>
:deep(.el-form-item__label) {
  font-weight: 700;
}
:deep(.el-input__wrapper) {
  width: 100%;
}
:deep(.el-button + .el-button) {
  margin-left: 5px;
}
</style>
