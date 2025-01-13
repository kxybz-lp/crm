<template>
  <div class="app-container">
    <el-card class="admin-card" shadow="hover">
      <ListHeader :rule="{ create: 176, sort: 118 }" @add="handleAdd" @sort="handleSort" />
      <el-table :data="dataList" stripe style="width: 100%"
        :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }" v-loading="loading">
        <el-table-column type="selection" prop="delivery_id" width="55" />
        <el-table-column prop="delivery_id" label="模板ID" min-width="100" />
        <el-table-column prop="name" label="模板名称" min-width="180" />
        <el-table-column prop="method" label="计费方式" min-width="180">
          <template #default="scope">{{ scope.row.method == 10 ? '按件数' : '按重量'}}</template>
        </el-table-column>
        <el-table-column label="排序号" min-width="160">
          <template #default="scope">
            <el-input style="width: 60%" type="number" v-model="scope.row.sort" min="0" />
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" min-width="180" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button v-permission="177" size="small" type="primary"
              @click="handleEdit(scope.row)">编辑 </el-button>
            <el-button v-permission="178" size="small" type="danger"
              @click="handleDelete(scope.row.delivery_id)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <FormDialog destroyOnClose :title="editId ? '更新' : '新增'" width="60%" ref="formDialogRef"
      @dialogClosed="dialogClosed" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rule="rule" label-width="180px" :inline="false">
        <el-form-item label="模板名称" prop="name">
          <el-input minlength="2" maxlength="20" show-word-limit v-model="form.name">
          </el-input>
        </el-form-item>
        <el-form-item label="计费方式" prop="method">
          <el-radio-group v-model="form.method">
            <el-radio :label="10">按件数</el-radio>
            <el-radio :label="20">按重量</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="配送区域及运费" prop="rule">
          <el-table border :data="form.rule" style="width: 100%;margin-bottom: 20px;"
            :header-cell-style="{ color: '#2c3e50', backgroundColor: '#f2f2f2' }"
            v-if="form.rule.length > 0">
            <el-table-column label="可配送区域" min-width="250">
              <template #default="scope">
                <div style="display:inline-block;margin-right:5px;"
                  v-for="item in scope.row.region_text" :key="item.name">{{ item.name }}
                  <i v-if="item.citys.length > 0">(<span v-for="itm in item.citys"
                      :key="itm.name">{{ itm.name }}</span>)</i>
                </div>
                <div class="buttons">
                  <el-button text @click="handleEditArea(scope.row)">编辑</el-button>
                  <el-button text @click="handleDeleteArea(scope.row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="form.method == 10 ? '首件 (个)' : '首重(KG)'">
              <template #default="scope">
                <el-input v-model="scope.row.first" placeholder="Please input" />
              </template>
            </el-table-column>
            <el-table-column label="运费(元)">
              <template #default="scope">
                <el-input v-model="scope.row.first_fee" placeholder="Please input" />
              </template>
            </el-table-column>
            <el-table-column :label="form.method == 10 ? '续件 (个)' : '续重(KG)'">
              <template #default="scope">
                <el-input v-model="scope.row.additional" placeholder="Please input" />
              </template>
            </el-table-column>
            <el-table-column label="续费(元)">
              <template #default="scope">
                <el-input v-model="scope.row.additional_fee" placeholder="Please input" />
              </template>
            </el-table-column>
          </el-table>
          <el-button @click="openAreaChioce">
            <el-icon>
              <Location />
            </el-icon>点击添加配送区域
          </el-button>
        </el-form-item>
        <el-form-item label="排序号">
          <el-input v-model="form.sort" type="number"></el-input>
        </el-form-item>
      </el-form>
    </FormDialog>

    <!-- 地区选择器 -->
    <!-- <el-transfer v-model="value" :data="areaList" :props="{
        key: 'id',
        label: 'areaname',
      }" /> -->
    <el-dialog v-model="dialogVisible" title="选择地区" width="50%">
      <div class="dialog-container">
        <div class="left">
          <div class="header">
            <span>地区选择：</span>
            <span class="choiceAll" @click="choiceAll">全选</span>
          </div>
          <div class="body">
            <el-scrollbar>
              <el-tree :data="areaLeftList" node-key="id" :props="{key: 'id',label: 'areaname',}">
                <template #default="{ data }">
                  <div class="custom-tree-node">
                    <span>{{ data.areaname }}</span>
                    <el-button type="primary" @click.stop="choice(data.id)" text>选择</el-button>
                  </div>
                </template>
              </el-tree>
            </el-scrollbar>
          </div>
        </div>
        <div class="right">
          <div class="header">
            <span>已选择</span>
          </div>
          <div class="body">
            <el-scrollbar>
              <el-tree :data="areaRightList" node-key="id" :props="{key: 'id',label: 'areaname',}">
                <template #default="{ data }">
                  <div class="custom-tree-node">
                    <span>{{ data.areaname }}</span>
                    <el-button type="primary" @click.stop="deleteChoice(data.id)" text>删除
                    </el-button>
                  </div>
                </template>
              </el-tree>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="choiceCancle">取消</el-button>
          <el-button style="margin-left:15px;" type="primary" @click="choiceSure">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
    
  <script setup>
