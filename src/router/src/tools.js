/**
 * 工具
 */
import {_import} from '@/config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '写个工具',
  path: '/tools',
  redirect: '/fixed/json',
  component: layout,
  ajaxPermissions: [''],
  children: [
    {name: '替换双引号', path: 'json', component: _import('examples/tools/format-json')}
  ]
}]
