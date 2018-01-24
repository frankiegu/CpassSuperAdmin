// 共同、通用的接口
import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

// 上传图片
export const uploadPic = (dataJson) => fetch(API_PATH + '/manage/file/uploadPic', dataJson, 'POST')

// 地址可选区域
export const addrList = (dataJson) => fetch(API_PATH + '/manage/region/listAll', dataJson, 'GET')

// 获取系统常量
export const loadConstant = (key) => fetch(API_PATH + '/common/constant/load', {
  key
}, 'POST')

// 申请下载code
export const applyDownloadCode = (obj) => fetch(API_PATH + '/manage/authorCode/applyDownloadCode', obj, 'POST')

// 获取空间下的管理员
export const adminUserList = (dataJson) => fetch(API_PATH + '/manage/adminUser/list', dataJson, 'GET')

/**
 * 消息
 * ------------------------------------------------------
 */
// 获取场地订单消息
export const getMessageOrder = (ajaxParame) => fetch(API_PATH + '/manage/messageCenter/getMessage/order', ajaxParame, 'GET')

// 阅读消息
export const readMessage = (ajaxParame) => fetch(API_PATH + '/manage/messageCenter/readMessage', ajaxParame, 'GET')

// 阅读消息
export const addMessage = (ajaxParame) => fetch(API_PATH + '/manage/messageCenter/addMessage', ajaxParame, 'GET')

/**
 * 权限资源
 * ------------------------------------------------------
 */
// 获取管理员拥有的资源
export const getByAdminUserId = (ajaxParame) => fetch(API_PATH + '/manage/adminUser/getResource', ajaxParame, 'GET')
