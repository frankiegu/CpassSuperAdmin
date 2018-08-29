// banner配置
import fetch from '@/config/fetch'
import { API_PATH } from '@/config/env'

// 新增或修改banner
export const indexBannerAddOrUpdate = (obj) => fetch(API_PATH + '/supervisor/indexBanner/addOrUpdate', obj, 'POST')

// 橱窗位列表
export const indexBannerShowcaseList = (obj) => fetch(API_PATH + '/supervisor/indexBanner/showcaseList', obj, 'POST')

// banner列表
export const indexBannerList = (obj) => fetch(API_PATH + '/supervisor/indexBanner/list', obj, 'POST')
