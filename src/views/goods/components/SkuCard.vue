<template>
  <div class="sku-card">
    <el-form-item label="规格模板">
      <el-select v-model="spec_template_id" filterable placeholder="请选择规格模板" style="width:300px;">
        <el-option :value="item.id" :label="item.name" v-for="item in specTemplateList"
          :key="item.id" />
      </el-select>
      <el-button type="primary" @click="skuChange" style="margin-left:10px;">确认</el-button>
    </el-form-item>
    <el-form-item label="商品规格">
      <el-card shadow="never" class="sku-card-item" v-for="(item, index) in specList"
        :key="item.key">
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
  </div>
</template>
  <script setup>
import { ref, computed, reactive, watch } from 'vue'
import SkuCardItem from './SkuCardItem.vue'
import SkuTable from './SkuTable.vue'
import { showModal, toast, useArrayMoveDown, useArrayMoveUp } from '@/utils/utils'
import { specList, spec_template_id, specTemplateList, skuChange, addSkuCard, handleSpecUpdate, delSkuCard, sortCard, initSkuTable } from '@/hooks/useSku'
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