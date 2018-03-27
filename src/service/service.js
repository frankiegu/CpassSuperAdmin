/**
 * 服务管理
 */

import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

// 服务列表分页查询
export const serviceList = (obj) => fetch(API_PATH + '/supervisor/platformService/list', obj, 'POST')

// 服务列表设置对外开放状态
export const serviceToggle = (obj) => fetch(API_PATH + '/supervisor/platformService/togglePermitOpen', obj, 'POST')

// 服务列表设置是否置顶
export const serviceSetOnTop = (obj) => fetch(API_PATH + '/supervisor/platformService/setOnTop', obj, 'POST')
