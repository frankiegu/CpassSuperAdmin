/**
 * 服务管理
 */

import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

// 服务列表分页查询
export const feedbackList = (obj) => fetch(API_PATH + '/supervisor/feedback/list', obj, 'POST')

// 服务列表详情查询
export const feedbackDetail = (obj) => fetch(API_PATH + '/supervisor/feedback/detail', obj, 'POST')
