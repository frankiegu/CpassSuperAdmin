import tableMixins from '@/mixins/table'
import { serviceOrderList } from '@/service/order'

export default {
  mixins: [tableMixins],
  components: {},
  data () {
    return {
      formData: {
        name: ''
      }
    }
  },
  mounted () {
    this.getPageData()
  },
  methods: {
    formatTime(time) {
      return !time ? '' : time.replace(/:\d{2}$/, '')
    },
    getPageData(page) {
      this.currentPage = page || this.currentPage
      const formData = this.formData
      const paramsObj = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        orderNum: formData.name
      }

      serviceOrderList(paramsObj).then(res => {
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
    }
  }
}
