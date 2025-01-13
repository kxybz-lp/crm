<template>
  <div>
    <template v-if="specItem.length > 0">
      <el-tag v-for="tag in specItem" :key="tag.key" class="mx-1" closable
        :disable-transitions="false" @close="handleClose(tag.key)" effect="plain">
        <el-input style="width:180px;margin-left: -10px;" class="spec_value"
          v-model="tag.spec_value" placeholder="规格值" size="small">
        </el-input>
      </el-tag>
    </template>
    <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" style="width:180px;"
      placeholder="请输入规格值" size="small" @keyup.enter="handleInputConfirm(current)"
      @blur="handleInputConfirm(current)" />
    <el-button v-else class="button-new-tag" size="small" @click="showInput">
      + 添加选项值
    </el-button>
  </div>
</template>
  <script setup>
import { initSpecItem } from '@/hooks/useSku'
const props = defineProps({
  current: {
    type: Number,
    default: 0,
  },
})
const { specItem, inputVisible, inputValue, InputRef, showInput, handleInputConfirm, handleClose } = initSpecItem(props.current)
</script>
  <style lang="scss" scoped>
:deep(.el-tag--plain) {
  --el-tag-border-color: #d9d9d9 !important;
  margin: 0 10px 10px 0;
}
.spec_value {
  border: none;
}
</style>