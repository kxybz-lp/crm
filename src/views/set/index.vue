<template>
  <div class="app-container">
    <el-card class="menu-order-add" shadow="hover">
      <el-form class="setting" :model="form" :rules="rules" ref="formRef" label-width="140px">
        <el-tabs v-model="activeTab" @tab-change="handleTabChange">
          <el-tab-pane label="应用设置" name="basic">
            <el-form-item label="应用名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入应用名称" minlength="2" maxlength="20"
                show-word-limit />
            </el-form-item>
            <el-form-item label="应用描述" prop="description">
              <el-input v-model="form.description" type="textarea" placeholder="请输入应用描述"
                minlength="2" maxlength="200" show-word-limit />
            </el-form-item>
            <el-form-item label="应用LOGO" prop="logo">
              <ChooseImage :limit="1" v-model="form.logo" />
            </el-form-item>
            <el-form-item label="CDN" prop="cdn">
              <el-input v-model="form.cdn" placeholder="请输入应用CDN地址" />
            </el-form-item>
            <el-form-item label="">
              <el-button type="warning" size="default" @click="activeTab='mp'">下一步</el-button>
              <el-button type="primary" size="default" @click="submit" :loading="loading">提交
              </el-button>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="公众号设置" name="mp">
            <el-divider content-position="left">高端设计公众号设置</el-divider>
            <el-form-item label="AppId" prop="mp_info">
              <el-input v-model="form.mp_info.app_id" placeholder="微信公众号AppId" />
            </el-form-item>
            <el-form-item label="AppSecret" prop="mp_info">
              <el-input v-model="form.mp_info.app_secret" placeholder="微信公众号AppSecret" />
            </el-form-item>
            <el-form-item label="token" prop="mp_info">
              <el-input v-model="form.mp_info.token" placeholder="微信公众号token" />
            </el-form-item>
            <el-form-item label="EncodinGaesKey" prop="mp_info">
              <el-input v-model="form.mp_info.encodingaes_key" placeholder="微信公众号EncodinGaesKey" />
            </el-form-item>
            <el-form-item label="">
              <el-button type="info" size="default" @click="activeTab='basic'">上一步</el-button>
              <el-button type="warning" size="default" @click="activeTab='mini'">下一步</el-button>
              <el-button type="primary" size="default" @click="submit" :loading="loading">提交
              </el-button>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="小程序设置" name="mini">
            <el-divider content-position="left">星艺装饰小程序设置</el-divider>
            <el-form-item label="AppId" prop="wc_mini">
              <el-input v-model="form.wc_mini.app_id" placeholder="请输入星艺装饰小程序AppId" />
            </el-form-item>
            <el-form-item label="AppSecret" prop="wc_mini">
              <el-input v-model="form.wc_mini.app_secret" placeholder="请输入星艺装饰小程序AppSecret" />
            </el-form-item>
            <el-form-item label="">
              <el-button type="info" size="default" @click="activeTab='mp'">上一步</el-button>
              <el-button type="warning" size="default" @click="activeTab='trade'">下一步</el-button>
              <el-button type="primary" size="default" @click="submit" :loading="loading">提交
              </el-button>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="交易设置" name="trade">
            <el-divider content-position="left">订单信息设置</el-divider>
            <el-form-item label="未支付订单">
              <el-input v-model="form.trade.close_hours">
                <template #append>小时后自动关闭</template>
              </el-input>
              <span class="notice">如果在期间订单未付款，系统自动关闭，设置0小时不自动关闭</span>
            </el-form-item>
            <el-form-item label="已发货订单">
              <el-input v-model="form.trade.receive_days">
                <template #append>天后自动确认收货</template>
              </el-input>
              <span class="notice">如果在期间未确认收货，系统自动完成收货，设置0天不自动收货</span>
            </el-form-item>
            <el-form-item label="已完成订单">
              <el-input v-model="form.trade.refund_days">
                <template #append>天内允许申请售后</template>
              </el-input>
              <span class="notice">订单完成后，用户在指定期限内可申请售后，设置0天不允许申请</span>
            </el-form-item>
            <el-divider content-position="left">微信支付设置</el-divider>
            <el-form-item label="AppId" prop="wx_pay">
              <el-input v-model="form.wx_pay.app_id" placeholder="请输入微信支付AppId" />
            </el-form-item>
            <el-form-item label="ApiKey" prop="wx_pay">
              <el-input v-model="form.wx_pay.api_key" placeholder="请输入微信支付ApiKey" />
            </el-form-item>
            <el-form-item label="MchId" prop="wx_pay">
              <el-input v-model="form.wx_pay.mch_id" placeholder="请输入微信支付小程序MchId" />
            </el-form-item>
            <el-form-item label="NotifyUrl" prop="wx_pay">
              <el-input v-model="form.wx_pay.notify_url" placeholder="请输入微信支付小程序NotifyUrl" />
            </el-form-item>
            <el-form-item label="SslcertPath" prop="wx_pay">
              <el-input v-model="form.wx_pay.sslcert_path" placeholder="请输入微信支付小程序SslcertPath" />
            </el-form-item>
            <el-form-item label="SslkeyPath" prop="wx_pay">
              <el-input v-model="form.wx_pay.sslkey_path" placeholder="请输入微信支付小程序SslkeyPath" />
            </el-form-item>
            <el-form-item label="TradeType" prop="wx_pay">
              <el-input v-model="form.wx_pay.trade_type" placeholder="请输入微信支付小程序TradeType" />
            </el-form-item>
            <el-form-item label="">
              <el-button type="info" size="default" @click="activeTab='mini'">上一步</el-button>
              <el-button type="warning" size="default" @click="activeTab='upload'">下一步</el-button>
              <el-button type="primary" size="default" @click="submit" :loading="loading">提交
              </el-button>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="上传设置" name="upload">
            <el-form-item label="默认上传方式" prop="upload.default">
              <el-radio-group v-model="form.upload.default">
                <el-radio label="local">本地上传</el-radio>
                <el-radio label="aliyun">阿里云</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="存储空间名称" prop="upload.engine.aliyun.bucket"
              v-if="form.upload.default == 'aliyun'" placeholder="存储空间名称 Bucket">
              <el-input v-model="form.upload.engine.aliyun.bucket" />
            </el-form-item>
            <el-form-item label="AccessKeyId" prop="upload.engine.aliyun.access_key_id"
              v-if="form.upload.default == 'aliyun'">
              <el-input v-model="form.upload.engine.aliyun.access_key_id" />
            </el-form-item>
            <el-form-item label="AccessKeySecret" prop="upload.engine.aliyun.access_key_secret"
              v-if="form.upload.default == 'aliyun'">
              <el-input v-model="form.upload.engine.aliyun.access_key_secret" />
            </el-form-item>
            <el-form-item label="空间域名" prop="upload_aliyun" v-if="form.upload.default == 'aliyun'">
              <el-input v-model="form.upload.engine.aliyun.domain" placeholder="空间域名 domain" />
            </el-form-item>
            <el-form-item label="">
              <el-button type="info" size="default" @click="activeTab='trade'">上一步</el-button>
              <el-button type="warning" size="default" @click="activeTab='notify'">下一步</el-button>
              <el-button type="primary" size="default" @click="submit" :loading="loading">提交
              </el-button>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="通知设置" name="notify">
            <el-divider content-position="left">短信通知设置</el-divider>
            <el-form-item label="默认短信平台" prop="notify.default">
              <el-radio-group v-model="form.notify.default">
                <el-radio label="aliyun">阿里云短信</el-radio>
                <el-radio label="qiniu" disabled>七牛云短信</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="AccessKeyId" prop="notify.engine.aliyun"
              v-if="form.notify.default == 'aliyun'">
              <el-input v-model="form.notify.engine.aliyun.access_key_id" />
            </el-form-item>
            <el-form-item label="AccessKeySecret" prop="notify.engine.aliyun"
              v-if="form.notify.default == 'aliyun'">
              <el-input v-model="form.notify.engine.aliyun.access_key_secret" />
            </el-form-item>
            <el-form-item label="模版ID" prop="notify.engine.aliyun"
              v-if="form.notify.default == 'aliyun'">
              <el-input v-model="form.notify.engine.aliyun.template_code"
                placeholder="例如：SMS_139800030" />
            </el-form-item>
            <el-form-item label="短信签名" prop="notify.engine.aliyun"
              v-if="form.notify.default == 'aliyun'">
              <el-input v-model="form.notify.engine.aliyun.sign_name" />
            </el-form-item>
            <el-form-item label="接收手机号" prop="notify.receive_mobile">
              <el-input v-model="form.notify.receive_mobile" placeholder="请输入接收手机号" />
            </el-form-item>
            <el-form-item label="">
              <el-button type="info" size="default" @click="activeTab='upload'">上一步</el-button>
              <el-button type="warning" size="default" @click="activeTab='delivery'">下一步</el-button>
              <el-button type="primary" size="default" @click="submit" :loading="loading">提交
              </el-button>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="配送设置" name="delivery">
            <el-form-item label="运费组合策略" prop="freight_rule">
              <el-radio-group v-model="form.freight_rule">
                <el-radio :label="10">叠加</el-radio>
                <el-radio :label="20">以最低运费结算</el-radio>
                <el-radio :label="30">以最高运费结算</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-divider content-position="left">物流轨迹API</el-divider>
            <el-form-item label="物流查询功能" prop="traces.enable">
              <el-radio-group v-model="form.traces.enable">
                <el-radio :label="1">开启</el-radio>
                <el-radio :label="0">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="API服务网关" prop="traces.default" v-if="form.traces.enable == 1">
              <el-radio-group v-model="form.traces.default">
                <el-radio label="kd100">快递100</el-radio>
                <el-radio label="aliyun" disabled>阿里云</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Customer" prop="traces.engine.kd100"
              v-if="form.traces.enable == 1 && form.traces.default == 'kd100'">
              <el-input v-model="form.traces.engine.kd100.customer" placeholder="快递100 Customer" />
            </el-form-item>
            <el-form-item label="Key" prop="traces.engine.kd100"
              v-if="form.traces.enable == 1 &&form.traces.default == 'kd100'">
              <el-input v-model="form.traces.engine.kd100.key" placeholder="快递100 Key" />
            </el-form-item>
            <el-form-item label="">
              <el-button type="info" size="default" @click="activeTab='notify'">上一步</el-button>
              <el-button type="primary" size="default" @click="submit" :loading="loading">提交
              </el-button>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script setup>
