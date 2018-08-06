import tableMixins from '@/mixins/table'
import { API_PATH } from '@/config/env'
import { downloadFile, formatTimeString } from '@/config/utils'
import radioPicker from '@/mixins/radio-datePicker'
import { fieldStatisticsNew, findAddSpaceDetail, findAddStoreDetail, findAddFieldDetail } from '@/service/statistics'

export default {
  mixins: [tableMixins, radioPicker],
  data () {
    return {
      typeList: [
        { val: 5, text: '全部' },
        { val: 1, text: '已对C-PASS展示' },
        { val: 0, text: '未对C-PASS展示' }
      ],
      fieldList: [
        { val: 7, text: '全部' },
        { val: 3, text: '日租工位' },
        { val: 6, text: '时租工位' },
        { val: 1, text: '会议室' },
        { val: 2, text: '路演厅' },
        { val: 5, text: '办公室' },
        { val: 4, text: '多功能室' }
      ],
      orderTypeList: [
        {
          label: '全部',
          number: ''
        }, {
          label: '自由工位(天)',
          number: ''
        }, {
          label: '时租工位(时)',
          number: ''
        }, {
          label: '会议室',
          number: ''
        }, {
          label: '路演厅',
          number: ''
        }, {
          label: '办公室',
          number: ''
        }, {
          label: '多功能室',
          number: ''
        }
      ],
      formData: {
        type: '',
        date: '',
        fieldTyoe: ''
      },
      dateRange: '', // 日期选择器
      dialogVisible: false, // 新增场地dialog
      periodId: 1, // 周期  1日 2周 3月

      startTime: '',
      endTime: '',
      diatableData: [], // 弹窗分页请求
      diapageTotal: 0, // 弹窗分页器显示的总数
      dialogTitle: '', // 弹窗标题
      dialogId: '', // 弹窗显示的Id
      dialogWidth: '', // 弹窗宽度
      dialogType: '', // 弹窗类型  1 新增品牌  2  新增空间  3 新增场地总数
      dialogDate: '' // 弹窗上的日期
    }
  },
  mounted () {
    this.getPageData()
  },
  methods: {
    // 新增统计
    getPageData(page) {
      this.currentPage = page || this.currentPage
      const paramsObj = {
        isPlatformOpen: this.formData.type === 5 ? '' : this.formData.type,
        dayType: this.selectedPeriod,
        startTime: this.dateRange ? formatTimeString(this.dateRange[0]) : null,
        endTime: this.dateRange ? formatTimeString(this.dateRange[1]) : null,
        fieldType: '',
        pageSize: this.pageSize,
        pageNum: this.currentPage
      }
      fieldStatisticsNew(paramsObj).then(res => {
        if (res.status === 'true') {
          // 场地概况
          this.orderTypeList[0].number = res.info.fieldGeneralSituation.allFieldCount || 0
          this.orderTypeList[1].number = res.info.fieldGeneralSituation.stationCount || 0
          this.orderTypeList[2].number = res.info.fieldGeneralSituation.hourStationCount || 0
          this.orderTypeList[3].number = res.info.fieldGeneralSituation.meetingCount || 0
          this.orderTypeList[4].number = res.info.fieldGeneralSituation.roadshowHallCount || 0
          this.orderTypeList[5].number = res.info.fieldGeneralSituation.officeCount || 0
          this.orderTypeList[6].number = res.info.fieldGeneralSituation.otherCount || 0

          // 新增统计(echarts)
          var date = []
          var spaceDate = []
          var storeDate = []
          var fieldDate = []

          // forEach遍历会慢一些
          // res.info.viewList.forEach((item, index) => {
          //   date[index] = item.relationDate
          //   spaceDate[index] = item.newSpaceCount
          //   storeDate[index] = item.newStoreCount
          //   fieldDate[index] = item.newFieldCount
          // })

          // 用一个临时变量缓存数组长度，再用for循环，节省遍历时间
          for (var j = 0, len = res.info.viewList.length; j < len; j++) {
            date[j] = res.info.viewList[j].relationDate
            spaceDate[j] = res.info.viewList[j].newSpaceCount
            storeDate[j] = res.info.viewList[j].newStoreCount
            fieldDate[j] = res.info.viewList[j].newFieldCount
          }
          this.option.xAxis.data = date
          this.option.series[0].data = spaceDate
          this.option.series[1].data = storeDate
          this.option.series[2].data = fieldDate
          // console.log(this.option.xAxis)
          this.drawLine();

          // 统计明细(表格)
          if (res.info.pageList) {
            this.pageTotal = res.info.pageList.total
            this.tableData = res.info.pageList.result
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
    // 弹窗内容分页请求
    diahandleCurrentChange (val) {
      this.diacurrentPage = val || this.diacurrentPage

      const paramsObj = {
        startTime: this.startTime,
        endTime: this.endTime,
        pageSize: this.diapageSize,
        pageNum: this.diacurrentPage
      }

      // 品牌
      if (this.dialogType === 1) {
        findAddSpaceDetail(paramsObj).then(res => {
          if (res.status === 'true') {
            let data = res.info
            if (data) {
              this.diapageTotal = data.total
              this.diatableData = data.result
            }

            this.tableLoading = false
            if (this.tableData.length === 0) {
              this.tableEmpty = '暂时无数据'
            }
          } else {
            this.setMsg('error', res.msg)
          }
        })
      } else if (this.dialogType === 2) {
        findAddStoreDetail(paramsObj).then(res => {
          if (res.status === 'true') {
            let data = res.info
            if (data) {
              this.diapageTotal = data.total
              this.diatableData = data.result
            }

            this.tableLoading = false
            if (this.tableData.length === 0) {
              this.tableEmpty = '暂时无数据'
            }
          } else {
            this.setMsg('error', res.msg)
          }
        })
      } else if (this.dialogType === 3) {
        paramsObj.fieldType = this.formData.fieldType === 7 ? '' : this.formData.fieldType
        findAddFieldDetail(paramsObj).then(res => {
          if (res.status === 'true') {
            let data = res.info
            if (data) {
              this.diapageTotal = data.total
              this.diatableData = data.result
            }

            this.tableLoading = false
            if (this.tableData.length === 0) {
              this.tableEmpty = '暂时无数据'
            }
          } else {
            this.setMsg('error', res.msg)
          }
        })
      }
    },
    diahandleSizeChange (val) {
      this.diapageSize = val
      this.diahandleCurrentChange(1)
    },
    // 导出数据
    exportExcel() {
      if (!this.tableData.length) {
        return this.setMsg('暂无数据')
      }
      const downParams = {
        dayType: this.selectedPeriod,
        startTime: this.dateRange ? formatTimeString(this.dateRange[0]) : null,
        endTime: this.dateRange ? formatTimeString(this.dateRange[1]) : null
      }
      let url = API_PATH + '/supervisor/fieldStatistics/exportFieldAddStatistics'
      downloadFile(url, downParams)
    }
  }
}
