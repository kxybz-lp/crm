<template>
  <div class="app-container">
    <el-card class="admin-card" shadow="hover">
      <ListHeader :rule="{ create: 184, sort: 186 }" @add="handleAdd" @sort="handleSort" />
      <el-table :data="dataList" stripe style="width: 100%"
        :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }" v-loading="loading">
        <el-table-column type="selection" prop="id" width="55" />
        <el-table-column prop="name" label="模板名" min-width="180" />
        <el-table-column prop="specs_name" label="商品规格" min-width="180" />
        <el-table-column prop="default" label="商品属性" min-width="180">
          <template #default="scope">
            <div v-for="item in scope.row.specs_values" :key="item">{{ item }}</div>
          </template>
        </el-table-column>
        <el-table-column label="排序号" min-width="160">
          <template #default="scope">
            <el-input style="width: 60%" type="number" v-model="scope.row.sort" min="0" />
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="150" v-permission="185">
          <template #default="scope">
            <el-switch :modelValue="scope.row.status" :active-value="1" :inactive-value="0"
              :loading="scope.row.statusLoading" @change="handleSwitch($event, scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button v-permission="185" size="small" type="primary"
              @click="handleEdit(scope.row)">编辑 </el-button>
            <el-button v-permission="187" size="small" type="danger"
              @click="handleDelete(scope.row.id)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 不开启destroyOnClose，编辑任意规格显示的属性值都是一样的 -->
    <FormDialog destroyOnClose :title="'规格' + dialogTitle" ref="formDialogRef"
      @dialogClosed="dialogClosed" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="模板名称" prop="name">
          <el-input minlength="2" maxlength="20" show-word-limit v-model="form.name">
          </el-input>
        </el-form-item>
        <el-form-item label="商品规格" prop="default">
          <!-- <TagInput v-model="form.default" /> -->
          <el-card shadow="never" class="sku-card-item" v-for="(item, index) in specList"
            :key="item.key" style="width:100%">
            <template #header>
              <div class="sku-card-header">
                <el-input placeholder="请输入规格名称" v-model="item.spec_name" style="width:200px;"
                  @change="handleSpecUpdate(item)" />
                <div class="buttons">
                  <el-button size="small" text @click="sortCard('up',index)" :disabled="index == 0">
                    <el-icon>
                      <Top />
                    </el-icon>
                  </el-button>
                  <el-button size="small" text @click="sortCard('down',index)"
                    :disabled="index === (specList.length - 1)">
                    <el-icon>
                      <Bottom />
                    </el-icon>
                  </el-button>
                  <el-button size="small" text @click="delSkuCard(item.key)">
                    <el-icon>
                      <Delete />
                    </el-icon>
                  </el-button>
                </div>
              </div>
            </template>
            <SkuCardItem :current="item.key" />
          </el-card>
          <el-button type="success" @click="addSkuCard">添加规格组
          </el-button>
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
import { ref } from 'vue'
import ListHeader from '@/components/ListHeader.vue'
// import TagInput from '@/components/TagInput.vue'
import spec_template from '@/api/spec_template'
import { useInitTable, useInitForm } from '@/hooks/useCommon'
import { specList, initSpecList, addSkuCard, handleSpecUpdate, delSkuCard, sortCard } from '@/hooks/useSku'
import SkuCardItem from '../goods/components/SkuCardItem.vue'
import { toast } from '@/utils/utils'
const { loading, count, dataList, getData, handleSwitch, handleSort, handleDelete } = useInitTable({
  api: spec_template,
  params: {
    page: 1,
    pageSize: 200,
    name: '',
  },
  onGetListSuccess: (res) => {
    count.value = res.result.total
    dataList.value = res.result.data.map((o) => {
      let specs_name = o.specList.map((item) => item.spec_name)
      let specs_values = o.specList.map((item) => item.valueList)
      o.specs_name = specs_name.join(',')
      let specs_value_arr = []
      specs_values.forEach((item) => {
        let val = item.map((itm) => itm.spec_value)
        specs_value_arr.push(val)
      })
      o.specs_values = specs_value_arr.map((item) => item.join(','))
      return o
    })
  },
})
const { editId, dialogTitle, formDialogRef, formRef, rules, form, handleAdd } = useInitForm({
  api: spec_template,
  getData,
  form: {
    name: '',
    sort: 100,
    specList: [],
    status: 1,
  },
  rules: {
    name: [
      {
        required: true,
        message: '规格模板名不能为空',
        trigger: 'blur',
      },
    ],
  },
  beforeSubmit: (form) => {
    if (specList.value.length == 0) {
      toast('至少添加一条商品规格', 'error')
      return
    }

    form.specList = specList.value
    return form
  },
})

// 关闭弹窗重装商品规格
const dialogClosed = () => {
  formRef.value.resetFields()
  specList.value = []
}

const handleEdit = (row) => {
  editId.value = row.id
  spec_template.read(editId.value).then((res) => {
    if (res.code > 0) {
      for (const key in form) {
        form[key] = res.result[key]
      }

      formDialogRef.value.openFormDialog()
      initSpecList(res.result.specList)
      getData()
    } else {
      toast(res.message, 'error')
    }
  })
}

// 提交
const handleSubmit = () => {
  if (!form.name) {
    toast('规格模板名称不能为空', 'error')
    return
  }
  // console.log(form)
  formDialogRef.value.showLoading()
  // 提交前的数据处理
  if (specList.value.length == 0) {
    toast('至少添加一条商品规格', 'error')
    return
  }

  form.specList = specList.value
  if (editId.value) {
    spec_template
      .edit(editId.value, form)
      .then((res) => {
        if (res.code > 0) {
          toast('数据更新成功')
          formDialogRef.value.closeFormDialog()
          form.specList = []
          specList.value = []
          getData()
        } else {
          toast(res.message, 'error')
        }
      })
      .finally(() => {
        formDialogRef.value.hideLoading()
      })
  } else {
    spec_template
      .create(form)
      .then((res) => {
        if (res.code > 0) {
          toast('数据新增成功')
          formDialogRef.value.closeFormDialog()
          form.specList = []
          specList.value = []
          getData()
        } else {
          toast(res.message, 'error')
        }
      })
      .finally(() => {
        formDialogRef.value.hideLoading()
      })
  }
}
</script>
  <style lang="scss" scoped>
.sku-card-item {
  width: 100%;
  margin-bottom: 10px;
}
:deep(.el-card__header) {
  background: #f4f5f9 !important;
  padding: 7px 12px !important;
}
.sku-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
  