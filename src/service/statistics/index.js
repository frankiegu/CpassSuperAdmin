// 统计
export * from './order'

// 场地统计-顶端统计
export const fieldTotalStatistics = (obj) => fetch(API_PATH + '/supervisor/fieldStatistics/fieldTotalStatistics', obj, 'POST')

// 场地统计-场地概况/新增统计
export const fieldStatisticsNew = (obj) => fetch(API_PATH + '/supervisor/fieldStatistics/fieldStatistics', obj, 'POST')

// 浏览统计-品牌
export const spaceAccessSituation = (obj) => fetch(API_PATH + '/supervisor/fieldStatistics/spaceAccessSituation', obj, 'POST')
