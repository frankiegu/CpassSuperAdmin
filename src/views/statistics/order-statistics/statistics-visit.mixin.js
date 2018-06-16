import tableMixins from '@/mixins/table'
import { API_PATH } from '@/config/env'
import { downloadFile } from '@/config/utils'
import { platformActivityList } from '@/service/market'

export default {
  mixins: [tableMixins],
  data () {
    return {
      dialogVisible: false,
      reservationDetail: [],
      reservationLoading: false,

      // 分页器配置
      pageSizeArrExtra: [20, 40, 80, 100],
      layoutArrExtra: 'total, sizes, prev, pager, next, jumper',
      currentPageExtra: 1,
      pageSizeExtra: 20,
      pageTotalExtra: 0,
      formData: {
        type: '',
        date: '',
        fieldTyoe: ''
      },
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
        status: this.formData.status === 5 ? '' : this.formData.status
      }

      platformActivityList(paramsObj).then(res => {
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
    // 导出数据
    exportExcel() {
      if (!this.receiveList.length) {
        return this.setMsg('暂无数据')
      }
      const downParams = {
        couponType: this.couponBaseInfo.type,
        couponId: this.couponId,
        customerName: this.searchName,
        useStatus: this.statusType + ''
      }
      let url = API_PATH + '/supervisor/platformCouponCustomer/export'
      downloadFile(url, downParams)
    },
    handleSizeChangeExtra(val) {
      this.currentPage = 1
      this.pageSize = val
      this.getPageData()
    },
    handleCurrentChangeExtra(val) {
      this.currentPage = val
      this.getPageData()
    }
  }
}
