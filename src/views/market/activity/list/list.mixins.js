import tableMixins from '@/mixins/table'
import { platformActivityList } from '@/service/market'

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
      orderBy: '', // 列表排序 开始时间 升序 10 降序 11 结束时间 升序 20 降序 21
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
    change(sort) {
      console.log(sort)

      if (sort.prop === 'startDate' && sort.order === 'ascending') {
        this.orderBy = 10
      } else if (sort.prop === 'startDate' && sort.order === 'descending') {
        this.orderBy = 11
      } else if (sort.prop === 'endDate' && sort.order === 'ascending') {
        this.orderBy = 20
      } else if (sort.prop === 'endDate' && sort.order === 'descending') {
        this.orderBy = 21
      } else {
        this.orderBy = 0
      }
      this.getPageData()
    },
    getPageData(page) {
      this.currentPage = page || this.currentPage
      const paramsObj = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        type: this.formData.type,
        status: this.formData.status,
        orderBy: this.orderBy
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
