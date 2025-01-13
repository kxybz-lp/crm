<template>
  <div class="app-container">
    <el-card class="admin-card" shadow="hover">
      <ListHeader :rule="{ create: 35 }" @add="handleAdd" />
      <el-table :data="dataList" stripe style="width: 100%"
        :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }" v-loading="loading">
        <el-table-column type="selection" prop="id" width="55"> </el-table-column>
        <el-table-column prop="name" label="角色名" min-width="180"> </el-table-column>
        <el-table-column prop="level" label="级别" min-width="80"> </el-table-column>
        <el-table-column prop="remark" label="描述" min-width="180"> </el-table-column>
        <el-table-column label="状态" width="150" v-permission="37">
          <template #default="scope">
            <el-switch :modelValue="scope.row.status" :disabled="scope.row.id == 1"
              :active-value="1" :inactive-value="0" :loading="scope.row.statusLoading"
              @change="handleSwitch($event, scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" min-width="180"></el-table-column>
        <el-table-column label="操作" width="260">
          <template #default="scope">
            <el-button :loading="loading" v-permission="38" size="small" type="warning"
              @click="handleAuths(scope.row)">授权角色 </el-button>
            <el-button v-permission="36" size="small" type="primary" :disabled="scope.row.id == 1"
              @click="handleEdit(scope.row)">编辑 </el-button>
            <el-button v-permission="39" size="small" type="danger" :disabled="scope.row.id == 1"
              @click="handleDelete(scope.row.id)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" :current-page="params.page"
        :hide-on-single-page="true" :page-size="params.pageSize" :background="true"
        :layout="$store.state.isMobile? 'total,prev, next' : 'total,prev, pager, next'"
        :total="count" class="fenye">
      </el-pagination>
    </el-card>
    <FormDialog destroyOnClose :title="'角色' + dialogTitle" ref="formDialogRef"
      @dialogClosed="dialogClosed" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="140px"
        :label-position="$store.state.isMobile ? 'top' : 'right'">
        <el-form-item label="角色名" prop="name">
          <el-input minlength="2" maxlength="20" show-word-limit v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-input v-model="form.level" type="number" min="0" max="100" placeholder="数值越大，权限越高">
          </el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input type="textarea" minlength="2" maxlength="30" show-word-limit
            v-model="form.remark" resize="none"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
    </FormDialog>
    <!-- 权限配置 -->
    <FormDrawer ref="setAuthsformDialogRef" title="授权角色" @drawerClosed="drawerClosed"
      @submit="handleSetAuthsSubmit">
      <el-scrollbar>
        <el-tree ref="elTreeRef" node-key="id" :check-strictly="checkStrictly"
          :check-on-click-node="true" :default-expanded-keys="defaultExpandedKeys" :data="ruleList"
          :props="{ label: 'label', children: 'children' }" show-checkbox :height="treeHeight"
          @check="handleTreeCheck" style="padding:15px;"></el-tree>
      </el-scrollbar>
    </FormDrawer>
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import FormDialog from '@/components/FormDialog.vue'
import ListHeader from '@/components/ListHeader.vue'
// import ChooseImage from '@/components/ChooseImage.vue'
import role from '@/api/role'
import menu from '@/api/menu'
import { toast } from '@/utils/utils'
import { useInitTable, useInitForm } from '@/hooks/useCommon'
const { loading, count, params, dataList, getData, handleCurrentChange, handleSwitch, handleDelete } = useInitTable({
  api: role,
  params: {
    page: 1,
    pageSize: 15,
    name: '',
  },
})
const { dialogTitle, formDialogRef, formRef, rules, form, handleAdd, handleEdit, handleSubmit, dialogClosed } = useInitForm({
  api: role,
  getData,
  form: {
    name: '',
    remark: '',
    level: '',
    status: 1,
  },
  rules: {
    name: [
      {
        required: true,
        message: '角色名不能为空',
        trigger: 'blur',
      },
    ],
  },
})

const ruleList = ref([])
const treeHeight = ref(0)
const roleId = ref(0)
const setAuthsformDialogRef = ref(null)
const defaultExpandedKeys = ref([])
const elTreeRef = ref(null)
// 当前角色拥有的权限ID
const ruleIds = ref([])
const checkStrictly = ref(false)

// 授权角色
const handleAuths = (row) => {
  loading.value = true
  roleId.value = row.id
  treeHeight.value = window.innerHeight - 150
  checkStrictly.value = true //赋值前取消父子强制关联
  menu.getList().then((res) => {
    ruleList.value = res.result
    defaultExpandedKeys.value = res.result.map((o) => o.id)
    setAuthsformDialogRef.value.openDrawer()
    loading.value = false
    // 当前角色拥有的权限ID
    if (row.auths) ruleIds.value = row.auths.split(',').map((o) => parseInt(o))
    nextTick(() => {
      elTreeRef.value.setCheckedKeys(ruleIds.value)
      checkStrictly.value = false
    })
  })
}

// treeselect勾选监听
const handleTreeCheck = (...e) => {
  // 获取选中与半选中的值
  const { checkedKeys, halfCheckedKeys } = e[1]
  ruleIds.value = [...checkedKeys, ...halfCheckedKeys]
}

// 关闭弹窗，清空所有选中的节点
const drawerClosed = () => {
  //elTreeRef.value.setCurrentKey(null)
  //elTreeRef.value.setCheckedNodes([])
  //console.log(elTreeRef.value.getCheckedNodes())
  ruleIds.value = []
}

// 设置权限
const handleSetAuthsSubmit = () => {
  setAuthsformDialogRef.value.showLoading()
  role
    .authorize({ id: roleId.value, auths: ruleIds.value })
    .then((res) => {
      if (res.code > 0) {
        toast('权限设置成功')
        setAuthsformDialogRef.value.closeDrawer()
        getData()
      } else {
        toast(res.message, 'error')
      }
    })
    .finally(() => {
      setAuthsformDialogRef.value.hideLoading()
    })
}
</script>
<style lang="scss" scoped></style>
