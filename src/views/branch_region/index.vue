<template>
  <div class="app-container">
    <el-card class="admin-card" shadow="hover">
      <ListHeader :rule="{ create: 267, sort: 270 }" @add="handleAdd" @sort="handleSort" />
      <el-table :data="dataList" stripe style="width: 100%" :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }" v-loading="loading">
        <el-table-column type="selection" prop="id" width="55"> </el-table-column>
        <el-table-column prop="name" label="区域名称" min-width="180"> </el-table-column>
        <el-table-column prop="contact_name" label="负责人" min-width="180"> </el-table-column>
        <el-table-column prop="contact_mobile" label="联系电话" min-width="180"> </el-table-column>
        <el-table-column label="排序号" min-width="160">
          <template #default="scope">
            <el-input type="number" style="width: 60%" v-model="scope.row.list_order" min="0" />
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="120" v-permission="269">
          <template #default="scope">
            <el-switch :modelValue="scope.row.status" :active-value="1" :inactive-value="0" :loading="scope.row.statusLoading" @change="handleSwitch($event, scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button v-permission="268" size="small" type="primary" @click="handleEdit(scope.row)"> 编辑 </el-button>
            <el-button v-permission="271" size="small" type="danger" @click="handleDelete(scope.row.id)"> 删除 </el-button>
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
        <el-form-item label="区域名称" prop="name">
          <el-input minlength="2" maxlength="20" show-word-limit v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="contact_name">
          <el-input minlength="2" maxlength="20" show-word-limit v-model="form.contact_name"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="contact_mobile">
          <el-input minlength="11" maxlength="11" show-word-limit v-model="form.contact_mobile"></el-input>
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
import FormDialog from '@/components/FormDialog.vue'
import ListHeader from '@/components/ListHeader.vue'
import branch_region from '@/api/branch_region'
import { useInitTable, useInitForm } from '@/hooks/useCommon'
const { loading, params, count, dataList, getData, handleCurrentChange, handleSwitch, handleSort, handleDelete } = useInitTable({
  api: branch_region,
  params: {
    page: 1,
    pageSize: 15,
    name: '',
  },
})
const { dialogTitle, formDialogRef, formRef, rules, form, handleAdd, handleEdit, handleSubmit, dialogClosed } = useInitForm({
  api: branch_region,
  getData,
  form: {
    name: '',
    contact_name: '',
    contact_mobile: '',
    list_order: 100,
    sort: 100,
    status: 1,
  },
  rules: {
    name: [
      {
        required: true,
        message: '区域名称不能为空',
        trigger: 'blur',
      },
    ],
  },
})
</script>
<style lang="scss" scoped></style>
