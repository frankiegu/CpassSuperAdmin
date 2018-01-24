/**
 * 个人、空间信息
 */
import {_import} from '@/config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '当前用户',
  path: '/admin',
  redirect: '/personal-info',
  component: layout,
  hidden: true,
  children: [
    {name: '个人信息管理', path: '/personal-info', component: _import('admin/personal-info')}
  ]
}]
