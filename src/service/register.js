// 登录
import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

// 登陆
export const supervisorLogin = (ajaxParams) => fetch(API_PATH + '/supervisor/supervisor/login', ajaxParams, 'POST')

// 重置密码(首次登录)
export const firstLoginResetPassword = (ajaxParams) => fetch(API_PATH + '/supervisor/supervisor/resetPassword', ajaxParams, 'POST')

