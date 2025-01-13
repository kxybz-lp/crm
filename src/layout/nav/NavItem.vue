<template>
  <template v-for="item in menu" :key="item.id">
    <!-- 如果当前菜单有下级,循环下级 -->
    <el-sub-menu v-if="(item.children && item.children.length > 0)" :index="item.path.toString()">
      <template #title>
        <el-icon class="menu-icon">
          <!-- 遍历icon -->
          <component :is="item.icon"></component>
        </el-icon>
        <span>{{ item.label }}</span>
      </template>

      <!-- 递归调用自身 -->
      <NavItem v-if="item.children.length" :menu="item.children" :index="item.path.toString()">
      </NavItem>
    </el-sub-menu>

    <!-- 没有下级 -->
    <el-menu-item v-else :index="item.path.toString()">
      <component :is="item.icon" class="menu-icon"></component>
      <template #title>{{ item.label }}</template>
    </el-menu-item>
  </template>
</template>

<script setup>
defineProps({
  menu: {
    type: Array,
    default: [],
  },
  index: {
    //不定义出现警告
    type: String,
    default: '',
  },
})
// const switchMenu = (item) => {
//   console.log(item)
// }
</script>

<style lang="scss" scoped>
.menu-icon {
  width: 20px !important;
  height: 20px !important;
  margin-right: 5px;
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
}
.el-menu-item.is-active {
  background-color: #02333b !important;
  color: #fff !important;
}
.el-menu-item:hover,
:deep(.el-submenu__title:hover) {
  background: #02333b !important;
  color: #fff !important;
}
</style>
