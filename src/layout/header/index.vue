<template>
  <div class="header-left">
    <el-icon @click="$store.commit('switchCollapse')" v-if="!$store.state.isMobile">
      <expand v-if="$store.state.collapse" />
      <fold v-else />
    </el-icon>
    <el-icon @click="$store.commit('switchCollapseMobile')" v-if="$store.state.isMobile">
      <expand v-if="!$store.state.collapse" />
      <fold v-else />
    </el-icon>
    <el-tooltip effect="dark" content="刷新" placement="bottom">
      <el-icon @click="refresh">
        <Refresh />
      </el-icon>
    </el-tooltip>
    <BreadCrumbVue v-show="!$store.state.isMobile"></BreadCrumbVue>
  </div>
  <div class="header-right">
    <el-dropdown style="margin-left: 25px;" :max-height="400" v-permission="148">
      <el-badge :value="$store.state.noteList ? $store.state.noteList.length : 0" :max="99"
        class="item" style="margin-right: 20px;">
        <el-icon>
          <Bell />
        </el-icon>
      </el-badge>
      <template #dropdown>
        <el-dropdown-menu class="note_wrap">
          <el-dropdown-item v-for="item in $store.state.noteList" :key="item.id">
            <div class="note_item">
              <div class="title">
                <el-tag type="danger" style="color: #fb6a3a" v-if="item.is_audit === 1">待跟进订单
                </el-tag>
                <el-tag type="warning" v-else-if="item.is_audit === 2">待审核订单</el-tag>
                <el-tag type="warning" v-else-if="item.is_audit === 3">审核失败订单</el-tag>
              </div>
              <div class="info" @click="handleNote(item.id)">
                {{ item.order_time }}
                {{ item.name }}
                {{ item.province_name + item.city_name }} <span style="color:#f56c6c">[立即处理]</span>
              </div>
              <div></div>
            </div>
          </el-dropdown-item>
          <!-- <div class="note_wrap">
            <div class="note_item" v-for="item in $store.state.noteList" :key="item.id">
              <div class="title">
                <el-tag type="danger" style="color: #fb6a3a" v-if="item.is_audit === 1">待跟进订单
                </el-tag>
                <el-tag type="warning" v-else-if="item.is_audit === 2">待审核订单</el-tag>
                <el-tag type="warning" v-else-if="item.is_audit === 3">审核失败订单</el-tag>
              </div>
              <div class="info" @click="$router.push('/order/edit/' + item.id)">
                {{ item.order_time }}
                {{ item.name }}
                {{ item.province_name + item.city_name }} <span style="color:#f56c6c">[立即处理]</span>
              </div>
              <div></div>
            </div>
          </div> -->
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-tooltip effect="dark" content="全屏" placement="bottom" v-if="!$store.state.isMobile">
      <el-icon @click="switchFull" style="margin-right:8px;">
        <copy-document v-if="full" />
        <full-screen v-else />
      </el-icon>
    </el-tooltip>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{ $store.state.adminInfo.name }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="password">修改密码</el-dropdown-item>
          <el-dropdown-item @click="$router.push('/admin/wechat')">绑定微信</el-dropdown-item>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <FormDrawer ref="formDrawerRef" title="修改密码" :close-on-click-modal="false" @submit="onSubmit">
    <el-form ref="formRef" :rules="rules" :model="form" label-width="80px"
      :label-position="$store.state.isMobile ? 'top' : 'right'" style="padding:0 15px;">
      <el-form-item prop="oldpassword" label="旧密码">
        <el-input v-model="form.oldpassword" placeholder="请输入旧密码"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="新密码">
        <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password>
        </el-input>
      </el-form-item>
      <el-form-item prop="repassword" label="确认密码">
        <el-input type="password" v-model="form.repassword" placeholder="请输入确认密码" show-password>
        </el-input>
      </el-form-item>
    </el-form>
  </FormDrawer>
  <!-- <follow ref="followHeaderRef" /> -->
  <!-- 公司信息编辑 -->
  <!-- <FormStore></FormStore> -->

</template>

<script setup>
import { ref } from 'vue'
// import admin from '@/api/admin'
// import order from '@/api/order'
import BreadCrumbVue from './BreadCrumb.vue'
import FormDrawer from '@/components/FormDrawer.vue'
import { useRepassword, useLogout } from '@/hooks/useAdmin'
import { handleFullScreen } from '@/utils/utils'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
// import follow from '@/views/order/compontens/follow.vue'
// import FormStore from '@/components/FormStore.vue'

const store = useStore()
const router = useRouter()
const full = ref(false)

const noteList = ref([])

const { formDrawerRef, formRef, form, rules, password, onSubmit } = useRepassword()
const { logout } = useLogout()

const refresh = () => {
  location.reload()
}

const handleCommand = (command) => {
  switch (command) {
    case 'logout':
      logout()
      break
    case 'password':
      password()
      break
    case 'wechat':
      console.log('wechatj')
      break
  }
}

// const $utils = internalInstance.appContext.config.globalProperties.$utils
const switchFull = () => {
  handleFullScreen(full.value)
  full.value = !full.value
}

// 订单跟进
const followHeaderRef = ref('')
const handleNote = (id) => {
  if (store.state.adminInfo.branch_id == 1) {
    router.push('/order/edit/' + id)
  } else {
    followHeaderRef.value.openFollowDrawer(id)
  }
}

// websocket消息实时提醒 https://www.freesion.com/article/6784910552/
// const getNoteData = () => {
//   admin.getNote().then((res) => {
//     if (res.code > 0) {
//       noteList.value = res.result.map((item) => {
//         item.order_time = parseTime(item.order_time, '{y}-{m}-{d} {h}:{i}')
//         return item
//       })
//       console.log(note.value)
//     } else {
//       toast(res.message || 'Error', 'error')
//     }
//   })
// }

// getNoteData()
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  &-left {
    display: flex;
    align-items: center;
    .el-icon {
      margin-right: 10px;
    }
  }
  .el-icon {
    font-size: 18px;
    color: var(--color);
    cursor: pointer;
  }
  .el-dropdown {
    cursor: pointer;
    .el-dropdown-link {
      position: relative;
      top: -3px;
      .el-icon--right {
        position: relative;
        top: 3px;
      }
    }
  }
}
.note_wrap {
  width: 280px;
  overflow: hidden;
}
.note_wrap :deep(.el-dropdown-menu__item) {
  white-space: inherit !important;
}
.note_wrap .note_item {
  font-size: 14px;
  color: #666;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}
.note_wrap .note_item .title {
  color: #333;
  margin-bottom: 10px;
}
.note_wrap .note_item .info {
  color: #666;
  line-height: 20px;
  cursor: pointer;
}
</style>
