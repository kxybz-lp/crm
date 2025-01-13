import { reactive, ref, computed } from 'vue'
import { toast, showModal, scrollToTop } from '@/utils/utils'
import store from '@/store'

// 列表，分页，搜索，删除，修改状态，排序
export function useInitTable(opt = {}) {
  const loading = ref(false)
  // 搜索与请求参数
  let params = null
  // 重置表单方法
  let resetParams = null
  if (opt.params) {
    params = reactive({ ...opt.params })
    resetParams = () => {
      for (const key in opt.params) {
        params[key] = opt.searchForm[key]
      }
      // getData()
    }
  }
  const count = ref(0)
  const dataList = ref([])
  // opt.api  数据请求的模型
  // opt.onGetListSuccess 数据请求成功后的回调
  const getData = (page = null) => {
    loading.value = true
    if (typeof page == 'number') {
      params.page = page
    }
    // console.log(params)
    opt.api
      .getList(params)
      .then((res) => {
        if (res.code > 0) {
          if (opt.onGetListSuccess && typeof opt.onGetListSuccess == 'function') {
            opt.onGetListSuccess(res)
          } else {
            count.value = res.result.total
            dataList.value = res.result.data
          }
        } else {
          toast(res.message || 'Error', 'error')
        }
      })
      .finally(() => {
        loading.value = false
      })
  }
  //获取数据
  getData()
  //切换分页码
  const handleCurrentChange = (page) => {
    params.page = page
    // 移动端返回页面顶部
    if (store.state.isMobile) {
      let elMain = document.querySelector('.el-main')
      elMain.scrollTop = 0
    }
    getData()
  }
  // 切换分页数
  const handleSizeChange = (pageSize) => {
    params.pageSize = pageSize
    getData()
  }

  //设置状态
  const handleSwitch = (val, row, key = 'id') => {
    let param = null
    switch (key) {
      case 'coupon_id':
        param = { coupon_id: row['coupon_id'], status: val }
        break
      case 'express_id':
        param = { express_id: row['express_id'], status: val }
        break
      default:
        param = { id: row['id'], status: val }
        break
    }
    row.statusLoading = true
    opt.api
      .status(param)
      .then((res) => {
        if (res.code > 0) {
          toast('数据更新成功')
          row.status = val
        } else {
          toast(res.message, 'error')
        }
      })
      .finally(() => {
        row.statusLoading = false
      })
  }

  // 表格数据字段排序
  const sortChange = (column, prop, order) => {
    params.page = 1
    if (column.prop == 'order_time_date') column.prop = 'order_time'
    params.sort = column.order == 'descending' ? column.prop + ' desc' : column.prop + ' asc'
    getData()
  }

  // 多选选中ID
  const multiSelectionIds = ref([])
  const handleSelectionChange = (e) => {
    let exists = e.some((item) => item.goods_id)
    if (exists) {
      multiSelectionIds.value = e.map((o) => o.goods_id)
    } else {
      multiSelectionIds.value = e.map((o) => o.id)
    }
  }
  // 批量删除
  const multipleTableRef = ref(null)
  const handleMultiDelete = () => {
    if (multiSelectionIds.value.length == 0) {
      toast('请选择需要删除的数据', 'error')
      return
    }
    loading.value = true
    opt.api
      .deleteAll(multiSelectionIds.value)
      .then((res) => {
        toast('数据删除成功')
        // 清空选中
        if (multipleTableRef.value) {
          multipleTableRef.value.clearSelection()
        }
        getData()
      })
      .finally(() => {
        loading.value = false
      })
  }
  // 排序
  const handleSort = () => {
    let sort = []
    dataList.value.map((o) => {
      if (o.list_order) {
        sort.push({ id: o.id, list_order: o.list_order })
      } else {
        sort.push({ id: o.id, sort: o.sort })
      }
    })
    loading.value = true
    opt.api
      .sort(sort)
      .then((res) => {
        if (res.code > 0) {
          toast('数据更新成功')
          getData()
        } else {
          toast(res.message || 'Error', 'error')
        }
      })
      .finally(() => {
        loading.value = false
      })
  }
  // 批量修改状态

  // 删除
  const handleDelete = (id) => {
    showModal('确认要删除该数据吗？')
      .then((res) => {
        opt.api.delete(id).then((res) => {
          if (res.code > 0) {
            toast('数据删除成功')
            getData()
          } else {
            toast(res.message, 'error')
          }
        })
      })
      .catch((err) => console.log(err))
  }

  // 恢复软删除数据
  const handleResave = (id) => {
    showModal('确认要恢复该数据吗？')
      .then((res) => {
        opt.api.resave(id).then((res) => {
          if (res.code > 0) {
            toast('数据恢复成功')
            getData()
          } else {
            toast(res.message, 'error')
          }
        })
      })
      .catch((err) => console.log(err))
  }
  //数据硬删除
  const handleDel = (id) => {
    showModal('确认要彻底删除该数据吗？')
      .then((res) => {
        opt.api.del(id).then((res) => {
          if (res.code > 0) {
            toast('数据彻底删除成功')
            getData()
          } else {
            toast(res.message, 'error')
          }
        })
      })
      .catch((err) => console.log(err))
  }

  return {
    loading,
    count,
    dataList,
    params,
    getData,
    resetParams,
    handleCurrentChange,
    handleSizeChange,
    handleSwitch,
    sortChange,
    handleSort,
    handleDelete,
    multiSelectionIds,
    handleSelectionChange,
    multipleTableRef,
    handleMultiDelete,
    handleResave,
    handleDel,
  }
}

