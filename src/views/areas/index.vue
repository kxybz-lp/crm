<template>
  <div class="app-container">
    <el-card class="menu-card" shadow="hover">
      <ListHeader :rule="{ create: 274 }" @add="handleAdd" />
      <el-tree :data="dataList" :props="{ children: 'children', label: 'areaname' }" v-loading="loading" node-key="id" :default-expanded-keys="defaultExpandedKeys">
        <template #default="{ data }">
          <div class="custom-tree-left">
            <span :data-id="data.id">{{ data.areaname }}</span>
          </div>
          <div class="custom-tree-right">
            <el-switch v-permission="276" :modelValue="data.status" :active-value="1" :inactive-value="0" @change="handleSwitch($event, data)" />
            <el-button v-permission="275" text type="primary" size="small" @click.stop="handleEdit(data)">修改</el-button>
            <el-button v-permission="274" text type="primary" size="small" @click.stop="addChild(data.id)">增加</el-button>
            <el-button v-permission="278" text type="primary" size="small" @click.stop="handleDelete(data.id)">删除</el-button>
            <!-- <el-popconfirm title="是否要删除该记录？" confirmButtonText="确认" cancelButtonText="取消" @confirm="handleDelete(data.id)">
                <template #reference>
                  <el-button text type="primary" size="small">删除</el-button>
                </template>
              </el-popconfirm> -->
          </div>
        </template>
      </el-tree>
    </el-card>
    <FormDialog destroyOnClose :title="dialogTitle" ref="formDialogRef" @dialogClosed="dialogClosed" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="140px" :label-position="$store.state.isMobile ? 'top' : 'right'">
        <el-form-item label="上级地区" prop="parentid">
          <el-cascader
            v-model="form.parentid"
            :options="dataList"
            :props="{ value: 'id', label: 'areaname', children: 'children', checkStrictly: true, emitPath: false }"
            placeholder="请选择上级地区"
          />
        </el-form-item>
        <el-form-item label="行政编码" prop="id">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="areaname">
          <el-input minlength="2" maxlength="20" show-word-limit v-model="form.areaname"></el-input>
        </el-form-item>
        <el-form-item label="简称" prop="shortname">
          <el-input minlength="2" maxlength="20" show-word-limit v-model="form.shortname"></el-input>
        </el-form-item>
        <el-form-item label="首字母" prop="letter">
          <el-input v-model="form.letter" placeholder="如广州市首字母为G"></el-input>
        </el-form-item>
        <el-form-item label="等级">
          <el-input v-model="form.level" type="number"></el-input>
        </el-form-item>
        <el-form-item label="排序号">
          <el-input v-model="form.sortno" type="number"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
    </FormDialog>
  </div>
</template>

<script setup>
import ListHeader from '@/components/ListHeader.vue'
import FormDialog from '@/components/FormDialog.vue'
import areas from '@/api/areas'
import { useInitTable, useInitForm } from '@/hooks/useCommon'
import { ref } from 'vue'
const defaultExpandedKeys = ref([])
const { loading, dataList, handleDelete, handleSwitch, getData } = useInitTable({
  api: areas,
  params: {
    page: 1,
    pageSize: 10,
  },
  onGetListSuccess: (res) => {
    dataList.value = res.result
    // 默认展开一级菜单
    //defaultExpandedKeys.value = res.result.map((item) => item.id)
    // console.log(dataList.value)
  },
})

const { dialogTitle, formDialogRef, formRef, rules, form, handleAdd, handleEdit, handleSubmit, dialogClosed } = useInitForm({
  api: areas,
  getData,
  form: {
    id: '',
    parentid: 0,
    areaname: '',
    shortname: '',
    level: 0,
    letter: '',
    sortno: 100,
    status: 1,
  },
  rules: {
    id: [
      {
        required: true,
        message: '行政编码不能为空',
        trigger: 'blur',
      },
    ],
    areaname: [
      {
        required: true,
        message: '地区名称不能为空',
        trigger: 'blur',
      },
    ],
    shortname: [
      {
        required: true,
        message: '简称简称不能为空',
        trigger: 'blur',
      },
    ],
  },
})

const addChild = (id) => {
  handleAdd()
  form.parentid = id
  form.status = 1
}
// 递归将多维数据转成一维数组，展开全部菜单
// const filterMenu1 = (menuList, arr = []) => {
//   menuList.forEach((item, index) => {
//     if (item.is_menu) {
//       arr.push({ id: item.id, parentid: item.parentid, name: item.name, label: item.label, icon: item.icon, path: item.path, children: [] })
//       if (item.children && item.children.length > 0) {
//         filterMenu1(item.children, arr)
//       }
//     }
//     return arr
//   })
// }
</script>

<style lang="scss" scoped>
.custom-tree-node {
  display: flex;
  align-items: center;
  font-size: 14px;
  justify-content: space-between;
}
.ml-2 {
  margin-left: 10px;
  margin-right: 2px;
}
.ml-auto {
  margin-left: auto;
}
:deep(.el-tree-node__label) {
  font-size: var(--el-font-size-base);
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
:deep(.el-tree-node__content) {
  padding: 20px 0;
}
.custom-tree-left {
  display: flex;
  align-items: center;
  .el-tag {
    margin-right: 10px;
  }
  .el-icon {
    margin-right: 5px;
  }
}
</style>
