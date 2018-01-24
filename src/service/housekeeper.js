import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

// 空间管家
export * from './housekeeper/space'

// 管家工单
export * from './housekeeper/order'

/**
 * 公用
 * ------------------------------------------------------
 */
// 服务类型列表
export const serviceTypeList = (ajaxParams) => fetch(API_PATH + '/manage/spaceServiceType/list', ajaxParams, 'GET')
