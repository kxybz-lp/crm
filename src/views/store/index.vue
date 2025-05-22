<template>
  <div class="app-container">
    <el-card class="admin-card" shadow="hover">
      <el-form class="search-more" :model="params" ref="searchMoreRef" size="default"
        label-width="68px" v-if="showSearch"
        :label-position="$store.state.isMobile ? 'top' : 'left'">
        <el-row :gutter="20">
          <el-col :md="6" :offset="0">
            <el-form-item label="公司名称">
              <el-input v-model="params.name" placeholder="输入公司名" clearable @clear="getData">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :md="6" :offset="0">
            <el-form-item label="状态">
              <el-select v-model="params.status" placeholder="选择状态" clearable @clear="getData(1)">
                <el-option value="1" label="在营"></el-option>
                <el-option value="0" label="关闭"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="6" :offset="0">
            <el-form-item label="一级区域">
              <el-select v-model="params.region_id" placeholder="选择区域" clearable
                @clear="getData(1)">
                <el-option :value="item.id" :label="item.name" v-for="item in regionList"
                  :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="6" :offset="0">
            <el-form-item label="所在省">
              <el-select v-model="params.province_id" filterable placeholder="选择或搜索省" clearable
                @change="handleProvinceChange" @clear="getData(1)">
                <el-option :value="item.id" :label="item.areaname" v-for="item in province"
                  :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="6" :offset="0">
            <el-form-item label="所在市">
              <el-select v-model="params.city_id" filterable placeholder="选择或搜索市" clearable
                @clear="getData(1)">
                <el-option :value="item.id" :label="item.areaname" v-for="item in city"
                  :key="item.id"></el-option>
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
      <ListHeader ref="headerRef" action="https://api.xydec.com.cn/crm/store/import"
        :rule="{ create: 62, export: 64, import: 65, download: 65 }" @add="handleAdd"
        @export="exportExcel" @import="importExcel" @download="download">
        <el-form class="search-form" :model="params" ref="searchRef" label-width="0px"
          size="default">
          <el-form-item label="" v-show="!showSearch && !$store.state.isMobile">
            <el-input v-model="params.name" placeholder="输入公司名" clearable @clear="getData(1)">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-show="!showSearch && !$store.state.isMobile" type="primary"
              @click="getData(1)">搜索</el-button>
            <el-button v-permission="66" type="primary" text @click="showSearch = !showSearch">
              {{ showSearch ? '收起' : '展开搜索' }}
              <el-icon>
                <ArrowUp v-if="showSearch" />
                <ArrowDown v-else />
              </el-icon>
            </el-button>
          </el-form-item>
        </el-form>
      </ListHeader>
      <el-table ref="multipleTableRef" :data="dataList" stripe style="width: 100%"
        tooltip-effect="light" :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }"
        @sort-change="sortChange" @selection-change="handleSelectionChange" v-loading="loading">
        <el-table-column type="selection" prop="id" width="55" />
        <el-table-column prop="name" label="公司名称" show-overflow-tooltip />
        <el-table-column prop="region_name" show-overflow-tooltip label="一级区域" />
        <el-table-column prop="province_name" show-overflow-tooltip label="省" />
        <el-table-column prop="city_name" show-overflow-tooltip label="市" />
        <el-table-column prop="district_name" label="区" width="140" />
        <el-table-column prop="address" show-overflow-tooltip label="详细地址" width="180" />
        <el-table-column prop="status" sortable label="状态">
          <template #default="scope">
            <el-tag size="small" type="success" v-if="scope.row.status == 1">在营</el-tag>
            <el-tag size="small" type="danger" v-if="scope.row.status == 0">关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <el-button v-permission="63" size="small" :disabled="scope.row.id == 10001"
              type="primary" @click="handleEdit(scope.row)">
              编辑 </el-button>
            <el-button v-permission="67" size="small" :disabled="scope.row.id == 10001"
              type="danger" @click="handleDelete(scope.row.id)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="params.page" v-model:page-size="params.pageSize"
        :page-sizes="[10, 15, 50, 100, 200]" :background="true"
        layout="total, sizes, prev, pager, next,slot, jumper" :total="count"
        @current-change="handleCurrentChange" @size-change="handleSizeChange"
        v-show="!$store.state.isMobile" />
      <el-pagination @current-change="handleCurrentChange" :current-page="params.page"
        :page-size="params.pageSize" :background="true" :layout="'total, prev, next'" :total="count"
        class="fenye" v-show="$store.state.isMobile" />
    </el-card>
    <FormDialog destroyOnClose :title="'门店' + dialogTitle" ref="formDialogRef"
      @dialogClosed="dialogClosed" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="140px"
        :label-position="$store.state.isMobile ? 'top' : 'right'">
        <el-form-item label="公司名称" prop="name">
          <el-input minlength="2" maxlength="20" show-word-limit v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="所在区域" prop="region_id">
          <el-select v-model="form.region_id" placeholder="选择区域">
            <el-option :value="item.id" :label="item.name" v-for="item in regionList"
              :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司地址" prop="address">
          <el-row :gutter="2" style="width: 100%">
            <el-col :span="12" :offset="0">
              <el-cascader v-model="area" :options="areaList"
                :props="{ value: 'id', label: 'areaname', children: 'children' }"
                placeholder="请选择省/市/区" @change="areaChange" />
            </el-col>
            <el-col :span="12" :offset="0">
              <el-input v-model="form.address"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="排序号" prop="sort">
          <el-input v-model="form.sort"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">在营</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </FormDialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ListHeader from '@/components/ListHeader.vue'
