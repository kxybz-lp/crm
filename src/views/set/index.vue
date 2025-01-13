<template>
  <div class="app-container">
    <el-card class="menu-order-add" shadow="hover">
      <p>表格拖拽(行+列)</p>
      <!-- <table class="tb">
        <thead>
          <draggable v-model="headers" animation="200" tag="tr" :item-key="(key) => key">
            <template #item="{ element: header }">
              <th class="move">
                {{ header }}
              </th>
            </template>
          </draggable>
        </thead>
        <draggable :list="list" handle=".move" animation="300" @start="onStart" @end="onEnd"
          tag="tbody" item-key="name">
          <template #item="{ element }">
            <tr>
              <td class="move" v-for="(header) in headers" :key="header">
                {{ element[header] }}
              </td>
            </tr>
          </template>
        </draggable>
      </table> -->
      <table class="tb">
        <thead>
          <draggable v-model="columns" animation="200" tag="tr" :item-key="(key) => key">
            <template #item="{ element: column }">
              <th class="move" v-show="column.show">
                {{ column.label }}
              </th>
            </template>
          </draggable>
        </thead>
        <draggable :list="dataList" handle=".move" animation="300" @start="onStart" @end="onEnd"
          tag="tbody" item-key="name">
          <template #item="{ element }">
            <tr>
              <td class="move" v-for="(column) in columns" :key="column.id" v-show="column.show">
                {{ element[column.prop] }}
              </td>
            </tr>
          </template>
        </draggable>
      </table>
      <hr style="margin: 20px 0;" />
      <!-- 单独设置表头 -->
      <p>element表格拖拽(行)</p>
      <el-table height="500" key="id" border :data="dataList" ref="dragTable">
        <!-- <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop"
          :label="item.label" /> -->
        <el-table-column v-for="(item,index) in oldList" :key="`col_${index}`"
          :prop="newList[index].prop" :label="item.label" align="center">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { toast } from '@/utils/utils'
import { computed, reactive, ref, watch, onMounted, nextTick } from 'vue'
import draggable from 'vuedraggable'
import Sortable from 'sortablejs'
// 表格拖拽
const headers = ref(['id', 'name', 'intro'])
const list = ref([
  { name: 'www.itxst.com', id: 0, intro: '慢吞吞的蜗牛' },
  { name: 'www.baidu.com', id: 1, intro: '中文搜索引擎' },
  { name: 'www.google.com', id: 3, intro: '安卓操作系统' },
])

// const state = reactive({
//   headers: ['id', 'name', 'intro'],
//   list: [
//     { name: 'www.itxst.com', id: 0, intro: '慢吞吞的蜗牛' },
//     { name: 'www.baidu.com', id: 1, intro: '中文搜索引擎' },
//     { name: 'www.google.com', id: 3, intro: '安卓操作系统' },
//   ],
// })

//拖拽开始的事件
const onStart = () => {
  // console.log('开始拖拽')
}

//拖拽结束的事件
const onEnd = () => {
  // console.log('结束拖拽')
}

const columns = ref([
  { prop: 'id', label: 'ID', show: true },
  { prop: 'name', label: '姓名', show: true },
  { prop: 'sex', label: '性别', show: false },
])
const dataList = ref([
  { id: 1, name: 'UserA', sex: 'Male' },
  { id: 2, name: 'UserB', sex: 'Female' },
  { id: 3, name: 'UserC', sex: 'Male' },
  { id: 4, name: 'UserD', sex: 'Male' },
  { id: 5, name: 'UserE', sex: 'Female' },
  { id: 6, name: 'UserF', sex: 'Male' },
  { id: 7, name: 'UserG', sex: 'Male' },
  { id: 8, name: 'UserH', sex: 'Female' },
  { id: 9, name: 'UserI', sex: 'Female' },
])

const dragTable = ref()
// 行拖拽
const rowDrop = () => {
  const tbody = document.querySelector('.order-card .el-table__body-wrapper tbody')
  if (tbody) {
    Sortable.create(tbody, {
      handle: '.el-table__row',
      animation: 200,
      ghostClass: 'ghost',
      onEnd({ newIndex, oldIndex }) {
        const currRow = dataList.value.splice(oldIndex, 1)[0]
        dataList.value.splice(newIndex, 0, currRow)
      },
    })
  }
}

// 列拖拽
const oldList = ref([])
const newList = ref([])
const columnDrop = () => {
  const theadTr = document.querySelector('.el-table__header-wrapper tr')
  if (theadTr) {
    Sortable.create(theadTr, {
      animation: 200,
      delay: 0,
      ghostClass: 'ghost',
      onEnd(event) {
        const oldItem = newList.value[event.oldIndex]
        newList.value.splice(event.oldIndex, 1)
        newList.value.splice(event.newIndex, 0, oldItem)
      },
    })
  }
}

onMounted(() => {
  oldList.value = JSON.parse(JSON.stringify(columns.value))
  newList.value = JSON.parse(JSON.stringify(columns.value))
  rowDrop()
  columnDrop()
})
</script>
<style lang="scss" scoped>
.itxst {
  width: 600px;
}

.move {
  cursor: move;
}

table.tb {
  color: #333;
  border: solid 1px #999;
  font-size: 13px;
  border-collapse: collapse;
  min-width: 500px;
  user-select: none;
}

table.tb th {
  background: rgb(168 173 217);
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #999;
  text-align: left;
}

table.tb th:nth-of-type(1) {
  text-align: center;
}

table.tb td {
  background: #d6c8c8;
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #999;
}

table.tb td:nth-of-type(1) {
  text-align: center;
}
</style>
