<template>
  <div class="app-container">
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
            <el-form-item label="推广标识" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入推广标识" />
            </el-form-item>
            <el-form-item label="客户IP" prop="ip">
              <el-input v-model="form.ip" placeholder="请输入客户IP" />
            </el-form-item>
            <el-form-item label="">
              <el-button type="warning" size="default" @click="changeTab('arrange')">下一步</el-button>
              <el-button type="primary" size="default" @click="submit" :loading="loading">提交
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
                <el-option :value="item.id" :label="item.name" v-for="item in kefuList"
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
              <el-button type="primary" size="default" @click="submit" :loading="loading">提交
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
            <el-form-item label="交定时间" prop="deal_time">
              <el-date-picker style="width: 100%" v-model="form.deal_time" type="datetime" readonly
                placeholder="交定时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"
                :editable="false" :disabled-date="disabledDate" clearable />
            </el-form-item>
            <el-form-item label="定金金额" prop="order_money">
              <el-input v-model="form.order_money" placeholder="请输入定金金额" />
            </el-form-item>
            <el-form-item label="签约时间" prop="signing_time">
              <el-date-picker style="width: 100%" v-model="form.signing_time" type="datetime"
                placeholder="请选择签约时间" format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss" :editable="false" :disabled-date="disabledDate"
                clearable />
            </el-form-item>
            <el-form-item label="合同金额" prop="contract_money">
              <el-input v-model="form.contract_money" placeholder="请输入合同金额" />
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
              <el-button type="primary" size="default" @click="submit" :loading="loading">提交
              </el-button>
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
              <el-button type="primary" size="default" @click="submit" :loading="loading">提交
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
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import order from '@/api/order'
import { toast, time_init } from '@/utils/utils'

const router = useRouter()
const store = useStore()
const tabList = store.state.tabList
const formRef = ref('')
const loading = ref(false)
const form = reactive({
  name: '',
  mobile: '',
  province_id: '',
  city_id: '',
  area_id: '',
  address: '',
  type_id: '',
  layout_id: '',
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
const area = computed({
  get() {
    return form.province_id && form.city_id ? [form.province_id, form.city_id] : []
  },
  set(val) {
    form.province_id = val[0]
    form.city_id = val[1]
    // form.area_id = val[2]
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
  form.follows.push({ follow_time: '', follow_note: '' })
}
const minusFollow = (index) => {
  form.follows.splice(index, 1)
}

// 交定时间
const statusChange = (status_id) => {
  if (status_id === 3 || status_id === 4 || status_id === 5 || status_id === 6) {
    if (!form.deal_time) form.deal_time = time_init()
  } else {
    form.deal_time = ''
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

const source = computed(() => {
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
    tagList.value = res.result.tag
    tagList.value.push({ id: 100, name: '其他' })
    kefuList.value = res.result.kefu
    if (store.state.adminInfo.role_id == 3 || store.state.adminInfo.role_id == 4) {
      form.arrange_man = store.state.adminInfo.id
    }
    //根据登录账户设置默认选择数据
  } else {
    toast(res.message || 'Error', 'error')
  }
})

// 表单提交
const submit = () => {
  formRef.value.validate((valid) => {
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
    loading.value = true
    order
      .create(form)
      .then((res) => {
        if (res.code > 0) {
          toast('数据新增成功')
          let index = tabList.findIndex((item) => item.path === '/order/add')
          // resetFields 只对有prop属性的生效
          formRef.value.resetFields()
          //重置无prop属性的字段
          form.follows = [{ follow_time: '', follow_note: '' }]
          form.visit = [{ visit_time: '', remark: '' }]
          form.province_id = ''
          form.city_id = ''
          invalid_tags.value = ''
          activeTab.value = 'order'
          // 跳转到订单列表页，并重新获取数据
          router.replace({ path: '/order/index', query: { reload: true } }).catch((err) => {})
          tabList.splice(index, 1)
          store.commit('setTabList', tabList)
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
:deep(.el-form-item__label) {
  font-weight: 700;
}
:deep(.el-input__wrapper) {
  width: 100%;
}
</style>
