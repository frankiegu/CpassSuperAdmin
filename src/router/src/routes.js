import {_import} from '@/config/env'
import layout from '@/views/layout/layout.vue'     // 顶层路由，对应index.html
import admin from '@/router/admin'                 // 个人、空间信息
import register from '@/router/register'           // 注册、找回密码
import example from '@/router/example'             // 一些示例页面
import error from '@/router/error'                 // 错误页面，如404

export const constantRouterMap = [
  {
    path: '/',
    redirect: '/home',
    component: layout,
    hidden: true,
    children: [
      {
        name: '首页',
        path: '/home',
        component: _import('admin/home'),
        hidden: true
      }
    ]
  },
  ...example,
  ...admin,
  ...register,
  ...error
]

export const asyncRouterMap = [
]
