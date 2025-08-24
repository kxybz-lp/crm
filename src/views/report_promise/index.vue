<template>
  <div class="app-container">
    <el-card class="admin-card" shadow="hover">
      <el-form class="search-more" :model="params" ref="searchMoreRef" size="default" label-width="68px" v-if="showSearch" :label-position="$store.state.isMobile ? 'top' : 'left'">
        <el-row :gutter="20">
          <el-col :md="6" :offset="0">
            <el-form-item label="公司名称">
              <el-input v-model="params.name" placeholder="输入公司名" clearable @clear="getData"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="6" :offset="0">
            <el-form-item label="一级区域">
              <el-select v-model="params.region_id" placeholder="选择区域" clearable @clear="getData(1)">
                <el-option :value="item.id" :label="item.name" v-for="item in regionList" :key="item.id"></el-option>
              </el-select>
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
      <ListHeader
        ref="headerRef"
        action="https://api.xydec.com.cn/crm/report_promise/import"
        :rule="{ create: 235, export: 235, import: 235, download: 235 }"
        @add="handleAdd"
        @export="exportExcel"
        @import="importExcel"
        @download="download"
      >
        <el-form class="search-form" :model="params" ref="searchRef" label-width="0px" size="default">
          <el-form-item label="" prop="report_store_id">
            <el-select clearable filterable v-model="params.report_store_id" placeholder="选择公司" :disabled="editId != 0" @clear="getData(1)">
              <el-option :value="item.id" :label="item.name" :disabled="item.status == 0" v-for="item in storeList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button v-show="!showSearch && !$store.state.isMobile" type="primary" @click="getData(1)">搜索</el-button>
            <!-- <el-button v-permission="66" type="primary" text @click="showSearch = !showSearch">
              {{ showSearch ? '收起' : '展开搜索' }}
              <el-icon>
                <ArrowUp v-if="showSearch" />
                <ArrowDown v-else />
              </el-icon>
            </el-button> -->
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
        <el-table-column prop="store_name" label="公司名称" show-overflow-tooltip />
        <el-table-column prop="min_goal" sortable label="最低签单目标" />
        <el-table-column prop="goal" sortable label="承诺签单目标" />
        <el-table-column prop="charge_mobile" label="负责人电话" />
        <el-table-column prop="bdr_mobile" label="报单人电话" />
        <el-table-column prop="bmobile" label="承诺人电话" />
        <el-table-column prop="update_time" label="更新时间" />
        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <el-button v-permission="234" size="small" :disabled="scope.row.id == 10001" type="primary" @click="handleEdit(scope.row)"> 编辑 </el-button>
            <el-button v-permission="233" size="small" :disabled="scope.row.id == 10001" type="danger" @click="handleDelete(scope.row.id)"> 删除 </el-button>
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
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-size="params.pageSize"
        :background="true"
        :layout="'total, prev, next'"
        :total="count"
        class="fenye"
        v-show="$store.state.isMobile"
      />
    </el-card>
    <FormDialog destroyOnClose :title="'签单目标' + dialogTitle" ref="formDialogRef" @dialogClosed="dialogClosed" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="140px" :label-position="$store.state.isMobile ? 'top' : 'right'">
        <el-form-item label="公司" prop="report_store_id">
          <el-select clearable filterable v-model="form.report_store_id" placeholder="选择公司" :disabled="editId != 0">
            <el-option :value="item.id" :label="item.name" :disabled="item.status == 0" v-for="item in storeList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最低签单目标" prop="min_goal">
          <el-input type="number" v-model="form.min_goal"></el-input>
        </el-form-item>
        <el-form-item label="签单目标" prop="goal">
          <el-input type="number" v-model="form.goal"></el-input>
        </el-form-item>
        <el-form-item label="负责人电话" prop="charge_mobile">
          <el-input v-model="form.charge_mobile"></el-input>
        </el-form-item>
        <el-form-item label="报单人电话" prop="bdr_mobile">
          <el-input v-model="form.bdr_mobile"></el-input>
        </el-form-item>
      </el-form>
    </FormDialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ListHeader from '@/components/ListHeader.vue'
