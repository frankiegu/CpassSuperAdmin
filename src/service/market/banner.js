// banner配置
import fetch from '@/config/fetch'
import { API_PATH } from '@/config/env'

// 新增banner
export const indexBannerAdd = (obj) => fetch(API_PATH + '/supervisor/indexBanner/add', obj, 'POST')

// 编辑banner
export const indexBannerUpdate = (obj) => fetch(API_PATH + '/supervisor/indexBanner/update', obj, 'POST')

// 橱窗位列表
export const indexBannerShowcaseList = (obj) => fetch(API_PATH + '/supervisor/indexBanner/showcaseList', obj, 'POST')

// banner列表
export const indexBannerList = (obj) => fetch(API_PATH + '/supervisor/indexBanner/list', obj, 'POST')

// 橱窗位置顶
export const indexBannerTop = (obj) => fetch(API_PATH + '/supervisor/indexBanner/top', obj, 'POST')

// 设置橱窗位
export const indexBannerChangeStatus = (obj) => fetch(API_PATH + '/supervisor/indexBanner/changeStatus', obj, 'POST')

// 删除Banner
export const indexBannerDelete = (obj) => fetch(API_PATH + '/supervisor/indexBanner/delete', obj, 'POST')

// banner详情
export const indexBannerDetail = (obj) => fetch(API_PATH + '/supervisor/indexBanner/detail', obj, 'POST')
