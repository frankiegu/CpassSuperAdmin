import tableMixins from '@/mixins/table'
import { clientList } from '@/service/client'

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
    getPageData() {
      const formData = this.formData
      const paramsObj = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        name: formData.name
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
