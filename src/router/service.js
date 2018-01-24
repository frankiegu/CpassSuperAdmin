/**
 * 服务管理
 */
import {_import} from '@/config/env'
import layout from '@/views/layout/layout.vue'

// 增值服务管理
// const activity = _import('push/activity/index')                    // 增值服务管理

// 供应商管理
const serviceOrderList = _import('service/supplier-manage/list')      // 供应商管理列表
const serviceOrderDetail = _import('service/supplier-manage/detail')  // 供应商管理详情

export default [{
  name: '服务管理',
  path: '/service',
  redirect: '/service/supplier',
  component: layout,
  icon: 'icon-service',
  ajaxPermissions: ['/manage/valueAddServiceProvider/list'],
  children: [
    // 增值服务管理
    // {name: '增值服务管理', path: 'activity', component: activity},
    // 供应商管理
    {name: '供应商管理', path: 'supplier', component: serviceOrderList, ajaxPermissions: '/manage/valueAddServiceProvider/list'},
    // 路由名不要改，文件上有有引用会报错
    {name: '', path: 'supplier-manage/detail', component: serviceOrderDetail, hidden: true}
  ]
}]
