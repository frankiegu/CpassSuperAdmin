// 固资模块
import fetch from '@/config/fetch'
import {API_PATH} from '@/config/env'

/**
 * 固资管理
 */
// 固资列表
export const listFixAssert = (obj) => fetch(API_PATH + '/manage/fixAssert/list', obj, 'GET')

// 新增固资
export const addFixAssert = (obj) => fetch(API_PATH + '/manage/fixAssert/add', obj, 'POST')

// 删除固资
export const deleteFixAssert = (obj) => fetch(API_PATH + '/manage/fixAssert/delete', obj, 'POST')

// 固资详情
export const fixAssertDetail = (obj) => fetch(API_PATH + '/manage/fixAssert/detail', obj, 'POST')

// 编辑固资
export const editFixAssert = (obj) => fetch(API_PATH + '/manage/fixAssert/edit', obj, 'POST')

// 已领取固资
export const findFetchedAssert = (obj) => fetch(API_PATH + '/manage/fixAssert/findFetchedAssert', obj, 'GET')

// 固资操作
export const recordAssert = (obj) => fetch(API_PATH + '/manage/fixAssert/recordAssert', obj, 'POST')

// 固资列表—不分页
export const spaceAssert = (obj) => fetch(API_PATH + '/manage/fixAssert/spaceAssert', obj, 'GET')
