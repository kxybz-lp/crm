<template>
  <div class="app-container">
    <el-card class="admin-card" shadow="hover">
      <ListHeader :rule="{ create: 90, sort: 93 }" @add="handleAdd" @sort="handleSortAll" />
      <el-table :data="dataList" stripe style="width: 100%"
        :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }" v-loading="loading"
        row-key="id">
        <el-table-column type="selection" prop="id" width="55"> </el-table-column>
        <el-table-column prop="name" label="名称" min-width="260">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-tag size="small" :type="scope.row.pid ? 'info' : ''">
                {{ scope.row.pid ? '来源' : '渠道' }}</el-tag>
              <span style="padding-left: 5px">{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="排序号" min-width="160">
          <template #default="scope">
            <el-input style="width: 80%" type="number" v-model="scope.row.list_order" min="0" />
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="120" v-permission="92">
          <template #default="scope">
            <el-switch :modelValue="scope.row.status" :active-value="1" :inactive-value="0"
              :loading="scope.row.statusLoading" @change="handleSwitch($event, scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260">
          <template #default="scope">
            <el-button v-permission="94" size="small" type="warning"
              @click="addChild(scope.row.id)">添加来源 </el-button>
            <el-button v-permission="91" size="small" type="primary" @click="handleEdit(scope.row)">
              编辑 </el-button>
            <el-button v-permission="95" size="small" type="danger"
              @click="handleDelete(scope.row.id)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <FormDialog destroyOnClose :title="dialogTitle" ref="formDialogRef" @dialogClosed="dialogClosed"
      @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="140px"
        :label-position="$store.state.isMobile ? 'top' : 'right'">
        <el-form-item label="所属渠道" prop="pid">
          <el-cascader v-model="form.pid" :options="dataList"
            :props="{ value: 'id', label: 'name', children: 'children', checkStrictly: true, emitPath: false }"
            placeholder="作为一级渠道" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input minlength="2" maxlength="20" show-word-limit v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="排序号">
          <el-input v-model="form.list_order" type="number"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
    </FormDialog>
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import ListHeader from '@/components/ListHeader.vue'
import FormDialog from '@/components/FormDialog.vue'
import channel from '@/api/channel'
import { toast } from '@/utils/utils'
import { useInitTable, useInitForm } from '@/hooks/useCommon'
const { loading, dataList, getData, handleSwitch, handleSort, handleDelete } = useInitTable({
  api: channel,
  params: {
    page: 1,
    pageSize: 200,
    name: '',
  },
  onGetListSuccess: (res) => {
    dataList.value = res.result
  },
})
const { dialogTitle, formDialogRef, formRef, rules, form, handleAdd, handleEdit, handleSubmit, dialogClosed } = useInitForm({
  api: channel,
  getData,
  form: {
    pid: 0,
    name: '',
    list_order: 100,
    status: 1,
  },
  rules: {
    name: [
      {
        required: true,
        message: '名称不能为空',
        trigger: 'blur',
      },
    ],
  },
})

const ruleid = ref(35) //新增 权限ID

const addChild = (id) => {
  handleAdd()
  form.pid = id
  form.status = 1
}

const handleSortAll = () => {
  let sort = []
  filterMenu(dataList.value, sort)
  loading.value = true
  channel
    .sort(sort)
    .then((res) => {
      if (res.code > 0) {
        toast('数据更新成功')
        getData()
      } else {
        toast(res.message || 'Error', 'error')
      }
    })
    .finally(() => {
      loading.value = false
    })
}

// 递归将多维数据转成一维数组
const filterMenu = (data, arr = []) => {
  data.forEach((item, index) => {
    arr.push({ id: item.id, list_order: parseInt(item.list_order) })
    if (item.children && item.children.length > 0) {
      filterMenu(item.children, arr)
    }
    return arr
  })
}
</script>
<style lang="scss" scoped>
:deep(.el-table .cell) {
  display: flex;
  align-items: center;
}
</style>
