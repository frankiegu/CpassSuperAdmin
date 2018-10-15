// 个人信息
import fetch from '@/config/fetch'
import { API_PATH } from '@/config/env'

/* c-pass 添加和编辑
-------------------------- */
// 场地列表，没有分页
export const cPassFindUseField = (obj) => fetch(API_PATH + '/supervisor/marketing/findUseField', obj, 'POST')

// 品牌列表，没有分页
export const cPassFindUseSpace = (obj) => fetch(API_PATH + '/supervisor/marketing/findUseSpace', obj, 'POST')

// 空间列表，没有分页
export const cPassFindUseStore = (obj) => fetch(API_PATH + '/supervisor/marketing/findUseStore', obj, 'POST')

// 编辑精选场地
export const cPassEditWellChosen = (obj) => fetch(API_PATH + '/supervisor/marketing/editWellChosen', obj, 'POST')

// 精选场地详情
export const cPassEditDetail = (obj) => fetch(API_PATH + '/supervisor/marketing/editDetail', obj, 'GET')

// 添加精选场地
export const cPassAddWellChosen = (obj) => fetch(API_PATH + '/supervisor/marketing/addWellChosen', obj, 'POST')

/* c-pass列表
-------------------------- */
// 编辑精选场地精选状态
export const cPassSetSelectionType = (obj) => fetch(API_PATH + '/supervisor/marketing/setSelectionType', obj, 'POST')

// 编辑精选场地发布状态
export const cPassSetReleaseType = (obj) => fetch(API_PATH + '/supervisor/marketing/setReleaseType', obj, 'POST')

// 置顶操作
export const cPassSetTop = (obj) => fetch(API_PATH + '/supervisor/marketing/top', obj, 'POST')

// 删除精选场地
export const cPassDelWellChosen = (obj) => fetch(API_PATH + '/supervisor/marketing/delWellChosen', obj, 'POST')

// 精选列表
export const cPassList = (obj) => fetch(API_PATH + '/supervisor/marketing/list', obj, 'GET')

// 橱窗列表
export const cPassShowcaseList = (obj) => fetch(API_PATH + '/supervisor/marketing/showcaseList', obj, 'GET')
