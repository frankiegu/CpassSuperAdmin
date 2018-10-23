import { PHONEREG, API_PATH } from '@/config/env'
import { productSelect, clientDetail, checkExistAccount } from '@/service'
import { settlementTypeSelect } from '@/service/common'

export default {
  data () {
    // 自定义校验规则
    const checkTel = (rule, value, callback) => {
      if (this.isCreateAccount) {
        if (!value) {
          return callback(new Error('登录账号不能为空！'))
        }
        if (!PHONEREG.test(value)) {
          return callback(new Error('账号格式错误（正确的手机号码）！'))
        } else {
          checkExistAccount({ mobile: value }).then(res => {
            if (res.code !== '200') {
              return callback(new Error(res.msg))
            } else {
              callback()
            }
          })
        }
      } else {
        callback()
      }
    }
    const checkProduct = (rule, value, callback) => {
      if (this.isCreateAccount) {
        if (!value) {
          return callback(new Error('签约版本不能为空！'))
        }
        callback()
      }
      callback()
    }
    const checkPeriod = (rule, value, callback) => {
      if (this.isCreateAccount) {
        if (!value) {
          return callback(new Error('签约年限不能为空！'))
        }
        callback()
      }
      callback()
    }
    const checkFeeRatio = (rule, value, callback) => {
      if (this.isCreateAccount) {
        if (!value) {
          return callback(new Error('服务费比例不能为空！'))
        } else if ((isNaN(value) || Number(value) < 0 || Number(value) > 100)) {
          callback(new Error('请输入0-100的正数'))
        } else if (value && (value.toString().indexOf('.') !== -1 && value.toString().split('.')[1].length > 2)) {
          callback(new Error('最多允许输入两位小数'))
        }
        callback()
      }
      callback()
    }
    const checkSettlementCycle = (rule, value, callback) => {
      if (this.isCreateAccount) {
        if (!value) {
          return callback(new Error('请选择结算周期！'))
        }
        callback()
      }
      callback()
    }
    const checkBankCardNum = (rule, value, callback) => {
      if (this.isCreateAccount && +this.dataForm.settlementType === 3) {
        if (!value) {
          return callback(new Error('收款账号不能为空！'))
        }
        callback()
      }
      callback()
    }
    const checkBank = (rule, value, callback) => {
      if (this.isCreateAccount && +this.dataForm.settlementType === 3) {
        if (!value) {
          return callback(new Error('开户行不能为空！'))
        }
        callback()
      }
      callback()
    }
    const checkWeixinPayNum = (rule, value, callback) => {
      if (this.isCreateAccount && +this.dataForm.settlementType === 1) {
        if (!value) {
          return callback(new Error('微信号不能为空！'))
        }
        callback()
      }
      callback()
    }
    const checkAliPayNum = (rule, value, callback) => {
      if (this.isCreateAccount && +this.dataForm.settlementType === 2) {
        if (!value) {
          return callback(new Error('支付宝账号不能为空！'))
        }
        callback()
      }
      callback()
    }
    const checkValidity = (rule, value, callback) => {
      if (this.isCreateAccount && !this.dataForm.isPermanent) {
        if (!value || value.length < 2) {
          return callback(new Error('请选择有效期限'))
        } else {
          let time = new Date(value)
          let today = new Date()
          if (time < today) {
            return callback(new Error(('有效期限需大于今天')))
          }
          callback()
        }
        callback()
      }
      callback()
    }
    const checkAppId = (rule, value, callback) => {
      if (this.isCreateAccount && !!this.dataForm.isOpenWxService) {
        if (!value) {
          return callback(new Error('AppID不能为空！'))
        }
        callback()
      }
      callback()
    }
    const checkAppSecret = (rule, value, callback) => {
      if (this.isCreateAccount && !!this.dataForm.isOpenWxService) {
        if (!value) {
          return callback(new Error('AppSecret不能为空！'))
        }
        callback()
      }
      callback()
    }
    const checkInFile = (rule, value, callback) => {
      if (this.isCreateAccount && !!this.dataForm.isOpenWxService) {
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
      if (this.isCreateAccount && !!this.dataForm.isOpenPayment) {
        if (!value) {
          return callback(new Error('mch_ID不能为空！'))
        }
        callback()
      }
      callback()
    }
    const checkServiceKey = (rule, value, callback) => {
      if (this.isCreateAccount && !!this.dataForm.isOpenPayment) {
        if (!value) {
          return callback(new Error('key不能为空！'))
        }
        callback()
      }
      callback()
    }
    const checkCeFile = (rule, value, callback) => {
      if (this.isCreateAccount && !!this.dataForm.isOpenPayment) {
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
      clientId: this.$route.query.id,
      hasChangeForm: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },

      isCreateAccount: false,
      productList: {},
      // 结算周期类型
      settlementCycleTypeList: [{
        id: 1,
        name: '月'
      }, {
        id: 2,
        name: '周'
      }, {
        id: 3,
        name: '天'
      }],
      // 结算方式类型
      settlementTypeList: [],
      uploadHeaders: { token: sessionStorage.getItem('token') },
      jsUploadPath: API_PATH + '/supervisor/client/uploadJsFile',
      p12UploadPath: API_PATH + '/supervisor/client/uploadPayCertFile',
      hasJsFile: 0,
      hasP12File: 0,
      uploadLoading1: false,
      uploadLoading2: false,
      dialogVisible: false,
      dataForm: {
        // 客户基础信息
        merchantId: 1, // 商户类型： 1-场地提供方，2-服务供应商，3-场地提供方&服务供应商
        brandName: '',
        companyName: '',
        contact: '',
        phone: '',
        email: '',
        weixin: '',
        address: '',
        countryId: '',
        provinceCode: '',
        cityCode: '',
        regionCode: '',
        officialWebsite: '',
        remark: '',
        saleManager: '',

        // 签约信息
        productStatus: 1,
        productId: '',
        period: '', // 签约年限
        serviceFeeProportion: '', // 服务费比例
        validity: '', // 有效期
        isPermanent: 0, // 是否永久有效
        settlementCycle: '', // 结算周期 1-固定日期 2-周期结算
        settlementDate: 1, // 日期
        settlementCycleType: 1, // 周期单位 1-月 2-周 3-天
        settlementType: 3, // 结算方式 1-微信 2-支付宝 3-银行卡
        bankCardNum: '', // 银行账号
        bank: '', // 开户行
        weixinPayNum: '', // 微信结算账号
        aliPayNum: '', // 支付宝结算账号
        adminUsername: '',

        // 开通公众服务号
        isOpenWxService: 0,
        appId: '',
        appSecret: '',
        jsFile: '', // JS接口文件

        // 开通微信支付功能
        isOpenPayment: 0,
        spaceWeixinPayId: '',
        mchId: '', // 客户服务号mch_ID
        mchKey: '', // 客户服务号key
        certificate: '' // 支付证书
      },

      dataRules: {
        productId: [{ validator: checkProduct, trigger: ['blur', 'change'] }],
        period: [{ validator: checkPeriod, trigger: ['blur', 'change'] }],
        serviceFeeProportion: [{ validator: checkFeeRatio, trigger: ['blur', 'change'] }],
        validity: [{ validator: checkValidity, trigger: ['blur', 'change'] }],
        settlementCycle: [{ validator: checkSettlementCycle, trigger: ['blur', 'change'] }],
        bankCardNum: [{ validator: checkBankCardNum, trigger: ['blur', 'change'] }],
        bank: [{ validator: checkBank, trigger: ['blur', 'change'] }],
        weixinPayNum: [{ validator: checkWeixinPayNum, trigger: ['blur', 'change'] }],
        aliPayNum: [{ validator: checkAliPayNum, trigger: ['blur', 'change'] }],
        adminUsername: [{ validator: checkTel, trigger: ['blur', 'change'] }],
        appId: [{ validator: checkAppId, trigger: ['blur', 'change'] }],
        appSecret: [{ validator: checkAppSecret, trigger: ['blur', 'change'] }],
        jsFile: [{ validator: checkInFile, trigger: ['blur', 'change'] }],
        mchId: [{ validator: checkMchId, trigger: ['blur', 'change'] }],
        mchKey: [{ validator: checkServiceKey, trigger: ['blur', 'change'] }],
        certificate: [{ validator: checkCeFile, trigger: ['blur', 'change'] }]
      }
    }
  },
  mounted() {
    if (this.clientId) this.handleGetDetail()
    if (!this.clientId) {
      const initialForm = this.dataFormStr
      const initInfo = this.infoStr
      this.$watch('dataFormStr', {
        handler: function (newVal, oldVal) {
          if (!newVal || newVal === initialForm) {
            this.hasChangeForm = false
          } else if (newVal !== initialForm) {
            this.hasChangeForm = true
          }
        }
      })
      this.$watch('infoStr', {
        handler: function (newVal) {
          if (!newVal || newVal === initInfo) {
            this.hasChangeInfo = false
          } else if (newVal !== initInfo) {
            this.hasChangeInfo = true
          }
        }
      })
    }

    // 获取产品类型 productConst
    productSelect().then(res => {
      if (res.status === 'true' && res.info) {
        this.productList = res.info
      } else {
        this.$message.error(res.msg)
      }
    })

    this.getSettlementType()
  },
  computed: {
    dataFormStr: function () {
      return Object.values(this.dataForm).join('')
    },
    // 拼接name字段到saleManager字段
    infoStr: function () {
      // console.log(Object.keys(this.dataForm).slice(0, 8))
      return Object.values(this.dataForm).slice(0, 8).join('')
    },
    // 拼接productId字段到jsFile字段
    accountStr: function () {
      // console.log(Object.keys(this.dataForm).slice(9, 16))
      return Object.values(this.dataForm).slice(9, 16).join('')
    },
    // 拼接spaceWeixinPayId字段到certificate字段
    payStr: function () {
      // console.log(Object.keys(this.dataForm).slice(17))
      return Object.values(this.dataForm).slice(17).join('')
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
      }
      return isTxt
    },
    // JS接口文件上传成功
    successUploadInFile(response, file, fileList) {
      if (response.status === 'true') {
        this.dataForm.jsFile = response.info
        this.uploadLoading1 = false
      } else {
        this.uploadLoading1 = false
        this.dataForm.jsFile = ''
        this.$refs['jsFile'].validate()
        this.$refs['jsFile'].validateMessage = response.msg
      }
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
      const isCompleted = !!this.dataForm.mchId
      if (!isCompleted) {
        this.uploadLoading2 = false
        this.$message.error('请先填写mch_ID')
        this.$refs['mchId'].validate()
        this.$refs['mchId'].validateMessage = 'mch_ID不能为空！'
        return isCompleted
      }
      if (!isP12) {
        this.uploadLoading2 = false
        this.dataForm.certificate = ''
        this.$refs['certificate'].validate()
        this.$refs['certificate'].validateMessage = '非正确的证书！'
        this.$message.error('请选择后缀名为"p12"的支付证书文件')
        return isP12
      }
      return isP12
    },
    // 支付证书文件上传成功
    successUploadCeFile(response, file, fileList) {
      if (response.status === 'true') {
        this.dataForm.certificate = response.info
        this.uploadLoading2 = false
      } else {
        this.uploadLoading2 = false
        this.dataForm.certificate = ''
        this.$refs['certificate'].validate()
        this.$refs['certificate'].validateMessage = response.msg
      }
    },

    // 获取客户详情
    handleGetDetail() {
      let obj = { clientId: this.clientId }
      clientDetail(obj).then(res => {
        if (res.status === 'true' && res.info) {
          let dataSource = res.info
          this.dataForm.brandName = dataSource.brandName
          this.dataForm.companyName = dataSource.companyName
          this.dataForm.contact = dataSource.contact
          this.dataForm.phone = dataSource.phone
          this.dataForm.email = dataSource.email
          this.dataForm.countryId = dataSource.countryId
          this.dataForm.provinceCode = dataSource.provinceCode
          this.dataForm.cityCode = dataSource.cityCode
          this.dataForm.regionCode = dataSource.regionCode
          this.dataForm.countryName = dataSource.countryName
          this.dataForm.provinceName = dataSource.provinceName
          this.dataForm.cityName = dataSource.cityName
          this.dataForm.regionName = dataSource.regionName
          this.dataForm.address = dataSource.address
          this.dataForm.weixin = dataSource.weixin
          this.dataForm.officialWebsite = dataSource.officialWebsite
          this.dataForm.remark = dataSource.remark
          this.dataForm.saleManager = dataSource.saleManager
          this.dataForm.productId = dataSource.productId
          this.dataForm.validity = dataSource.productEndDate ? dataSource.productEndDate.split(' ')[0] : ''
          this.dataForm.isPermanent = dataSource.isPermanent
          this.dataForm.settlementCycle = dataSource.settlementCycle
          this.dataForm.settlementDate = dataSource.settlementDate
          this.dataForm.settlementCycleType = dataSource.settlementCycleType
          this.dataForm.settlementType = dataSource.settlementType
          this.dataForm.bankCardNum = dataSource.bankCardNum
          this.dataForm.bank = dataSource.bank
          this.dataForm.weixinPayNum = dataSource.weixinPayNum
          this.dataForm.aliPayNum = dataSource.aliPayNum
          this.dataForm.adminUsername = ''
          this.dataForm.productStatus = dataSource.productStatus
          this.dataForm.appId = dataSource.appId
          this.dataForm.appSecret = dataSource.appSecret
          this.dataForm.jsFile = dataSource.jsFile
          this.dataForm.isOpenPayment = dataSource.spaceWeixinPayStatus
          this.dataForm.spaceWeixinPayId = dataSource.spaceWeixinPayId
          this.dataForm.mchId = dataSource.mchId
          this.dataForm.mchKey = dataSource.mchKey
          this.dataForm.certificate = dataSource.payCertFileName
          // 获取详情后再监听表单的变化
          const initialForm = this.dataFormStr
          const initInfo = this.infoStr
          const initAccount = this.accountStr
          const initPay = this.payStr
          this.$watch('dataFormStr', {
            handler: function (newVal) {
              if (!newVal || newVal === initialForm) {
                this.hasChangeForm = false
              } else if (newVal !== initialForm) {
                this.hasChangeForm = true
              }
            }
          })
          this.$watch('infoStr', {
            handler: function (newVal) {
              if (!newVal || newVal === initInfo) {
                this.hasChangeInfo = false
              } else if (newVal !== initInfo) {
                this.hasChangeInfo = true
              }
            }
          })
          this.$watch('accountStr', {
            handler: function (newVal) {
              if (!newVal || newVal === initAccount) {
                this.hasChangeAccount = false
              } else if (newVal !== initAccount) {
                this.hasChangeAccount = true
              }
            }
          })
          this.$watch('payStr', {
            handler: function (newVal) {
              if (!newVal || newVal === initPay) {
                this.hasChangePay = false
              } else if (newVal !== initPay) {
                this.hasChangePay = true
              }
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    changeCreateStatus(status) {
      this.isCreateAccount = status
      if (!status) {
        this.dataForm.isOpenWxService = 0
        this.dataForm.isOpenPayment = 0
        this.resetItemField(['productId', 'validity', 'settlementCycle', 'serviceFeeProportion', 'adminUsername', 'bank', 'bankCardNum', 'weixinPayNum', 'aliPayNum'], false)
      }
    },

    // 获取结算方式类型列表
    getSettlementType() {
      settlementTypeSelect().then(res => {
        if (res.status === 'true') {
          this.settlementTypeList = res.info
        } else {
          this.$message.error('结算方式类型下拉：：' + res.msg)
        }
      })
    }
  }
}
