/**
 * 服务管理
 */
import { _import } from '../config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '服务管理',
  path: '/service',
  redirect: '/service/list',
  component: layout,
  icon: 'icon-viip',
  children: [{
    name: '服务列表',
    path: 'list',
    component: _import('service/list')
  }]
}]
