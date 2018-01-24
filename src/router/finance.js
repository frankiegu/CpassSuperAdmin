/**
 * 财务管理
 */
import {_import} from '@/config/env'
import layout from '@/views/layout/layout.vue'

// 结算管理
const settlementList = _import('finance/settlement/list')               // 租金结算管理
const settlementDetail = _import('finance/settlement/detail')           // 结算清单明细

// 退款审批
const refundApprovalList = _import('finance/refund-approval/index')     // 退款审批
const refundApprovalDetail = _import('finance/refund-approval/detail')  // 退款审批

export default [{
  name: '财务管理',
  path: '/finance',
  redirect: '/finance/settlement',
  component: layout,
  icon: 'icon-finance',
  ajaxPermissions: ['/manage/companyMonthlyBill/list', '/manage/orderRefund/list'],
  children: [
    // 结算管理
    {name: '租金结算管理', path: 'settlement', component: settlementList, ajaxPermissions: '/manage/companyMonthlyBill/list'},
    {name: '结算清单明细', path: 'settlement/detail', component: settlementDetail, hidden: true},
    {name: '退款审批', path: 'refund-approval', component: refundApprovalList, ajaxPermissions: '/manage/orderRefund/list'},
    {name: '退款详情', path: 'refund-approval/detail', component: refundApprovalDetail, hidden: true}
  ]
}]
