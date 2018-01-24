/**
 * 营销管理-优惠劵-积分规则 配置
 */
import {_import} from '@/config/env'
import layout from '@/views/layout/layout.vue'

// 优惠劵管理
const couponList = _import('market/coupon/list')                  // 优惠劵管理
const couponDetail = _import('market/coupon/detail')              // 优惠劵详情
const couponAdd = _import('market/coupon/add')                    // 新增优惠劵

// 积分规则管理
const integralList = _import('market/integral/list')              // 积分规则管理
const integralDetail = _import('market/integral/detail')          // 积分规则详情
const integralAdd = _import('market/integral/add')                // 新增积分规则
const integralRecharge = _import('market/integral/recharge')      // 积分充值

export default [{
  name: '营销管理',
  path: '/market',
  redirect: '/market/integral/list',
  component: layout,
  icon: 'icon-Marketing',
  ajaxPermissions: ['/manage/grantPointRule/list', '/manage/coupon/list'],
  children: [
    // 积分规则模块
    {name: '积分规则管理', path: 'integral/list', component: integralList, ajaxPermissions: '/manage/grantPointRule/list'},
    {name: '', path: 'integral/detail', component: integralDetail, hidden: true},
    {name: '新增积分规则', path: 'integral/add', component: integralAdd, hidden: true},
    {name: '积分充值', path: 'integral/recharge', component: integralRecharge, hidden: true},
    // 优惠劵模块
    {name: '优惠劵管理', path: 'coupon/list', component: couponList, ajaxPermissions: '/manage/coupon/list'},
    {name: '优惠劵详情', path: 'coupon/detail', component: couponDetail, hidden: true},
    {name: '新增优惠劵', path: 'coupon/add', component: couponAdd, hidden: true}
  ]
}]
