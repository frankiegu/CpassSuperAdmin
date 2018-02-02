/**
 * 客户管理
 */
import { _import } from '../config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '客户管理',
  path: '/client',
  redirect: '/client/list',
  component: layout,
  noDropdown: true,
  icon: 'icon-viip',
  children: [{
    name: '客户列表',
    path: 'list',
    component: _import('client/index').default,
    hidden: true
  }, {
    name: '',
    path: 'add',
    component: _import('client/add').default,
    hidden: true,
    meta: {
      level2: true
    }
  }, {
    name: '修改客户资料',
    path: 'modify',
    component: _import('client/modify').default,
    hidden: true,
    meta: {
      level2: true
    }
  }, {
    name: '客户详情',
    path: 'detail',
    component: _import('client/client-detail').default,
    hidden: true,
    meta: {
      level2: true
    }
  }, {
    name: '账户信息',
    path: 'account',
    component: _import('client/account').default,
    hidden: true,
    meta: {
      // 是否是二级页包括 3级 等
      level2: true,
      // title 是否显示下载 pdf 按钮
      pdf: true
    }
  }]
}]
