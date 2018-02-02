/**
 * 客户管理
 */
import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

// 客户列表
export const listClient = (obj) => fetch(API_PATH + '/admin/client/list', obj, 'GET')

// 新增客户基础信息
export const addClient = (obj) => fetch(API_PATH + '/admin/client/add', obj, 'POST')

// 编辑客户基础信息
export const updateClientInfo = (obj) => fetch(API_PATH + '/admin/client/updateClientInfo', obj, 'POST')

// 创建智众账户
export const createAccount = (obj) => fetch(API_PATH + '/admin/client/createAccount', obj, 'POST')

// 设置智众账户状态
export const setAccountStatus = (obj) => fetch(API_PATH + '/admin/client/setAccountStatus', obj, 'POST')

// 编辑智众账户
export const updateAccount = (obj) => fetch(API_PATH + '/admin/client/updateAccount', obj, 'POST')

// 开通微信支付功能
export const bindWeixinPay = (obj) => fetch(API_PATH + '/admin/client/bindWeixinPay', obj, 'POST')

// 编辑微信支付信息
export const updateWeixinPay = (obj) => fetch(API_PATH + '/admin/client/updateWeixinPay', obj, 'POST')

// 设置微信支付状态
export const setWeixinPayStatus = (obj) => fetch(API_PATH + '/admin/client/setWeixinPayStatus', obj, 'POST')

// 客户详情
export const clientDetail = (obj) => fetch(API_PATH + '/admin/client/detail', obj, 'GET')

// 账户信息
export const accountInfo = (obj) => fetch(API_PATH + '/admin/client/accountInfo', obj, 'GET')

// 重置账户
export const resetAccount = (obj) => fetch(API_PATH + '/admin/client/resetAccount', obj, 'POST')

// 重置密码
export const resetPassword = (obj) => fetch(API_PATH + '/admin/client/resetPassword', obj, 'POST')
