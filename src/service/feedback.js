/**
 * 服务管理
 */

import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

// 管理后台意见反馈列表
export const feedbackList = (obj) => fetch(API_PATH + '/supervisor/feedback/list', obj, 'POST')

// 管理后台意见反馈详情
export const feedbackDetail = (obj) => fetch(API_PATH + '/supervisor/feedback/detail', obj, 'POST')

// CPASS意见反馈列表
export const cpassFeedbackList = (obj) => fetch(API_PATH + '/supervisor/platformFeedback/list', obj, 'POST')

// CPASS意见反馈详情
export const cpassFeedbackDetail = (obj) => fetch(API_PATH + '/supervisor/platformFeedback/detail', obj, 'POST')

