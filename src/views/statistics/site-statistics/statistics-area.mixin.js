import tableMixins from '@/mixins/table'
import { API_PATH } from '@/config/env'
import { downloadFile } from '@/config/utils'
import { storeDistributeByArea, fieldDistributeByArea } from '@/service/statistics'

export default {
  mixins: [tableMixins],
  data () {
    return {
      typeList: [
        { val: 5, text: '全部' },
        { val: 1, text: '已对C-PASS展示' },
        { val: 0, text: '未对C-PASS展示' }
      ],
      formData: {
        spaceType: '',
        fieldType: ''
      },

      spaceData: [],
      fieldData: [],

      orderTypeList: [
        {
          label: '全部',
          number: '',
          key: ''
        }, {
          label: '移动工位',
          number: '',
          key: 3
        }, {
          label: '时租工位(时)',
          number: '',
          key: 6
        }, {
          label: '会议室',
          number: '',
          key: 1
        }, {
          label: '路演厅',
          number: '',
          key: 2
        }, {
          label: '办公室',
          number: '',
          key: 5
        }, {
          label: '多功能室',
          number: '',
          key: 4
        }
      ],
      fieldType: '', // 场地类型
      currentIndex: 0 // 当前页面
    }
  },
  mounted () {
    this.getSpaceData()
    this.getFieldData()
  },
  methods: {
    getSpaceData(page) {
      this.currentPage = page || this.currentPage
      const paramsObj = {
        isPlatformOpen: this.formData.spaceType === 5 ? '' : this.formData.spaceType
      }

      storeDistributeByArea(paramsObj).then(res => {
        if (res.status === 'true') {
          // 空间地区分布的表格
          this.spaceData = res.info

          this.tableLoading = false
          if (this.spaceData.length === 0) {
            this.tableEmpty = '暂时无数据'
          }

          // 空间地区分布的echarts
          var obj = {}
          this.option1.series[0].data = []
          for (let j = 0, len = res.info.length; j < len; j++) {
            this.option1.legend.data[j] = res.info[j].cityName
            obj = {}
            obj.name = res.info[j].cityName
            obj.value = res.info[j].storeCount
            this.option1.series[0].data.push(obj)
          }
          this.drawLine1()
        } else {
          this.setMsg('error', res.msg)
          this.tableEmpty = '暂时无数据'
        }
      })
    },
    getFieldData(page) {
      this.fieldCurrentPage = page || this.fieldCurrentPage
      const paramsObj = {
        isPlatformOpen: this.formData.fieldType === 5 ? '' : this.formData.fieldType,
        fieldType: this.fieldType
      }

      fieldDistributeByArea(paramsObj).then(res => {
        if (res.status === 'true') {
          // 场地分布数据赋值
          this.orderTypeList[0].number = res.info.fieldGeneralSituation.allFieldCount || 0
          this.orderTypeList[1].number = res.info.fieldGeneralSituation.stationCount || 0
          this.orderTypeList[2].number = res.info.fieldGeneralSituation.hourStationCount || 0
          this.orderTypeList[3].number = res.info.fieldGeneralSituation.meetingCount || 0
          this.orderTypeList[4].number = res.info.fieldGeneralSituation.roadshowHallCount || 0
          this.orderTypeList[5].number = res.info.fieldGeneralSituation.officeCount || 0
          this.orderTypeList[6].number = res.info.fieldGeneralSituation.otherCount || 0

          // 场地地区分布的表格
          this.fieldData = res.info.fieldRegionDistributionList

          this.tableLoading = false
          if (this.fieldData.length === 0) {
            this.tableEmpty = '暂时无数据'
          }

          // 场地地区分布的echarts
          let obj = {}
          this.option2.series[0].data = []
          for (let j = 0, len = res.info.fieldRegionDistributionList.length; j < len; j++) {
            this.option2.legend.data[j] = res.info.fieldRegionDistributionList[j].cityName
            obj = {}
            obj.name = res.info.fieldRegionDistributionList[j].cityName
            obj.value = res.info.fieldRegionDistributionList[j].fieldCount
            this.option2.series[0].data.push(obj)
          }
          this.drawLine2()
        } else {
        }
      })
    },
    // 根据状态筛选
    sortByStatus(index, key) {
      if (this.currentIndex !== index) {
        this.fieldType = key
        this.getFieldData()
      }
      this.currentIndex = index
    },
    // 导出空间数据
    exportSpaceExcel() {
      const self = this
      console.log(self.formData.spaceType)
      if (!self.spaceData.length) {
        return self.setMsg('暂无数据')
      }
      const downParams = {
        isPlatformOpen: self.formData.spaceType === 5 ? '' : self.formData.spaceType
      }
      let url = API_PATH + '/supervisor/fieldStatistics/exportStoreDistributeByArea'
      downloadFile(url, downParams)
    },
    // 导出场地数据
    exportFieldExcel() {
      const self = this
      if (!self.fieldData.length) {
        return self.setMsg('暂无数据')
      }
      const downParams = {
        isPlatformOpen: self.formData.fieldType === 5 ? '' : self.formData.fieldType,
        fieldType: self.fieldType
      }
      let url = API_PATH + '/supervisor/fieldStatistics/exportFieldDistributeByArea'
      downloadFile(url, downParams)
    }
  }
}