import report_promise from '@/api/report_promise'
import { toast, elLoading, closeElLoading } from '@/utils/utils'
import { useInitTable, useInitForm } from '@/hooks/useCommon'
const { loading, count, dataList, params, getData, handleCurrentChange, handleSizeChange, sortChange, handleSwitch, handleDelete, handleSelectionChange, multipleTableRef } = useInitTable({
  api: report_promise,
  params: {
    page: 1,
    pageSize: 15,
    report_store_id: '',
  },
})

const showSearch = ref(false) // 高级搜索
const searchMoreRef = ref()
// 签单目标验证
const validateCheckGoal = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('签单目标不能为空'))
  } else {
    if (value < form.min_goal) {
      callback(new Error('签单目标不能小于最低签单目标'))
    }
    callback()
  }
}
const { dialogTitle, formDialogRef, formRef, rules, form, editId, handleAdd, handleEdit, handleSubmit, dialogClosed } = useInitForm({
  api: report_promise,
  getData,
  form: {
    report_store_id: '',
    min_goal: '',
    goal: '',
    charge_mobile: '',
    bdr_mobile: '',
  },
  rules: {
    report_store_id: [
      {
        required: true,
        message: '公司不能为空',
        trigger: 'blur',
      },
    ],
    min_goal: [
      {
        required: true,
        message: '最低签单目标',
        trigger: 'blur',
      },
    ],
    goal: [
      {
        required: true,
        validator: validateCheckGoal,
        trigger: 'blur',
      },
    ],
    charge_mobile: [
      {
        required: true,
        message: '负责人电话不能为空',
        trigger: 'blur',
      },
    ],
    bdr_mobile: [
      {
        required: true,
        message: 'bdr电话不能为空',
        trigger: 'blur',
      },
    ],
  },
})

const regionList = ref([])
const areaList = ref([])
const province = ref([])
const city = ref([])
const areas = ref([])
const storeList = ref([])
const handleProvinceChange = (province_id) => {
  if (province_id) {
    city.value = []
    params.city_id = ''
    areaList.value.forEach((item) => {
      if (item.id == province_id) {
        item.children.forEach((itm) => {
          city.value.push({ id: itm.id, areaname: itm.areaname })
        })
      }
    })
  } else {
    city.value = []
  }
}

// select数据,合并远程请求
report_promise.getSelect().then((res) => {
  if (res.code > 0) {
    regionList.value = res.result.region
    areaList.value = res.result.area
    res.result.area.forEach((item) => {
      province.value.push({ id: item.id, areaname: item.areaname })
    })
    storeList.value = res.result.store
  } else {
    toast(res.message || 'Error', 'error')
  }
})

// const area = ref([])
const area = computed({
  get() {
    return form.province_id && form.city_id && form.district_id ? [form.province_id, form.city_id, form.district_id] : []
  },
  set(val) {
    form.province_id = val[0]
    form.city_id = val[1]
    form.district_id = val[2]
  },
})
const areaChange = (val) => {
  areas.value = []
  form.service_areas = []
  areaList.value.forEach((item) => {
    if (item.id == val[0]) {
      item.children.forEach((itm) => {
        if (itm.id == val[1]) {
          areas.value = itm.children
        }
      })
    }
  })
}

// 表单重置
const resetFrom = () => {
  if (!searchMoreRef.value) return
  // searchMoreRef.value.resetFields()
  params.page = 1
  params.pageSize = 15
  params.report_store_id = ''
  getData(1)
}

// 导出
const exportExcel = () => {
  elLoading('数据导出中...')
  report_promise
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

// 导入
const importExcel = (e) => {
  getData(1)
}
// 下载
const download = () => {
  location.href = '/template_report_promise.xlsx?v=1'
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
