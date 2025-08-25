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
          <el-col :md="6" :offset="0">
            <el-form-item label="区域">
              <el-select v-model="params.region_id" placeholder="选择区域" clearable @clear="getData(1)">
                <el-option :value="item.id" :label="item.name" v-for="item in regionList" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="6" :offset="0">
            <el-form-item label="公司">
              <el-select clearable filterable v-model="params.report_store_id" placeholder="选择公司" @clear="getData(1)">
                <el-option :value="item.id" :label="item.name" :disabled="item.status == 0" v-for="item in storeList" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="6" :offset="0">
            <el-form-item label="报单时间">
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
                  start-placeholder="报单开始时间"
                  end-placeholder="报单结束时间"
                />
              </template>
              <template v-else>
                <el-date-picker
                  style="width: 100%; margin-bottom: 10px"
                  v-model="params.create_time_start"
                  type="datetime"
                  placeholder="报单开始时间"
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
                  placeholder="报单结束时间"
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
        <el-row :gutter="20">
          <el-col :md="6" :offset="0">
            <el-form-item label="签单时间">
              <template v-if="!$store.state.isMobile">
                <el-date-picker
                  style="width: 45%"
                  v-model="params.sign_time"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  :editable="false"
                  type="datetimerange"
                  range-separator="至"
                  clearable
                  @clear="getData(1)"
                  start-placeholder="签单开始时间"
                  end-placeholder="签单结束时间"
                />
              </template>
              <template v-else>
                <el-date-picker
                  style="width: 100%; margin-bottom: 10px"
                  v-model="params.sign_time_start"
                  type="datetime"
                  placeholder="签单开始时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  :editable="false"
                  clearable
                  @clear="getData(1)"
                />
                <el-date-picker
                  style="width: 100%"
                  v-model="params.sign_time_end"
                  type="datetime"
                  placeholder="签单结束时间"
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
      <ListHeader
        ref="headerRef"
        action="https://api.xydec.com.cn/crm/report_order/import"
        :rule="{ ewm: 223, create: 220, export: 223, import: 222, download: 222 }"
        @ewm="createEwm"
        @add="handleAdd"
        @export="exportExcel"
        @import="importExcel"
        @download="download"
      >
        <el-form class="search-form" :model="params" ref="searchRef" label-width="0px" size="default">
          <el-form-item label="" prop="report_store_id">
            <el-input v-model="params.mobile" placeholder="输入客户电话" clearable @clear="getData"> </el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-show="!showSearch && !$store.state.isMobile" type="primary" @click="getData(1)">搜索</el-button>
            <el-button v-permission="223" type="primary" text @click="showSearch = !showSearch">
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
        <!-- <el-table-column prop="customer_name" label="客户名称" show-overflow-tooltip /> -->
        <!-- <el-table-column prop="mobile" label="客户电话" /> -->
        <el-table-column prop="project_name" label="项目名称" show-overflow-tooltip />
        <el-table-column prop="store_name" label="签单公司" show-overflow-tooltip />
        <el-table-column prop="sign_time" sortable label="签单时间" />
        <el-table-column label="签单金额">
          <template #default="scope">
            <p>{{ scope.row.sign_amount ? scope.row.sign_amount : '' }}</p>
          </template>
        </el-table-column>
        <el-table-column label="签单收据">
          <template #default="scope">
            <el-image style="width: 50px; height: 50px" :src="scope.row.receipt" fit="cover" @click="showImage(scope.row.receipt)" />
          </template>
        </el-table-column>
        <el-table-column prop="create_time" sortable label="报单时间" />
        <!-- <el-table-column prop="user_id" label="报单人" /> -->
        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <el-button v-permission="221" size="small" :disabled="scope.row.id == 10001" type="primary" @click="handleEdit(scope.row)"> 编辑 </el-button>
            <el-button v-permission="225" size="small" :disabled="scope.row.id == 10001" type="danger" @click="handleDelete(scope.row.id)"> 删除 </el-button>
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
    <FormDialog destroyOnClose :title="'订单' + dialogTitle" ref="formDialogRef" @dialogClosed="dialogClosed" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="140px" :label-position="$store.state.isMobile ? 'top' : 'right'">
        <!-- <el-form-item label="客户名称">
          <el-input v-model="form.customer_name"></el-input>
        </el-form-item>
        <el-form-item label="客户电话" prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item> -->
        <el-form-item label="签单公司" prop="report_store_id">
          <el-select clearable filterable v-model="form.report_store_id" placeholder="选择公司">
            <el-option :value="item.id" :label="item.name" :disabled="item.status == 0" v-for="item in storeList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="项目名称">
          <el-input v-model="form.project_name"></el-input>
        </el-form-item> -->
        <el-form-item label="签单时间" prop="sign_time">
          <el-date-picker
            style="width: 100%"
            v-model="form.sign_time"
            type="datetime"
            placeholder="请选择签单时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            :editable="false"
            clearable
          />
        </el-form-item>
        <el-form-item label="签单金额">
          <el-input type="number" v-model="form.sign_amount"></el-input>
        </el-form-item>
        <el-form-item label="签单收据" prop="receipt">
          <ChooseImage v-model="form.receipt" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
    </FormDialog>
    <!-- 图片预览 -->
    <div class="receipt-image__preview">
      <el-image-viewer v-if="showPreview" :url-list="imageList" :initial-index="0" @close="showPreview = false" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ListHeader from '@/components/ListHeader.vue'
