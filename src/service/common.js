// 共同、通用的接口
import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

// 上传图片
// export const uploadPic = (dataJson) => fetch(API_PATH + '/manage/file/uploadPic', dataJson, 'POST')

// 获取系统常量值
export const loadConstant = (key) => fetch(API_PATH + '/common/constant/load', { key }, 'POST')

// 获取地址库
export const regionList = (obj) => fetch(API_PATH + '/common/region/listAll', obj, 'POST')

// 获取空间
export const spaceList = (obj) => fetch(API_PATH + '/supervisor/space/list', obj, 'POST')

// 获取空间
export const storeList = (obj) => fetch(API_PATH + '/supervisor/store/list', obj, 'POST')

// 商户类型
export const merchantSelect = (obj) => fetch(API_PATH + '/common/general/merchantSelect', obj, 'GET')

// 结算类型
export const settlementTypeSelect = (obj) => fetch(API_PATH + '/common/general/settlementTypeSelect', obj, 'GET')

// webSocket信息流
export const informList = (obj) => fetch(API_PATH + '/manage/inform/list', obj, 'GET')

// 获取管理员拥有的资源
export const getByAdminUserId = (obj) => fetch(API_PATH + '/supervisor/supervisor/getResource', obj, 'GET')

// 获取管理员信息
export const adminUserInfo = (obj) => fetch(API_PATH + '/supervisor/supervisor/info', obj, 'GET')

