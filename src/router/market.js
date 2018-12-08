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
  ajaxPermissions: [
    '/supervisor/indexBanner/list', // 首页banner
    '/supervisor/marketing/list', // CPASS精选
    '/supervisor/platformCoupon/list', // 优惠券
    '/supervisor/platformVerifier/page', // 核销管理 - 核销员
    '/supervisor/platformVerifyStation/page', // 核销管理 - 核销点
    '/supervisor/platformVerifyRecord/page', // 核销管理 - 核销记录
    '/supervisor/platformActivity/list' // 活动列表
  ],
  children: [{
    name: '首页banner',
    path: 'banner',
    component: _import('market/banner/list'),
    ajaxPermissions: '/supervisor/indexBanner/list'
  }, {
    name: '',
    path: 'banner/add',
    hidden: true,
    component: _import('market/banner/add')
  },

  // CPASS精选
  {
    name: 'CPASS精选',
    path: 'c-pass',
    component: _import('market/c-pass/list'),
    ajaxPermissions: '/supervisor/marketing/list'
  }, {
    name: '',
    path: 'c-pass/com',
    hidden: true,
    component: _import('market/c-pass/com/index')
  },

  // 优惠券
  {
    name: '优惠券',
    path: 'coupon',
    component: _import('market/coupon/coupon'),
    ajaxPermissions: '/supervisor/platformCoupon/list'
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
    ajaxPermissions: [
      '/supervisor/platformVerifier/page', // 核销管理 - 核销员
      '/supervisor/platformVerifyStation/page', // 核销管理 - 核销点
      '/supervisor/platformVerifyRecord/page' // 核销管理 - 核销记录
    ],
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
    component: _import('market/activity/list/list'),
    ajaxPermissions: '/supervisor/platformActivity/list'
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
  },

  // 邀请活动列表
  {
    name: '邀请活动列表',
    path: '/activityInvite',
    component: _import('market/activity-invite/list/list'),
    ajaxPermissions: '/supervisor/platformActivity/list'
  },
  {
    name: '添加/编辑邀请活动',
    path: '/activityInvite/add',
    hidden: true,
    component: _import('market/activity-invite/add/add')
  },
  {
    name: '邀请人员列表',
    path: '/activityInvite/users',
    hidden: true,
    component: _import('market/activity-invite/users/users')
  }]
}]
