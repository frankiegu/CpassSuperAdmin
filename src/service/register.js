// 登录
import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

// 登陆
export const login = (dataJson) => fetch(API_PATH + '/manage/adminUser/login', dataJson, 'POST')

// 登出
export const logout = (dataJson) => fetch(API_PATH + '/manage/adminUser/logout', dataJson, 'POST')
