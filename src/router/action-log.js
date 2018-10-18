/**
 * 用户管理
 */
import { _import } from '../config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '操作记录',
  path: '/action-log',
  redirect: '/action-log/list',
  component: layout,
  icon: 'icon-order',
  children: [{
    name: '操作记录',
    path: 'list',
    component: _import('action-log/index')
  }]
}]
