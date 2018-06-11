/**
 * 统计
 */
import { _import } from '@/config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '统计',
  path: '/statistics',
  redirect: '/statistics/funnel',
  component: layout,
  icon: 'icon-order',
  children: [
    // 转发漏斗
    {
      name: '转发漏斗',
      path: 'funnel',
      component: _import('statistics/funnel/index'),
      ajaxPermissions: '/manage/field/listFieldRevenue'
    }
  ]
}]
