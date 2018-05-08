/**
 * 错误页面，401 500
 */
import { _import } from '@/config/env'

export default [
  {
    name: '权限不足',
    path: '/401',
    component: _import('error/401')
  }, {
    name: '服务端错误',
    path: '/500',
    component: _import('error/500')
  }, {
    name: '页面不存在',
    path: '/404',
    component: _import('error/404')
  }
]
