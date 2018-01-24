/**
 * 系统配置
 */
import {_import} from '@/config/env'
import layout from '@/views/layout/layout.vue'

// 操作日志
const logIndex = _import('system/log/index')                // 操作日志

// 参数配置
const parameterIndex = _import('system/parameter/index')    // 参数配置

// 开发者权限资源管理
const sourceIndex = _import('system/resource/index')

export default [{
  name: '系统配置',
  path: '/system',
  redirect: '/system/log',
  component: layout,
  icon: 'icon-Set',
  ajaxPermissions: ['/manage/operationLog/list', '/manage/configSetting/getConfig'],
  children: [
    // 操作日志
    {name: '操作日志', path: 'log', component: logIndex, ajaxPermissions: '/manage/operationLog/list'},
    // 参数配置
    {
      name: '参数配置',
      path: 'parameter',
      component: parameterIndex,
      meta: {dynamicTitle: true}, // 设置动态标题，应用在一个页面展示：新增编辑和详情
      ajaxPermissions: '/manage/configSetting/getConfig'
    },
    // 开发者权限资源管理（只限开发人员使用, 不对客户开放）
    {name: '开发者权限资源管理', path: 'resource', component: sourceIndex, hidden: true}
  ]
}]
