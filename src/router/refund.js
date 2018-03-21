/**
 * 财务
 */
import { _import } from '../config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '财务',
  path: '/refund',
  redirect: '/refund/list',
  component: layout,
  icon: 'icon-viip',
  children: [
    {
      name: '退款审批',
      path: 'list',
      component: _import('refund/list')
    }, {
      name: '退款详情',
      path: 'detail',
      hidden: true,
      component: _import('refund/detail')
    }
  ]
}]
