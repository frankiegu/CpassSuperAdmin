/**
 * 场地管理
 */
import { _import } from '../config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '营销管理',
  path: '/market',
  redirect: '/market/coupon',
  component: layout,
  icon: 'icon-Site',
  children: [{
    name: '优惠券',
    path: 'coupon',
    component: _import('market/coupon/coupon')
  }, {
    name: '优惠券详情',
    path: 'coupon-detail',
    hidden: true,
    component: _import('market/coupon/coupon-detail')
  }]
}]
