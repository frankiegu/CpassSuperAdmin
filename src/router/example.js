/**
 * 一些示例页面路由
 */
import { _import } from '@/config/env'
import layout from '@/views/layout/layout.vue'

export default [{
  name: '小部件',
  path: '/examples',
  redirect: '/examples/counter',
  icon: 'icon-Set',
  component: layout,
  hidden: process.env.NODE_ENV,
  children: [
    { name: 'counter', path: 'counter', component: _import('examples/counter') },
    { name: '图标', path: 'svgs', component: _import('examples/svg-icons/index') }
  ]
}];
