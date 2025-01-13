import Mock from 'mockjs'
//配置
Mock.setup({
  timeout: 100, //延时1s返回数据
})

//使用mockjs模拟数据
Mock.mock('/index/banner', {
  code: 1,
  msg: 'ok',
  result: {
    mtime: '@datetime', //随机生成日期时间
    'score|1-800': 800, //随机生成1-800的数字
    'rank|1-100': 100, //随机生成1-100的数字
    'stars|1-5': 5, //随机生成1-5的数字
    nickname: '@cname', //随机生成中文名字
  },
})

Mock.mock('/index/menu', 'get', {
  code: 1,
  msg: 'ok',
  result: [
    {
      id: 1,
      pid: 0,
      name: 'Home', //运营概览
      label: '首页',
      icon: 'HomeFilled',
      path: '/home',
      meta: { title: '数据概览', permissions: true },
    },
    {
      id: 2,
      pid: 0,
      name: 'Admins',
      label: '用户管理',
      icon: 'UserFilled',
      path: '/admin', //为空会导致el-menu的unique-opened属性无效
      children: [
        {
          id: 21,
          pid: 2,
          name: 'Admin',
          label: '管理员列表',
          path: '/admin/index',
          meta: { title: '管理员列表', permissions: true },
        },
        {
          id: 22,
          pid: 2,
          name: 'Role',
          label: '角色列表',
          path: '/admin/role',
          meta: { title: '角色列表', permissions: true },
        },
      ],
    },
    {
      id: 3,
      pid: 0,
      name: 'orders',
      label: '订单管理',
      icon: 'List',
      path: '/orders',
      children: [
        {
          id: 31,
          pid: 3,
          name: 'Order',
          label: '订单列表',
          path: '/order',
        },
        {
          id: 32,
          pid: 3,
          name: 'Channel',
          label: '渠道管理',
          path: '/channel',
        },
        {
          id: 33,
          pid: 3,
          name: 'Status',
          label: '状态管理',
          path: '/status',
        },
        {
          id: 34,
          pid: 3,
          name: 'Tags',
          label: '标签管理',
          path: '/tags',
        },
        {
          id: 35,
          pid: 3,
          name: 'Type',
          label: '类型管理',
          path: '/type',
        },
        {
          id: 36,
          pid: 3,
          name: 'Layout',
          label: '户型管理',
          path: '/layout',
        },
      ],
    },
    {
      id: 4,
      pid: 0,
      name: 'Award',
      label: '抽奖管理',
      icon: 'Coin',
      path: '/award',
    },
    {
      id: 5,
      pid: 0,
      name: 'System',
      label: '系统管理',
      icon: 'Tools',
      path: '/system',
      children: [
        {
          id: 51,
          pid: 5,
          name: 'Category',
          label: '分类列表',
          path: '/category',
        },
        {
          id: 52,
          pid: 5,
          name: 'News',
          label: '资讯列表',
          path: '/news',
        },
        {
          id: 53,
          pid: 5,
          name: 'Menu',
          label: '菜单列表',
          path: '/admin/menu',
          meta: { title: '菜单列表', permissions: true },
        },
      ],
    },
  ],
})

// Mock.mock('/api/getGoodsList', {
//   "code":1,
//   "msg": "ok",
//   "result":
//     [
//       {
//         id: 1,
//         name: '儿童网眼运动凉鞋儿童网眼运动凉鞋（宽松版）',
//         pic: require("../assets/images/goods_01.png"),
//         price: "128"
//       },
//       {
//         id: 2,
//         name: '儿童小萌象系列湿巾',
//         pic: require("../assets/images/goods_02.png"),
//         price: "18"
//       },
//       {
//         id: 3,
//         name: '动物生日派对主题爬行垫',
//         pic: require("../assets/images/goods_03.png"),
//         price: "229"
//       },
//       {
//         id: 4,
//         name: '自嗨小天地，可折叠游戏围栏',
//         pic: require("../assets/images/goods_04.png"),
//         price: "629"
//       },
//       {
//         id: 5,
//         name: '网易有道词典笔',
//         pic: require("../assets/images/goods_05.png"),
//         price: "799"
//       },
//       {
//         id: 6,
//         name: '儿童豪华型学习桌椅',
//         pic: require("../assets/images/goods_06.png"),
//         price: "2899"
//       },
//       {
//         id: 7,
//         name: '弱酸性手口湿巾',
//         pic: require("../assets/images/goods_07.png"),
//         price: "9"
//       },
//       {
//         id: 8,
//         name: '日本乳霜纸巾',
//         pic: require("../assets/images/goods_08.png"),
//         price: "18"
//       },
//       {
//         id: 9,
//         name: '海量鲸吸婴儿拉拉裤学步裤',
//         pic: require("../assets/images/goods_09.png"),
//         price: "55"
//       },
//       {
//         id: 10,
//         name: '海量鲸吸婴儿纸尿裤尿不湿',
//         pic: require("../assets/images/goods_10.png"),
//         price: "55"
//       },
//     ]
// });
