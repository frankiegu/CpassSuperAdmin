import { _import } from '@/config/env'
import layout from '@/views/layout/layout'         // 顶层路由，对应index.html
import register from '@/router/register'           // 注册、找回密码
import example from '@/router/example'             // 一些示例页面
import error from '@/router/error'                 // 错误页面，如404
import client from '@/router/client'               // 客户管理
import service from '@/router/service'             // 服务管理
import field from '@/router/field'                 // 场地管理
import member from '@/router/member'               // 会员管理
// import order from '@/router/order'                 // 订单管理
import refund from '@/router/refund'               // 退款
import cantonFair from '@/router/canton-fair'      // 广交会活动
import feedback from '@/router/feedback'           // 广交会活动

export const constantRouterMap = [
  {
    name: '首页',
    path: '',
    redirect: '/client/list',
    component: layout,
    hidden: true,
    children: [
      {
        path: 'home',
        component: _import('home'),
        hidden: true
      },
      ...error
    ]
  },
  ...example,
  ...client,
  ...member,
  ...field,
  ...service,
  // ...order,
  ...refund,
  ...cantonFair,
  ...feedback,
  ...register,
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
