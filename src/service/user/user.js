/**
 * 用户管理
 */
import fetch from '../../config/fetch'
import { API_PATH } from '../../config/env'

// 用户列表
export const getUserList = obj => fetch(API_PATH + '/supervisor/supervisor/page', obj, 'GET')

// 新增用户
// export const userAdd = obj => fetch(API_PATH + '/supervisor/supervisor/add', obj, 'POST')

// 编辑用户
// export const userUpdate = obj => fetch(API_PATH + '/supervisor/supervisor/update', obj, 'POST')

// 用户明细
// export const getuserDetail = obj => fetch(API_PATH + '/supervisor/supervisor/getuserDetail', obj, 'GET')

// 禁用用户
export const closeUser = obj => fetch(API_PATH + '/supervisor/supervisor/close', obj, 'POST')

// 启用用户
export const openUser = obj => fetch(API_PATH + '/supervisor/supervisor/open', obj, 'POST')

// 删除用户
export const deleteUser = obj => fetch(API_PATH + '/supervisor/supervisor/delete', obj, 'POST')
