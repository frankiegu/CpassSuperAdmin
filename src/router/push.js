/**
 * 推送管理
 */
import {_import} from '@/config/env'
import layout from '@/views/layout/layout.vue'

// 活动管理
const activity = _import('push/activity/index')     // 活动列表
const activityEdit = _import('push/activity/edit')  // 活动新增编辑和详情，状态有：空、有数据、禁用

// 公告管理
const notice = _import('push/notice/index')         // 公告列表
const noticeEdit = _import('push/notice/edit')      // 公告新增编辑和详情

export default [{
  name: '推送管理',
  path: '/push',
  redirect: '/push/activity',
  component: layout,
  icon: 'icon-push',
  ajaxPermissions: ['/manage/activityDetail/listAll', '/manage/notice/list'],
  children: [
    // 活动管理
    {name: '活动管理', path: 'activity', component: activity, ajaxPermissions: '/manage/activityDetail/listAll'},
    {name: '', path: 'activity/edit', component: activityEdit, hidden: true, meta: {dynamicTitle: true}},
    // 公告管理
    {name: '公告管理', path: 'notice', component: notice, ajaxPermissions: '/manage/notice/list'},
    {name: '', path: 'notice/edit', component: noticeEdit, hidden: true, meta: {dynamicTitle: true}} // 设置动态标题，应用在一个页面展示：新增编辑和详情
  ]
}]
