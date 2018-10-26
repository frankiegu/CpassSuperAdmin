/**
 * 用户信息
 */
import fetch from '../../config/fetch'
import { API_PATH } from '../../config/env'

// 重置密码
export const resetByPassword = obj => fetch(API_PATH + '/supervisor/supervisor/resetByPassword', obj, 'GET')

// 编辑个人信息
export const adminUserUpdate = obj => fetch(API_PATH + '/supervisor/supervisor/updateInfo', obj, 'POST')
