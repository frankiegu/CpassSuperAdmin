/**
 * 角色管理
 */
import fetch from '../../config/fetch'
import { API_PATH } from '../../config/env'

// 角色列表
export const roleList = (obj) => fetch(API_PATH + '/supervisor/role/list', obj, 'GET')

// 新增角色
export const roleAdd = (obj) => fetch(API_PATH + '/supervisor/role/add', obj, 'POST')

// 编辑角色
export const roleUpdate = (obj) => fetch(API_PATH + '/supervisor/role/update', obj, 'POST')

// 角色明细
export const getRoleDetail = (obj) => fetch(API_PATH + '/supervisor/role/getRoleDetail', obj, 'GET')

// 禁用角色
export const closeRole = (obj) => fetch(API_PATH + '/supervisor/role/close', obj, 'GET')

// 启用角色
export const openRole = (obj) => fetch(API_PATH + '/supervisor/role/open', obj, 'GET')

// 删除角色
export const deleteRole = (obj) => fetch(API_PATH + '/supervisor/role/delete', obj, 'POST')
