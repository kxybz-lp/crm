<template>
  <div class="app-container">
    <el-card class="admin-card" shadow="hover">
      <ListHeader :rule="{ create: 8 }" @add="handleAdd">
        <el-form class="search-form" :model="params" ref="searchRef" label-width="0px"
          size="default">
          <el-form-item label="" v-show="!$store.state.isMobile">
            <el-select v-model="params.role_id" placeholder="选择角色" clearable @clear="getData(1)">
              <el-option :value="item.id" :label="item.name" v-for="item in roleList"
                :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="" v-show="!$store.state.isMobile">
            <el-select v-model="params.openid" placeholder="绑定微信" clearable @clear="getData(1)">
              <el-option value="1" label="已绑定"></el-option>
              <el-option value="2" label="未绑定"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="">
            <el-input v-model="params.name" placeholder="输入用户名" clearable @clear="getData(1)">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getData(1)">搜索</el-button>
          </el-form-item>
        </el-form>
      </ListHeader>
      <el-table ref="multipleTableRef" :data="dataList" stripe style="width: 100%"
        :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }"
        @sort-change="sortChange" @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column type="selection" prop="id" width="55"> </el-table-column>
        <el-table-column prop="name" label="登录名" min-width="140"> </el-table-column>
        <el-table-column prop="role_name" label="角色" min-width="140"> </el-table-column>
        <el-table-column prop="store_name" label="所属公司" min-width="160"> </el-table-column>
        <el-table-column prop="ip" label="最后登录IP" min-width="140"> </el-table-column>
        <el-table-column prop="last_login_time" sortable label="最后登录时间" min-width="140">
        </el-table-column>
        <el-table-column label="状态" v-permission="32">
          <template #default="scope">
            <el-switch :modelValue="scope.row.status" :disabled="scope.row.id == 10001"
              :active-value="1" :inactive-value="0" :loading="scope.row.statusLoading"
              @change="handleSwitch($event, scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="绑定微信" min-width="120">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.openid">已绑定</el-tag>
            <el-tag type="danger" v-else>未绑定</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template #default="scope">
            <el-button v-permission="31" size="small" type="primary"
              :disabled="scope.row.id == 10001" @click="handleEdit(scope.row)">编辑 </el-button>
            <el-button v-permission="33" size="small" type="danger"
              :disabled="scope.row.id == 10001" @click="handleDelete(scope.row.id)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" :current-page="params.page"
        :page-size="params.pageSize" :background="true"
        :layout="$store.state.isMobile? 'total,prev, next' : 'total,prev, pager, next'"
        :total="count" class="fenye">
      </el-pagination>
    </el-card>
    <FormDialog destroyOnClose :title="'管理员' + dialogTitle" ref="formDialogRef"
      @dialogClosed="dialogClosed" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="140px" :inline="false"
        :label-position="$store.state.isMobile ? 'top' : 'right'">
        <el-form-item label="登录名" prop="name">
          <el-input minlength="2" maxlength="20" show-word-limit v-model="form.name"
            :disabled="editId != 0"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" show-password v-model="form.password"
            :placeholder="editId == 0 ? '' : '留空则不修改密码'"></el-input>
        </el-form-item>
        <el-form-item v-if="editId == 0" label="确认密码" prop="password_confirm">
          <el-input type="password" show-password v-model="form.password_confirm"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="form.role_id" placeholder="选择角色">
            <el-option :value="item.id" :label="item.name" :disabled="item.status == 0"
              v-for="item in roleList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属公司" prop="store_id">
          <el-select clearable multiple filterable v-model="form.store_id" placeholder="选择公司">
            <el-option :value="item.id.toString()" :label="item.name" :disabled="item.status == 2"
              v-for="item in storeList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="微信号" v-if="editId != 0">
          <el-input v-model="form.openid" />
        </el-form-item>
        <!-- <el-form-item label="头像" prop="avatar">
          <ChooseImage v-model="form.avatar" />
        </el-form-item> -->
        <!-- <el-form-item label="规格值" prop="default">
          <TagInput v-model="form.default" />
        </el-form-item> -->
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
    </FormDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FormDialog from '@/components/FormDialog.vue'
import ListHeader from '@/components/ListHeader.vue'
// import ChooseImage from '@/components/ChooseImage.vue'
// import TagInput from '@/components/TagInput.vue'
import admin from '@/api/admin'
import { toast } from '@/utils/utils'
import { useInitTable, useInitForm } from '@/hooks/useCommon'
const { loading, count, dataList, params, getData, handleCurrentChange, handleSwitch, sortChange, handleDelete, handleSelectionChange } = useInitTable({
  api: admin,
  params: {
    page: 1,
    pageSize: 15,
    name: '',
    role_id: '',
    openid: '',
    sort: '',
  },
  onGetListSuccess: (res) => {
    count.value = res.result.total
    dataList.value = res.result.data.map((o) => {
      // o.last_login_time = dateFormart(o.last_login_time, 'hour')
      o.statusLoading = false
      return o
    })
  },
})

// 密码验证
const validatePass = (rule, value, callback) => {
  if (value === '' && editId.value == 0) {
    callback(new Error('密码不能为空'))
  } else {
    callback()
  }
}
// 确认密码验证
const validateCheckPass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('确认密码不能为空'))
  } else {
    if (value != form.password) {
      callback(new Error('确认密码与密码不一致'))
    }
    callback()
  }
}
const { dialogTitle, formDialogRef, formRef, rules, form, editId, handleAdd, handleEdit, handleSubmit, dialogClosed } = useInitForm({
  api: admin,
  getData,
  form: {
    name: '',
    password: '',
    password_confirm: '',
    role_id: '',
    store_id: [],
    openid: '',
    status: 1,
  },
  rules: {
    name: [
      {
        required: true,
        message: '登录名不能为空',
        trigger: 'blur',
      },
    ],
    password: [
      {
        validator: validatePass,
        trigger: 'blur',
      },
      { min: 6, max: 20, message: '密码长度6至20位之间', trigger: 'blur' },
    ],
    password_confirm: [
      {
        validator: validateCheckPass,
        trigger: 'blur',
      },
    ],
    role_id: [
      {
        required: true,
        message: '请选择角色',
        trigger: 'blur',
      },
    ],
    store_id: [
      {
        type: 'array',
        required: true,
        message: '请选择所属公司',
        trigger: 'blur',
      },
    ],
  },
  fliterParam: (row) => {
    row['password'] = ''
    // row['store_id'] = row['store_id'].split(',').map((o) => parseInt(o))
    for (const key in form) {
      form[key] = row[key]
    }
  },
})

// 将字符串日期转时间戳， 2020-09-12 12:11:22
// let time = (new Date(row.create_time)).getTime()
// 当前时间戳
// let time_current = new Date().getTime()

const roleList = ref([])
const storeList = ref([])

// select数据,合并远程请求
admin.getSelect().then((res) => {
  if (res.code > 0) {
    roleList.value = res.result.role
    storeList.value = res.result.store
  } else {
    toast(res.message || 'Error', 'error')
  }
})

// const instance = getCurrentInstance()
// const $api = instance.proxy.$api
</script>
<style lang="scss" scoped></style>
