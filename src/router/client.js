/**
 * 客户管理
 */
import { _import } from '../config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '商户管理',
  path: '/client',
  redirect: '/client/list',
  component: layout,
  noDropdown: false,
  icon: 'icon-kehu',
  ajaxPermissions: ['/supervisor/client/list', '/supervisor/storeStar/storeList', '/supervisor/regionInfo/page'],
  children: [{
    name: '商户列表',
    path: 'list',
    component: _import('client/merchant/index')
    ajaxPermissions: '/supervisor/client/list'
  }, {
    name: '',
    path: 'add',
    component: _import('client/merchant/add/index'),
    hidden: true,
    meta: { title: '', level2: true }
  }, {
    name: '修改商户资料',
    path: 'modify',
    component: _import('client/merchant/edit/index'),
    hidden: true,
    meta: { level2: true }
  }, {
    name: '商户详情',
    path: 'detail',
    component: _import('client/merchant/detail/index'),
    hidden: true,
    meta: { level2: true }
  }, {
    name: '账户信息',
    path: 'account',
    component: _import('client/merchant/account/index'),
    hidden: true,
    meta: {
      // 是否是二级页包括 3级 等
      level2: true,
      // title 是否显示下载 pdf 按钮
      pdf: true
    }
  },

  // 空间列表
  {
    name: '空间列表',
    path: 'space',
    component: _import('client/space/index'),
    meta: { level2: true },
    ajaxPermissions: '/supervisor/storeStar/storeList'
  },

  // 城市维护
  {
    name: '城市维护',
    path: 'city',
    component: _import('client/city-maintain/index'),
    meta: { level2: true },
    ajaxPermissions: '/supervisor/regionInfo/page'
  }]
}]
