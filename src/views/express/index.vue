<template>
  <div class="app-container">
    <el-card class="admin-card" shadow="hover">
      <ListHeader :rule="{ create: 210, sort: 212 }" @add="handleAdd" @sort="handleSort">
        <el-form class="search-form" :model="params" ref="searchRef" label-width="0px"
          size="default">
          <el-form-item label="">
            <el-input v-model="params.express_name" placeholder="输入物流公司名称" clearable
              @clear="getData(1)">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getData(1)">搜索</el-button>
          </el-form-item>
        </el-form>
      </ListHeader>
      <el-table :data="dataList" stripe style="width: 100%"
        :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }" v-loading="loading">
        <el-table-column type="selection" prop="express_id" width="55"> </el-table-column>
        <el-table-column prop="express_name" label="物流公司名称" min-width="180"> </el-table-column>
        <el-table-column prop="kuaidi100_code" label="公司编码（快递100）" min-width="160">
        </el-table-column>
        <el-table-column prop="kdniao_code" label="公司编码（快递鸟）" min-width="160"> </el-table-column>
        <el-table-column label="排序号" min-width="160">
          <template #default="scope">
            <el-input type="number" style="width: 60%" v-model="scope.row.sort" min="0" />
          </template>
        </el-table-column>
        <el-table-column label="状态" width="150" v-permission="37">
          <template #default="scope">
            <el-switch :modelValue="scope.row.status" :active-value="1" :inactive-value="0"
              :loading="scope.row.statusLoading"
              @change="handleSwitch($event, scope.row, 'express_id')" />
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" min-width="180"></el-table-column>
        <el-table-column label="操作" width="260">
          <template #default="scope">
            <el-button v-permission="211" size="small" type="primary"
              @click="handleEdit(scope.row, 'express_id')">编辑 </el-button>
            <el-button v-permission="213" size="small" type="danger"
              @click="handleDelete(scope.row.express_id)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" :current-page="params.page"
        :hide-on-single-page="true" :page-size="params.pageSize" :background="true"
        :layout="$store.state.isMobile? 'total,prev, next' : 'total,prev, pager, next'"
        :total="count" class="fenye">
      </el-pagination>
    </el-card>
    <FormDialog destroyOnClose :title="'物流公司' + dialogTitle" ref="formDialogRef"
      @dialogClosed="dialogClosed" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="180px"
        :label-position="$store.state.isMobile ? 'top' : 'right'">
        <el-form-item label="物流公司名称" prop="express_name">
          <el-input minlength="2" maxlength="20" show-word-limit
            v-model="form.express_name"></el-input>
        </el-form-item>
        <el-form-item label="公司编码（快递100）" prop="level">
          <el-input v-model="form.kuaidi100_code" placeholder="">
          </el-input>
          <view class="notice">请参照<a style="color: #076575;"
              href="https://api.kuaidi100.com/manager/page/document/kdbm"
              target="_blank">物流公司编码表</a></view>
        </el-form-item>
        <el-form-item label="公司编码（快递鸟）" prop="kdniao_code">
          <el-input v-model="form.kdniao_code" placeholder="" />
          <view class="notice">请参照<a style="color: #076575;" href="http://www.kdniao.com/documents"
              target="_blank">快递鸟接口支持快递公司编码.xlsx</a></view>
        </el-form-item>
        <el-form-item label="排序号" prop="sort">
          <el-input v-model="form.sort" type="number" min="1" max="1000">
          </el-input>
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
import FormDialog from '@/components/FormDialog.vue'
import ListHeader from '@/components/ListHeader.vue'
// import ChooseImage from '@/components/ChooseImage.vue'
import express from '@/api/express'
import menu from '@/api/menu'
import { toast } from '@/utils/utils'
import { useInitTable, useInitForm } from '@/hooks/useCommon'
const { loading, count, params, dataList, getData, handleCurrentChange, handleSwitch, handleSort, handleDelete } = useInitTable({
  api: express,
  params: {
    page: 1,
    pageSize: 15,
    express_name: '',
  },
})
const { editId, dialogTitle, formDialogRef, formRef, rules, form, handleAdd, handleEdit, handleSubmit, dialogClosed } = useInitForm({
  api: express,
  getData,
  form: {
    express_name: '',
    kuaidi100_code: '',
    kdniao_code: '',
    sort: 100,
    status: 1,
  },
  rules: {
    express_name: [
      {
        required: true,
        message: '物流公司名不能为空',
        trigger: 'blur',
      },
    ],
    kuaidi100_code: [
      {
        required: true,
        message: '公司编码（快递100）不能为空',
        trigger: 'blur',
      },
    ],
    kdniao_code: [
      {
        required: true,
        message: '公司编码（快递鸟）不能为空',
        trigger: 'blur',
      },
    ],
  },
})
</script>
  <style lang="scss" scoped></style>
  