/**
 * 用户管理
 */
import { _import } from '../config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '用户管理',
  path: '/user-management',
  redirect: '/user-management/user',
  component: layout,
  icon: 'icon-order',
  children: [{
    name: '用户列表',
    path: 'user',
    component: _import('user-management/user/index')
  }, {
    name: '角色设置',
    path: 'role',
    component: _import('user-management/role/index')
  }, {
    name: '',
    path: 'role/com',
    hidden: true,
    component: _import('user-management/role/com/index')
  }]
}]
