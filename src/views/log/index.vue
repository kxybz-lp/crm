<template>
  <div class="app-container">
    <el-card class="log-card" shadow="hover">
      <ListHeader :rule="{ delete: 70 }" @delete="handleMultiDelete">
        <el-form class="search-form" :model="params" ref="searchRef" label-width="0px"
          size="default" v-if="!$store.state.isMobile">
          <el-form-item label="">
            <el-select v-model="params.type" placeholder="操作类型" clearable @clear="getData(1)">
              <el-option :value="item.id" :label="item.name" v-for="item in type" :key="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="params.name" placeholder="操作人" clearable @clear="getData(1)">
            </el-input>
          </el-form-item>
          <el-form-item label="">
            <el-date-picker style="width: 45%" v-model="params.create_time"
              value-format="YYYY-MM-DD HH:mm:ss" :editable="false" type="datetimerange"
              range-separator="至" clearable start-placeholder="开始时间" end-placeholder="结束时间" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getData(1)">搜索</el-button>
          </el-form-item>
        </el-form>
      </ListHeader>
      <el-table ref="multipleTableRef" :data="dataList" stripe style="width: 100%"
        :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }"
        @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column type="selection" prop="id" width="55"> </el-table-column>
        <el-table-column prop="type" label="操作类型" min-width="120"> </el-table-column>
        <el-table-column prop="url" label="操作地址" min-width="180" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="details" label="操作内容" min-width="140" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="admin_name" label="操作者" min-width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ip" label="IP" min-width="140"> </el-table-column>
        <el-table-column prop="create_time" label="操作时间" min-width="160"></el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button v-permission="69" size="small" type="danger"
              @click="handleDelete(scope.row.id)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" :current-page="params.page"
        :page-size="params.pageSize" :background="true"
        :layout="$store.state.isMobile ? 'total,prev, next' : 'total,prev, pager, next'"
        :total="count" class="fenye">
      </el-pagination>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ListHeader from '@/components/ListHeader.vue'
import log from '@/api/log'
import { useInitTable } from '@/hooks/useCommon'
const { loading, count, dataList, params, getData, handleCurrentChange, handleDelete, handleSelectionChange, multipleTableRef, handleMultiDelete } = useInitTable({
  api: log,
  params: {
    page: 1,
    pageSize: 15,
    name: '',
    type: '',
    create_time: '',
  },
})

const type = ref([
  {
    id: 0,
    name: '请选择操作类型',
  },
  {
    id: 1,
    name: '登录',
  },
  {
    id: 2,
    name: '新增',
  },
  {
    id: 3,
    name: '修改',
  },
  {
    id: 4,
    name: '删除',
  },
  {
    id: 5,
    name: '上传',
  },
  {
    id: 6,
    name: '下载',
  },
  {
    id: 10,
    name: '其他',
  },
])
</script>
<style lang="scss" scoped></style>
