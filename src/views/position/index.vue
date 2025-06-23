<template>
  <div class="app-container">
    <el-card class="admin-card" shadow="hover">
      <ListHeader :rule="{ create: 97, sort: 100 }" @add="handleAdd" @sort="handleSort" />
      <el-table :data="dataList" stripe style="width: 100%" :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }" v-loading="loading">
        <el-table-column type="selection" prop="id" width="55"> </el-table-column>
        <el-table-column prop="name" label="职位" min-width="180"> </el-table-column>
        <el-table-column label="排序号" min-width="160">
          <template #default="scope">
            <el-input type="number" style="width: 60%" v-model="scope.row.sort" min="0" />
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="120" v-permission="99">
          <template #default="scope">
            <el-switch :modelValue="scope.row.status" :active-value="1" :inactive-value="0" :loading="scope.row.statusLoading" @change="handleSwitch($event, scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button v-permission="98" size="small" type="primary" @click="handleEdit(scope.row)"> 编辑 </el-button>
            <el-button v-permission="101" size="small" type="danger" @click="handleDelete(scope.row.id)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :hide-on-single-page="true"
        :page-size="params.pageSize"
        :background="true"
        :layout="$store.state.isMobile ? 'total,prev, next' : 'total,prev, pager, next'"
        :total="count"
        class="fenye"
      >
      </el-pagination>
    </el-card>
    <FormDialog destroyOnClose :title="dialogTitle" ref="formDialogRef" @dialogClosed="dialogClosed" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="140px" :label-position="$store.state.isMobile ? 'top' : 'right'">
        <el-form-item label="职位" prop="name">
          <el-input minlength="2" maxlength="20" show-word-limit v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="排序号">
          <el-input v-model="form.sort" type="number"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
    </FormDialog>
  </div>
</template>

<script setup>
import FormDialog from '@/components/FormDialog.vue'
import ListHeader from '@/components/ListHeader.vue'
import card_position from '@/api/card_position'
import { useInitTable, useInitForm } from '@/hooks/useCommon'
const { loading, params, count, dataList, getData, handleCurrentChange, handleSwitch, handleSort, handleDelete } = useInitTable({
  api: card_position,
  params: {
    page: 1,
    pageSize: 15,
    name: '',
  },
})
const { dialogTitle, formDialogRef, formRef, rules, form, handleAdd, handleEdit, handleSubmit, dialogClosed } = useInitForm({
  api: card_position,
  getData,
  form: {
    name: '',
    sort: 100,
    status: 1,
  },
  rules: {
    name: [
      {
        required: true,
        message: '职位名称不能为空',
        trigger: 'blur',
      },
    ],
  },
})
</script>
<style lang="scss" scoped></style>
