// 个人信息
import fetch from '@/config/fetch'
import { API_PATH } from '@/config/env'

// 客户列表
export const clientList = (obj) => fetch(API_PATH + '/supervisor/client/list', obj, 'GET')
