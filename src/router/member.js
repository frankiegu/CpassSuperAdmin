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
  children: [{
    name: '会员列表',
    path: 'list',
    component: _import('member/list')
  }, {
    name: '会员详情',
    path: 'detail',
    hidden: true,
    component: _import('member/detail')
  }]
}]
