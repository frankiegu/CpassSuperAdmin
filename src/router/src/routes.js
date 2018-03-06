import { _import } from '@/config/env'
import layout from '@/views/layout/layout'         // 顶层路由，对应index.html
import register from '@/router/register'           // 注册、找回密码
import example from '@/router/example'             // 一些示例页面
import error from '@/router/error'                 // 错误页面，如404
import client from '@/router/client'               // 客户管理
import service from '@/router/service'             // 服务管理
import field from '@/router/field'                 // 场地管理
import member from '@/router/member'               // 会员管理
import order from '@/router/order'                 // 订单管理

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
      }
    ]
  },
  ...client,
  ...service,
  ...field,
  ...member,
  ...order,
  ...register,
  ...example,
  ...error
]

export const asyncRouterMap = [
]
