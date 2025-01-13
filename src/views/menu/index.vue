<template>
  <div class="app-container">
    <el-card class="menu-card" shadow="hover">
      <ListHeader :rule="{ create: 41 }" @add="handleAdd" />
      <el-tree :data="dataList" :props="{ children: 'children', label: 'label' }"
        v-loading="loading" node-key="id" :default-expanded-keys="defaultExpandedKeys">
        <template #default="{ data }">
          <div class="custom-tree-left">
            <el-tag size="small" :type="data.is_menu ? '' : 'info'">{{ data.is_menu ? '菜单' : '权限' }}
            </el-tag>
            <el-icon v-if="data.icon" :size="16">
              <component :is="data.icon" />
            </el-icon>
            <span :data-id="data.id">{{ data.label }}</span>
          </div>
          <div class="custom-tree-right">
            <el-switch v-permission="43" :modelValue="data.status" :active-value="1"
              :inactive-value="0" @change="handleSwitch($event, data)" />
            <el-button v-permission="42" text type="primary" size="small"
              @click.stop="handleEdit(data)">修改</el-button>
            <el-button v-permission="41" text type="primary" size="small"
              @click.stop="addChild(data.id)">增加</el-button>
            <el-button v-permission="44" text type="primary" size="small"
              @click.stop="handleDelete(data.id)">删除</el-button>
            <!-- <el-popconfirm title="是否要删除该记录？" confirmButtonText="确认" cancelButtonText="取消" @confirm="handleDelete(data.id)">
                <template #reference>
                  <el-button text type="primary" size="small">删除</el-button>
                </template>
              </el-popconfirm> -->
          </div>
        </template>
      </el-tree>
    </el-card>
    <FormDialog destroyOnClose :title="dialogTitle" ref="formDialogRef" @dialogClosed="dialogClosed"
      @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="140px"
        :label-position="$store.state.isMobile ? 'top' : 'right'">
        <el-form-item label="上级菜单" prop="pid">
          <el-cascader v-model="form.pid" :options="dataList"
            :props="{ value: 'id', label: 'label', children: 'children', checkStrictly: true, emitPath: false }"
            placeholder="请选择上级菜单" />
        </el-form-item>
        <el-form-item label="菜单/规则" prop="is_menu">
          <el-radio-group v-model="form.is_menu">
            <el-radio :label="1" border>菜单</el-radio>
            <el-radio :label="0" border>规则</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="label">
          <el-input minlength="2" maxlength="20" show-word-limit v-model="form.label"></el-input>
        </el-form-item>
        <el-form-item label="Name值" prop="name">
          <el-input minlength="2" maxlength="20" show-word-limit v-model="form.name"
            placeholder="首字母大写,如Home"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon" v-if="form.is_menu == 1">
          <IconSelect v-model="form.icon"></IconSelect>
        </el-form-item>
        <el-form-item label="路由地址" prop="path">
          <el-input v-model="form.path" placeholder="前端路由地址,如/home"></el-input>
        </el-form-item>
        <el-form-item label="后端地址">
          <el-input v-model="form.backend_path" placeholder="后端请求地址,如/order/admin/index"></el-input>
        </el-form-item>
        <el-form-item label="路由组件" prop="component"
          v-if="(form.is_menu == 1 && form.pid > 0) || form.is_menu == 0">
          <el-input v-model="form.component" placeholder="前端路由对应组件,如views/home/index.vue">
          </el-input>
        </el-form-item>
        <el-form-item label="路由标题" v-if="(form.is_menu == 1 && form.pid > 0) || form.is_menu == 0">
          <el-input v-model="form.meta.title"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type">
            <el-option :value="item.id" :label="item.name" v-for="item in types" :key="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序号">
          <el-input v-model="form.sort" type="number"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input type="textarea" row="2" v-model="form.remark" minlength="2" maxlength="20"
            show-word-limit resize="none"></el-input>
        </el-form-item>
      </el-form>
    </FormDialog>
  </div>
</template>

<script setup>
import ListHeader from '@/components/ListHeader.vue'
import IconSelect from '@/components/IconSelect.vue'
import FormDialog from '@/components/FormDialog.vue'
import menu from '@/api/menu'
import { useInitTable, useInitForm } from '@/hooks/useCommon'
import { ref } from 'vue'
const defaultExpandedKeys = ref([])
const { loading, dataList, handleDelete, handleSwitch, getData } = useInitTable({
  api: menu,
  params: {
    page: 1,
    pageSize: 10,
  },
  onGetListSuccess: (res) => {
    dataList.value = res.result
    // 默认展开一级菜单
    defaultExpandedKeys.value = res.result.map((item) => item.id)
    // console.log(dataList.value)
  },
})

const { dialogTitle, formDialogRef, formRef, rules, form, handleAdd, handleEdit, handleSubmit, dialogClosed } = useInitForm({
  api: menu,
  getData,
  form: {
    pid: 0,
    name: '',
    label: '',
    is_menu: 0,
    path: '',
    backend_path: '',
    icon: '',
    component: '',
    type: 0,
    remark: '',
    meta: { title: '' },
    status: 1,
    sort: 100,
  },
  rules: {
    label: [
      {
        required: true,
        message: '菜单/规则名不能为空',
        trigger: 'blur',
      },
    ],
    name: [
      {
        required: true,
        message: 'name值不能为空',
        trigger: 'blur',
      },
    ],
    path: [
      {
        required: true,
        message: '路由地址不能为空',
        trigger: 'blur',
      },
    ],
  },
})

const types = ref([
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

const addChild = (id) => {
  handleAdd()
  form.pid = id
  form.status = 1
}
// 递归将多维数据转成一维数组，展开全部菜单
// const filterMenu1 = (menuList, arr = []) => {
//   menuList.forEach((item, index) => {
//     if (item.is_menu) {
//       arr.push({ id: item.id, pid: item.pid, name: item.name, label: item.label, icon: item.icon, path: item.path, children: [] })
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
