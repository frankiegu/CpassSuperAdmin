import tableMixins from '@/mixins/table'
import { clientList } from '@/service/client'

export default {
  mixins: [tableMixins],
  data () {
    return {}
  },
  mounted () {
    this.getPageData()
  },
  methods: {
    getPageData() {
      const paramsObj = {
        pageSize: this.pageSize,
        pageNum: this.currentPage
      }

      clientList(paramsObj).then(res => {
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
