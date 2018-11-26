/**
 * 权限资源管理
 */
import { _import } from '../config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '权限资源管理',
  path: '/resource',
  redirect: '/resource/list',
  component: layout,
  icon: 'icon-order',
  hidden: true,
  children: [{ // 权限资源管理
    name: '权限资源列表',
    path: 'list',
    component: _import('resource/index')
  }]
}]
