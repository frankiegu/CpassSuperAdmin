// 会员
import fetch from '@/config/fetch'
import {API_PATH} from '@/config/env'

// 会员信息
export const userList = (ajaxParams) => fetch(API_PATH + '/manage/user/list', ajaxParams, 'GET')

// 下载会员信息
export const userListExcel = (ajaxParams) => fetch(API_PATH + '/manage/user/listExcel', ajaxParams, 'GET')

// 更新会员角色
export const userUpdateRole = (ajaxParams) => fetch(API_PATH + '/manage/user/updateRole', ajaxParams, 'POST')

// 更新会员状态
export const userUpdateStatus = (ajaxParams) => fetch(API_PATH + '/manage/user/updateStatus', ajaxParams, 'POST')

// 会员详细信息
export const userDetail = (ajaxParams) => fetch(API_PATH + '/manage/user/detail', ajaxParams, 'POST')
