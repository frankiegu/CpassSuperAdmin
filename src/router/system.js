/**
 * 系统设置
 */
import { _import } from '../config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '系统设置',
  path: '/system',
  redirect: '/system/profile',
  component: layout,
  icon: 'icon-order',
  hidden: true,
  children: [{
    name: '个人信息',
    path: 'profile',
    component: _import('system/profile/index')
  }, {
    name: '编辑个人信息',
    path: 'profile/edit',
    component: _import('system/profile/edit')
  }]
}]
