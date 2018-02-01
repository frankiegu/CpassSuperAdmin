import {PHONEREG, API_PATH} from '../../config/env'
// import {loadConstant} from '@/service'

export default {
  data () {
    // 自定义校验规则
    const checkTel = (rule, value, callback) => {
      if (this.dataForm.isCreateAccount) {
        if (!value) {
          return callback(new Error('登录账号不能为空！'))
        }
        if (!PHONEREG.test(value)) {
          callback(new Error('账号格式错误（正确的手机号码）！'))
        }
        callback()
      }
      callback()
    }
    const checkProduct = (rule, value, callback) => {
      if (this.dataForm.isCreateAccount) {
        if (!value) {
          return callback(new Error('产品不能为空！'))
        }
        callback()
      }
      callback()
    }
    const checkValidity = (rule, value, callback) => {
      if (this.dataForm.isCreateAccount && !this.dataForm.isPermanent) {
        if (!value || value.length < 2) {
          return callback(new Error('请选择有效期限或永久有效'))
        }
        callback()
      }
      callback()
    }
    const checkAppId = (rule, value, callback) => {
      if (this.dataForm.isCreateAccount) {
        if (!value) {
          return callback(new Error('AppID不能为空！'))
        }
        callback()
      }
      callback()
    }
    const checkAppSecret = (rule, value, callback) => {
      if (this.dataForm.isCreateAccount) {
        if (!value) {
          return callback(new Error('AppSecret不能为空！'))
        }
        callback()
      }
      callback()
    }
    const checkInFile = (rule, value, callback) => {
      if (this.dataForm.isCreateAccount) {
        if (!value) {
          if (this.hasJsFile > 0) {
            return callback(new Error('非正确的接口文件！'))
          } else {
            return callback(new Error('未上传接口文件！'))
          }
        }
        callback()
      }
      callback()
    }
    const checkMchId = (rule, value, callback) => {
      if (this.dataForm.isCreateAccount && this.dataForm.isOpenPayment) {
        if (!value) {
          return callback(new Error('mch_ID不能为空！'))
        }
        callback()
      }
      callback()
    }
    const checkServiceKey = (rule, value, callback) => {
      if (this.dataForm.isCreateAccount && this.dataForm.isOpenPayment) {
        if (!value) {
          return callback(new Error('key不能为空！'))
        }
        callback()
      }
      callback()
    }
    const checkCeFile = (rule, value, callback) => {
      if (this.dataForm.isCreateAccount && this.dataForm.isOpenPayment) {
        if (!value) {
          if (this.hasP12File > 0) {
            return callback(new Error('非正确的证书！'))
          } else {
            return callback(new Error('未上传证书！'))
          }
        }
        callback()
      }
      callback()
    }
    return {
      title: this.$route.query.id ? '客户详情' : '新增客户',
      clientId: this.$route.query.id,
      hasChangeForm: false,

      productList: {1: '完整版'},
      jsUploadPath: API_PATH + '/admin/client/uploadJsFile',
      p12UploadPath: API_PATH + '/admin/client/uploadPayCertFile',
      hasJsFile: 0,
      hasP12File: 0,
      uploadLoading1: false,
      uploadLoading2: false,
      dialogVisible: false,
      dataForm: {
        // 客户基础信息
        name: '',
        contact: '',
        phone: '',
        email: '',
        address: '',
        weixin: '',
        remark: '',
        saleManager: '',
        isCreateAccount: false,

        // 开通账户信息
        productId: '',
        validity: '', // 有效期
        isPermanent: false, // 是否永久有效
        account: '',
        useStatus: 1,
        appId: '',
        appSecret: '',
        jsFile: '', // JS接口文件

        // 开通微信支付功能
        isOpenPayment: false,
        mchId: '', // 客户服务号mch_ID
        serviceKey: '', // 客户服务号key
        certificate: '' // 支付证书
      },

      dataRules: {
        productId: [{validator: checkProduct, trigger: 'blur, change'}],
        validity: [{validator: checkValidity, trigger: 'blur, change', type: 'array'}],
        account: [{validator: checkTel, trigger: 'blur, change'}],
        appId: [{validator: checkAppId, trigger: 'blur, change'}],
        appSecret: [{validator: checkAppSecret, trigger: 'blur, change'}],
        jsFile: [{validator: checkInFile, trigger: 'blur, change'}],
        mchId: [{validator: checkMchId, trigger: 'blur, change'}],
        serviceKey: [{validator: checkServiceKey, trigger: 'blur, change'}],
        certificate: [{validator: checkCeFile, trigger: 'blur, change'}]
      }
    }
  },
  mounted() {
    document.title = this.title
    this.$store.commit('NAV_CRUMB', this.title)
    if (this.clientId) this.handleGetDetail()

    // 获取产品类型 productConst
    // loadConstant('productConst').then(res => {
    //   if (res.status === 'true' && res.info) {
    //     this.productList = res.info
    //   } else {
    //     this.$message.error(res.msg)
    //   }
    // })

    const initialForm = this.dataFormStr
    this.$watch('dataFormStr', {
      handler: function (newVal) {
        if (!newVal || newVal === initialForm) {
          this.hasChangeForm = false
        } else if (newVal !== initialForm) {
          this.hasChangeForm = true
        }
      }
    })
  },
  computed: {
    dataFormStr: function () {
      return Object.values(this.dataForm).join('')
    }
  },
  methods: {
    /**
     * @description 重置一个或多个表单域
     * @param {String | Array} fieldName 表单域的ref
     * @param {Boolean} isClearAll true 清除全部（内容和校验结果）；false 只清除校验结果（保留内容）
     */
    resetItemField(fieldName, isClearAll) {
      if (typeof (fieldName) === 'string') {
        if (isClearAll) {
          this.$refs[fieldName].resetField()
        } else {
          this.$refs[fieldName].clearValidate()
        }
      } else if (fieldName.length > 0) {
        if (isClearAll) {
          for (let i = 0; i < fieldName.length; i++) {
            this.$refs[fieldName[i]].resetField()
          }
        } else {
          for (let i = 0; i < fieldName.length; i++) {
            this.$refs[fieldName[i]].clearValidate()
          }
        }
      }
    },

    // JS接口文件状态改变时
    changeInFile(file, fileList) {
      if (file.status === 'success') {
        this.hasJsFile = fileList.length
      }
    },
    // JS接口文件上传之前判断txt格式
    beforeUploadInFile(file) {
      this.uploadLoading1 = true
      const isTxt = file.type === 'text/plain'
      // const isCompleted = !!this.dataForm.appId && !!this.dataForm.appSecret
      // if (!isCompleted) {
      //   this.uploadLoading1 = false
      //   this.$message.error('请先填写AppID和AppSecret！')
      //   this.$refs['appId'].validate()
      //   this.$refs['appSecret'].validate()
      //   this.$refs['appId'].validateMessage = 'AppId不能为空！'
      //   this.$refs['appSecret'].validateMessage = 'AppSecret不能为空！'
      //   return isCompleted
      // }
      if (!isTxt) {
        this.uploadLoading1 = false
        this.dataForm.jsFile = ''
        this.$refs['jsFile'].validate()
        this.$refs['jsFile'].validateMessage = '非正确的接口文件！'
        this.$message.error('请选择后缀名为"txt"的JS接口文件')
        return isTxt
      } else {
        this.dataForm.jsFile = file.name
      }
      return isTxt
    },
    // JS接口文件上传成功
    successUploadInFile(response, file, fileList) {
      this.uploadLoading1 = false
    },

    // 支付证书文件状态改变时
    changeCeFile(file, fileList) {
      if (file.status === 'success') {
        this.hasP12File = fileList.length
      }
    },
    // 支付证书文件上传之前判断AppID、AppSecret和txt格式
    beforeUploadCeFile(file) {
      this.uploadLoading2 = true
      const isP12 = file.type === 'application/x-pkcs12'
      // const isCompleted = !!this.dataForm.mchId && !!this.dataForm.serviceKey
      // if (!isCompleted) {
      //   this.uploadLoading2 = false
      //   this.$message.error('请先填写mch_ID和key！')
      //   this.$refs['mchId'].validate()
      //   this.$refs['serviceKey'].validate()
      //   this.$refs['mchId'].validateMessage = 'mch_ID不能为空！'
      //   this.$refs['serviceKey'].validateMessage = 'key不能为空！'
      //   return isCompleted
      // }
      if (!isP12) {
        this.uploadLoading2 = false
        this.dataForm.certificate = ''
        this.$refs['certificate'].validate()
        this.$refs['certificate'].validateMessage = '非正确的证书！'
        this.$message.error('请选择后缀名为"p12"的支付证书文件')
        return isP12
      } else {
        this.dataForm.certificate = file.name
      }
      return isP12
    },
    // 支付证书文件上传成功
    successUploadCeFile(response, file, fileList) {
      this.uploadLoading2 = false
    }
  }
}
