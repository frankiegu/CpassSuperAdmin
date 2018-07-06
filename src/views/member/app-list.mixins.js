import tableMixins from '@/mixins/table'
import { appMemberList, memberStatistics, appChangeStatus } from '@/service/member'
import { loadConstant } from '@/service/common'
import { API_PATH } from '@/config/env'
import { downloadFile } from '@/config/utils'
import memberRate from './components/memberRate'
import pickerOptions from '@/mixins/pickerOptions'

export default {
  mixins: [tableMixins, pickerOptions],
  components: { memberRate },
  data () {
    return {
      formData: {
        logInDate: null,
        registerDate: null,
        grade: '',
        status: '',
        name: ''
      },
      gradeList: [],
      statusList: [],
      memberRateData: [0, 0, 0, 0] // 会员变化率
    }
  },
  mounted () {
    this.getMemberStatistics()
    this.getStatusList()
    this.getPageData()
  },
  methods: {
    // 会员变化
    getMemberStatistics () {
      const self = this
      memberStatistics().then(res => {
        if (res.status === 'true') {
          self.memberRateData = [res.info.total, res.info.todayChange, res.info.weekChange, res.info.monthChange]
        } else {
          self.setMsg('error', res.msg)
        }
      })
    },
    // 会员状态常量
    getStatusList () {
      loadConstant('appCustomer.status').then(res => {
        if (res.status === 'true') {
          this.statusList = res.info
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },
    getPageData(page) {
      this.currentPage = page || this.currentPage
      const formData = this.formData
      const paramsObj = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        lastLoginStart: formData.logInDate ? formData.logInDate[0] : null,
        lastLoginEnd: formData.logInDate ? formData.logInDate[1] : null,
        registerStart: formData.registerDate ? formData.registerDate[0] : null,
        registerEnd: formData.registerDate ? formData.registerDate[1] : null,
        levelId: formData.grade,
        status: formData.status,
        search: formData.name
      }

      appMemberList(paramsObj).then(res => {
        if (res.status === 'true') {
          let data = res.info
          if (data) {
            this.pageTotal = data.total
            this.tableData = data.result
          }

          this.tableLoading = false
          if (this.tableData.length === 0) {
            this.tableEmpty = '暂时无数据'
          }
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },
    // 承接datePicker
    datePickerChange (page, dateRange, dateType) {
      const self = this
      switch (dateType) {
        case 1:
          self.formData.logInDate = dateRange
          break;
        case 2:
          self.formData.registerDate = dateRange
      }
      self.getPageData(1)
    },
    // 停用或启用app会员
    changeStatus (id, currentStatus) {
      const status = currentStatus === 0 ? 1 : 0
      const JSON = {
        appCustomerId: id,
        status: status
      }
      appChangeStatus(JSON).then(res => {
        if (res.status === 'true') {
          this.setMsg('success', status === 0 ? '停用成功' : '启用成功')
          this.getPageData()
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },
    exportExcel() {
      if (!this.tableData.length) {
        return this.setMsg('暂无数据')
      }
      const formData = this.formData
      const downParams = {
        nickname: formData.name
      }
      let url = API_PATH + '/supervisor/customer/exportExcel'
      downloadFile(url, downParams)
    }
  }
}
