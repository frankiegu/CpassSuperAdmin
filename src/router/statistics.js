/**
 * 数据统计
 */
import {_import} from '@/config/env'
import layout from '@/views/layout/layout.vue'

// 场地营收统计
const siteRevenue = _import('statistics/site-revenue/index')

export default [{
  name: '数据统计',
  path: '/statistics',
  redirect: '/statistics/site-revenue',
  component: layout,
  icon: 'icon-Statistics',
  ajaxPermissions: ['/manage/field/listFieldRevenue'],
  children: [
    // 场地营收统计
    {name: '场地营收统计', path: 'site-revenue', component: siteRevenue, ajaxPermissions: '/manage/field/listFieldRevenue'}
  ]
}]
