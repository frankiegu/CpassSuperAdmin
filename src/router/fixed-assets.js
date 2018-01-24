/**
 * 固资管理
 */
import {_import} from '@/config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '固资管理',
  path: '/fixed',
  redirect: '/fixed/assets',
  component: layout,
  icon: 'icon-asset_management',
  ajaxPermissions: ['/manage/fixAssert/list'],
  children: [
    // 固资管理
    {name: '固资列表', path: 'assets', component: _import('fixed-assets/assets/list'), ajaxPermissions: '/manage/fixAssert/list'},
    {name: '', path: 'assets/detail', component: _import('fixed-assets/assets/detail'), hidden: true},
    {name: '登记固资', path: 'assets/register', component: _import('fixed-assets/assets/register'), hidden: true}
  ]
}]
