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
  icon: 'icon-viip',
  children: [{
    name: '场地订单',
    path: 'space',
    component: _import('order/space')
  }, {
    name: '服务订单',
    path: 'service',
    component: _import('order/service')
  }]
}]
