/**
 * 错误页面，404、500、没有权限
 */
import { _import } from '@/config/env'
import layout from '@/views/layout/layout.vue'

export default [
  {
    name: '抱歉',
    path: '/error',
    redirect: '/500',
    component: layout,
    hidden: true,
    children: [
      {
        name: '服务器出错了',
        path: '/500',
        component: _import('error/500')
      }, {
        name: '没有访问权限',
        path: '/not-permission',
        component: _import('error/not-permission')
      }
    ]
  }, {
    name: '没有发现',
    path: '/not-found',
    component: _import('error/not-found'),
    hidden: true
  }, {
    name: '没有发现 ',
    path: '*',
    redirect: '/not-found',
    hidden: true
  }
]
