<template>
  <div>
    <el-form-item label="商品属性" v-if="tableThs && tableThs.length > 0">
      <div class="sku-batch">
        <span class="text" style="color:#999;padding-right:5px;">批量设置</span>
        <el-input style="width:100px" placeholder="商品价格" v-model="spec_s.goods_price" />
        <el-input style="width:100px" placeholder="划线价格" v-model="spec_s.line_price" />
        <el-input style="width:100px" placeholder="库存数量" v-model="spec_s.stock_num" />
        <el-input style="width:100px" placeholder="商品重量" v-model="spec_s.goods_weight" />
        <el-input style="width:100px" placeholder="sku编码" v-model="spec_s.goods_sku_no" />
        <el-button style="color:#999;margin-left:5px;" @click="setSkus">立即设置</el-button>
      </div>
    </el-form-item>
    <el-form-item v-if="tableThs && tableThs.length > 0">
      <table class="sku-table" border="1">
        <thead>
          <tr>
            <th v-for="(th,thi) in tableThs" :key="thi">
              {{ th.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in skuList" :key="index">
            <td class="text-center" v-for="(sku,skuI) in item.skuKeys" :key="skuI">
              {{ sku.spec_value }}
            </td>
            <td class="sku-pic" @click="open(index)">
              <el-image class="privew-image" :src="item.sku_pic" v-if="item.sku_pic" fit="cover">
              </el-image>
              <div v-else class="choose-image-btn">
                <el-icon :size="25" color="#e2e2e2">
                  <Plus />
                </el-icon>
              </div>

            </td>
            <td class="text-center">
              <el-input v-model="item.goods_sku_no" size="small" />
            </td>
            <td class="text-center">
              <el-input v-model="item.goods_price" size="small" type="number" />
            </td>
            <td class="text-center">
              <el-input v-model="item.line_price" size="small" type="number" />
            </td>
            <td class="text-center">
              <el-input v-model="item.stock_num" size="small" type="number" />
            </td>
            <td class="text-center">
              <el-input v-model="item.goods_weight" size="small" type="number" />
            </td>
          </tr>
        </tbody>
      </table>
      <ChooseImage :preview="false" ref="ChooseImageRef" />
    </el-form-item>
  </div>
</template>
  <script setup>
import { initSkuTable } from '@/hooks/useSku'
import ChooseImage from '@/components/ChooseImage.vue'
import { ref } from 'vue'

const { spec_s, setSkus, tableThs, skuList } = initSkuTable()

const ChooseImageRef = ref('')
const open = (index) => {
  ChooseImageRef.value.open((data) => {
    skuList.value[index].sku_pic = data
  })
}
</script>
  <style lang="scss" scoped>
.sku-batch .el-input {
  margin: 0 5px;
}
.sku-table {
  width: 100%;
  border-collapse: collapse;
  color: #666;
}
.sku-table th {
  background: #f8f8f8;
}
.sku-table th,
.sku-table td {
  border: 1px solid #e8e8e8;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  padding: 5px 5px;
  min-width: 100px;
}
.text-center {
  text-align: center;
}
.privew-image {
  width: 50px;
  height: 50px;
  border: 1px solid #e2e2e2;
  overflow: hidden;
  margin-left: 20px;
}
.choose-image-btn {
  width: 50px;
  height: 50px;
  border: 1px dashed #e2e2e2;
  color: #dad9d9;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
}
</style>