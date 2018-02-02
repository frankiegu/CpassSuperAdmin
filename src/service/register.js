// 登录
import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

// 登陆
export const supervisorLogin = (ajaxParams) => fetch(API_PATH + '/supervisor/supervisor/login', ajaxParams, 'POST')
