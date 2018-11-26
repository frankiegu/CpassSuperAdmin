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
        date: '',
        name: ''
      },
      typeList: [
        { key: '0', label: '全部' }
      ],
      type: '0'
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
        logModule: logSort.logModule,
        name: logSort.name
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
        startTime: logSort.date ? formatTimeString(logSort.date[0]) : '',
        endTime: logSort.date ? formatTimeString(logSort.date[1]) : '',
        logModule: logSort.logModule,
        name: logSort.name
      }
      let url = API_PATH + '/supervisor/operationLog/exportLogInfo'
      downloadFile(url, downParams)
    }
  }
}
