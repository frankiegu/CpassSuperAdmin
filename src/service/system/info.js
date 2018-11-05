/**
 * 用户信息
 */
import fetch from '../../config/fetch'
import { API_PATH } from '../../config/env'

// 重置密码
export const resetByPassword = obj => fetch(API_PATH + '/supervisor/supervisor/resetByPassword', obj, 'GET')

// 编辑个人信息
export const adminUserUpdate = obj => fetch(API_PATH + '/supervisor/supervisor/updateInfo', obj, 'POST')

// 用户是否存在
export const userIsExist = obj => fetch(API_PATH + '/supervisor/supervisor/isExist', obj, 'GET')

// 发送验证码（修改手机号码）
export const sendResetUsernameCode = (dataJson) => fetch(API_PATH + '/supervisor/message/supervisorSendResetUsernameCode', dataJson, 'POST')

// 重置用户名
export const resetUsername = (dataJson) => fetch(API_PATH + '/supervisor/supervisor/resetUsername', dataJson, 'POST')
