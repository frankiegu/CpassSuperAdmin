/**
 * 客户管理
 */
import fetch from '../config/fetch'
import {API_PATH} from '../config/env'

// 新增客户
export const addClient = (obj) => fetch(API_PATH + '/admin/client/add', obj, 'POST')
