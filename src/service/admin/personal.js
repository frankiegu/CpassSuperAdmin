// 个人信息
import fetch from '@/config/fetch'
import {API_PATH} from '@/config/env'

// 获取个人信息
export const adminUserInfo = (ajaxParams) => fetch(API_PATH + '/manage/adminUser/info', ajaxParams, 'GET')

// 修改姓名
export const updateName = (ajaxParams) => fetch(API_PATH + '/manage/adminUser/updateName', ajaxParams, 'POST')

// 重置密码（密码）
export const resetByPassword = (ajaxParams) => fetch(API_PATH + '/manage/adminUser/resetByPassword', ajaxParams, 'POST')

// 修改手机号码
export const resetUsername = (ajaxParams) => fetch(API_PATH + '/manage/adminUser/resetUsername', ajaxParams, 'POST')

// 获取secret
export const generateSecret = (ajaxParams) => fetch(API_PATH + '/manage/adminUser/generateSecret', ajaxParams, 'POST')

// 发送验证码（修改手机号码）
export const sendResetUsernameCode = (dataJson) => fetch(API_PATH + '/manage/message/sendResetUsernameCode', dataJson, 'GET')

// 用户是否存在
export const userIsExist = (dataJson) => fetch(API_PATH + '/manage/adminUser/isExist', dataJson, 'POST')
