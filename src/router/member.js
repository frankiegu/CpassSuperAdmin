/**
 * 会员管理
 */
import { _import } from '../config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '会员管理',
  path: '/member',
  redirect: '/member/list',
  component: layout,
  icon: 'icon-viip',
  ajaxPermissions: ['/supervisor/appCustomer/list', '/supervisor/customer/list'],
  children: [{
    name: '会员列表',
    path: 'list',
    redirect: '/member/list/app-list',
    component: _import('member/main'),
    children: [{
      name: 'CPASS会员列表',
      path: 'app-list',
      hidden: true,
      component: _import('member/app-list')
    }, {
      name: 'CPASS会员详情',
      path: 'app-detail',
      hidden: true,
      component: _import('member/app-detail')
    }, {
      name: '小程序会员列表',
      path: 'wechat-list',
      hidden: true,
      component: _import('member/list')
    }]
  }]
}]
