// 管家工单
import fetch from '@/config/fetch'
import {API_PATH} from '@/config/env'

// 管家订单列表
export const keeperOrderList = (ajaxParams) => fetch(API_PATH + '/manage/spaceKeeperOrder/list', ajaxParams, 'GET')

// 管家订单详细查询
export const keeperOrderDetail = (ajaxParams) => fetch(API_PATH + '/manage/spaceKeeperOrder/detail', ajaxParams, 'GET')

// 管家订单-接单
export const keeperOrderAccept = (ajaxParams) => fetch(API_PATH + '/manage/spaceKeeperOrder/accept', ajaxParams, 'GET')
