import {_import} from '@/config/env'

import layout from '@/views/layout/layout.vue'     // 顶层路由，对应index.html
import register from '@/router/register'           // 注册、找回密码
import admin from '@/router/admin'                 // 个人、空间信息
import example from '@/router/example'             // 一些示例页面
import error from '@/router/error'                 // 错误页面，如404
import space from '@/router/space'                 // 场地管理
import housekeeper from '@/router/housekeeper'     // 空间管家
import service from '@/router/service'             // 服务管理
import member from '@/router/member'               // 会员管理
import market from '@/router/market'               // 营销管理
import order from '@/router/order'                 // 订单管理
import finance from '@/router/finance'             // 财务管理
import statistics from '@/router/statistics'       // 数据统计
import permission from '@/router/permission'       // 权限管理
import push from '@/router/push'                   // 推送管理
import fixedAssets from '@/router/fixed-assets'    // 固资管理
import system from '@/router/system'               // 系统配置
import tools from './tools'                        // 系统配置

const home = _import('admin/home')                 // 首页
export const constantRouterMap = [
  {
    path: '/',
    redirect: '/space',
    component: layout,
    hidden: true,
    children: [ // 二级路由。对应App.vue
      {
        name: '首页',
        path: '/home',
        component: home,
        hidden: true
      },
      ...example
    ]
  },
  ...space,
  ...housekeeper,
  ...service,
  ...member,
  ...market,
  ...order,
  ...finance,
  ...statistics,
  ...push,
  ...fixedAssets,
  ...permission,
  ...system,
  ...admin,
  ...register,
  ...tools,
  ...error
]

export const asyncRouterMap = [
]
