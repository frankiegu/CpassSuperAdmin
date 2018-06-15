import tableMixins from '@/mixins/table'
import { API_PATH } from '@/config/env'
import { reservationList, reservationDetail } from '@/service/field'
import { loadConstant } from '@/service/common'
import { formatTimeString, downloadFile } from '@/config/utils'

export default {
  mixins: [tableMixins],
  data () {
    return {
      id: '',
      content: '',
      reservationList: [],
      pickerOptions: {
        shortcuts: [{
          text: '一周内',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '一个月内',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '三个月内',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },

      formData: {
        content: '',
        submitDate: null,
        bookDate: null
      }
    }
  },
  mounted () {
    this.getReservationList()
    this.getPageData()
  },
  methods: {
    getPageData(page) {
      this.currentPage = page || this.currentPage
      const paramsObj = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        keyword: this.formData.content,
        statusCode: this.formData.reservationType,
        startDate: this.formData.submitDate ? formatTimeString(this.formData.submitDate[0]) : null,
        endDate: this.formData.submitDate ? formatTimeString(this.formData.submitDate[1]) : null,
        bookstartDate: this.formData.bookDate ? formatTimeString(this.formData.bookDate[0]) : null,
        bookendDate: this.formData.bookDate ? formatTimeString(this.formData.bookDate[1]) : null
      }

      reservationList(paramsObj).then(res => {
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
    getReservationList() {
      loadConstant('VisitReservationStatus').then(res => {
        if (res.status === 'true') {
          this.reservationList = res.info
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },
    viewDetail (id) {
      this.id = id
      this.content = ''
      this.dialogVisible = true
      const paramsObj = {
        visitReservationId: this.id
      }
      reservationDetail(paramsObj).then(res => {
        if (res.status === 'true') {
          if (res.info) {
            this.content = res.info.note || ''
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
        keyword: formData.content,
        statusCode: formData.reservationType,
        startDate: formData.submitDate ? formatTimeString(formData.submitDate[0]) : null,
        endDate: formData.submitDate ? formatTimeString(formData.submitDate[1]) : null,
        bookstartDate: formData.bookDate ? formatTimeString(formData.bookDate[0]) : null,
        bookendDate: formData.bookDate ? formatTimeString(formData.bookDate[1]) : null
      }
      let url = API_PATH + '/supervisor/visitReservation/export'
      downloadFile(url, downParams)
    }
  }
}
