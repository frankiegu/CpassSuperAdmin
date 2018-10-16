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
    this.tableData = [
      {
        name: '老板',
        userList: 'hekkerjerj',
        status: '可用',
        desc: '科技部烦恼的功夫'
      },
      {
        name: '老板',
        userList: 'hekkerjerj',
        status: '可用',
        desc: '科技部烦恼的功夫'
      },
      {
        name: '老板',
        userList: 'hekkerjerj',
        status: '可用',
        desc: '科技部烦恼的功夫'
      }
    ]
  },
  watch: {},
  computed: {},
  methods: {
    // 二次弹窗确认
    handleChangeUseState (action) {
      this.$confirm(`确认${action}此用户？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      }).catch(() => {})
    }
  }
}
