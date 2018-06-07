import { API_PATH } from '@/config/env'
import { formatTimeString, downloadFile } from '@/config/utils'
import { fieldOrderList } from '@/service/order'
export default {
  data () {
    return {
      statusList: [
        { val: 5, text: '待支付' },
        { val: 10, text: '待使用' },
        { val: 20, text: '已使用' },
        { val: 30, text: '已取消' },
        { val: 40, text: '待退款' },
        { val: 50, text: '已退款' }
      ],
      formData: {
        name: '',
        bookDate: '',
        orderDate: '',
        status: ''
      },
      sortField: '', // 1-生成时间 2-预订时间 3-订单金额
      descOrAsc: '' // 排序方式 0-升序 1-降序
    }
  },
  props: {},
  components: {},
  mounted() {
    this.getPageData()
  },
  watch: {},
  computed: {},
  methods: {
    change(sort) {
      console.log(sort)
      if (sort.prop === 'created') {
        this.sortField = 1
      } else if (sort.prop === 'bookingPeriod') {
        this.sortField = 2
      } else if (sort.prop === 'formatPrice') {
        this.sortField = 3
      } else if (sort.prop === null) {
        this.sortField = ''
      }

      if (sort.order === 'ascending') {
        this.descOrAsc = 0
      } else if (sort.order === 'descending') {
        this.descOrAsc = 1
      } else if (sort.order === null) {
        this.descOrAsc = ''
      }

      this.currentPage = 1
      this.getPageData()
    },
    formatPrice(row, column) {
      return '￥ ' + row.orderAmount
    },
    formatTime(row, column) {
      return row.created
      // return row.email.replace(/:\d{2}$/, '')
    },
    getPageData(page) {
      this.currentPage = page || this.currentPage
      const paramsObj = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        orderNum: this.formData.name,
        bookStartDate: this.formData.bookDate ? formatTimeString(this.formData.bookDate[0]) : null,
        bookEndDate: this.formData.bookDate ? formatTimeString(this.formData.bookDate[1]) : null,
        orderStartDate: this.formData.orderDate ? formatTimeString(this.formData.orderDate[0]) : null,
        orderEndDate: this.formData.orderDate ? formatTimeString(this.formData.orderDate[1]) : null,
        orderStatus: this.formData.status,
        sortField: this.sortField,
        descOrAsc: this.descOrAsc
      }
      fieldOrderList(paramsObj).then(res => {
        if (res.status === 'true') {
          console.log('res', res)
          let data = res.info
          if (data) {
            this.pageTotal = data.total
            this.tableData = data.result
            // 支付状态payStatus, 10=未支付, 20=已支付, 30=已经退款
            this.tableData.forEach(v => {
              v.formatPrice = '￥ ' + v.orderAmount
              if (v.type === 1 || v.type === 2 || v.type === 4) {
                v.bookingPeriod = v.bookStartTime + '～' + v.bookEndTime
              } else {
                v.bookDate = '-'
                v.bookingPeriod = v.bookStartDate +  '～' + v.bookEndDate
              }
            })
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
    exportExcel() {
      if (!this.tableData.length) {
        return this.setMsg('暂无数据')
      }
      const formData = this.formData
      const downParams = {
        orderNum: formData.name,
        bookStartDate: formData.bookDate ? formatTimeString(formData.bookDate[0]) : null,
        bookEndDate: formData.bookDate ? formatTimeString(formData.bookDate[1]) : null,
        orderStartDate: formData.orderDate ? formatTimeString(formData.orderDate[0]) : null,
        orderEndDate: formData.orderDate ? formatTimeString(formData.orderDate[1]) : null,
        orderStatus: formData.status
      }
      let url = API_PATH + '/supervisor/platformOrder/export'
      downloadFile(url, downParams)
    }
  }
}
