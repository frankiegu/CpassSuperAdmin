import tableMixins from '@/mixins/table'
import { serviceList } from '@/service'

export default {
  mixins: [tableMixins],
  data () {
    return {
      id: '',
      statusList: [
        { val: 10, text: '未发布' },
        { val: 20, text: '未开始' },
        { val: 30, text: '进行中' },
        { val: 40, text: '已结束' },
        { val: 50, text: '暂停' }
      ],
      typeList: [
        { val: 10, text: '普通活动' },
        { val: 20, text: '互动游戏' }
      ],
      formData: {
        name: '',
        type: '',
        status: ''
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
        pageNum: this.currentPage
      }

      serviceList(paramsObj).then(res => {
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
