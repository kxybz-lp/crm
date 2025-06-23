<template>
  <div class="app-container">
    <el-card class="admin-card" shadow="hover">
      <ListHeader :rule="{ create: 79 }" @add="handleAdd">
        <el-form class="search-form" :model="params" ref="searchRef" label-width="0px" size="default">
          <!-- <el-form-item label="" v-show="!$store.state.isMobile">
            <el-select v-model="params.role_id" placeholder="选择角色" clearable @clear="getData(1)">
              <el-option :value="item.id" :label="item.name" v-for="item in roleList"
                :key="item.id"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="">
            <el-input v-model="params.name" placeholder="输入名称" clearable @clear="getData(1)"> </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getData(1)">搜索</el-button>
          </el-form-item>
        </el-form>
      </ListHeader>
      <el-table :data="dataList" stripe style="width: 100%" :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }" v-loading="loading">
        <el-table-column type="selection" prop="id" width="55"> </el-table-column>
        <el-table-column prop="name" label="名称"> </el-table-column>
        <el-table-column prop="name" label="头像">
          <template #default="scope">
            <el-image style="width: 50px; height: 50px" :src="scope.row.avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="company" label="公司" width="220"> </el-table-column>
        <el-table-column prop="position" label="职位" width="220"> </el-table-column>
        <el-table-column prop="mobile" label="手机"> </el-table-column>
        <el-table-column prop="tel" label="电话"> </el-table-column>
        <el-table-column label="状态" min-width="120" v-permission="99">
          <template #default="scope">
            <el-switch :modelValue="scope.row.status" :active-value="1" :inactive-value="0" :loading="scope.row.statusLoading" @change="handleSwitch($event, scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button v-permission="80" v-if="params.tab !== 'recyc'" size="small" type="warning" @click="handlEwm(scope.row.id)"> 生成二维码 </el-button>
            <el-button v-permission="80" size="small" type="primary" @click="handleEdit(scope.row)"> 编辑 </el-button>
            <el-button v-permission="87" size="small" type="danger" @click="handleDelete(scope.row.id)"> 删除 </el-button>
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
    <!-- 图片预览 -->
    <div class="goods-image__preview">
      <!-- <el-image ref="imageRef" style="width: 100px; height: 100px" :src="url" :zoom-rate="1.2"
        :max-scale="7" :min-scale="0.2" :preview-src-list="srcList" show-progress :initial-index="0"
        fit="cover" /> -->
      <el-image-viewer v-if="showPreview" :url-list="srcList" :initial-index="0" @close="hidePreview" />
    </div>
    <FormDialog destroyOnClose :title="dialogTitle" ref="formDialogRef" @dialogClosed="dialogClosed" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="140px" :label-position="$store.state.isMobile ? 'top' : 'right'">
        <el-form-item label="名称" prop="name">
          <el-input minlength="2" maxlength="20" show-word-limit v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <ChooseImage v-model="form.avatar" />
        </el-form-item>
        <el-form-item label="名片" prop="card_pic">
          <ChooseImage v-model="form.card_pic" />
        </el-form-item>
        <el-form-item label="公司" prop="store_id">
          <el-select clearable filterable v-model="form.store_id" placeholder="选择公司">
            <el-option :value="item.id" :label="item.name" :disabled="item.status == 0" v-for="item in storeList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="position_id">
          <el-select clearable multiple filterable v-model="form.position_id" placeholder="选择职位">
            <el-option :value="item.id.toString()" :label="item.name" :disabled="item.status == 0" v-for="item in positionList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.tel" placeholder="020-32509700"></el-input>
        </el-form-item>
        <el-form-item label="区域" prop="region">
          <el-input v-model="form.region" placeholder="广东省,广州市,番禺区"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.address" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="位置坐标" prop="point">
          <el-input v-model="form.point" placeholder="23.040107,113.306330"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
    </FormDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { toast } from '@/utils/utils'
import FormDialog from '@/components/FormDialog.vue'
import ListHeader from '@/components/ListHeader.vue'
import ChooseImage from '@/components/ChooseImage.vue'
import card from '@/api/card'
import { useInitTable, useInitForm } from '@/hooks/useCommon'
const { loading, params, count, dataList, getData, handleCurrentChange, handleSwitch, handleSort, handleDelete } = useInitTable({
  api: card,
  params: {
    page: 1,
    pageSize: 15,
    name: '',
  },
})
const { dialogTitle, formDialogRef, formRef, rules, form, handleAdd, handleEdit, handleSubmit, dialogClosed } = useInitForm({
  api: card,
  getData,
  form: {
    name: '',
    avatar: '',
    position_id: [],
    store_id: '',
    mobile: '',
    tel: '',
    status: 1,
    region: '',
    address: '',
    card_pic: '',
    point: '',
  },
  rules: {
    name: [
      {
        required: true,
        message: '名称不能为空',
        trigger: 'blur',
      },
    ],
    avatar: [
      {
        required: true,
        message: '请上传头像',
        trigger: 'blur',
      },
    ],
    store_id: [
      {
        required: true,
        message: '请选择公司',
        trigger: 'blur',
      },
    ],
    position_id: [
      {
        type: 'array',
        required: true,
        message: '请选择职位',
        trigger: 'blur',
      },
    ],
    mobile: [
      {
        required: true,
        message: '手机不能为空',
        trigger: 'blur',
      },
    ],
    region: [
      {
        required: true,
        message: '区域不能为空',
        trigger: 'blur',
      },
    ],
    address: [
      {
        required: true,
        message: '详细地址不能为空',
        trigger: 'blur',
      },
    ],
    address: [
      {
        required: true,
        message: '详细地址不能为空',
        trigger: 'blur',
      },
    ],
    card_pic: [
      {
        required: true,
        message: '名片不能为空',
        trigger: 'blur',
      },
    ],
  },
})

const props = {
  value: 'id',
  label: 'name',
  children: 'children',
  multiple: true,
  checkStrictly: true,
  emitPath: false,
}

// select数据
const storeList = ref([])
const positionList = ref([])
card.getSelect().then((res) => {
  if (res.code > 0) {
    positionList.value = res.result.position
    storeList.value = res.result.store
  } else {
    toast(res.message || 'Error', 'error')
  }
})

// 生成二维码
// const srcList = ref([])
// const url = 'https://xystcdn.xydec.com.cn/uploads/ewm/goods/goods_14.jpg'
const loadingText = ref('数据加载中...')
const srcList = ref([])
const showPreview = ref(false)
const handlEwm = (card_id) => {
  loading.value = true
  card
    .ewm({ card_id })
    .then((res) => {
      if (res.code > 0) {
        srcList.value.push(res.result.path)
        toast('二维码生成成功')
        showPreview.value = true
      } else {
        toast(res.message, 'error')
      }
    })
    .finally(() => {
      loading.value = false
    })
}
const hidePreview = () => {
  srcList.value = []
  showPreview.value = false
}
</script>
<style lang="scss" scoped></style>
