/**
 * 空间列表
 */

import fetch from '@/config/fetch'
import { API_PATH } from '@/config/env'

// 空间列表
export const listSpace = (obj) => fetch(API_PATH + '/supervisor/storeStar/storeList', obj, 'POST')

// 空间橱窗列表
export const listShowcase = (obj) => fetch(API_PATH + '/supervisor/storeStar/showcaseList', obj, 'POST')

// 空间编辑详情
export const editSpaceDetail = (obj) => fetch(API_PATH + '/supervisor/storeStar/editDetail', obj, 'POST')

// 设置明星空间
export const setWellChosen = (obj) => fetch(API_PATH + '/supervisor/storeStar/setWellChosen', obj, 'POST')

// 编辑明星空间
export const editSpace = (obj) => fetch(API_PATH + '/supervisor/storeStar/editStoreStar', obj, 'POST')

// 空间置顶
export const topSpace = (obj) => fetch(API_PATH + '/supervisor/storeStar/top', obj, 'POST')
