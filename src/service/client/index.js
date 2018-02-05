// 个人信息
import fetch from '@/config/fetch'
import { API_PATH } from '@/config/env'

// 客户列表
export const clientList = (obj) => fetch(API_PATH + '/supervisor/client/list', obj, 'GET')

// 账户信息
export const accountInfo = (obj) => fetch(API_PATH + '/supervisor/client/accountInfo', obj, 'GET')

// 重置账户
export const clientResetAccount = (obj) => fetch(API_PATH + '/supervisor/client/resetAccount', obj, 'GET')

// 重置密码
export const clientResetPassword = (obj) => fetch(API_PATH + '/supervisor/client/resetPassword', obj, 'GET')
