/**
 * 营销管理
 */
import { _import } from '../config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '营销管理',
  path: '/market',
  redirect: '/market/banner',
  component: layout,
  icon: 'icon-Site',
  children: [{
    name: '首页banner',
    path: 'banner',
    component: _import('market/banner/list')
  }, {
    name: '',
    path: 'banner/add',
    hidden: true,
    component: _import('market/banner/add')
  },

  // CPASS精选
  {
    name: 'C-PASS精选',
    path: 'c-pass',
    component: _import('market/c-pass/list')
  }, {
    name: '',
    path: 'c-pass/com',
    hidden: true,
    component: _import('market/c-pass/com')
  },

  // 优惠券
  {
    name: '优惠券',
    path: 'coupon',
    component: _import('market/coupon/coupon')
  }, {
    name: '优惠券详情',
    path: 'coupon-detail',
    hidden: true,
    component: _import('market/coupon/coupon-detail')
  }, {
    name: '添加/编辑优惠券',
    path: '/coupon/add',
    hidden: true,
    component: _import('market/coupon/add')
  }, {
    name: '下发优惠券',
    path: '/coupon/issue',
    hidden: true,
    component: _import('market/coupon/manual-issue')
  },

  // 核销管理
  {
    name: '核销管理',
    path: '/write-off',
    redirect: '/write-off/member',
    component: _import('market/write-off/write-off'),
    children: [{
      name: '核销员',
      path: 'member',
      hidden: true,
      component: _import('market/write-off/write-off-member')
    }, {
      name: '核销点',
      path: 'point',
      hidden: true,
      component: _import('market/write-off/write-off-point')
    }, {
      name: '核销记录',
      path: 'record',
      hidden: true,
      component: _import('market/write-off/write-off-record')
    }]
  },

  // 活动添加
  {
    name: '活动列表',
    path: '/activity',
    component: _import('market/activity/list/list')
  },
  {
    name: '添加/编辑/复制活动',
    path: '/activity/add',
    hidden: true,
    component: _import('market/activity/add/add')
  },
  {
    name: '活动详情',
    path: '/activity/detail',
    hidden: true,
    component: _import('market/activity/detail/detail')
  }]
}]
