/**
 * 权限资源管理
 */
import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

// 权限模块列表
export const listPermisModule = obj => fetch(API_PATH + '/supervisor/resource/listPermisModule', obj, 'GET')

// 权限以及对应的资源列表
export const getPermisList = obj => fetch(API_PATH + '/supervisor/permis/list', obj, 'GET')

// 获取资源
export const getResourceList = obj => fetch(API_PATH + '/supervisor/resource/list', obj, 'GET')

// 新增权限模块
export const addPermisModule = obj => fetch(API_PATH + '/supervisor/resource/addPermisModule', obj, 'POST')

// 删除权限模块
export const deletePermisModule = obj => fetch(API_PATH + '/supervisor/resource/deletePermisModule', obj, 'GET')

// 修改权限模块
export const updatePermisModule = obj => fetch(API_PATH + '/supervisor/resource/updatePermisModule', obj, 'POST')

// 更新权限资源对应关系
export const updatePermisResource = obj => fetch(API_PATH + '/supervisor/resource/updatePermisResource', obj, 'POST')

// 新增顶级权限
export const addTopLevelPermis = obj => fetch(API_PATH + '/supervisor/resource/addTopLevelPermis', obj, 'POST')

// 新增权限
export const addPermis = obj => fetch(API_PATH + '/supervisor/resource/addPermis', obj, 'POST')

// 删除权限
export const deletePermis = obj => fetch(API_PATH + '/supervisor/resource/deletePermis', obj, 'GET')

// 更新权限
export const updatePermis = obj => fetch(API_PATH + '/supervisor/resource/updatePermis', obj, 'POST')
