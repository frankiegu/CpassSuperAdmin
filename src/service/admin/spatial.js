// 空间信息
import fetch from '@/config/fetch'
import {API_PATH} from '@/config/env'

// 获取空间信息
export const defaultSpaceInfo = (ajaxParams) => fetch(API_PATH + '/manage/space/defaultSpaceInfo', ajaxParams, 'GET')

// 更新空间信息
export const updateSpaceInfo = (ajaxParams) => fetch(API_PATH + '/manage/space/updateSpaceInfo', ajaxParams, 'POST')

// 更新门店状态
export const updateStoreStatus = (ajaxParams) => fetch(API_PATH + '/manage/store/updateStoreStatus', ajaxParams, 'POST')

// 查看门店(编码)
export const findByStoreCode = (ajaxParams) => fetch(API_PATH + '/manage/store/findByStoreCode', ajaxParams, 'GET')

// 更新门店(编码)
export const updateStore = (ajaxParams) => fetch(API_PATH + '/manage/store/updateStore', ajaxParams, 'POST')

// 添加门店(编码)
export const addStore = (ajaxParams) => fetch(API_PATH + '/manage/store/addStore', ajaxParams, 'POST')

// 查找所有的门店
export const findAllStore = (ajaxParams) => fetch(API_PATH + '/manage/store/findAll', ajaxParams, 'GET')

// 统计门店使用率
export const statisticsStoreRate = (ajaxParams) => fetch(API_PATH + '/manage/store/statisticsStoreRate', ajaxParams, 'GET')

// 分页查询空间的门店
export const storeList = (ajaxParams) => fetch(API_PATH + '/manage/store/list', ajaxParams, 'GET')
