// 注册登录
import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

// 登陆
export const login = (dataJson) => fetch(API_PATH + '/manage/adminUser/login', dataJson, 'POST')

// 登出
export const logout = (dataJson) => fetch(API_PATH + '/manage/adminUser/logout', dataJson, 'POST')

// 发送验证码（重置密码）
export const sendResetPasswordCode = (dataJson) => fetch(API_PATH + '/manage/message/sendResetPasswordCode', dataJson, 'POST')

// 重置密码（验证码）
export const resetByVerifyCode = (dataJson) => fetch(API_PATH + '/manage/adminUser/resetByVerifyCode', dataJson, 'POST')

// 发送验证码（修改手机号码）
export const sendResetUsernameCode = (dataJson) => fetch(API_PATH + '/manage/message/sendResetUsernameCode', dataJson, 'GET')

// 用户是否存在
export const userIsExist = (dataJson) => fetch(API_PATH + '/manage/adminUser/isExist', dataJson, 'POST')

// 用户是否存在
export const ResetUsername = (dataJson) => fetch(API_PATH + '/manage/adminUser/resetUsername', dataJson, 'POST')
