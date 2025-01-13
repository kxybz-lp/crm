<template>
  <div class="icon-wrap">
    <el-icon :size="20" v-if="modelValue" class="mr-2">
      <component :is="modelValue" />
    </el-icon>
    <el-select filterable :modelValue="modelValue" class="m-2" placeholder="请选择图标" @change="handleChange">
      <el-option v-for="item in icons" :key="item" :label="item" :value="item">
        <div class="icon-item">
          <el-icon>
            <component :is="item" />
          </el-icon>
          <span class="text-gray-500">{{ item }}</span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import * as iconList from '@element-plus/icons-vue'
defineProps({
  modelValue: String,
})

const icons = ref(Object.keys(iconList))

const emit = defineEmits(['update:modelValue'])
const handleChange = (icon) => {
  emit('update:modelValue', icon)
}
</script>

<style lang="scss" scoped>
.icon-wrap {
  display: flex;
  align-items: center;
  width: 100%;
  .mr-2 {
    margin-right: 10px;
  }

  .text-gray-500 {
    color: #eee;
  }
}
.icon-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
