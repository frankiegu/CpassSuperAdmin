// 数据统计
import fetch from '../config/fetch'
import {API_PATH} from '../config/env'

/**
 * 场地营收统计
 * --------------------------------------------
 */
// 查询列表
export const getListFieldRevenue = (obj) => fetch(API_PATH + '/manage/field/listFieldRevenue', obj, 'GET')
