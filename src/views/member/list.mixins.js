import tableMixins from '@/mixins/table'
import { CUSTOMER_LIST } from '@/service/member'

export default {
  mixins: [tableMixins],
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
    getPageData() {
      const formData = this.formData
      const paramsObj = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        nickname: formData.name
      }

      CUSTOMER_LIST(paramsObj).then(res => {
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
