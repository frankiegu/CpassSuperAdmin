/**
 * 场地管理 配置
 */
import {_import} from '@/config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '场地管理',
  path: '/space',
  redirect: '/space/list',
  component: layout,
  icon: 'icon-Site',
  ajaxPermissions: ['/manage/field/list', '/manage/lockBase/list'], // #@tag 页面级级权限判断demo
  children: [
    // 场地，当没有权限访问的时候，显示为空
    {name: '场地发布管理', path: 'list', component: _import('space/space/list/main'), ajaxPermissions: '/manage/field/list'},
    {name: '查看预约', path: 'detail', component: _import('space/space/detail'), hidden: true},
    {name: '场地草稿箱', path: 'drafts', component: _import('space/space/drafts'), hidden: true},
    {name: '', path: 'add', component: _import('space/space/add/main'), hidden: true},
    // 门禁
    {name: '门禁管理', path: 'access-control', component: _import('space/access-control/index'), ajaxPermissions: '/manage/lockBase/list'},
    {name: '', path: 'access-control/detail', component: _import('space/access-control/detail'), hidden: true},
    {name: '人员维护', path: 'access-control/person', component: _import('space/access-control/person')}
  ]
}]
