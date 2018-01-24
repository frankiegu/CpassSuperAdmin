// 推送管理
import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

/**
 * 活动管理
 * ------------------------------------------------------
 */
/**
 * 活动管理
 * ------------------------------------------------------
 */
// 查询全部活动列表
export const getActivityList = (dataJson) => fetch(API_PATH + '/manage/activityDetail/listAll', dataJson, 'GET')

// 查询符合指定条件的活动列表 - 根据活动状态和活动名
export const queryActivityList = (dataJson) => fetch(API_PATH + '/manage/activityDetail/listByNameOrStatus', dataJson, 'POST')

// 查询活动详细信息 - 根据ID
export const queryDetailById = (dataJson) => fetch(API_PATH + '/manage/activityDetail/detail', dataJson, 'POST')

// 删除活动
export const deleteActivityById = (dataJson) => fetch(API_PATH + '/manage/activityDetail/delete', dataJson, 'POST')

// 新增活动
export const addActivity = (dataJson) => fetch(API_PATH + '/manage/activityDetail/add', dataJson, 'POST')

// 修改活动
export const editActivity = (dataJson) => fetch(API_PATH + '/manage/activityDetail/modifyActivity', dataJson, 'POST')

/**
 * 公告管理
 * ------------------------------------------------------
 */

// 查询公告列表
export const getNoticeList = (obj) => fetch(API_PATH + '/manage/notice/list', obj, 'GET')

// 添加或更新公告
export const addOrUpdateNotice = (obj) => fetch(API_PATH + '/manage/notice/addOrUpdate', obj, 'POST')

// 公告详情
export const getNoticeDetail = (obj) => fetch(API_PATH + '/manage/notice/detail', obj, 'GET')

// 删除公告
export const deleteNotice = (obj) => fetch(API_PATH + '/manage/notice/delete', obj, 'POST')
