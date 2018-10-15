/**
 * 产品库
 */
import { _import } from '../config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '产品库',
  path: '/product',
  redirect: '/product/list',
  component: layout,
  noDropdown: true,
  icon: 'icon-space',
  children: [{
    name: '产品库列表',
    path: 'list',
    component: _import('product/list')
  }, {
    name: '',
    path: 'add',
    hidden: true,
    component: _import('product/add')
  }]
}]
