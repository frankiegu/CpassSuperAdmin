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
  icon: 'icon-service',
  children: [{
    name: '服务列表',
    path: 'list',
    component: _import('service/list')
  }, {
    name: '服务订单',
    path: 'order',
    component: _import('service/order')
  }, {
    name: '服务订单详情',
    path: 'order/detail',
    hidden: true,
    component: _import('service/order-detail')
  }]
}]