import { toast } from '@/utils/utils'
import { computed, onMounted, reactive, ref } from 'vue'
import ChooseImage from '@/components/ChooseImage.vue'
import setting from '@/api/setting'
const formRef = ref('')
const loading = ref(false)
const validateUploadAliyunBucket = (rule, value, callback) => {
  if (form.upload.default == 'aliyun' && value == '') {
    callback(new Error('存储空间名称Bucket不能为空'))
  } else {
    callback()
  }
}
const validateUploadAliyunAccessKeyId = (rule, value, callback) => {
  if (form.upload.default == 'aliyun' && value == '') {
    callback(new Error('阿里云AccessKeyId不能为空'))
  } else {
    callback()
  }
}
const validateUploadAliyunAccessKeySecret = (rule, value, callback) => {
  if (form.upload.default == 'aliyun' && value == '') {
    callback(new Error('阿里云AccessKeySecret不能为空'))
  } else {
    callback()
  }
}
const form = reactive({
  name: '',
  description: '',
  logo: '',
  cdn: '',
  allow_ip: '',
  file_setting: '',
  traces: null,
  trade: {
    close_hours: 24,
    receive_days: 7,
    refund_days: 7,
  },
  upload: {
    default: 'local',
    engine: {
      aliyun: {
        access_key_id: '',
        access_key_secret: '',
        bucket: '',
        domain: 'http://',
      },
      local: null,
    },
  },
  notify: {
    default: 'aliyun',
    receive_mobile: '13710393639',
    engine: {
      aliyun: {
        access_key_id: '',
        access_key_secret: '',
        name: '',
        template_code: '',
        sign_name: '星艺装饰',
      },
      local: null,
    },
  },
  wc_mini: {
    app_id: '',
    app_secret: '',
  },
  wx_pay: {
    app_id: '',
    api_key: '',
    mch_id: '',
    notify_url: '',
    sslcert_path: '',
    sslkey_path: '',
    trade_type: '',
  },
  mp_info: {
    app_id: '',
    app_secret: '',
    token: '',
    encodingaes_key: '',
  },
  freight_rule: 10,
  traces: {
    enable: 0,
    default: 'kd100',
    engine: {
      aliyun: {
        access_key_id: '',
        access_key_secret: '',
        name: '',
        template_code: '',
        sign_name: '星艺装饰',
      },
      kd100: {
        customer: '',
        key: '',
      },
    },
  },
})
const rules = {
  name: [
    {
      required: true,
      message: '应用名称不能为空',
      trigger: 'blur',
    },
  ],
  description: [
    {
      required: true,
      message: '应用描述不能为空',
      trigger: 'blur',
    },
  ],
  logo: [
    {
      required: true,
      message: '应用LOGO不能为空',
      trigger: 'blur',
    },
  ],
  'upload.default': [
    {
      required: true,
      message: '默认上传方式不能为空',
      trigger: 'blur',
    },
  ],
  'upload.engine.aliyun.bucket': [
    {
      validator: validateUploadAliyunBucket,
      trigger: 'blur',
    },
    { min: 6, max: 20, message: '存储空间名称 Bucket长度6至20位之间', trigger: 'blur' },
  ],
  'upload.engine.aliyun.access_key_id': [
    {
      validator: validateUploadAliyunAccessKeyId,
      trigger: 'blur',
    },
  ],
  'upload.engine.aliyun.access_key_secret': [
    {
      validator: validateUploadAliyunAccessKeySecret,
      trigger: 'blur',
    },
  ],
  'notify.default': [
    {
      required: true,
      message: '默认短信平台不能为空',
      trigger: 'blur',
    },
  ],
  freight_rule: [
    {
      required: true,
      message: '运费组合策略不能为空',
      trigger: 'blur',
    },
  ],
}

