/**
 * 城市维护
 */

import fetch from '@/config/fetch'
import { API_PATH } from '@/config/env'

// 国家列表
export const listCountry = (obj) => fetch(API_PATH + '/supervisor/country/list', obj, 'POST')

// 城市列表
export const listCity = (obj) => fetch(API_PATH + '/supervisor/regionInfo/page', obj, 'POST')

// 列出国家下所有城市
export const listCityTree = (obj) => fetch(API_PATH + '/supervisor/region/listCityTree', obj, 'POST')

// 添加城市
export const addCity = (obj) => fetch(API_PATH + '/supervisor/regionInfo/add', obj, 'POST')

// 更新城市
export const updateCity = (obj) => fetch(API_PATH + '/supervisor/regionInfo/update', obj, 'POST')

// 城市开始/关闭
export const switchCity = (obj) => fetch(API_PATH + '/supervisor/regionInfo/openStatus', obj, 'POST')

// 城市置顶
export const topCity = (obj) => fetch(API_PATH + '/supervisor/regionInfo/top', obj, 'POST')
