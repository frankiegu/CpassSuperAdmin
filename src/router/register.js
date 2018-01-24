/**
 * 注册、找回密码、设置密码
 */
import { _import } from '@/config/env'

const login = _import('register/login')                       // 登录页
const backPwd = _import('register/back-pwd')                  // 找回密码

const spacePreview = _import('register/space-preview/index')  // 预览场地

export default[
  {name: '登录页', path: '/login', component: login, hidden: true},
  {name: '找回密码', path: '/back-pwd', component: backPwd, hidden: true},
  {name: '预览场地', path: '/space-preview', component: spacePreview, hidden: true}
]
