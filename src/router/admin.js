/**
 * 个人、空间信息
 */
import {_import} from '@/config/env'
import layout from '@/views/layout/layout.vue'

const personalInfo = _import('admin/personal-info')  // 个人信息设置
const spatialInfo = _import('admin/spatial-info')    // 空间信息设置

export default [{
  name: '当前用户',
  path: '/admin',
  redirect: '/personal-info',
  component: layout,
  hidden: true,
  children: [
    {name: '个人信息管理', path: '/personal-info', component: personalInfo},
    {name: '空间信息管理', path: '/spatial-info', component: spatialInfo}
  ]
}]