// 新增，修改
export function useInitForm(opt = {}) {
  const editId = ref(0)
  const defaultForm = opt.form
  const dialogTitle = computed(() => (editId.value ? '修改' : '新增'))
  const formDialogRef = ref(null)
  const formRef = ref(null)
  let form = reactive({ ...opt.form })
  const rules = opt.rules || {}

  // 重置表单
  function resetForm(row = false) {
    if (formRef.value) formRef.value.clearValidate()
    for (const key in defaultForm) {
      form[key] = row[key]
    }
  }

  // 新增
  const handleAdd = () => {
    editId.value = 0
    formDialogRef.value.openFormDialog()
    resetForm(defaultForm)
  }
  // 编辑，重要内容请求服务器获取item
  const handleEdit = (row, key = 'id') => {
    editId.value = row[key]
    formDialogRef.value.openFormDialog()

    if (opt.fliterParam && typeof opt.fliterParam == 'function') {
      opt.fliterParam(row)
    } else {
      resetForm(row)
    }
  }

  // 提交
  const handleSubmit = () => {
    formRef.value.validate((valid) => {
      if (!valid) return
      // console.log(form)
      formDialogRef.value.showLoading()
      // 提交前的数据处理
      let body = {}
      if (opt.beforeSubmit && typeof opt.beforeSubmit == 'function') {
        body = opt.beforeSubmit({ ...form })
      } else {
        body = form
      }
      if (!body) {
        formDialogRef.value.hideLoading()
        return
      }

      if (editId.value) {
        opt.api
          .edit(editId.value, body)
          .then((res) => {
            if (res.code > 0) {
              toast('数据更新成功')
              formDialogRef.value.closeFormDialog()
              opt.getData()
            } else {
              toast(res.message, 'error')
            }
          })
          .finally(() => {
            formDialogRef.value.hideLoading()
          })
      } else {
        opt.api
          .create(body)
          .then((res) => {
            if (res.code > 0) {
              toast('数据新增成功')
              formDialogRef.value.closeFormDialog()
              opt.getData()
            } else {
              toast(res.message, 'error')
            }
          })
          .finally(() => {
            formDialogRef.value.hideLoading()
          })
      }
    })
  }
  // 弹窗关闭重置表单，esetFields只对有prop属性的生效
  const dialogClosed = () => {
    if (!formRef.value) return
    formRef.value.resetFields()
  }

  return {
    dialogTitle,
    formDialogRef,
    formRef,
    form,
    rules,
    editId,
    handleAdd,
    handleEdit,
    handleSubmit,
    dialogClosed,
  }
}
