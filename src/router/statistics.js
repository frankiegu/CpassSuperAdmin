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
    // 场地统计
    {
      name: '场地统计 ',
      path: '/site-statistics',
      redirect: '/site-statistics/statistics-site',
      component: _import('statistics/site-statistics/site-statistics'),
      children: [{
        name: '场地统计',
        path: 'statistics-site',
        hidden: true,
        component: _import('statistics/site-statistics/statistics-site')
      }, {
        name: '浏览统计',
        path: 'statistics-browsing',
        hidden: true,
        component: _import('statistics/site-statistics/statistics-browsing')
      }, {
        name: '地区分析',
        path: 'statistics-area',
        hidden: true,
        component: _import('statistics/site-statistics/statistics-area')
      }]
    },

    // C-PASS订单统计
    {
      name: 'C-PASS订单统计',
      path: '/order-statistics',
      redirect: '/order-statistics/statistics-order',
      component: _import('statistics/order-statistics/order-statistics'),
      children: [{
        name: '场地订单统计',
        path: 'statistics-order',
        hidden: true,
        component: _import('statistics/order-statistics/statistics-order')
      }, {
        name: '参观预约统计',
        path: 'statistics-visit',
        hidden: true,
        component: _import('statistics/order-statistics/statistics-visit')
      }]
    },
    {
      name: 'C-PASS订单明细',
      path: 'C-PASS-order',
      hidden: true,
      component: _import('statistics/order-statistics/order-detail')
    },

    // 转发漏斗
    {
      name: '转发漏斗',
      path: 'funnel',
      component: _import('statistics/funnel/index'),
      ajaxPermissions: '/manage/field/listFieldRevenue'
    }
  ]
}]
