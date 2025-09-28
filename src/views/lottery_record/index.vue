<template>
  <div class="app-container">
    <el-card class="admin-card" shadow="hover">
      <el-form class="search-more" :model="params" ref="searchMoreRef" size="default" label-width="68px" v-if="showSearch" :label-position="$store.state.isMobile ? 'top' : 'left'">
        <el-row :gutter="20">
          <el-col :md="6" :offset="0">
            <el-form-item label="客户电话">
              <el-input v-model="params.mobile" placeholder="输入客户电话" clearable @clear="getData"> </el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :md="6" :offset="0">
            <el-form-item label="区域">
              <el-select v-model="params.region_id" placeholder="选择区域" clearable @clear="getData(1)">
                <el-option :value="item.id" :label="item.name" v-for="item in regionList" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :md="6" :offset="0">
            <el-form-item label="奖项">
              <el-select clearable filterable v-model="params.lottery_award_id" placeholder="选择奖项" @clear="getData(1)">
                <el-option :value="item.id" :label="item.name" v-for="item in awardList" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="6" :offset="0">
            <el-form-item label="公司">
              <el-select clearable filterable v-model="params.store_id" placeholder="选择公司" @clear="getData(1)">
                <el-option :value="item.id" :label="item.name" :disabled="item.status == 0" v-for="item in storeList" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="6" :offset="0">
            <el-form-item label="创建时间">
              <template v-if="!$store.state.isMobile">
                <el-date-picker
                  style="width: 45%"
                  v-model="params.create_time"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  :editable="false"
                  type="datetimerange"
                  range-separator="至"
                  clearable
                  @clear="getData(1)"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                />
              </template>
              <template v-else>
                <el-date-picker
                  style="width: 100%; margin-bottom: 10px"
                  v-model="params.create_time_start"
                  type="datetime"
                  placeholder="开始时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  :editable="false"
                  clearable
                  @clear="getData(1)"
                />
                <el-date-picker
                  style="width: 100%"
                  v-model="params.create_time_end"
                  type="datetime"
                  placeholder="结束时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  :editable="false"
                  clearable
                  @clear="getData(1)"
                />
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="24" :offset="0">
            <el-form-item label="">
              <el-button type="primary" @click="getData(1)">搜索</el-button>
              <el-button @click="resetFrom">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <ListHeader ref="headerRef" :rule="{ export: 263 }" @ewm="createEwm" @export="exportExcel">
        <el-form class="search-form" :model="params" ref="searchRef" label-width="0px" size="default">
          <el-form-item label="" prop="mobile">
            <el-input v-model="params.mobile" placeholder="输入客户手机号" clearable @clear="getData"> </el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-show="!showSearch && !$store.state.isMobile" type="primary" @click="getData(1)">搜索</el-button>
            <el-button v-permission="261" type="primary" text @click="showSearch = !showSearch">
              {{ showSearch ? '收起' : '展开搜索' }}
              <el-icon>
                <ArrowUp v-if="showSearch" />
                <ArrowDown v-else />
              </el-icon>
            </el-button>
          </el-form-item>
        </el-form>
      </ListHeader>
      <el-table
        ref="multipleTableRef"
        :data="dataList"
        stripe
        style="width: 100%"
        tooltip-effect="light"
        :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }"
        @sort-change="sortChange"
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <el-table-column type="selection" prop="id" width="55" />
        <el-table-column prop="user_name" label="客户名称" show-overflow-tooltip />
        <el-table-column prop="mobile" label="客户电话" />
        <el-table-column prop="award_name" label="获奖奖项" show-overflow-tooltip />
        <el-table-column prop="store_name" label="签单公司" show-overflow-tooltip />
        <el-table-column prop="create_time" sortable label="中奖时间" />
        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <el-button v-permission="257" size="small" type="danger" @click="handleDelete(scope.row.id)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="params.page"
        v-model:page-size="params.pageSize"
        :page-sizes="[10, 15, 50, 100, 200]"
        :background="true"
        layout="total, sizes, prev, pager, next,slot, jumper"
        :total="count"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        v-show="!$store.state.isMobile"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ListHeader from '@/components/ListHeader.vue'
import lottery_record from '@/api/lottery_record'
import { toast, elLoading, closeElLoading } from '@/utils/utils'
import { useInitTable } from '@/hooks/useCommon'
const { loading, count, dataList, params, getData, handleCurrentChange, handleSizeChange, sortChange, handleDelete, handleSelectionChange, multipleTableRef } = useInitTable({
  api: lottery_record,
  params: {
    page: 1,
    pageSize: 15,
    store_id: '',
    mobile: '',
    region_id: '',
    lottery_award_id: '',
    create_time: '',
    create_time_start: '',
    create_time_end: '',
    status: '',
  },
})

const showSearch = ref(false) // 高级搜索
const searchMoreRef = ref()

const regionList = ref([])
const storeList = ref([])
const awardList = ref([])

// select数据,合并远程请求
lottery_record.getSelect().then((res) => {
  if (res.code > 0) {
    regionList.value = res.result.region
    storeList.value = res.result.store
    awardList.value = res.result.award
  } else {
    toast(res.message || 'Error', 'error')
  }
})

// 表单重置
const resetFrom = () => {
  if (!searchMoreRef.value) return
  // searchMoreRef.value.resetFields()
  params.page = 1
  params.pageSize = 15
  params.store_id = ''
  params.mobile = ''
  params.region_id = ''
  params.lottery_award_id = ''
  params.create_time = ''
  params.create_time_start = ''
  params.create_time_end = ''
  getData(1)
}

// 生成二维码
const createEwm = () => {
  loading.value = true
  lottery_record
    .ewm()
    .then((res) => {
      if (res.code > 0) {
        toast('二维码生成成功')
        imageUrl.value = res.result.path
        imageList.value = [res.result.path]
        showPreview.value = true
      } else {
        toast(res.message, 'error')
      }
    })
    .finally(() => {
      loading.value = false
    })
}

// 导出
const exportExcel = () => {
  elLoading('数据导出中...')
  lottery_record
    .export(params)
    .then((res) => {
      if (res.code > 0) {
        console.log(res)
        location.href = res.result.url
      } else {
        toast(res.message || 'Error', 'error')
      }
    })
    .finally(() => {
      closeElLoading()
    })
}
</script>
<style lang="scss" scoped>
.search-more {
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #eee;
}
:deep(.el-input__wrapper) {
  width: 100%;
}
</style>
