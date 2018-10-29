/**
 * 操作记录
 */
import { _import } from '../config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '操作记录查询',
  path: '/action-log',
  redirect: '/action-log/list',
  component: layout,
  noDropdown: true,
  icon: 'icon-order',
  ajaxPermissions: ['/supervisor/operationLog/listLogModule', '/supervisor/operationLog/list'],
  children: [{
    name: '操作记录',
    path: 'list',
    component: _import('action-log/index'),
    ajaxPermissions: ['/supervisor/operationLog/listLogModule', '/supervisor/operationLog/list']
  }]
}]