import { ref } from 'vue'
import FormDialog from '@/components/FormDialog.vue'
import ListHeader from '@/components/ListHeader.vue'
import delivery from '@/api/delivery'
import { useInitTable, useInitForm } from '@/hooks/useCommon'
import { toast, sortBy } from '@/utils/utils'
const { loading, count, dataList, getData, handleSwitch, handleSort, handleDelete } = useInitTable({
  api: delivery,
  params: {
    page: 1,
    pageSize: 200,
    name: '',
  },
  onGetListSuccess: (res) => {
    count.value = res.result.total
    dataList.value = res.result.data.map((o) => {
      return o
    })
  },
})
const { editId, drawerTitle, formRef, rule, form } = useInitForm({
  api: delivery,
  getData,
  form: {
    name: '',
    method: 10,
    sort: 100,
    rule: [],
    // rule: [
    //   {
    //     key: 0,
    //     first: 1,
    //     first_fee: 0,
    //     additional: 0,
    //     additional_fee: 0,
    //     region: [2, 1938, 1926, 1963, 1971, 1949],
    //     region_text: [
    //       {
    //         name: '北京',
    //         citys: [],
    //       },
    //       {
    //         name: '广东省',
    //         citys: [
    //           {
    //             name: '广州市',
    //           },
    //           {
    //             name: '深圳市',
    //           },
    //           {
    //             name: '清远市',
    //           },
    //           {
    //             name: '佛山市',
    //           },
    //           {
    //             name: '珠海市',
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // ],
    status: 1,
  },
  rule: {
    name: [
      {
        required: true,
        message: '运费模板名不能为空',
        trigger: 'blur',
      },
    ],
    rule: [
      {
        required: true,
        message: '您还没有添加配送区域及运费',
        trigger: 'blur',
      },
    ],
  },
  beforeSubmit: (form) => {
    if (form.rule == '') {
      toast('至少添加一条运费规则', 'error')
      return
    }

    form.specList = specList.value
    return form
  },
})

const formDialogRef = ref('')
const dialogVisible = ref(false)
const areaList = ref([])
const areaLeftList = ref([])
const areaRightList = ref([])
// // select数据,合并远程请求
delivery.getSelect().then((res) => {
  if (res.code > 0) {
    areaList.value = res.result.area
    // 深拷贝areaList数据，操作areaLeftList不会影响areaList
    areaLeftList.value = JSON.parse(JSON.stringify(areaList.value))
  } else {
    toast(res.message || 'Error', 'error')
  }
})

const choiceAll = () => {
  areaRightList.value = areaLeftList.value
  areaLeftList.value = []
}

const choice = (id) => {
  let index = areaLeftList.value.findIndex((item) => item.id === id)
  if (index !== -1) {
    areaRightList.value.push(areaLeftList.value[index])
    // 重新排序
    areaRightList.value.sort(sortBy('id'))
    areaLeftList.value.splice(index, 1)
  } else {
    areaLeftList.value.forEach((item, index) => {
      item.children.forEach((itm, idx) => {
        if (itm.id == id) {
          let idx2 = areaRightList.value.findIndex((list) => list.id === item.id)
          if (idx2 !== -1) {
            areaRightList.value[idx2].children.push(itm)
            // 重新排序
            areaRightList.value[idx2].children.sort(sortBy('id'))
          } else {
            areaRightList.value.push({ id: item.id, areaname: item.areaname, children: [itm] })
          }
          item.children.splice(idx, 1)
          if (areaLeftList.value[index].children.length === 0) {
            areaLeftList.value.splice(index, 1)
          }
        }
      })
    })
  }
}

