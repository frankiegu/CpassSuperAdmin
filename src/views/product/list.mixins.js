import tableMixins from '@/mixins/table'
import { productList } from '@/service/product'

export default {
  mixins: [tableMixins],
  data () {
    return {
      id: '',
      formData: {
        name: ''
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
        activityName: this.formData.name
      }

      productList(paramsObj).then(res => {
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

    // 恢复状态
    restore(id, status) {
      this.$confirm('此操作将恢复该版本, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '恢复成功!'
        });
        // 修改状态、刷新页面数据
        this.getPageData()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消恢复'
        })
      })
    },

    // 禁用状态
    disable(id, status) {
      this.$confirm('此操作将禁用该版本, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '禁用成功!'
        })
        // 修改状态、刷新页面数据
        this.getPageData()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消禁用'
        })
      })
    }
  }
}
