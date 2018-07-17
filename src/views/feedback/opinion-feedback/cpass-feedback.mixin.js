import tableMixins from '@/mixins/table'
import { API_PATH } from '@/config/env'
import { cpassFeedbackList, cpassFeedbackDetail } from '@/service/feedback'
import { formatTimeString, downloadFile } from '@/config/utils'

export default {
  mixins: [tableMixins],
  data () {
    return {
      id: '',
      content: '',
      moduleName: '',
      formData: {
        keyword: '',
        reg_date: null
      },
      imgList: [],
      showImg: ''
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
        keyword: this.formData.keyword,
        startDate: this.formData.reg_date ? formatTimeString(this.formData.reg_date[0]) : null,
        endDate: this.formData.reg_date ? formatTimeString(this.formData.reg_date[1]) : null
      }

      cpassFeedbackList(paramsObj).then(res => {
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
      this.imgList = []
      this.outerVisible = true
      const paramsObj = {
        id: this.id
      }
      cpassFeedbackDetail(paramsObj).then(res => {
        if (res.status === 'true') {
          if (res.info) {
            this.content = res.info.content
            this.imgList = res.info.platformFeedbackImgs || []
            this.showImg = res.info.showImg
          } else {
            this.setMsg('error', res.msg)
          }
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },
    // 承接datePicker
    datePickerChange (page, dateRange) {
      this.formData.reg_date = dateRange
      this.getPageData(1)
    },
    exportExcel() {
      if (!this.tableData.length) {
        return this.setMsg('暂无数据')
      }
      const formData = this.formData
      const downParams = {
        keyword: formData.keyword,
        startDate: formData.reg_date ? formatTimeString(formData.reg_date[0]) : null,
        endDate: formData.reg_date ? formatTimeString(formData.reg_date[1]) : null
      }
      let url = API_PATH + '/supervisor/platformFeedback/export'
      downloadFile(url, downParams)
    }
  }
}
