/**
 * 产品库
 */
import { _import } from '../config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '',
  path: '/product',
  redirect: '/product/list',
  component: layout,
  noDropdown: true,
  icon: 'icon-space',
  ajaxPermissions: ['/supervisor/product/selectPage'],
  children: [{
    name: '产品库',
    path: 'list',
    component: _import('product/list')
  }, {
    name: '',
    path: 'add',
    hidden: true,
    component: _import('product/add')
  }]
}]
