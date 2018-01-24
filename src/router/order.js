/**
 * 订单管理
 */
import {_import} from '@/config/env'
import layout from '@/views/layout/layout.vue'

// 场地预约订单
const bookingOrderList = _import('order/booking/list')      // 订单列表
const bookingOrderDetail = _import('order/booking/detail')  // 订单详情

// 服务订单
const serviceOrderList = _import('order/service/list')      // 服务订单列表
const serviceOrderDetail = _import('order/service/detail')  // 服务订单详情

// 入驻申请
const settledOrderList = _import('order/settled/list')      // 入驻申请列表
const settledOrderDetail = _import('order/settled/detail')  // 入驻申请审批

// 预约参观
const bookingVisitList = _import('order/visit/list')        // 查看预约
const bookingVisitDetail = _import('order/visit/detail')    // 查看预约

// 报障订单
const warningOrder = _import('order/warning/list')
export default [{
  name: '订单管理',
  path: '/order',
  redirect: '/order/booking',
  component: layout,
  icon: 'icon-order',
  ajaxPermissions: [
    '/manage/order/orderList',
    '/manage/valueAddServiceOrder/listOrder',
    '/manage/enter/list',
    '/manage/visitReservation/listVisitReservation',
    '/manage/repair/list'
  ],
  children: [
    // 场地预约订单
    {name: '场地预约', path: 'booking', component: bookingOrderList, ajaxPermissions: '/manage/order/orderList'},
    {name: '场地预约订单详情', path: 'booking/detail', component: bookingOrderDetail, hidden: true},
    // 增值服务订单
    {name: '增值服务', path: 'service/list', component: serviceOrderList, ajaxPermissions: '/manage/valueAddServiceOrder/listOrder'},
    {name: '增值服务详情', path: 'service/detail', component: serviceOrderDetail, hidden: true},
    // 入驻申请
    {name: '入驻申请', path: 'settled', component: settledOrderList, ajaxPermissions: '/manage/enter/list'},
    {name: '入驻审批', path: 'settled/detail', component: settledOrderDetail, hidden: true},
    // 参观申请
    {name: '参观预约', path: 'visit', component: bookingVisitList, ajaxPermissions: '/manage/visitReservation/listVisitReservation'},
    {name: '参观预约详情', path: 'visit/detail', component: bookingVisitDetail, hidden: true},
    // 报修订单
    {name: '故障报修', path: 'warning', component: warningOrder, ajaxPermissions: '/manage/repair/list'}
  ]
}]
