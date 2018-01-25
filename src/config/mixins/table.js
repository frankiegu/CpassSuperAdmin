// table 公共变量、方法
export default {
  data () {
    return {
      tableData: [],
      tableLoading: false,
      tableEmpty: ' ',

      // 分页器配置
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.getPageData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getPageData()
    }
  }
}
