/**
 * 企业信息管理、会员信息管理 路由配置
 */
import {_import} from '@/config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '空间管家',
  path: '/housekeeper',
  redirect: '/housekeeper/space',
  component: layout,
  icon: 'icon-space',
  ajaxPermissions: ['/manage/spaceKeeperOrder/listOrderStat', '/manage/spaceKeeperOrder/list'],
  children: [
    // 空间管家
    {name: '空间管家 ', path: 'space', component: _import('housekeeper/space/list'), ajaxPermissions: '/manage/spaceKeeperOrder/listOrderStat'},
    // 管家工单
    {name: '管家工单', path: 'order', component: _import('housekeeper/order/list'), ajaxPermissions: '/manage/spaceKeeperOrder/list'},
    {name: '工单详情', path: 'order/detail', component: _import('housekeeper/order/detail')}
  ]
}]
