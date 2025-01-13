<template>
  <div class="app-container" v-loading="loading">
    <el-card class="admin-card" shadow="hover">
      <div v-if="is_subscribe == 0" class="wechat_login">
        <img :src="img" alt="" style="max-width: 200px; display: block; margin: 20px auto 0px" />
        <p style="font-size: 12px; color: #666; text-align: center; padding-bottom: 50px">
          打开微信扫一扫，关注星艺公众号</p>
      </div>
      <div class="" v-else>
        <div class="wechat_info">
          <el-icon :size="16">
            <CircleCheck />
          </el-icon>
          <span>您已经成功绑定微信号！！！</span>
        </div>
        <el-button type="danger" size="small" @click="bind_remove">解除绑定</el-button>
      </div>
    </el-card>
  </div>
</template>
<script setup>
import admin from '@/api/admin'
import { showModal, toast } from '@/utils/utils'
import { onUnmounted, onDeactivated, ref } from 'vue'

// 方便清除轮询
let timer = null
let flag = ''

const is_subscribe = ref(0)
const img = ref('')
const loading = ref(false)
const loadData = () => {
  loading.value = true
  admin
    .wechat()
    .then((res) => {
      is_subscribe.value = res.result.is_subscribe
      img.value = res.result.img
    })
    .finally(() => {
      loading.value = false
    })
}
loadData()

// 解除绑定
const bind_remove = () => {
  showModal('确认要解除微信绑定吗？')
    .then((res) => {
      loading.value = true
      admin
        .wechatRemove()
        .then((res) => {
          if (res.code > 0) {
            toast('微信解绑成功')
            loadData()
          } else {
            toast(res.message, 'error')
          }
        })
        .finally(() => {
          loading.value = false
        })
    })
    .catch((err) => {})
}

// 扫码绑定
setTimeout(() => {
  if (is_subscribe.value === 0) {
    timer = setInterval(() => {
      admin.wechatCheck().then((res) => {
        if (res.code > 0) {
          toast('微信绑定成功')
          clearInterval(timer)
          loadData()
        }
      })
    }, 2000)
  }
}, 3000)
// 组件切换时清除定时器
onDeactivated(() => {
  clearInterval(timer)
})
// 组件卸载时清除定时器
onUnmounted(() => {
  clearInterval(timer)
})
</script>
<style lang="scss" scoped>
.wechat_info {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
  .el-icon {
    margin-right: 5px;
    color: #67c23a;
  }
}
</style>
