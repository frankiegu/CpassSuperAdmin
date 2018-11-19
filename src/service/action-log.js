/**
 * 操作纪录
 */

import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

// 获取所有纪录模块
export const getActionLogListModule = obj => fetch(API_PATH + '/supervisor/operationLog/listLogModule', obj, 'GET')

// 操作纪录列表
export const getActionLogList = obj => fetch(API_PATH + '/supervisor/operationLog/list', obj, 'GET')