const deleteChoice = (id) => {
  let index = areaRightList.value.findIndex((item) => item.id === id)
  if (index !== -1) {
    areaLeftList.value.push(areaRightList.value[index])
    // 重新排序
    areaLeftList.value.sort(sortBy('id'))
    areaRightList.value.splice(index, 1)
  } else {
    areaRightList.value.forEach((item, index) => {
      item.children.forEach((itm, idx) => {
        if (itm.id == id) {
          let idx2 = areaLeftList.value.findIndex((list) => list.id === item.id)
          if (idx2 !== -1) {
            areaLeftList.value[idx2].children.push(itm)
            // 重新排序
            areaLeftList.value[idx2].children.sort(sortBy('id'))
          } else {
            areaLeftList.value.push({ id: item.id, areaname: item.areaname, children: [itm] })
          }
          item.children.splice(idx, 1)
          if (areaRightList.value[index].children.length === 0) {
            areaRightList.value.splice(index, 1)
          }
        }
      })
    })
  }
}

const choiceSure = () => {
  // 选中数据处理
  let key
  if (form.rule.length === 0) {
    key = 0
  } else {
    let key_arr = form.rule.map((item) => item.key)
    key = Math.max(...key_arr) + 1
  }
  let region = []
  let region_text = []
  areaRightList.value.forEach((item, index) => {
    let province = areaList.value.find((itm) => itm.id == item.id)
    region_text.push({ name: item.areaname, citys: [] })
    if (item.children && item.children.length != province.children.length) {
      item.children.forEach((itm) => {
        region.push(itm.id)
        region_text[index].citys.push({ name: itm.areaname })
      })
    } else {
      let city_id = province.children.map((item) => item.id)
      region.push(...city_id)
      region_text[index].citys = []
    }
  })
  form.rule.push({
    key,
    first: 1,
    first_fee: 0,
    additional: 0,
    additional_fee: 0,
    region,
    region_text,
  })
  dialogVisible.value = false
}
const choiceCancle = () => {
  areaLeftList.value = areaList.value
  areaRightList.value = []
  dialogVisible.value = false
}

const openAreaChioce = () => {
  dialogVisible.value = true
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

const handleAdd = () => {
  formDialogRef.value.openFormDialog()
}

const handleEdit = (row) => {
  editId.value = row.delivery_id
  delivery.read(editId.value).then((res) => {
    if (res.code > 0) {
      for (const key in form) {
        form[key] = res.result[key]
      }
      formDialogRef.value.openFormDialog()
    } else {
      toast(res.message, 'error')
    }
  })
}

// 提交
const handleSubmit = () => {
  if (!form.name) {
    toast('模板名称不能为空', 'error')
    return
  }
  // 提交前的数据处理
  if (form.rule.length == 0) {
    toast('至少添加一条运费规则', 'error')
    return
  }
  if (editId.value) {
    delivery
      .edit(editId.value, form)
      .then((res) => {
        if (res.code > 0) {
          toast('数据更新成功')
          formDialogRef.value.closeFormDialog()
          getData()
        } else {
          toast(res.message, 'error')
        }
      })
      .finally(() => {
        formDialogRef.value.hideLoading()
      })
  } else {
    delivery
      .create(form)
      .then((res) => {
        if (res.code > 0) {
          toast('数据新增成功')
          formDialogRef.value.closeFormDialog()
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

// 弹窗关闭
const dialogClosed = () => {
  formRef.value.resetFields()
  form.name = ''
  form.rule = []
  // areaLeftList = []
  // areaRightList = []
}

const handleEditArea = () => {
  dialogVisible.value = true
}

const handleDeleteArea = (row) => {
  let rule_id = row.rule_id
  let index = form.rule.findIndex((item) => item.rule_id == rule_id)
  form.rule.splice(index, 1)
}
</script>
    <style lang="scss" scoped>
.buttons {
  display: flex;
  justify-content: flex-end;
}
// .el-button + .el-button {
//   margin-left: 0;
// }
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
.custom-tree-node {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
:deep(.el-dialog__header) {
  padding-bottom: 16px;
  border-bottom: 1px solid #f5f5f5 !important;
}
:deep(.el-dialog__footer) {
  padding-top: 20px;
  border-top: 1px solid #f5f5f5 !important;
  box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, 0.04), 0px 8px 20px rgba(0, 0, 0, 0.08);
}
:deep(.el-dialog__body) {
  height: 52vh;
}
.dialog-container {
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.dialog-container .left,
.dialog-container .right {
  width: 45%;
  display: flex;
  flex-direction: column;
}
.dialog-container .header {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dialog-container .header .choiceAll {
  cursor: pointer;
}
.dialog-container .body {
  flex: 1;
  border: 1px solid #f5f5f5;
  height: 42.2vh;
}
.dialog-container .body .el-button {
  font-size: 14px;
}
</style>
    