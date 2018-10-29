import { API_PATH } from '@/config/env'
import { comPickerOptions } from '@/config/data/head'
import { formatTimeString, downloadFile } from '@/config/utils'
import { getActionLogListModule, getActionLogList } from '@/service'

export default {
  data () {
    return {
      downloadLoading: false,
      selectDateRange: comPickerOptions,
      date: null,        // 选择日期
      logModuleList: {}, // 纪录模块列表
      logSort: {         // 筛选条件
        logModule: '',
        date: ''
      },
      typeList: [
        { key: '0', label: '全部' }
      ],
      type: '0',
      tableData: [{ 'id': 3338, 'logModule': '场地管理', 'logAction': '导出场地营收统计信息', 'targetId': null, 'targetName': null, 'logTime': '2018-10-17 14:38:53', 'adminUserId': 8, 'adminUserName': '雷猴' }, { 'id': 3337, 'logModule': '场地管理', 'logAction': '编辑场地', 'targetId': 3218, 'targetName': '互联网智能AI场地a', 'logTime': '2018-10-17 14:26:15', 'adminUserId': 8, 'adminUserName': '雷猴' }, { 'id': 3336, 'logModule': '场地管理', 'logAction': '编辑场地', 'targetId': 3271, 'targetName': null, 'logTime': '2018-10-17 14:25:25', 'adminUserId': 8, 'adminUserName': '雷猴' }, { 'id': 3335, 'logModule': '场地管理', 'logAction': '删除场地', 'targetId': 3075, 'targetName': 'test', 'logTime': '2018-10-17 14:24:02', 'adminUserId': 8, 'adminUserName': '雷猴' }, { 'id': 3334, 'logModule': '空间管理', 'logAction': '编辑门店', 'targetId': 88, 'targetName': '测试空间', 'logTime': '2018-10-17 14:16:36', 'adminUserId': 8, 'adminUserName': '雷猴' }, { 'id': 3333, 'logModule': '空间管理', 'logAction': '创建门店', 'targetId': null, 'targetName': 'sss', 'logTime': '2018-10-17 14:11:30', 'adminUserId': 8, 'adminUserName': '雷猴' }, { 'id': 3332, 'logModule': '空间管理', 'logAction': '编辑空间LOGO及名称', 'targetId': null, 'targetName': null, 'logTime': '2018-10-17 14:06:59', 'adminUserId': 8, 'adminUserName': '雷猴' }, { 'id': 3331, 'logModule': '权限管理', 'logAction': '分配人员', 'targetId': 59, 'targetName': null, 'logTime': '2018-10-17 14:03:50', 'adminUserId': 8, 'adminUserName': '雷猴' }, { 'id': 3330, 'logModule': '权限管理', 'logAction': '停用职务', 'targetId': 55, 'targetName': '核销', 'logTime': '2018-10-17 14:03:13', 'adminUserId': 8, 'adminUserName': '雷猴' }, { 'id': 3329, 'logModule': '权限管理', 'logAction': '编辑职务', 'targetId': 58, 'targetName': 'DY测试', 'logTime': '2018-10-17 14:02:20', 'adminUserId': 8, 'adminUserName': '雷猴' }, { 'id': 3328, 'logModule': '权限管理', 'logAction': '停用账号', 'targetId': 75, 'targetName': 'Eason', 'logTime': '2018-10-17 13:55:51', 'adminUserId': 8, 'adminUserName': '雷猴' }, { 'id': 3327, 'logModule': '权限管理', 'logAction': '删除账号', 'targetId': 76, 'targetName': 'cecelia', 'logTime': '2018-10-17 13:54:26', 'adminUserId': 8, 'adminUserName': '雷猴' }, { 'id': 3326, 'logModule': '权限管理', 'logAction': '创建账号', 'targetId': null, 'targetName': 'ace', 'logTime': '2018-10-17 13:53:03', 'adminUserId': 8, 'adminUserName': '雷猴' }, { 'id': 3325, 'logModule': '权限管理', 'logAction': '编辑职务', 'targetId': 49, 'targetName': '开奕测试', 'logTime': '2018-10-16 12:06:36', 'adminUserId': 8, 'adminUserName': '雷猴' }, { 'id': 3324, 'logModule': '权限管理', 'logAction': '编辑职务', 'targetId': 49, 'targetName': '开奕测试', 'logTime': '2018-10-16 12:06:27', 'adminUserId': 8, 'adminUserName': '雷猴' }, { 'id': 3323, 'logModule': '权限管理', 'logAction': '编辑职务', 'targetId': 49, 'targetName': '开奕测试', 'logTime': '2018-10-16 12:01:59', 'adminUserId': 8, 'adminUserName': '雷猴' }, { 'id': 3322, 'logModule': '权限管理', 'logAction': '编辑职务', 'targetId': 49, 'targetName': '开奕测试', 'logTime': '2018-10-16 12:01:00', 'adminUserId': 8, 'adminUserName': '雷猴' }, { 'id': 3321, 'logModule': '空间管家', 'logAction': '删除服务类型', 'targetId': 10, 'targetName': null, 'logTime': '2018-10-16 11:56:29', 'adminUserId': 8, 'adminUserName': '雷猴' }, { 'id': 3320, 'logModule': '空间管家', 'logAction': '删除服务类型', 'targetId': 3, 'targetName': null, 'logTime': '2018-10-16 11:51:38', 'adminUserId': 8, 'adminUserName': '雷猴' }, { 'id': 3319, 'logModule': '权限管理', 'logAction': '编辑职务', 'targetId': 49, 'targetName': '开奕测试', 'logTime': '2018-10-16 11:34:37', 'adminUserId': 8, 'adminUserName': '雷猴' }]
    }
  },
  props: {},
  components: {},
  mounted() {
    // 获取纪录模块列表
    getActionLogListModule().then(res => {
      if (res.status === 'true') {
        this.logModuleList = res.info
      }
    })
    this.getPageData()
  },
  watch: {},
  computed: {},
  methods: {
    getPageData(page) {
      this.currentPage = page || this.currentPage
      let logSort = this.logSort
      const paramsObj = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        startTime: logSort.date ? formatTimeString(logSort.date[0]) : '',
        endTime: logSort.date ? formatTimeString(logSort.date[1]) : '',
        logModule: logSort.logModule
      }
      getActionLogList(paramsObj).then(res => {
        if (res.status === 'true') {
          let data = res.info
          this.pageTotal = data.total
          this.tableData = data.result

          // table的交互
          this.tableLoading = false
          if (this.tableData.length === 0) {
            this.tableEmpty = '暂无数据'
          }
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },
    exportExcel() {
      if (!this.tableData.length) {
        return this.setMsg('暂无数据')
      }
      let logSort = this.logSort
      const downParams = {
        logModule: logSort.logModule,
        startTime: logSort.date ? formatTimeString(logSort.date[0]) : '',
        endTime: logSort.date ? formatTimeString(logSort.date[1]) : ''
      }
      let url = API_PATH + '/supervisor/operationLog/exportLogInfo'
      downloadFile(url, downParams)
    }
  }
}