// tabs切换
const activeTab = ref('basic')

const handleTabChange = (tab) => {
  let fields = []
  if (tab != 'basic') {
    fields = ['name', 'description', '']
    formRef.value.validateField(fields, (valid) => {
      if (!valid) {
        activeTab.value = 'basic'
      } else {
        activeTab.value = tab
      }
    })
  }
}

onMounted(() => {
  getDetail(10001)
})
// getDetail(10001)

const getDetail = (id) => {
  loading.value = true
  setting
    .read(id)
    .then((res) => {
      if (res.code > 0) {
        const result = res.result
        console.log(result)
      } else {
        toast(res.message || 'error', 'error')
        return false
      }
    })
    .finally(() => {
      loading.value = false
    })
}

// 表单提交
const submit = () => {
  formRef.value.validate((valid, fields) => {
    if (!valid) {
      const errorFields = Object.keys(fields)
      // .map((key) => fields[key].Error)
      // .join(', ')
      toast(`表单验证失败: ${Object.values(fields)[0]}`, 'error')
      return false
    }
    loading.value = true
    setting
      .edit(form)
      .then((res) => {
        if (res.code > 0) {
          toast('数据更新成功')
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
  font-weight: 700 !important;
}
.notice {
  font-size: 12px;
  color: #666;
}
.separator {
  display: table;
  margin: 20px 0;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  text-align: center;
  background: transparent;
}
.separator::before {
  position: relative;
  top: 50%;
  display: table-cell;
  width: 5%;
  border-top: 1px solid #e8e8e8;
  -webkit-transform: translateY(50%);
  transform: translateY(50%);
  content: '';
}
.separator::after {
  position: relative;
  top: 50%;
  display: table-cell;
  width: 95%;
  border-top: 1px solid #e8e8e8;
  -webkit-transform: translateY(50%);
  transform: translateY(50%);
  content: '';
}
.separator span {
  display: inline-block;
  padding: 0 10px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.61);
}
</style>
