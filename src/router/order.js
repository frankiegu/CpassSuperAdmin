/**
 * 订单管理
 */
import { _import } from '../config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '订单管理',
  path: '/order',
  redirect: '/order/field',
  component: layout,
  icon: 'icon-order'
  // children: [{
  //   name: '场地订单',
  //   path: 'field',
  //   component: _import('order/field')
  // }, {
  //   name: '场地订单详情',
  //   path: 'field/detail',
  //   hidden: true,
  //   component: _import('order/field-detail')
  // }, {
  //   name: '服务订单',
  //   path: 'service',
  //   component: _import('order/service')
  // }, {
  //   name: '服务订单详情',
  //   path: 'service/detail',
  //   hidden: true,
  //   component: _import('order/service-detail')
  // }]
}]
