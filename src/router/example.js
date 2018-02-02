/**
 * 一些示例页面路由
 */
import { _import } from '@/config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '实例',
  path: '/examples',
  redirect: '/examples/counter',
  component: layout,
  hidden: true,
  children: [
    { name: 'counter', path: '/counter', component: _import('examples/counter').default },
    { name: '图标', path: '/svgs', component: _import('examples/svg-icons/index').default }
  ]
}];
