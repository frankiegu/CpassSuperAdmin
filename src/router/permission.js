/**
 * 权限管理
 */
import {_import} from '@/config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '权限管理',
  path: '/permission',
  redirect: '/permission/duty',
  component: layout,
  icon: 'icon-purview',
  ajaxPermissions: ['/manage/role/list', '/manage/adminUser/page'],
  children: [
    {
      name: '职务权限',
      path: 'duty',
      component: _import('permission/duty/index'),
      ajaxPermissions: ('/manage/role/list')
    }, {
      name: '',
      path: 'duty/add',
      component: _import('permission/duty/add')
    }, {
      name: '账号管理',
      path: 'account',
      component: _import('permission/account/index'),
      ajaxPermissions: ('/manage/adminUser/page')
    }
  ]
}]
