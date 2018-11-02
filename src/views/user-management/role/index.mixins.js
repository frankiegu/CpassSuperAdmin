import { roleList, closeRole, openRole, deleteRole } from '@/service'

export default {
  data () {
    return {
      formData: {
        roleName: ''
      }
    }
  },
  props: {},
  components: {},
  mounted() {
    this.getPageData()
  },
  watch: {},
  computed: {},
  methods: {
    // 获取角色列表
    async getPageData(page) {
      this.currentPage = page || this.currentPage
      const params = {
        roleName: this.formData.roleName,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      const res = await roleList(params)
      if (res.status === 'true') {
        const data = res.info.page
        if (data) {
          this.tableData = data.result
          this.pageTotal = data.total
          this.tableData = data.result
        }
      } else {
        this.setMsg('error', res.msg)
      }
    },
    // 二次弹窗确认
    handleChangeUseState (type, row) {
      let index = type - 1
      const actionList = ['禁用', '恢复', '删除']
      this.$confirm(`确认${actionList[index]}"${row.roleName}"角色？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 如果是删除操作，需要判断该角色是否已分配了用户
        if (actionList[index] === '删除' && +row.adminUserCount > 0) {
          this.setMsg('error', `此角色已配分配给${row.adminUserCount}名用户，不允许删除`)
          return
        }
        let methodList = [closeRole, openRole, deleteRole]
        methodList[index]({ roleId: row.id }).then(res => {
          if (res.status === 'true') {
            this.getPageData()
            this.setMsg('success', `${actionList[index]}成功`)
          } else {
            this.setMsg('error', res.msg)
          }
        })
      }).catch(() => {})
    }
  }
}
