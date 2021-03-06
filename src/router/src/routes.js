import { _import } from '@/config/env'
import layout from '@/views/layout/layout'         // 顶层路由，对应index.html
import register from '@/router/register'           // 注册、找回密码
import example from '@/router/example'             // 一些示例页面
import error from '@/router/error'                 // 错误页面，如404
import client from '@/router/client'               // 客户管理
import service from '@/router/service'             // 服务管理
import field from '@/router/field'                 // 场地管理
import member from '@/router/member'               // 会员管理
import refund from '@/router/refund'               // 退款
import cantonFair from '@/router/canton-fair'      // 广交会活动
import feedback from '@/router/feedback'           // 广交会活动
import market from '@/router/market'               // 营销管理
import statistics from '@/router/statistics'       // 统计
import product from '@/router/product'             // 产品库
import user from '@/router/user-management'        // 用户管理
import resource from '@/router/resource'           // 权限资源管理
import actionLog from '@/router/action-log'        // 操作记录
import system from '@/router/system'               // 系统

export const constantRouterMap = [
  {
    name: '首页',
    path: '',
    redirect: '/home',
    component: layout,
    hidden: true,
    children: [
      {
        name: '',
        path: 'home',
        component: _import('home/index'),
        hidden: true
      },
      ...error
    ]
  },
  ...user,
  ...client,
  ...member,
  ...field,
  ...service,
  ...refund,
  ...cantonFair,
  ...feedback,
  ...market,
  ...product,
  ...statistics,
  ...register,
  ...resource,
  ...actionLog,
  ...system,
  ...example,
  /* 必须保证404页面在最后引入，有坑 */
  {
    name: '没有发现 ',
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export const asyncRouterMap = [
]
