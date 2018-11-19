/**
 * 场地管理
 */
import { _import } from '../config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '场地管理',
  path: '/field',
  redirect: '/field/list',
  component: layout,
  icon: 'icon-Site',
  ajaxPermissions: ['/supervisor/field/list', '/supervisor/platformOrder/list', '/supervisor/visitReservation/list'],
  children: [{
    name: '场地列表',
    path: 'list',
    component: _import('field/list'),
    ajaxPermissions: '/supervisor/field/list'
  }, {
    name: '场地详情',
    path: 'detail',
    hidden: true,
    component: _import('field/detail')
  }, {
    name: '场地订单',
    path: 'order',
    component: _import('field/order'),
    ajaxPermissions: '/supervisor/platformOrder/list'
  }, {
    name: '场地订单详情',
    path: 'order/detail',
    hidden: true,
    component: _import('field/order-detail')
  }, {
    name: '参观预约',
    path: 'appointment',
    component: _import('field/visit-appointment/list'),
    ajaxPermissions: '/supervisor/visitReservation/list'
  }]
}]
