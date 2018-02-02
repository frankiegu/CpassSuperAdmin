// 共同、通用的接口
import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

// 上传图片
// export const uploadPic = (dataJson) => fetch(API_PATH + '/manage/file/uploadPic', dataJson, 'POST')

// 获取系统常量值
export const loadConstant = (key) => fetch(API_PATH + '/common/constant/load', { key }, 'POST')
