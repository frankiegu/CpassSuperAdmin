// 场地和草稿箱
import fetch from '../config/fetch'
import { API_PATH } from '../config/env'

// 人员维护
export * from './space/person'

/**
 * 场地
 * ------------------------------------------------------
 */
// 门店下第一个场地
export const findFirstField = (dataJson) => fetch(API_PATH + '/manage/store/findFirstField', dataJson, 'GET')

// 每一天的场地信息
export const fieldList = (dataJson) => fetch(API_PATH + '/manage/field/list', dataJson, 'GET')

// 场地信息(名称)
export const findByName = (dataJson) => fetch(API_PATH + '/manage/field/findByName', dataJson, 'GET')

// 获取一个月场地的营业状态
export const getFieldMonthBusinessStatus = (dataJson) => fetch(API_PATH + '/manage/field/getFieldMonthBusinessStatus', dataJson, 'GET')

// 获取一段时间的营业状态
export const getFieldBusinessStatus = (dataJson) => fetch(API_PATH + '/manage/field/getFieldBusinessStatus', dataJson, 'GET')

// 一键更改营业状态
export const updateFieldBusinessStatusForever = (dataJson) => fetch(API_PATH + '/manage/field/updateFieldBusinessStatusForever', dataJson, 'POST')

// 更新一堆日期的营业状态
export const updateFiledBusinessStatus = (dataJson) => fetch(API_PATH + '/manage/field/updateFiledBusinessStatus', dataJson, 'POST')

// 更新一堆日期的营业状态
export const fieldDelete = (dataJson) => fetch(API_PATH + '/manage/field/delete', dataJson, 'POST')

// 场地信息(主键)
export const findFieldDetail = (dataJson) => fetch(API_PATH + '/manage/field/findFieldDetail', dataJson, 'POST')

// 添加/修改场地-1
export const addOrUpdateFieldPartOne = (dataJson) => fetch(API_PATH + '/manage/field/addOrUpdateFieldPartOne', dataJson, 'POST')

// 添加/修改场地-2
export const addOrUpdateFieldPartTwo = (dataJson) => fetch(API_PATH + '/manage/field/addOrUpdateFieldPartTwo', dataJson, 'POST')

// 添加/修改场地-3
export const addOrUpdateFieldPartThree = (dataJson) => fetch(API_PATH + '/manage/field/addOrUpdateFieldPartThree', dataJson, 'POST')

// 硬件设施列表
export const equipmentList = (dataJson) => fetch(API_PATH + '/manage/equipment/list', dataJson, 'POST')

// 简单的场地信息
export const simpleField = (dataJson) => fetch(API_PATH + '/manage/field/simpleField', dataJson, 'POST')

// 场地预览
export const fieldPreview = (dataJson) => fetch(API_PATH + '/manage/field/preview', dataJson, 'GET')

// 场地支付方式
export const paymentType = (dataJson) => fetch(API_PATH + '/manage/paymentType/list', dataJson, 'GET')

/**
 * 草稿箱
 * ------------------------------------------------------
 */
// 草稿箱
export const draftBox = (dataJson) => fetch(API_PATH + '/manage/field/draftBox', dataJson, 'GET')

/**
 * 门禁管理
 * ------------------------------------------------------
 */
// 可用场地列表
export const listUsable = (dataJson) => fetch(API_PATH + '/manage/field/listUsable', dataJson, 'GET')

// 门禁列表
export const listLockBase = (dataJson) => fetch(API_PATH + '/manage/lockBase/list', dataJson, 'POST')

// 添加门禁
export const addLockBase = (dataJson) => fetch(API_PATH + '/manage/lockBase/add', dataJson, 'POST')

// 更新门禁
export const updateLockBase = (dataJson) => fetch(API_PATH + '/manage/lockBase/update', dataJson, 'POST')

// 门禁详情
export const lockDetail = (dataJson) => fetch(API_PATH + '/manage/lockBase/detail', dataJson, 'POST')

// 加载未关联用户
export const loadUsers = (dataJson) => fetch(API_PATH + '/manage/lockMaintain/loadUsers', dataJson, 'GET')

// 关联用户列表
export const listMaintain = (dataJson) => fetch(API_PATH + '/manage/lockMaintain/list', dataJson, 'POST')

// 批量添加关联用户
export const batchAddLockUser = (dataJson) => fetch(API_PATH + '/manage/lockMaintain/batchAdd', dataJson, 'POST')

// 删除关联用户
export const deleteLockUser = (dataJson) => fetch(API_PATH + '/manage/lockMaintain/delete', dataJson, 'POST')

// 更新关联用户
export const updateLockUser = (dataJson) => fetch(API_PATH + '/manage/lockMaintain/update', dataJson, 'POST')

// 更新使用状态
export const changeUseStatus = (dataJson) => fetch(API_PATH + '/manage/lockMaintain/changeUseStatus', dataJson, 'POST')

// 开锁记录列表
export const unlockRecord = (dataJson) => fetch(API_PATH + '/manage/lockBase/unlockRecord', dataJson, 'GET')
