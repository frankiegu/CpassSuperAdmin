import { checkPhone } from '@/config/utils'
import { getUserList, openUser, closeUser, createUser, updateUser, deleteUser } from '@/service'

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
        userName: '',
        realName: '',
        email: '',
        role: '',
        description: '',
        userStateCode: 1
      },
      roles: [
        { id: 1, role: 'root' },
        { id: 2, role: '管理员' },
        { id: 3, role: '运营主管' }
      ],
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
        userStateCode: [
          { required: true, message: '请选择可用状态', trigger: ['blur', 'change'] }
        ]
      },
      isShowUserForm: false,
      tableData: [
        { id: 1, userName: '18819901111', realName: '小明', email: 'test@gzleihou.cn', role: '管理员', userStateCode: 1, description: '打工仔' },
        { id: 2, userName: '18819901111', realName: '小明', email: 'test@gzleihou.cn', role: 'root', userStateCode: 1, description: '超级管理员' },
        { id: 3, userName: '18819901111', realName: '小明', email: 'test@cpass.net', role: '管理员', userStateCode: 0, description: '打工仔' },
        { id: 4, userName: '18819901111', realName: '小明', email: 'test@cpass.net', role: '管理员', userStateCode: 1, description: '' }
      ]
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
    // 改变用户账号状态
    handleChangeUseState (index, action) {
      let actionList = {
        '删除': deleteUser,
        '禁用': closeUser,
        '恢复': openUser
      }
      this.$confirm(`确认${action}此用户？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return actionList[action]({ id: this.tableData[index].id })
          .then(res => {
            if (res.status === 'true') {
              if (action === '删除') {
                this.getPageData()
              } else {
                this.tableData[index].userStateCode = action === '禁用' ? 0 : 1
              }
            } else {
              this.setMsg('error', res.msg)
            }
          })
      }).catch(() => {})
    },
    // 新增编辑用户
    setUser (index) {
      if (arguments.length) {
        this.userFormTitle = '编辑用户'
        this.userForm.index = index
        Object.assign(this.userForm, this.tableData[index])
      } else {
        delete this.userForm.index
        delete this.userForm.id
        this.userFormTitle = '新增用户'
      }
      this.isShowUserForm = true
    },
    // 关闭用户信息窗
    cancelSet (formName) {
      this.isShowUserForm = false
      this.$refs[formName].resetFields()
    },
    // 保存更改
    postSave (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let actionList = {
            '新增用户': createUser,
            '编辑用户': updateUser
          }
          let params = {
            username: this.userForm.userName,
            name: this.userForm.realName,
            email: this.userForm.email,
            role: this.userForm.role,
            statusCode: this.userForm.userStateCode,
            supervisorDesc: this.userForm.description
          }
          if (this.userFormTitle === '编辑用户') {
            params.id = this.userForm.id
          }
          actionList[this.userFormTitle](params)
            .then(res => {
              if (res.status === 'true') {
                this.isShowUserForm = false
                this.tableData[this.userForm.index] && Object.assign(this.tableData[this.userForm.index], this.userForm)
              } else {
                this.setMsg('error', res.msg)
              }
            }).catch(() => {})
        }
      })
    }
  }
}
