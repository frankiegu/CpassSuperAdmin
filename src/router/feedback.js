/**
 * 反馈
 */
import { _import } from '../config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '反馈',
  path: '/feedback',
  redirect: '/feedback/opinion-feedback',
  component: layout,
  hidden: false,
  icon: 'icon-peer_surface',
  children: [
    // 意见反馈
    {
      name: '意见反馈',
      path: '/opinion-feedback',
      redirect: '/opinion-feedback/manage-feedback',
      component: _import('feedback/opinion-feedback/opinion-feedback'),
      children: [{
        name: '管理后台',
        path: 'manage-feedback',
        hidden: true,
        component: _import('feedback/opinion-feedback/manage-feedback')
      }, {
        name: 'CPASS',
        path: 'cpass-feedback',
        hidden: true,
        component: _import('feedback/opinion-feedback/cpass-feedback')
      }]
    }
  ]
}]

