import tableMixins from '@/mixins/table'
import radioPicker from '@/mixins/radio-datePicker'
import { API_PATH } from '@/config/env'
import { downloadFile } from '@/config/utils'
import { platformActivityList } from '@/service/market'

export default {
  mixins: [tableMixins, radioPicker],
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
        date: ''
      },
      xAxisData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      seriesData: [
        {
          labelArray: [120, 132, 101, 134, 90, 230, 210]
        }
      ]
    }
  },
  computed: {
    option() {
      let that = this
      var series = [];
      that.seriesData.forEach(item => {
        series.push({
          type: 'line',
          stack: '总量',
          data: item.labelArray
        })
      })
      let obj = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: that.xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: series
      }
      return obj
    }
  },
  mounted () {
    // this.getPageData()
  },
  methods: {
    getPageData(page) {
      // Echart 的加载，避免出现空白
      this.myChart.showLoading({
        maskColor: 'rgba(255, 255, 255, 0.8)',
        text: '正在加载~',
        textColor: '#5A72F6',
        color: '#5A72F6'
      })
      this.myChart.clear()
      this.xAxisData = ['3月', '4月', '5月', '6月']
      this.seriesData = [
        {
          labelArray: [120, 322, 57, 43]
        }
      ]
      this.myChart.hideLoading();
      this.myChart.setOption(this.option)

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
