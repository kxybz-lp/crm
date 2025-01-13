import { showModal, toast, array_column, useArrayMoveUp, useArrayMoveDown, cartesianProductOf } from '@/utils/utils'
import { ref, nextTick, reactive, computed, watch } from 'vue'
import goods from '@/api/goods'

// 当前商品ID
export const goods_id = ref(0)

// 规格列表
export const specList = ref([])
// sku列表
export const skuList = ref([])
// sku模板id
export const spec_template_id = ref('')
// sku模板列表
export const specTemplateList = ref([])

/**
 * 初始化规格列表
 *
 * @param {*} spec_list
 */
export function initSpecList(spec_list) {
  specList.value = spec_list
}

/**
 * 初始化sku列表
 * @param {*} sku_list
 */
export function initSkuList(sku_list) {
  skuList.value = sku_list
}

// 获取规格模板数据
goods.getSpecTemplateList().then((res) => {
  if (res.code > 0) {
    specTemplateList.value = res.result
  } else {
    toast('规格模板数据获取失败')
  }
})

// 选择规格模板
export function skuChange() {
  let list = specTemplateList.value.find((item) => item.id === spec_template_id.value)
  if (list.specList.length === 0) return
  // specList.value = list.specList  //直接赋值会改变的数据的响应式
  specList.value.splice(0, specList.value.length)
  specList.value.push(...list.specList)
}

// 添加规格UI
export function addSkuCard() {
  // let key = specList.value.length
  let key
  if (specList.value.length === 0) {
    key = 0
  } else {
    let key_arr = specList.value.map((item) => item.key)
    key = Math.max(...key_arr) + 1
  }
  specList.value.push({ key: key, spec_name: '', valueList: [] })
}

// 添加/修改规格组
export function handleSpecUpdate(item) {
  if (!item.spec_name.trim()) {
    toast('请输入规格名称', 'error')
    return
  }
  item.spec_name = item.spec_name.trim()
}

// 删除规格组
export function delSkuCard(key) {
  showModal('确认要删除该数据吗？')
    .then((res) => {
      let index = specList.value.findIndex((item) => item.key === key)
      specList.value.splice(index, 1)
      toast('数据删除成功')
    })
    .catch((err) => console.log(err))
}

// 排序
export function sortCard(action, index) {
  // let oList = JSON.parse(JSON.stringify(specList.value))
  if (action === 'up') {
    useArrayMoveUp(specList.value, index)
  } else {
    useArrayMoveDown(specList.value, index)
  }
}

/**
 * 初始化规格值
 * @param {*} key  规格组索引
 */
export function initSpecItem(key) {
  const specItem = computed(() => {
    let index = specList.value.findIndex((item) => item.key == key)
    return specList.value[index]['valueList']
  })
  const inputVisible = ref(false)
  const inputValue = ref('')
  const InputRef = ref()
  const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
      InputRef.value.input.focus()
    })
  }

  // 规格值初始化
  const handleInputConfirm = (current) => {
    if (!inputValue.value.trim()) {
      inputVisible.value = false
      return
    }
    let spec_value = inputValue.value.trim().trim()
    // let key = specList.value[current]['valueList'].length
    let key
    if (specItem.value.length === 0) {
      key = 0
    } else {
      let key_arr = specItem.value.map((item) => item.key)
      // Math.max.apply(null, key_arr)
      key = Math.max(...key_arr) + 1
    }
    let index = specList.value.findIndex((item) => item.key == current)
    specList.value[index]['valueList'].push({ key: key, groupKey: current, spec_value: spec_value })
    inputVisible.value = false
    inputValue.value = ''
  }

  // 规格值删除
  const handleClose = (key) => {
    showModal('确认要删除该数据吗？')
      .then((res) => {
        let index = specItem.value.findIndex((item) => item.key === key)
        specItem.value.splice(index, 1)
        toast('数据删除成功')
      })
      .catch((err) => console.log(err))
  }

  return {
    specItem,
    inputVisible,
    inputValue,
    InputRef,
    showInput,
    handleClose,
    handleInputConfirm,
  }
}

// 初始化表格
export function initSkuTable() {
  const spec_s = reactive({
    sku_pic: '',
    goods_sku_no: '',
    goods_price: '',
    line_price: '',
    stock_num: '',
    goods_weight: '',
  })

  // 批量设置sku
  const setSkus = () => {
    skuList.value.forEach((item) => {
      for (const key in item) {
        if (spec_s[key]) {
          item[key] = spec_s[key]
        }
      }
    })
  }

  const tableThs = ref([])
  watch(
    specList.value,
    (newVal) => {
      let skuLabels = newVal.filter((v) => v.valueList.length > 0)
      if (skuLabels.length > 0) {
        let list = []
        let sku_list = []
        skuLabels.forEach((v) => {
          list.push({ name: v.spec_name })
          sku_list.push(v.valueList)
        })
        list.push(
          {
            name: '规格图片',
          },
          {
            name: '商品编码',
          },
          {
            name: '商品价格',
          },
          {
            name: '划线价格',
          },
          {
            name: '库存数量',
          },
          {
            name: '商品重量',
          }
        )
        tableThs.value = list

        let arr = cartesianProductOf(...sku_list)
        let spec_list = []
        arr.forEach((item) => {
          let skuKey = item.map((itm) => itm.key).join('_')
          let spec_value_ids = item.map((itm) => itm.spec_value_id).join('_')
          let is_exist = skuList.value.find((im) => im.goods_sku_id === spec_value_ids)

          if (is_exist) {
            is_exist.skuKey = skuKey
            is_exist.skuKeys = item
            delete is_exist.goods_id
            delete is_exist.id
            delete is_exist.goods_props
            delete is_exist.spec_value_ids
            spec_list.push(is_exist)
          } else {
            spec_list.push({
              goods_sku_no: '',
              goods_price: '',
              goods_weight: '',
              line_price: '',
              sku_pic: '',
              stock_num: '',
              skuKey,
              skuKeys: item,
            })
          }
        })
        skuList.value = spec_list
      } else {
        tableThs.value = []
        skuList.value = []
      }
      // console.log(specList.value)
    },
    { deep: true, immediate: true }
  )

  return {
    spec_s,
    setSkus,
    skuList,
    tableThs,
  }
}
