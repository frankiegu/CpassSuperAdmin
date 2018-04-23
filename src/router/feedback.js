/**
 * 财务
 */
import { _import } from '../config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '反馈',
  path: '/feedback',
  redirect: '/feedback/list',
  component: layout,
  icon: 'icon-menuunfold',
  children: [
    {
      name: '管理后台反馈',
      path: 'list',
      component: _import('feedback/list')
    }
  ]
}]
