/**
 * 企业信息管理、会员信息管理 路由配置
 */
import {_import} from '@/config/env'
import layout from '@/views/layout/layout.vue'

// 企业
const enterpriseList = _import('member/enterprise/list')              // 企业信息管理
const enterpriseDetail = _import('member/enterprise/detail')          // 企业详情
const enterpriseBatch = _import('member/enterprise/batch-import')     // 批量上传

// 会员
const membersInfo = _import('member/member/list')                     // 会员信息管理
const membersCreditSet = _import('member/member/credit-set')          // 信用值登记

// 信用值设置
const creditList = _import('member/credit/index')                     // 信用值设置

export default [{
  name: '会员管理',
  path: '/member',
  redirect: '/member/enterprise',
  component: layout,
  icon: 'icon-viip',
  ajaxPermissions: ['/manage/company/list', '/manage/user/list', '/manage/creditRule/listDetail'],
  children: [
    // 企业
    {name: '入驻企业', path: 'enterprise', component: enterpriseList, ajaxPermissions: '/manage/company/list'},
    {name: '', path: 'enterprise/detail', component: enterpriseDetail, hidden: true},
    {name: '批量上传', path: 'enterprise/batch-import', component: enterpriseBatch, hidden: true},
    // 会员信息管理
    {name: '会员信息', path: 'list', component: membersInfo, ajaxPermissions: '/manage/user/list'},
    {name: '信用值登记', path: 'credit-set', component: membersCreditSet, hidden: true},
    {name: '会员信息详情', path: 'com', component: _import('member/member/com')},
    // 信用值设置
    {name: '信用值设置', path: 'credit', component: creditList, ajaxPermissions: '/manage/creditRule/listDetail'}
  ]
}]
