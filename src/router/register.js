/**
 * 登录
 */
import { _import } from '@/config/env'

export default[
  { name: '登录页', path: '/login', component: _import('register/login').default, hidden: true },
  { name: '登出', path: '/logout', component: _import('register/logout').default, hidden: true }
]
