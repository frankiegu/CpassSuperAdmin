/**
 * table 公共变量
 * 方便大家扩展，进行数据分离
 */
export default {
  data () {
    return {
      tableData: [],
      tableLoading: false,
      tableEmpty: ' ',

      // 分页器配置
      pageSizeArr: [20, 40, 80, 100],
      layoutArr: 'total, sizes, prev, pager, next, jumper',
      currentPage: 1,
      pageSize: 20,
      pageTotal: 0
    }
  }
}
