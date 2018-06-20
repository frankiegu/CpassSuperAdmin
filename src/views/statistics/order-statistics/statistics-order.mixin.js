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
      orderList: [],
      orderLoading: false,

      // 分页器配置
      pageSizeArrExtra: [20, 40, 80, 100],
      layoutArrExtra: 'total, sizes, prev, pager, next, jumper',
      currentPageExtra: 1,
      pageSizeExtra: 20,
      pageTotalExtra: 0,
      tableEmpty: '暂无数据',
      fieldType: '',
      fieldTypeList: [{
        value: '1',
        label: '会议室'
      }, {
        value: '2',
        label: '多功能场地'
      }],
      orderType: '',
      orderStatusList: [{
        value: '1',
        label: '待使用'
      }, {
        value: '2',
        label: '已使用'
      }],
      orderTypeList: [
        {
          label: '总订单数',
          number: 100
        }, {
          label: '待使用',
          number: 20
        }, {
          label: '已使用',
          number: 60
        }, {
          label: '待退款',
          number: 10
        }, {
          label: '已退款/已取消',
          number: 10
        }
      ],
      legend: ['移动工位订单', '时租工位订单', '会议室订单', '路演厅订单', '多功能场地订单'],
      xAxisData: ['05-01', '05-02', '05-03', '05-04', '05-05', '05-06', '05-07'],
      seriesData: [
        {
          labelArray: [320, 302, 301, 334, 390, 330, 320]
        },
        {
          labelArray: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          labelArray: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          labelArray: [150, 212, 201, 154, 190, 330, 410]
        },
        {
          labelArray: [820, 832, 901, 934, 1290, 1330, 1320]
        }
      ],
      currentIndex: 0, // 当前选中
      formData: {
        type: '',
        date: ''
      }
    }
  },
  mounted () {
    // this.getPageData()
  },
  computed: {
    option() {
      let that = this
      var series = [];
      that.seriesData.forEach((item, index) => {
        series.push({
          name: that.legend[index],
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          data: item.labelArray
        })
      })
      let obj = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: that.legend
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          type: 'value'
        },
        xAxis: {
          type: 'category',
          data: that.xAxisData
        },
        series: series
      }
      return obj;
    }
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
        },
        {
          labelArray: [405, 23, 54, 33]
        },
        {
          labelArray: [220, 34, 55, 66]
        },
        {
          labelArray: [150, 97, 64, 32]
        },
        {
          labelArray: [234, 345, 424, 453]
        }
      ]
      this.myChart.hideLoading();
      this.myChart.setOption(this.option)
      // 日期选择器
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
    sortByStatus(index) {
      this.currentIndex = index
      this.getPageData()
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
    // 查看统计明细
    viewOrderDetail() {
      this.dialogVisible = true
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
