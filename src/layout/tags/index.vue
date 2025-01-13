<template>
  <div class="tablist">
    <el-icon @click="scrolls(0)">
      <el-icon-arrow-left />
    </el-icon>
    <div class="tabs">
      <el-scrollbar ref="scrollbarRef">
        <div class="tabs-scroll">
          <el-tag :key="tag.path" type="info" size="default" v-for="(tag, index) in tabList"
            :closable="tag.path !== '/'" :disable-transitions="false" @close="closeTab(tag, index)"
            @click="changeMenu(tag, index)" :effect="currentRoute === tag.path ? 'dark' : 'plain'"
            :ref="
						(el) => {
							if (el) tagsRefs[index] = el;
						}
					">
            {{ tag.label }}
          </el-tag>
        </div>
      </el-scrollbar>
    </div>
    <el-icon @click="scrolls(2000)">
      <el-icon-arrow-right />
    </el-icon>
    <el-dropdown @command="handleCommand">
      <span class="tabs-close">
        <el-icon>
          <el-icon-arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="other">关闭其他</el-dropdown-item>
          <el-dropdown-item command="all">关闭全部</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { useTabList } from '@/hooks/useTabList'
import { onMounted, ref } from 'vue'
const { currentRoute, tabList, closeTab, changeMenu, handleCommand, scrollbarRef, tagsRefs, scrolls } = useTabList()
</script>

<style lang="scss" scoped>
.tablist {
  display: flex;
  align-items: center;
  height: 30px;
  line-height: 30px;
  background-color: #fff;
  overflow: hidden;
  .tabs {
    flex: 1;
    overflow: hidden;
  }
  .tabs-scroll {
    display: flex;
    flex-wrap: nowrap;
  }
  .el-dropdown {
    border-left: 1px solid #f6f6f6;
  }
}
.tablist .el-icon {
  width: 30px;
  font-size: 18px;
  cursor: pointer;
}
.el-tag {
  border-radius: 0;
  cursor: pointer;
  min-width: 92px;
  text-align: center;
  background: #fff;
}
.el-tag.el-tag--info {
  background: #fff;
  border: none;
  border-right: none;
}
.el-tag--dark.el-tag--info {
  color: var(--color) !important;
  background-color: #f0f2f5;
  border-top: 1px solid var(--color);
}
.el-tag--dark.el-tag--info:deep(.el-tag__close) {
  color: var(--color) !important;
}
.el-tag--medium {
  line-height: 28px;
}
.el-tag--default {
  height: 26px;
  font-size: 13px;
}
</style>
