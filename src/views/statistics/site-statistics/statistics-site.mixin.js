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
        { val: 1, text: '普通活动' },
        { val: 2, text: '互动游戏' }
      ],
      fieldList: [
        { val: 1, text: '全部' },
        { val: 2, text: '移动工位' },
        { val: 3, text: '时租工位' },
        { val: 4, text: '会议室' },
        { val: 5, text: '路演厅' },
        { val: 6, text: '办公室' },
        { val: 7, text: '多功能办公室' }
      ],
      formData: {
        type: '',
        date: '',
        fieldTyoe: ''
      },
      brandDialogVisible: false, // 新增品牌dialog
      spaceDialogVisible: false, // 新增空间dialog
      fieldDialogVisible: false, // 新增场地dialog
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
    }
  }
}
