export default {
  data () {
    return {
      formData: {
        userName: '',
        realName: '',
        rolaName: ''
      },
      userForm: {
        name: '',
        tel: '',
        email: '',
        role: '',
        roles: [
          { id: 1, role: 'root' },
          { id: 2, role: '管理员' },
          { id: 3, role: '运营主管' }
        ]
      },
      isShowUserForm: false,
      roles: [
        { id: ' ', role: '全部' },
        { id: 1, role: 'root' },
        { id: 2, role: '管理员' },
        { id: 3, role: '运营主管' }
      ],
      tableData: [
        { id: 1, userName: '123123123', realName: '小明', email: 'test@126.com', role: '管理员', useState: '可用', descript: '打工仔' },
        { id: 2, userName: '123123123', realName: '小明', email: 'test@126.com', role: 'root', useState: '可用', descript: '超级管理员' },
        { id: 3, userName: '123123123', realName: '小明', email: 'test@126.com', role: '管理员', useState: '禁用', descript: '打工仔' },
        { id: 4, userName: '123123123', realName: '小明', email: 'test@126.com', role: '管理员', useState: '可用', descript: '打工仔' }
      ]
    }
  },
  props: {},
  components: {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    handleDeleteUser (index, item) {
      this.$confirm('确认删除此用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteUser(index)
      }).catch(() => {})
    },
    handleChangeUseState (index, action) {
      this.$confirm(`确认${action}此用户？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeUseState(index, action)
      }).catch(() => {})
    },
    deleteUser(index) {
      console.log('删除了该用户！')
      this.tableData.splice(index, 1)
    },
    changeUseState(index, action) {
      console.log('改变了该用户状态！')
      this.tableData[index].useState = action === '禁用' ? '禁用' : '可用'
    },
    setUser (id) {
      this.isShowUserForm = true
    },
    cancelSet () {
      this.isShowUserForm = false
    }
  }
}
