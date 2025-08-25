import { get, post } from '@/utils/http'

const home = {
  //首页数据
  getData() {
    return post('/crm/index/data')
  },
  // 商城柱状图数据
  getBarData(params) {
    return post('/crm/index/ercharts_bar', params)
  },
  // 报单柱状图数据
  getReportBarData(params) {
    return post('/crm/index/ercharts_bar_report', params)
  },
  //公告数据
  getNotice() {
    return post('/order/index/notice')
  },
}

export default home
