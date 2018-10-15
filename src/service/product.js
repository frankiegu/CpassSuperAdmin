// 职务管理
import fetch from '@/config/fetch'
import { API_PATH } from '@/config/env'

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

// 新增职务
export const roleAdd = (ajaxParameters) => fetch(API_PATH + '/manage/role/add', ajaxParameters, 'POST')

// 修改职务
export const roleUpdate = (ajaxParameters) => fetch(API_PATH + '/manage/role/update', ajaxParameters, 'POST')

// 职务明细
export const getRoleDetail = (ajaxParameters) => fetch(API_PATH + '/manage/role/getRoleDetail', ajaxParameters, 'GET')
