// 统计
import fetch from '../../config/fetch'
import { API_PATH } from '../../config/env'

export * from './order'

// 场地统计-顶端统计
export const fieldTotalStatistics = (obj) => fetch(API_PATH + '/supervisor/fieldStatistics/fieldTotalStatistics', obj, 'POST')

// 场地统计-场地概况/新增统计
export const fieldStatisticsNew = (obj) => fetch(API_PATH + '/supervisor/fieldStatistics/fieldStatistics', obj, 'POST')

// 场地统计-查询新增品牌详情列表
export const findAddSpaceDetail = (obj) => fetch(API_PATH + '/supervisor/fieldStatistics/findAddSpaceDetail', obj, 'POST')

// 场地统计-查询新增空间详情列表
export const findAddStoreDetail = (obj) => fetch(API_PATH + '/supervisor/fieldStatistics/findAddStoreDetail', obj, 'POST')

// 场地统计-查询新增场地详情列表
export const findAddFieldDetail = (obj) => fetch(API_PATH + '/supervisor/fieldStatistics/findAddFieldDetail', obj, 'POST')

// 地区分析-空间地区分布
export const storeDistributeByArea = (obj) => fetch(API_PATH + '/supervisor/fieldStatistics/storeDistributeByArea', obj, 'POST')

// 地区分析-场地地区分布
export const fieldDistributeByArea = (obj) => fetch(API_PATH + '/supervisor/fieldStatistics/fieldDistributeByArea', obj, 'POST')