import ChooseImage from '@/components/ChooseImage.vue'
import report_order from '@/api/report_order'
import { toast, elLoading, closeElLoading } from '@/utils/utils'
import { useInitTable, useInitForm } from '@/hooks/useCommon'
const { loading, count, dataList, params, getData, handleCurrentChange, handleSizeChange, sortChange, handleDelete, handleSelectionChange, multipleTableRef } = useInitTable({
  api: report_order,
  params: {
    page: 1,
    pageSize: 15,
    report_store_id: '',
    mobile: '',
    region_id: '',
    sign_time: '',
    sign_time_start: '',
    sign_time_end: '',
    create_time: '',
    create_time_start: '',
    create_time_end: '',
    status: '',
  },
})

const showSearch = ref(false) // 高级搜索
const searchMoreRef = ref()
const { dialogTitle, formDialogRef, formRef, rules, form, editId, handleAdd, handleEdit, handleSubmit, dialogClosed } = useInitForm({
  api: report_order,
  getData,
  form: {
    report_store_id: '',
    customer_name: '',
    project_name: '',
    mobile: '',
    status: 1,
    sign_amount: '',
    sign_time: '',
    receipt: '',
  },
  rules: {
    report_store_id: [
      {
        required: true,
        message: '签单公司不能为空',
        trigger: 'blur',
      },
    ],
    // customer_name: [
    //   {
    //     required: true,
    //     message: '客户名称不能为空',
    //     trigger: 'blur',
    //   },
    // ],
    // project_name: [
    //   {
    //     required: true,
    //     message: '项目名称不能为空',
    //     trigger: 'blur',
    //   },
    // ],
    mobile: [
      {
        required: true,
        message: '客户电话不能为空',
        trigger: 'blur',
      },
    ],
    sign_time: [
      {
        required: true,
        message: '签单时间不能为空',
        trigger: 'blur',
      },
    ],
    // sign_amount: [
    //   {
    //     required: true,
    //     message: '签单金额不能为空',
    //     trigger: 'blur',
    //   },
    // ],
    receipt: [
      {
        required: true,
        message: '签单收据不能为空',
        trigger: 'blur',
      },
    ],
  },
})

const regionList = ref([])
const storeList = ref([])

const imageUrl = ref('')
const imageList = ref([])
const showPreview = ref('')
const showImage = (image) => {
  imageUrl.value = image
  imageList.value = [image]
  showPreview.value = true
}

// select数据,合并远程请求
report_order.getSelect().then((res) => {
  if (res.code > 0) {
    regionList.value = res.result.region
    storeList.value = res.result.store
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
  params.report_store_id = ''
  params.mobile = ''
  params.region_id = ''
  params.create_time = ''
  params.create_time_start = ''
  params.create_time_end = ''
  params.sign_time = ''
  params.sign_time_start = ''
  params.sign_time_end = ''
  getData(1)
}

// 生成二维码
const createEwm = () => {
  loading.value = true
  report_order
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
  report_order
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
  location.href = '/template_report_order.xlsx?v=1'
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
/* 解决图片预览被表格行遮挡的问题 */
/* 提高图片预览弹窗的层级 */
.el-image-viewer__wrapper {
  z-index: 3000 !important; /* 确保这个值大于表格相关元素的z-index */
}

/* 调整表格行的层级，避免其高于图片预览 */
.el-table__row {
  position: relative;
  z-index: 1; /* 确保小于图片预览的z-index */
}

/* 解决鼠标悬停高亮行遮挡图片的问题 */
.el-table__row:hover > td {
  position: relative;
  z-index: 1; /* 保持低于图片预览的层级 */
}

/* 确保表格单元格内容不会遮挡图片预览 */
.el-table__cell {
  overflow: visible !important;
}
.table-image {
  position: relative;
  z-index: 2; /* 略高于表格行，但低于预览弹窗 */
}
</style>