import store from '@/api/store'
import { toast, elLoading, closeElLoading } from '@/utils/utils'
import { useInitTable, useInitForm } from '@/hooks/useCommon'
const { loading, count, dataList, params, getData, handleCurrentChange, handleSizeChange, sortChange, handleDelete, handleSelectionChange, multipleTableRef } = useInitTable({
  api: store,
  params: {
    page: 1,
    pageSize: 15,
    name: '',
    status: '',
    region_id: '',
    province_id: '',
    city_id: '',
  },
})

const showSearch = ref(false) // 高级搜索
const searchMoreRef = ref()
const { dialogTitle, formDialogRef, formRef, rules, form, handleAdd, handleEdit, handleSubmit, dialogClosed } = useInitForm({
  api: store,
  getData,
  form: {
    name: '',
    region: '',
    region_id: '',
    province_id: '',
    city_id: '',
    district_id: '',
    mobile: '',
    address: '',
    status: 1,
    sort: 100,
  },
  rules: {
    name: [
      {
        required: true,
        message: '公司名称不能为空',
        trigger: 'blur',
      },
    ],
    region_id: [
      {
        required: true,
        message: '公司所在区域不能为空',
        trigger: 'blur',
      },
    ],
    province_id: [
      {
        required: true,
        message: '公司所在省不能为空',
        trigger: 'blur',
      },
    ],
    city_id: [
      {
        required: true,
        message: '公司所在市不能为空',
        trigger: 'blur',
      },
    ],
    district_id: [
      {
        required: true,
        message: '公司所在区不能为空',
        trigger: 'blur',
      },
    ],
    address: [
      {
        required: true,
        message: '公司详细地址不能为空',
        trigger: 'blur',
      },
    ],
  },
  // 编辑后继续新增，数据出现id导致无法新增
  fliterParam(row) {
    if (formRef.value) formRef.value.clearValidate()
    areaList.value.forEach((item) => {
      if (item.id == row.province_id) {
        item.children.forEach((itm) => {
          if (itm.id == row.city_id) {
            areas.value = itm.children
          }
        })
      }
    })

    for (const key in form) {
      form[key] = row[key]
    }
  },
})

// 将字符串日期转时间戳， 2020-09-12 12:11:22
// let time = (new Date(row.create_time)).getTime()
// 当前时间戳
let time_current = new Date().getTime()
// console.log(time_current)
// const params_store = reactive({
//   page: 1,
//   pageSize: 10,
// })
// 时间戳格式化

const regionList = ref([])
const areaList = ref([])
const province = ref([])
const city = ref([])
const areas = ref([])
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
store.getSelect().then((res) => {
  if (res.code > 0) {
    regionList.value = res.result.region
    areaList.value = res.result.area
    res.result.area.forEach((item) => {
      province.value.push({ id: item.id, areaname: item.areaname })
    })
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
  params.name = ''
  params.status = ''
  params.region_id = ''
  params.province_id = ''
  params.city_id = ''
  city.value = []
  getData(1)
}

// 导出
const exportExcel = () => {
  elLoading('数据导出中...')
  store
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
  location.href = '/template_store.xlsx?v=1'
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
