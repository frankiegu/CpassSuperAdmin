/**
 * 用户管理
 */

import fetch from '../../config/fetch'
import { API_PATH } from '../../config/env'

// 角色列表
export const getRoleList = obj => fetch(API_PATH + '/supervisor/supervisor/roleList', obj, 'GET')

// 用户列表
export const getUserList = obj => fetch(API_PATH + '/supervisor/supervisor/page', obj, 'GET')

// 新增用户
export const createUser = obj => fetch(API_PATH + '/supervisor/supervisor/add', obj, 'POST')

// 编辑用户
export const updateUser = obj => fetch(API_PATH + '/supervisor/supervisor/update', obj, 'POST')

// 禁用用户
export const closeUser = obj => fetch(API_PATH + '/supervisor/supervisor/close', obj, 'POST')

// 恢复用户
export const openUser = obj => fetch(API_PATH + '/supervisor/supervisor/open', obj, 'POST')

// 删除用户
export const deleteUser = obj => fetch(API_PATH + '/supervisor/supervisor/delete', obj, 'POST')
