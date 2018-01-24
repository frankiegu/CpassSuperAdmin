// 人员维护
import fetch from '@/config/fetch'
import {API_PATH} from '@/config/env'

// 已绑定的设备-门店列表
export const listBindEquipment = (ajaxParams) => fetch(API_PATH + '/manage/lockBase/listBindEquipment', ajaxParams, 'GET')

// 企业和用户信息
export const loadCompanyUserTree = (ajaxParams) => fetch(API_PATH + '/manage/staff/loadCompanyUserTree', ajaxParams, 'GET')

// 人员列表
export const staffList = (ajaxParams) => fetch(API_PATH + '/manage/staff/list', ajaxParams, 'GET')

// 人员删除
export const staffDelete = (ajaxParams) => fetch(API_PATH + '/manage/staff/delete', ajaxParams, 'POST')

// 人员详细
export const staffDetail = (ajaxParams) => fetch(API_PATH + '/manage/staff/detail', ajaxParams, 'GET')

// 添加人员
export const staffAdd = (ajaxParams) => fetch(API_PATH + '/manage/staff/add', ajaxParams, 'POST')
