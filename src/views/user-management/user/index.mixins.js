import { checkPhone } from '@/config/utils'
import { getUserList, openUser, closeUser, deleteUser } from '@/service'

export default {
  data () {
    // 检测电话号码
    let validateTel = (rule, value, callback) => {
      if (!checkPhone(value)) {
        callback(new Error('请输入正确的手机号'));
      } else {
        // checkField('contactTel', value, callback)
        callback()
      }
    }
    // 验证邮箱
    let checkEmail = (rule, value, callback) => {
      let emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      let companyEmailReg = /^([a-zA-Z0-9_-])+@(gzleihou\.cn|cpass\.net)$/
      if (!emailReg.test(value)) {
        callback(new Error('邮箱格式不正确'))
      }
      if (!companyEmailReg.test(value)) {
        callback(new Error('例：xx@gzleihou.cn，xx@cpass.net'))
      }
      callback()
    }
    return {
      userFormTitle: '',
      formData: {
        userName: '',
        realName: '',
        roleId: ''
      },
      userForm: {
        id: '',
        userName: '',
        realName: '',
        email: '',
        role: '',
        description: '',
        useState: '可用',
        roles: [
          { id: 1, role: 'root' },
          { id: 2, role: '管理员' },
          { id: 3, role: '运营主管' }
        ]
      },
      rules: {
        userName: [
          { required: true, message: '请输入手机号', trigger: ['blur', 'change'] },
          { validator: validateTel, trigger: ['blur', 'change'] }
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: ['blur', 'change'] }
        ],
        email: [
          { required: true, message: '请输入公司邮箱', trigger: ['blur', 'change'] },
          { validator: checkEmail, trigger: ['blur', 'change'] }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: ['blur', 'change'] }
        ],
        useState: [
          { required: true, message: '请选择可用状态', trigger: ['blur', 'change'] }
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
        { id: 1, userNumber: '9527', userName: '18819901111', realName: '小明', email: 'test@gzleihou.cn', role: '管理员', useState: '可用', description: '打工仔' },
        { id: 2, userNumber: '9527', userName: '18819901111', realName: '小明', email: 'test@gzleihou.cn', role: 'root', useState: '可用', description: '超级管理员' },
        { id: 3, userNumber: '9527', userName: '18819901111', realName: '小明', email: 'test@cpass.net', role: '管理员', useState: '禁用', description: '打工仔' },
        { id: 4, userNumber: '9527', userName: '18819901111', realName: '小明', email: 'test@cpass.net', role: '管理员', useState: '可用', description: '' }
      ]
    }
  },
  props: {},
  components: {},
  mounted() {
    // this.getPageData()
  },
  watch: {},
  computed: {},
  methods: {
    // 获取用户列表
    async getPageData(page) {
      this.currentPage = page || this.currentPage
      const params = {
        username: this.formData.userName,
        name: this.formData.realName,
        role: this.formData.roleId,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      const res = await getUserList(params)
      if (res.status === 'true') {
        const data = res.info.page
        if (data) {
          this.tableData = data.result
          this.pageTotal = data.total
        }
      } else {
        this.setMsg('error', res.msg)
      }
    },
    handleChangeUseState (index, action) {
      this.$confirm(`确认${action}此用户？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (action === '删除') {
          deleteUser({ id: this.tableData[index].id })
            .then(res => {
              if (res.status === 'true') {
                this.getPageData()
              } else {
                this.setMsg('error', res.msg)
              }
            }).catch(() => {})
        } else {
          this.changeUseState(index, action)
        }
      }).catch(() => {})
    },
    changeUseState(index, action) {
      let actionMethod = action === '禁用' ? closeUser : openUser
      actionMethod({ id: this.tableData[index].id })
        .then(res => {
          if (res.status === 'true') {
            this.tableData[index].useState = action === '禁用' ? '禁用' : '可用'
          } else {
            this.setMsg('error', res.msg)
          }
        }).catch(() => {})
    },
    setUser (item) {
      if (item) {
        this.userFormTitle = '编辑用户'
        Object.assign(this.userForm, item)
      } else {
        this.userForm.id = ''
        this.userForm.userNumber = ''
        this.userFormTitle = '新增用户'
      }
      this.isShowUserForm = true
    },
    cancelSet (formName) {
      this.isShowUserForm = false
      this.$refs[formName].resetFields()
    },
    postSave (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$message({ showClose: true, type: 'warning', message: '数据验证合格' })
        } else {
          this.$message({ showClose: true, type: 'warning', message: '数据验证失败' })
        }
      })
    }
  }
}
