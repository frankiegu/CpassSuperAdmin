import tableMixins from '@/mixins/table'
import { API_PATH } from '@/config/env'
import { feedbackList, feedbackDetail } from '@/service/feedback'
import { formatTimeString, downloadFile } from '@/config/utils'

export default {
  mixins: [tableMixins],
  data () {
    return {
      id: '',
      content: '',
      moduleName: '',
      formData: {
        content: '',
        reg_date: null
      }
    }
  },
  mounted () {
    this.getPageData()
  },
  methods: {
    getPageData() {
      const paramsObj = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        content: this.formData.content,
        startDate: this.formData.reg_date ? formatTimeString(this.formData.reg_date[0]) : null,
        endDate: this.formData.reg_date ? formatTimeString(this.formData.reg_date[1]) : null
      }

      feedbackList(paramsObj).then(res => {
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
          this.tableEmpty = '暂时无数据'
          this.setMsg('error', res.msg)
        }
      })
    },
    viewDetail (id) {
      this.id = id
      this.content = ''
      this.moduleName = ''
      this.dialogVisible = true
      const paramsObj = {
        id: this.id
      }
      feedbackDetail(paramsObj).then(res => {
        if (res.status === 'true') {
          if (res.info) {
            this.moduleName = res.info.moduleName || ''
            this.content = res.info.content || ''
          } else {
            this.setMsg('error', res.msg)
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
      const formData = this.formData
      const downParams = {
        content: formData.content,
        startDate: formData.reg_date ? formatTimeString(formData.reg_date[0]) : null,
        endDate: formData.reg_date ? formatTimeString(formData.reg_date[1]) : null
      }
      let url = API_PATH + '/supervisor/feedback/export'
      downloadFile(url, downParams)
    }
  }
}
