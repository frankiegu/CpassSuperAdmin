// 会员模块
import fetch from '@/config/fetch'
import { API_PATH } from '@/config/env'

// 会员
export * from './member/member'

/**
 * 企业
 * ------------------------------------------------------
 */
// 统计企业数
export const companyStatistics = (token) => fetch(API_PATH + '/manage/company/companyStatistics', token, 'GET')

// 企业列表查询
export const companyList = (obj) => fetch(API_PATH + '/manage/company/list', obj, 'GET')

// 企业列表-不分页
export const companyListAll = (obj) => fetch(API_PATH + '/manage/company/listAll', obj, 'GET')

// 关闭企业
export const closeCompany = (obj) => fetch(API_PATH + '/manage/company/close', obj, 'GET')

// 开启企业
export const openCompany = (obj) => fetch(API_PATH + '/manage/company/open', obj, 'GET')

// 企业详情
export const companyDetail = (obj) => fetch(API_PATH + '/manage/company/detail', obj, 'GET')

// 行业信息
export const loadProfession = (obj) => fetch(API_PATH + '/manage/profession/loadProfession', obj, 'GET')

// 企业规模
export const loadCompanyScale = (obj) => fetch(API_PATH + '/manage/company/loadCompanyScale', obj, 'GET')

// 添加企业
export const addCompany = (obj) => fetch(API_PATH + '/manage/company/addCompany', obj, 'GET')

// 更新企业
export const updateCompany = (obj) => fetch(API_PATH + '/manage/company/updateCompany', obj, 'GET')

// 下载批量导入模板
export const downloadTemplate = (token) => fetch(API_PATH + '/manage/company/downloadTemplate', token, 'GET')

// 批量添加企业
export const batchAddCompany = (obj) => fetch(API_PATH + '/manage/company/batchAddCompany', obj, 'POST')

// 导出企业Excel
export const exportCompany = (obj) => fetch(API_PATH + '/manage/company/exportCompany', obj, 'POST')

// 新增合同
export const addContract = (obj) => fetch(API_PATH + '/manage/contract/addContract', obj, 'POST')

// 续签合同
export const renewContract = (obj) => fetch(API_PATH + '/manage/contract/renewContract', obj, 'POST')

// 更新合同
export const updateContract = (obj) => fetch(API_PATH + '/manage/contract/updateContract', obj, 'POST')

/**
 * 信用分管理
 * ------------------------------------------------------
 */
// 信用明细列表
export const creditRuleList = (obj) => fetch(API_PATH + '/manage/creditRule/listDetail', obj, 'GET')

// 获取信用体系说明
export const getCreditRuleRemark = (obj) => fetch(API_PATH + '/manage/creditRule/getRemark', obj, 'GET')

// 更新信用规则说明
export const updateCreditRuleRemark = (obj) => fetch(API_PATH + '/manage/creditRule/updateRemark', obj, 'POST')

// 关闭信用规则明细
export const closeCreditRule = (obj) => fetch(API_PATH + '/manage/creditRule/closeDetail', obj, 'POST')

// 开启信用规则明细
export const openCreditRule = (obj) => fetch(API_PATH + '/manage/creditRule/openDetail', obj, 'POST')

// 删除信用明细
export const deleteCreditRule = (obj) => fetch(API_PATH + '/manage/creditRule/deleteDetail', obj, 'POST')

// 增加信用明细
export const addCreditRule = (obj) => fetch(API_PATH + '/manage/creditRule/addDetail', obj, 'POST')

// 更新信用明细
export const updateCreditRule = (obj) => fetch(API_PATH + '/manage/creditRule/updateDetail', obj, 'POST')

// 查询信用奖励
export const listReward = (obj) => fetch(API_PATH + '/manage/creditRule/listReward', obj, 'GET')

// 更新信用奖励
export const updateReward = (obj) => fetch(API_PATH + '/manage/creditRule/updateReward', obj, 'POST')

// 人工判定信用规则列表
export const judgeList = (obj) => fetch(API_PATH + '/manage/creditRule/listManualJudgeDetail', obj, 'GET')

// 信用登记
export const creditRegister = (obj) => fetch(API_PATH + '/manage/creditRule/creditRegister', obj, 'POST')
