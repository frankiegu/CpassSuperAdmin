// 权限管理
import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

/**
 * 职务管理
 * ------------------------------------------------------
 */
// 职务的用户总列表
export const listRole = (ajaxParameters) => fetch(API_PATH + '/manage/adminUser/listNoSuper', ajaxParameters, 'POST')

// 获取没有分配职务的用户
export const listNoRole = (ajaxParameters) => fetch(API_PATH + '/manage/adminUser/listNoRole', ajaxParameters, 'POST')

// 获取已分配职务的用户
export const listHasRole = (ajaxParameters) => fetch(API_PATH + '/manage/adminUser/listHasRole', ajaxParameters, 'POST')

// 删除职务
export const roleDelete = (ajaxParameters) => fetch(API_PATH + '/manage/role/delete', ajaxParameters, 'POST')

// 关闭职务
export const roleClose = (ajaxParameters) => fetch(API_PATH + '/manage/role/close', ajaxParameters, 'GET')

// 开启职务
export const roleOpen = (ajaxParameters) => fetch(API_PATH + '/manage/role/open', ajaxParameters, 'GET')

// 职务列表
export const roleList = (ajaxParameters) => fetch(API_PATH + '/manage/role/list', ajaxParameters, 'GET')

// 职务管理人员
export const manageUser = (ajaxParameters) => fetch(API_PATH + '/manage/role/manageUser', ajaxParameters, 'POST')

// 查询职务下的人员
export const getAdminUserByRole = (ajaxParameters) => fetch(API_PATH + '/manage/role/getAdminUserByRole', ajaxParameters, 'GET')

// 新增或修改职务
export const addOrUpdate = (ajaxParameters) => fetch(API_PATH + '/manage/role/addOrUpdate', ajaxParameters, 'POST')

// 职务明细
export const getRoleDetail = (ajaxParameters) => fetch(API_PATH + '/manage/role/getRoleDetail', ajaxParameters, 'GET')

/**
 * 账号管理
 * ------------------------------------------------------
 */

// 新增用户和编辑用户
export const ADD_EDIT_USER = (obj) => fetch(API_PATH + '/manage/adminUser/addOrUpdate', obj, 'POST')

// 用户校验ajax接口
export const USER_CHECK = (obj) => fetch(API_PATH + '/manage/adminUser/check', obj, 'POST')

// 获取用户信息
export const USER_INFO = (obj) => fetch(API_PATH + '/manage/adminUser/getAdminUserInfo', obj, 'POST')

// 管理员账户列表
export const ACCOUNT_USER_LIST = (obj) => fetch(API_PATH + '/manage/adminUser/page', obj, 'POST')

// 删除用户
export const DEL_ACCOUNT_USER = (obj) => fetch(API_PATH + '/manage/adminUser/delete', obj, 'POST')

// 分配职务
export const DISTRIBUTE_ROLE = (obj) => fetch(API_PATH + '/manage/adminUser/distributeRole', obj, 'POST')

// 停用管理员账号
export const ACCOUNT_CLOSE = (obj) => fetch(API_PATH + '/manage/adminUser/close', obj, 'POST')

// 开启管理员账号
export const ACCOUNT_OPEN = (obj) => fetch(API_PATH + '/manage/adminUser/open', obj, 'POST')
