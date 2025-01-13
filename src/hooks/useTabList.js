import { ref, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export function useTabList() {
  const store = useStore()
  const router = useRouter()
  const route = useRoute()
  const scrollbarRef = ref(null)
  const noTab = ref(false)
  const tagsRefs = ref([])
  const tagsRefsIndex = ref(0)

  const tabList = computed(() => store.state.tabList)
  const currentRoute = computed(() => store.state.currentRoute)

  const scrolls = (pos) => {
    scrollbarRef.value.setScrollLeft(pos)
  }

  // 添加标签导航
  const addTab = (tab) => {
    noTab.value = tabList.value.findIndex((t) => t.path == tab.path) == -1
    if (noTab.value) {
      tabList.value.push(tab)
    }
    tagsRefsIndex.value = tabList.value.findIndex((t) => t.path == tab.path)
    tagsViewmoveToCurrentTag()
    store.commit('setTabList', tabList.value)
  }

  const tagsViewmoveToCurrentTag = () => {
    nextTick(() => {
      if (tagsRefs.value.length <= 0) return false
      // 当前tag元素
      let tagDom = tagsRefs.value[tagsRefsIndex.value]
      // 当前 tag 总长度
      let tagLength = tagsRefs.value.length
      // 最前 tag
      let tagFirst = tagsRefs.value[0]
      // 最后 tag
      let tagLast = tagsRefs.value[tagsRefs.value.length - 1]
      // 当前滚动条宽度
      // let tagsWidth = 0
      // tagsRefs.value.forEach((item, index) => {
      //   tagsWidth += parseInt(tagsRefs.value[index].$el.offsetWidth)
      // })
      let tagsWidth = tagLength * 80
      let scrollbarWidth = scrollbarRef.value.$el.offsetWidth
      if (tagsRefsIndex.value > 0 && scrollbarWidth < tagsWidth) {
        let pos = 0
        if (noTab.value) {
          // 需等tab渲染完成后在滑动
          setTimeout(() => {
            scrolls(tagsWidth)
            // 移动端点击后菜单后缩进
            if (store.state.isMobile) {
              store.commit('switchCollapse')
            }
          }, 500)
        } else {
          pos = (tagsRefsIndex.value - 1) * 80
          scrolls(pos)
          scrollbarRef.value.update()
        }
      }
    })
  }

  watch(
    route,
    () => {
      addTab({
        label: route.meta.title,
        path: route.path,
      })

      store.commit('setCurrentRoute', route.path)
    },
    { deep: true, immediate: true }
  )
  // 关闭标签导航
  const closeTab = (tag, index) => {
    let tab = tabList.value
    let length = tab.length - 1
    tabList.value.splice(index, 1)
    store.commit('setTabList', tabList.value)
    // 如果关闭的标签不是当前路由的话，就不跳转
    if (tag.path !== currentRoute.value) {
      return
    }

    // 关闭的标签是最右边的话，往左边跳转一个
    if (index === length) {
      router.push(tab[index - 1].path).catch((err) => {})
    } else {
      // 否则往右边跳转
      router.push(tab[index].path).catch((err) => {})
    }
  }
  const changeMenu = (tag, index) => {
    router.push(tag.path).catch((err) => err) //catch解决重复点击报错
  }

  const handleCommand = (command) => {
    let tab = tabList.value
    switch (command) {
      case 'other':
        // 过滤只剩下首页和当前激活
        tab = tabList.value.filter((tab) => tab.path == '/' || tab.path == currentRoute.value)
        break
      case 'all':
        // 切换回首页
        router.push('/').catch((err) => {})
        tab = [
          {
            label: '首页',
            path: '/',
          },
        ]
        break
    }
    store.commit('setTabList', tab)
  }

  return {
    currentRoute,
    tabList,
    closeTab,
    changeMenu,
    handleCommand,
    tagsRefs,
    scrollbarRef,
    scrolls,
  }
}
