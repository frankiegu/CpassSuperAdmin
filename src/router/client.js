/**
 * 客户管理
 */
import {_import} from '../config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '客户管理',
  path: '/client',
  redirect: '/client/list',
  component: layout,
  noDropdown: true,
  icon: 'icon-viip',
  children: [
    {name: '客户列表', path: 'list', component: _import('client/index'), hidden: true},
    {name: '', path: 'add', component: _import('client/add'), hidden: true, meta: {level2: true}},
    {name: '客户详情', path: 'detail', component: _import('client/client-detail'), hidden: true, meta: {level2: true}},
    {name: '账户信息', path: 'account', component: _import('client/account'), hidden: true, meta: {level2: true}}
  ]
}]
