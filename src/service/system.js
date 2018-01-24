// 系统配置
import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

/**
 * 操作日志
 * ------------------------------------------------------
 */
// 获取所有日志模块
export const listLogModule = (obj) => fetch(API_PATH + '/manage/operationLog/listLogModule', obj, 'GET')

// 操作日志列表
export const logList = (obj) => fetch(API_PATH + '/manage/operationLog/list', obj, 'GET')

/**
 * 参数配置
 * ------------------------------------------------------
 */

// 查询参数配置
export const getConfig = (obj) => fetch(API_PATH + '/manage/configSetting/getConfig', obj, 'GET')

// 修改参数配置
export const updateConfig = (obj) => fetch(API_PATH + '/manage/configSetting/updateConfig', obj, 'POST')

// 录入设备-门店列表
export const listEquipment = (obj) => fetch(API_PATH + '/manage/lockBase/listMainEquipment', obj, 'POST')

// 根据门店显示门禁列表
export const listLockByStore = (obj) => fetch(API_PATH + '/manage/lockBase/listLockByStore', obj, 'GET')

// 设置门店的录入设备
export const setMainEquipment = (obj) => fetch(API_PATH + '/manage/lockBase/setMainEquipment', obj, 'POST')

/**
 * 开发者权限资源管理
 * ------------------------------------------------------
 */
// 获取资源
export const getResourceList = (obj) => fetch(API_PATH + '/manage/resource/list', obj, 'GET')

// 权限以及对应的资源列表
export const getPermisList = (obj) => fetch(API_PATH + '/manage/permis/list', obj, 'GET')

// 更新权限资源对应关系
export const updatePermisResource = (obj) => fetch(API_PATH + '/manage/resource/updatePermisResource', obj, 'GET')

// 权限模块列表
export const listPermisModule = (obj) => fetch(API_PATH + '/manage/resource/listPermisModule', obj, 'GET')

// 新增权限模块
export const addPermisModule = (obj) => fetch(API_PATH + '/manage/resource/addPermisModule', obj, 'GET')

// 修改权限模块
export const updatePermisModule = (obj) => fetch(API_PATH + '/manage/resource/updatePermisModule', obj, 'GET')

// 删除权限模块
export const deletePermisModule = (obj) => fetch(API_PATH + '/manage/resource/deletePermisModule', obj, 'GET')

// 新增顶级权限
export const addTopLevelPermis = (obj) => fetch(API_PATH + '/manage/resource/addTopLevelPermis', obj, 'GET')

// 新增权限
export const addPermis = (obj) => fetch(API_PATH + '/manage/resource/addPermis', obj, 'GET')

// 删除权限
export const deletePermis = (obj) => fetch(API_PATH + '/manage/resource/deletePermis', obj, 'GET')

// 更新权限
export const updatePermis = (obj) => fetch(API_PATH + '/manage/resource/updatePermis', obj, 'GET')
