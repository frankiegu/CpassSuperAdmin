import tableMixins from '@/mixins/table'
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
      formData: {
        type: ''
      }
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
    }
  }
}
