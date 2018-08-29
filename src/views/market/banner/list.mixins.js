import tableMixins from '@/mixins/table'
import { indexBannerShowcaseList, indexBannerList, cPassDelWellChosen, cPassSetTop, cPassSetSelectionType } from '@/service/market'

export default {
  mixins: [tableMixins],
  data () {
    return {
      formDate: {
        title: ''
      },

      // 橱窗位
      showcaseData: [],
      showcaseTableLoading: false,
      showcaseTableEmpty: '暂无数据'
    }
  },
  mounted () {
    this.getShowCaseList()
    this.getPageData()
  },
  methods: {
    /**
     * 加精和取精
     * @param {[Numer]} id       [场地id]
     * @param {[Number]} status   [是否加精]
     */
    setRelease(id, status) {
      if (status && this.showcaseData.length >= 3) return

      this.$confirm(status ? '确认后将推送到活动新人限时抢展示, 是否继续?' : '确认后取消在活动展示, 是否继续?', '提示', { type: 'warning' }).then(() => {
        cPassSetSelectionType({
          selectionId: id,
          selectionType: status
        }).then(res => {
          if (res.status === 'true') {
            this.getShowCaseList()
            this.getPageData()
            this.setMsg('success', (status ? '加精成功' : '取消成功'))
          } else {
            this.setMsg('error', res.msg)
          }
        })
      }).catch(() => {
        this.setMsg('已取消删除')
      })
    },
    /**
     * 精选列表
     * @param  {[Number]} page [每次触发筛选条件，分页数重置为1]
     */
    getPageData(page) {
      this.currentPage = page || this.currentPage

      const ajaxParam = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        title: this.formDate.title
      }
      indexBannerList(ajaxParam).then(res => {
        if (res.status === 'true') {
          let resInfo = res.info
          if (resInfo) {
            this.pageTotal = resInfo.total
            this.tableData = resInfo.result
          }

          this.tableLoading = false
          if (this.tableData.length === 0) {
            this.tableEmpty = '暂无数据'
          }
        } else {
          this.tableLoading = false
          this.tableEmpty = '暂无数据'
          this.setMsg('error', res.msg)
        }
      })
    },
    // 置顶操作
    setFirst(id) {
      cPassSetTop({ selectionId: id }).then(res => {
        if (res.status === 'true') {
          this.getShowCaseList()
          this.setMsg('success', '置顶成功')
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },
    // 删除精选
    deleteField(id) {
      this.$confirm('此操作将永久删除该banner, 是否继续?', '提示', { type: 'warning' }).then(() => {
        cPassDelWellChosen({ selectionId: id }).then(res => {
          if (res.status === 'true') {
            this.getPageData()
            this.setMsg('success', '删除成功')
          } else {
            this.setMsg('已取消删除')
          }
        })
      }).catch(() => {
        this.setMsg('已取消删除')
      })
    },
    // 橱窗列表
    getShowCaseList() {
      indexBannerShowcaseList().then(res => {
        if (res.status === 'true') {
          this.showcaseData = res.info

          this.showcaseTableLoading = false
          if (this.showcaseData.length === 0) {
            this.showcaseTableEmpty = '暂无数据'
          }
        } else {
          this.showcaseTableEmpty = '暂无数据'
          this.showcaseTableLoading = false
          this.setMsg('error', res.msg)
        }
      })
    }
  }
}
