<template>
  <div class="app-container">
    <el-card class="goods-add-card" shadow="hover">
      <el-form class="goods" :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-tabs v-model="activeTab" @tab-change="handleTabChange">
          <el-tab-pane label="基础信息" name="basic">
            <el-form-item label="商品类型" prop="goods_type">
              <el-radio-group v-model="form.goods_type">
                <el-radio :label="10">实物商品/物流发货</el-radio>
                <el-radio :label="20">虚拟商品/无需物流</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="form.goods_name" placeholder="请输入商品名称" minlength="2" maxlength="50"
                show-word-limit />
            </el-form-item>
            <el-form-item label="商品分类" prop="category_id">
              <el-cascader v-model="form.category_id" :options="categoryList" :props="props"
                clearable :show-all-levels="false" placeholder="请选择分类" />
            </el-form-item>
            <el-form-item label="商品图片" prop="images">
              <ChooseImage :limit="9" v-model="form.images" />
            </el-form-item>
            <el-form-item label="商品描述">
              <el-input type="textarea" v-model="form.goods_desc" placeholder="请输入商品描述" />
            </el-form-item>
            <el-form-item label="商品单位" prop="goods_unit">
              <el-input v-model="form.goods_unit" placeholder="件" />
            </el-form-item>
            <el-form-item label="初始销量">
              <el-input type="number" v-model="form.sales_initial" placeholder="请输入初始销量" />
            </el-form-item>
            <el-form-item label="商品排序">
              <el-input type="number" v-model="form.goods_sort" placeholder="请输入商品排序" />
            </el-form-item>
            <el-form-item label="商品状态" prop="goods_status">
              <el-radio-group v-model="form.goods_status">
                <el-radio :label="10">上架</el-radio>
                <el-radio :label="20">下架</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="">
              <el-button type="warning" size="default" @click="activeTab='sku'">下一步</el-button>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="规格库存" name="sku">
            <el-form-item label="商品规格" prop="spec_type">
              <el-radio-group v-model="form.spec_type">
                <el-radio :label="10">单规格</el-radio>
                <el-radio :label="20">多规格</el-radio>
              </el-radio-group>
            </el-form-item>
            <template v-if="form.spec_type === 10">
              <el-form-item label="规格图片">
                <ChooseImage v-model="form.sku[0].sku_pic" />
              </el-form-item>
              <el-form-item label="商品编码">
                <el-input v-model="form.sku[0].goods_sku_no" />
              </el-form-item>
              <el-form-item label="商品价格">
                <el-input v-model="form.sku[0].goods_price"><template #append>元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="划线价格">
                <el-input v-model="form.sku[0].line_price"><template #append>元</template></el-input>
              </el-form-item>
              <el-form-item label="商品库存">
                <el-input v-model="form.sku[0].stock_num"><template
                    #append>{{form.goods_unit}}</template></el-input>
              </el-form-item>
              <el-form-item label="商品重量">
                <el-input v-model="form.sku[0].goods_weight"><template #append>KG</template>
                </el-input>
              </el-form-item>
            </template>
            <template v-else>
              <SkuCard ref="SkuCardRef" />
              <SkuTable />
            </template>
            <el-form-item label="库存计算" prop="deduct_stock_type">
              <el-radio-group v-model="form.deduct_stock_type">
                <el-radio :label="10">下单减库存</el-radio>
                <el-radio :label="20" disabled>付款减库存</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="">
              <el-button type="info" size="default" @click="activeTab='basic'">上一步</el-button>
              <el-button type="warning" size="default" @click="activeTab='detail'">下一步</el-button>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品详情" name="detail">
            <el-form-item label="商品详情" prop="content">
              <Editor :content="form.content" @getEditorContent="onEditorChange" ref="editorRef" />
            </el-form-item>
            <el-form-item label="" style="margin-top:20px;">
              <el-button type="info" size="default" @click="activeTab='sku'">上一步</el-button>
              <el-button type="warning" size="default" @click="activeTab='express'">下一步</el-button>
              <el-button type="primary" size="default" @click="submit" :loading="loading">提交
              </el-button>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="物流设置" name="express">
            <el-form-item label="物流方式" prop="delivery_type">
              <el-checkbox-group v-model="form.delivery_type">
                <el-checkbox :label="10">快递</el-checkbox>
                <el-checkbox :label="20">到店</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="运费设置" prop="freight">
              <el-radio-group v-model="form.freight">
                <el-radio :label="10">固定邮费</el-radio>
                <el-radio :label="20">运费模板</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="" v-if="form.freight===10">
              <el-radio-group v-model="form.freight">
                <el-input type="number" v-model="form.freight_fee" placeholder="请输入运费" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="" v-else>
              <el-select v-model="form.delivery_id" placeholder="请选择物流模板" style="width:200px;">
                <el-option v-for="item in delivery" :key="item.delivery_id" :label="item.name"
                  :value="item.delivery_id" />
              </el-select>
              <el-button text type="primary" style="color:#076575">新增运费模板</el-button>
            </el-form-item>
            <el-form-item label="">
              <el-button type="info" size="default" @click="activeTab='detail'">上一步</el-button>
              <el-button type="warning" size="default" @click="activeTab='other'">下一步</el-button>
              <el-button type="primary" size="default" @click="submit" :loading="loading">提交
              </el-button>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="其他设置" name="other">
            <el-form-item label="热卖商品" prop="is_hot">
              <el-radio-group v-model="form.is_hot">
                <el-radio :label="10">开启</el-radio>
                <el-radio :label="20">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="促销商品" prop="is_promo">
              <el-radio-group v-model="form.is_promo">
                <el-radio :label="10">开启</el-radio>
                <el-radio :label="20">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="会员折扣" prop="is_discount">
              <el-radio-group v-model="form.is_discount">
                <el-radio :label="10">开启</el-radio>
                <el-radio :label="20">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否积分" prop="is_integral">
              <el-switch v-model="form.is_integral" :active-value="1" :inactive-value="0"
                inline-prompt active-text="开启" inactive-text="关闭" />
            </el-form-item>
            <el-form-item label="" v-if="form.is_integral===1">
              <el-radio-group v-model="form.integral_num">
                <el-input type="number" v-model="form.integral_num" placeholder="请输入积分数" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否限购" prop="is_restrict">
              <el-switch v-model="form.is_restrict" :active-value="1" :inactive-value="0"
                inline-prompt active-text="开启" inactive-text="关闭" />
            </el-form-item>
            <el-form-item label="" v-if="form.is_restrict===1">
              <el-radio-group v-model="form.restrict_total">
                <el-input type="number" v-model="form.restrict_total" placeholder="请输入总限购数量" />
                <el-input style="margin-top: 10px;" type="number" v-model="form.restrict_single"
                  placeholder="请输入每单限购数量" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="">
              <el-button type="info" size="default" @click="activeTab='express'">上一步</el-button>
              <el-button type="primary" size="default" @click="submit" :loading="loading">提交
              </el-button>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
  <script setup>
import { onUnmounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import goods from '@/api/goods'
import { toast } from '@/utils/utils'
import ChooseImage from '@/components/ChooseImage.vue'
import SkuCard from './components/SkuCard.vue'
import SkuTable from './components/SkuTable.vue'
import Editor from '@/components/Editor.vue'
import { specList, skuList, initSpecList, initSkuList } from '@/hooks/useSku.js'

const router = useRouter()
const route = useRoute()
const store = useStore()
const tabList = store.state.tabList
const formRef = ref('')
const editorRef = ref('')
const SkuCardRef = ref('')
const loading = ref(false)
const form = reactive({
  goods_type: 10,
  goods_name: '',
  category_id: '',
  goods_thumb: '',
  images: '',
  goods_desc: '',
  goods_unit: '',
  sales_initial: 0,
  goods_sort: 100,
  goods_status: 10,
  spec_type: 10,
  sku: [
    {
      sku_pic: '',
      goods_sku_no: '',
      goods_price: '',
      line_price: '',
      stock_num: '',
      goods_weight: '',
    },
  ],
  specData: {
    specList: [],
    skuList: [],
  },
  deduct_stock_type: 10,
  content: '',
  delivery_type: [10],
  freight: 10,
  freight_fee: '',
  delivery_id: '',
  is_hot: 20,
  is_integral: 0,
  integral_num: '',
  is_promo: 20,
  is_discount: 20,
  is_restrict: 0,
  restrict_total: '',
  restrict_single: '',
})
const rules = {
  goods_name: [
    {
      required: true,
      message: '商品名称不能为空',
      trigger: 'blur',
    },
  ],
  category_id: [
    {
      required: true,
      message: '商品分类不能为空',
      trigger: 'blur',
    },
  ],
  goods_thumb: [
    {
      required: true,
      message: '商品图片不能为空',
      trigger: 'blur',
    },
  ],
  images: [
    {
      required: true,
      message: '商品图片不能为空',
      trigger: 'blur',
    },
  ],
  goods_unit: [
    {
      required: true,
      message: '商品单位不能为空',
      trigger: 'blur',
    },
  ],
}

const props = {
  value: 'id',
  label: 'name',
  children: 'children',
  multiple: true,
  checkStrictly: true,
  emitPath: false,
}

onUnmounted(() => {
  // 重置商品规格数据
  initSpecList([])
  initSkuList([])
})

const loadData = (id) => {
  loading.value = true
  goods
    .read(id)
    .then((res) => {
      if (res.code > 0) {
        const result = res.result
        if (!result) {
          toast('商品不存在', 'error')
          router.replace('/goods/index').catch((err) => {})
          let index = tabList.findIndex((item) => item.path === '/goods/edit/' + id)
          tabList.splice(index, 1)
          store.commit('setTabList', tabList)
        }

        for (const key in form) {
          if (result[key]) form[key] = result[key]
        }
        // form.category_id = form.category_id.map((item) => parseInt(item))
        form.delivery_type = form.delivery_type.map((item) => parseInt(item))
        form.images = result.image.map((item) => item.path)
        form.sku = form.sku.length > 0 ? form.sku : [{ sku_pic: '', goods_sku_no: '', goods_price: '', line_price: '', stock_num: '', goods_weight: '' }]

        // console.log(form)
        // 初始化规格数据
        if (form.spec_type === 20 && result.specList.length > 0) {
          initSpecList(result.specList)
          initSkuList(form.sku)
        }
      } else {
        toast(res.message || 'error', 'error')
        return false
      }
    })
    .finally(() => {
      loading.value = false
    })
}
let goods_id = route.params.id
loadData(goods_id)

// select数据
const delivery = ref([])
const categoryList = ref([])
goods.getSelect().then((res) => {
  if (res.code > 0) {
    categoryList.value = res.result.category
    delivery.value = res.result.delivery
  } else {
    toast(res.message || 'Error', 'error')
  }
})

// tabs切换
const activeTab = ref('basic')
const changeTab = (tab) => {
  activeTab.value = tab
}
const handleTabChange = (tab) => {
  let fields = []
  if (tab != 'basic') {
    fields = ['goods_name', 'category_id', 'images', 'goods_unit']
    formRef.value.validateField(fields, (valid) => {
      if (!valid) {
        activeTab.value = 'basic'
      } else {
        activeTab.value = tab
      }
    })
  }
}

const onEditorChange = (arr, html) => {
  // console.log(arr, html)
  form.content = html
}

// 表单提交
const submit = () => {
  formRef.value.validate((valid) => {
    if (!valid) {
      return false
    }

    if (form.spec_type == 10) {
      if (!form.sku[0].goods_price) {
        toast('商品价格不能为空', 'error')
        activeTab.value = 'sku'
        return
      }
      if (!form.sku[0].stock_num) {
        toast('商品库存不能为空', 'error')
        activeTab.value = 'sku'
        return
      }
    } else {
      let specListArr = specList.value
      let skuListArr = skuList.value
      // foreach导致formRef.value.validate执行两次
      // let spec_name_arr = removeDuplicatedItem(array_column(specListArr, 'spec_name'))
      // if (spec_name_arr.length != specListArr.length) {
      //   toast('不能存在重复的规格 请检查您的输入', 'error')
      //   activeTab.value = 'sku'
      //   return
      // }
      let check_price = skuListArr.some((item) => {
        return item.goods_price == ''
      })
      let check_stock = skuListArr.some((item) => {
        return item.stock_num == ''
      })
      if (check_price) {
        toast('商品价格不能为空', 'error')
        activeTab.value = 'sku'
        return
      }
      if (check_stock) {
        toast('商品库存不能为空', 'error')
        activeTab.value = 'sku'
        return
      }
      form.specData.specList = specListArr
      form.specData.skuList = skuListArr
    }
    form.delivery_type = form.delivery_type.map((item) => parseInt(item))
    if (form.freight == 10) form.delivery_id = ''
    if (form.freight == 20) form.freight_fee = 0
    if (form.freight == 20 && !form.delivery_id) {
      toast('请选择物流模板', 'error')
      return
    }
    if (!form.is_restrict) {
      form.restrict_total = form.restrict_single = ''
    }
    if (form.is_restrict && (!form.restrict_total || !form.restrict_single)) {
      toast('请输入限购数量', 'error')
      return
    }
    if (!form.is_integral) form.integral_num = ''
    if (form.is_integral && !form.integral_num) {
      toast('请输入积分数', 'error')
      return
    }

    loading.value = true
    goods
      .edit(goods_id, form)
      .then((res) => {
        if (res.code > 0) {
          toast('数据更新成功')
          // resetFields 只对有prop属性的生效
          formRef.value.resetFields()
          editorRef.value.destroy()
          //重置无prop属性的字段
          activeTab.value = 'basic'
          form.sales_initial = 0
          form.goods_sort = 100
          form.images = ''
          form.content = ''
          form.goods_desc = ''
          form.freight_fee = ''
          form.sku.sku_pic = ''
          form.sku.goods_sku_no = ''
          form.sku.goods_price = ''
          form.sku.line_price = ''
          form.sku.stock_num = ''
          form.sku.goods_weight = ''
          form.specData.specList = []
          form.specData.skuList = []
          // 重置商品规格数据
          initSpecList([])
          initSkuList([])
          // 跳转到订单列表页，并重新获取数据
          let index = tabList.findIndex((item) => item.path === '/goods/edit/' + goods_id)
          router.replace({ path: '/goods/index', query: { reload: true, page: true } }).catch((err) => {})
          tabList.splice(index, 1)
          store.commit('setTabList', tabList)
        } else {
          toast(res.message || 'error', 'error')
          return false
        }
      })
      .finally(() => {
        loading.value = false
      })
    return false
  })
}
</script>
  <script>
export default {
  name: 'GoodsEdit',
}
</script>