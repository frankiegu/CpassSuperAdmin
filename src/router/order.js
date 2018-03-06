/**
 * 场地管理
 */
import { _import } from '../config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '订单管理',
  path: '/order',
  redirect: '/order/space',
  component: layout,
  icon: 'icon-order',
  children: [{
    name: '场地订单',
    path: 'space',
    component: _import('order/space')
  }, {
    name: '场地订单详情',
    path: 'space/detail',
    hidden: true,
    component: _import('order/space-detail')
  }, {
    name: '服务订单',
    path: 'service',
    component: _import('order/service')
  }]
}]
