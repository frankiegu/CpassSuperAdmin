import tableMixins from '@/mixins/table'
import { API_PATH } from '@/config/env'
import { downloadFile } from '@/config/utils'
import { platformActivityList } from '@/service/market'

export default {
  mixins: [tableMixins],
  data () {
    return {
      typeList: [
        { val: 5, text: '全部' },
        { val: 1, text: '已对C-PASS展示' },
        { val: 2, text: '未对C-PASS展示' }
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
          number: 100
        }, {
          label: '移动工位',
          number: 20
        }, {
          label: '时租工位(时)',
          number: 60
        }, {
          label: '会议室',
          number: 10
        }, {
          label: '路演厅',
          number: 10
        }, {
          label: '办公室',
          number: 10
        }, {
          label: '多功能室',
          number: 10
        }
      ],
      currentIndex: 0, // 当前页面
      periodId: 1 // 周期  1日 2周 3月
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
            this.spaceData = data.result
          }

          this.tableLoading = false
          if (this.spaceData.length === 0) {
            this.tableEmpty = '暂时无数据'
          }
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },
    getFieldData(page) {
      this.fieldCurrentPage = page || this.fieldCurrentPage
      const paramsObj = {
        pageSize: this.fieldPageSize,
        pageNum: this.fieldCurrentPage,
        type: this.formData.type === 5 ? '' : this.formData.type,
        status: this.formData.status === 5 ? '' : this.formData.status
      }

      platformActivityList(paramsObj).then(res => {
        if (res.status === 'true') {
          let data = res.info
          if (data) {
            this.fieldPageTotal = data.total
            this.fieldData = data.result
          }

          this.tableLoading = false
          if (this.fieldData.length === 0) {
            this.tableEmpty = '暂时无数据'
          }
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },
    // 根据状态筛选
    sortByStatus(index) {
      this.currentIndex = index
    },
    // 导出空间数据
    exportSpaceExcel() {
      if (!this.spaceData.length) {
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
    // 导出场地数据
    exportFieldExcel() {
      if (!this.fieldData.length) {
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
    }
  }
}
