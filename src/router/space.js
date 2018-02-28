/**
 * 场地管理
 */
import { _import } from '../config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '场地管理',
  path: '/space',
  redirect: '/space/list',
  component: layout,
  icon: 'icon-Site',
  children: [{
    name: '场地列表',
    path: 'list',
    component: _import('space/list')
  }]
}]
