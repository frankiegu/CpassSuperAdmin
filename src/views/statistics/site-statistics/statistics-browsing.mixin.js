import tableMixins from '@/mixins/table'
import { API_PATH } from '@/config/env'
import { downloadFile, formatTimeString } from '@/config/utils'
import radioPicker from '@/mixins/radio-datePicker'
import { spaceAccessSituation, storeAccessSituation, fieldAccessSituation } from '@/service/statistics'

export default {
  mixins: [tableMixins, radioPicker],
  data () {
    return {
      formData: {
        type: '',
        date: '',
        fieldTyoe: ''
      },
      dateRange: '', // 日期
      periodId: 1 // 周期  1日 2周 3月
    }
  },
  mounted () {
    this.getPageData()
  },
  methods: {
    getPageData(page) {
      this.currentPage = page || this.currentPage
      const paramsObj = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        type: this.formData.type === 5 ? '' : this.formData.type,
      }

      spaceAccessSituation(paramsObj).then(res => {
        if (res.status === 'true') {
          let data = res.info
          if (data) {
            this.pageTotal = data.pageList.total
            this.tableData = data.pageList.result
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
    // 导出数据
    exportExcel() {
      if (!this.tableData.length) {
        return this.setMsg('暂无数据')
      }
      const downParams = {
        exportType: 1,
        startTime: this.dateRange ? formatTimeString(this.dateRange[0]) : null,
        endTime: this.dateRange ? formatTimeString(this.dateRange[1]) : null
      }
      let url = API_PATH + '/supervisor/fieldStatistics/exportAccessStatistics'
      downloadFile(url, downParams)
    }
  }
}
