// table 公共变量、方法
import tableData from '@/mixins/table/data'
export default {
  mixins: [tableData],
  methods: {
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
      this.getPageData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getPageData()
    }
  }
}
