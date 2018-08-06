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

// 获取门店
export const storeList = (obj) => fetch(API_PATH + '/supervisor/store/list', obj, 'POST')
