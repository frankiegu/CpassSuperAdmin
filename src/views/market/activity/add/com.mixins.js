import { POSITIVE_INTEGER, NATURAL_NUM } from '@/config/env'
import { activityIsUnique, findUsableCouponByType } from '@/service/market'

export default {
  data () {
    // 需要用到this，要放在data里面
    const validateActivityName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入活动名称'));
      }
      if (this.monitorOnePartForm.activityName !== value) {
        let params = {
          name: value
        }
        activityIsUnique(params).then(res => {
          if (res.status === 'false') {
            callback(new Error(res.msg));
          } else {
            callback();
          }
        })
      } else {
        callback();
      }
    };
    const validateTerminal = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请选择活动展示端'));
      }
      callback();
    };
    const validateActivityDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择活动有效期'));
      } else if (value && value.length > 0) {
        if (new Date(value[0]) < new Date() && this.type !== 'edit') {
          callback(new Error('起始时间需大于当前时间'))
        } else if (new Date(value[0]) >= new Date(value[1])) {
          console.log('13r3', value)
          callback(new Error('结束时间需大于开始时间'))
        } else {
          callback();
        }
      }
      callback();
    };
    // 验证活动展示时间
    const validateDispalyS = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择活动展示时间'));
      } else if (new Date(value[0]) < new Date()) {
        callback(new Error('活动展示时间需大于当前时间'));
      }
      callback();
    };
    // 验证活动隐藏时间
    const validateDispalyE = (rule, value, callback) => {
      console.log('display', [this.threePartForm.displayStartSubmit, new Date(value)])
      if (!value) {
        callback(new Error('请选择活动隐藏时间'));
      } else if (value && new Date(this.threePartForm.displayStartSubmit) >= new Date(value)) {
        callback(new Error('活动隐藏时间需大于展示时间'))
      }
      callback();
    };
    const validateActivityBanner = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请上传活动banner'));
      }
      callback();
    };
    const validateActivityRules = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入活动规则'));
      }
      callback();
    };
    return {
      addEditType: 0,     // 区分编辑还是新增
      activityTab: 1,     // tab 的门
      tabSwitch: 1,       // tab 的值
      tabList: ['① 基本配置', '② 活动配置', '③ 发布设置'],
      validatePartOne: false, // 验证第一步
      validatePartTwo: false, // 验证第二步
      validatePartThree: false, // 验证第三步
      /**
       * 信息完整度
       * 添加100%之后调用编辑接口
       * 否则，调用添加接口
       * 第一步：30，第二步70，第三步100
       */
      step: null, // 添加步骤 1:第一步 2:第二步 3:第三步
      loadingOnePart: false,
      loadingTwoPart: false,
      loadingThreePart: false,
      editorOption1: {
        modules: {
          toolbar: [
            [{ 'list': 'ordered' }]
          ]
        },
        placeholder: '请填写活动规则',
        theme: 'snow'  // or 'bubble'
      }, // 富文本编辑器
      editor1TextLength: 0,
      quillLenght: 200,

      // part 1
      onePartForm: {
        activityName: '', // 活动名称
        activityRules: '', // 活动规则
        activityTemplate: '2', // 活动模板
        activityType: '2', // 活动类型
        activityStartDate: '', // 活动开始日期
        activityEndDate: '', // 活动结束日期
        rangeDate: '', // 活动日期
        bannerPic: '' // 活动banner
      },
      onePartFormRule: {
        activityName: [{ required: true, trigger: ['blur', 'change'], validator: validateActivityName }],
        activityRules: [{ required: true, trigger: ['blur', 'change'], validator: validateActivityRules }],
        rangeDate: [{ required: true, trigger: ['blur', 'change'], validator: validateActivityDate }],
        bannerPic: [{ required: true, trigger: ['blur', 'change'], validator: validateActivityBanner }]
      },
      monitorOnePartForm: {}, // 编辑和复制活动时备份原来的信息

      // part 2
      // 备份，判断表单是否有改动
      twoPartMonitor: null,
      twoPartStatus: true,
      openDataMonitor: null,
      orderLoading: false,
      prizeList: [], // 奖品列表
      twoPartForm: {
        attendNum: '', // 参与人数
        winningTimes: '', // 允许的最大中奖次数
        originalTimes: '', // 初始抽奖次数
        shareAddTimes: 0 // 分享后获得的抽奖次数
      },
      twoPartFormRule: {
        price: [{ required: true, validator: checkPrice, trigger: ['blur', 'change'] }],
        attendNum: [{ required: true, validator: checkNum, trigger: ['blur', 'change'] }],
        winningTimes: [{ required: true, validator: checkWinningTimes, trigger: ['blur', 'change'] }],
        originalTimes: [{ required: true, validator: checkOriginalTimes, trigger: ['blur', 'change'] }],
        shareAddTimes: [{ required: true, validator: checkShareAddTimes, trigger: ['blur', 'change'] }]
      },
      prizeTableRules: {
        probability: [{ required: true, validator: checkWinProsibility, trigger: ['blur', 'change'] }]
      },
      dialogVisible: false, // 添加商品弹窗
      addPrizeForm: {
        addPrizeType: '1',
        redEnvelopeType: '1',
        redEnvelopeAmount: '',
        selCouponId: '',
        couponType: 1, // 优惠券类型
        allowRepeat: false, // 是否允许重复中奖
        useInstruction: '', // 使用说明
        // redEnvelopeInstruction: '', // 红包使用说明
        showRedEnvelope: false
        // giftUseInstruction: '' // 礼品券使用说明
      }, // 添加奖品
      addPrizeFormRule: {
        redEnvelopeAmount: [{ required: true, validator: validateRedEnvelopeAmount, trigger: ['blur', 'change'] }],
        useInstruction: [{ required: true, message: '请填写奖品的使用说明', trigger: ['blur', 'change'] }],
        // redEnvelopeInstruction: [{ required: true, message: '请填写奖品的使用说明', trigger: ['blur', 'change'] }],
        // giftUseInstruction: [{ required: true, message: '请填写礼品券使用说明', trigger: ['blur', 'change'] }],
        selCouponId: [{ required: true, message: '请选择优惠券', trigger: ['blur', 'change'] }],
        couponType: [{ required: true, message: '请选择优惠券类型', trigger: ['blur', 'change'] }]
      }, // 添加奖品验证
      // 奖品类型 1-优惠券, 2-微信红包
      prizeType: [
        {
          type: 1,
          name: '小时券'
        },
        // {
        //   type: 2,
        //   name: '代金券'
        // },
        {
          type: 3,
          name: '礼品券'
        }
      ],
      couponList: [], // 优惠券列表

      // part 3
      threePartForm: {
        // 展示端
        displayTerminal: [],
        activityStart: '', // 活动开始时间
        activityEnd: '', // 活动结束时间
        activityDisplayStart: '', // 活动展示开始时间
        activityDisplayEnd: '', // 活动展示结束时间
        tipsBeforeStart: '', // 活动未开始提示
        tipsEnd: '', // 活动结束提示
        displayStartValue: '', // 活动显示的开始时间的毫秒数
        displayStartSubmit: '', // 提交的显示日期
        displayEndSubmit: '', // 提交的隐藏日期
        terminalList: [
          {
            name: '小程序',
            id: 1,
            disabled: false
          },
          {
            name: 'APP IOS端',
            id: 2,
            disabled: true
          },
          {
            name: 'APP 安卓端',
            id: 3,
            disabled: true
          }
        ]
      },
      threePartFormRule: {
        // contactTel: [{ required: true, validator: validateTel, trigger: ['blur', 'change'] }],
        displayTerminal: [{ required: true, validator: validateTerminal, trigger: ['blur', 'change'] }],
        activityDisplayStart: [{ required: true, validator: validateDispalyS, trigger: ['blur', 'change'] }],
        activityDisplayEnd: [{ required: true, validator: validateDispalyE, trigger: ['blur', 'change'] }],
        tipsBeforeStart: [{ required: true, message: '请输入活动未开始提示', trigger: ['blur', 'change'] }],
        tipsEnd: [{ required: true, message: '请输入活动结束提示', trigger: ['blur', 'change'] }]
      }
    }
  },
  methods: {
    // 验证添加的奖品的数量的输入
    handleInputQuantity(currentQuantity, id, type, max) {
      let feeTarget = this.prizeList.find(target => {
        return target.id === id
      })
      let tempObj, index
      this.prizeList.forEach((v, i) => {
        if (v.id === id) {
          tempObj = v
          index = i
        }
      })
      if (!currentQuantity) {
        tempObj.validate = true
        this.prizeList.splice(index, 1, tempObj)
      }
      if (!POSITIVE_INTEGER.test(currentQuantity)) {
        tempObj.prizeQuantityWarning = '奖品数量必须为正整数'
        tempObj.validate = true
        this.prizeList.splice(index, 1, tempObj)
      } else {
        // 1-优惠券, 2-微信红包
        if (type === 1) {
          if (max >= 0) {
            if (feeTarget.quantity - 1 + 1 > max) {
              tempObj.prizeQuantityWarning = '奖品数量不能超过券剩余量'
              tempObj.validate = true
              this.prizeList.splice(index, 1, tempObj)
            } else if (feeTarget.quantity - 1 + 1 <= 0) {
              tempObj.prizeQuantityWarning = '奖品数量不能为0'
              tempObj.validate = true
              this.prizeList.splice(index, 1, tempObj)
            } else {
              tempObj.prizeQuantityWarning = ''
              tempObj.validate = false
              this.prizeList.splice(index, 1, tempObj)
            }
          }
        } else if (type === 2) {
          if (feeTarget.quantity - 1 + 1 > 9999) {
            feeTarget.quantity = String(feeTarget.quantity).slice(0, 3)
            tempObj.prizeQuantityWarning = '奖品数量不能超过8位数'
            tempObj.validate = true
            this.prizeList.splice(index, 1, tempObj)
          } else if (feeTarget.quantity - 1 + 1 <= 0) {
            tempObj.prizeQuantityWarning = '奖品数量不能为0'
            tempObj.validate = true
            this.prizeList.splice(index, 1, tempObj)
          } else {
            tempObj.prizeQuantityWarning = ''
            tempObj.validate = false
            this.prizeList.splice(index, 1, tempObj)
          }
        }
      }
    },
    // 验证添加的奖品的中奖概率的输入
    handleInputProbability(probability, id) {
      let temp = probability.replace(/\./g, '')
      let totalProbability = 0
      let feeTarget = this.prizeList.find(target => {
        return target.id === id
      })
      let tempObj, index
      this.prizeList.forEach((v, i) => {
        if (v.id === id) {
          tempObj = v
          index = i
        }
        totalProbability += (v.probability - 1 + 1)
      })
      if (probability.indexOf('.') < 0) {
        feeTarget.maxLength = 3
      } else {
        feeTarget.maxLength = probability.indexOf('.') + 3
      }
      if (!probability) {
        tempObj.probabilityValidate = true
        this.prizeList.splice(index, 1, tempObj)
      }
      if (!NATURAL_NUM.test(temp)) {
        tempObj.prizeProbabilityWarning = '中奖概率必须1-100间的数字'
        tempObj.probabilityValidate = true
        this.prizeList.splice(index, 1, tempObj)
      } else if (temp - 1 + 1 <= 0) {
        tempObj.prizeProbabilityWarning = '中奖概率必须为1-100间的数字'
        tempObj.probabilityValidate = true
        this.prizeList.splice(index, 1, tempObj)
      } else {
        if (totalProbability > 100) {
          tempObj.prizeProbabilityWarning = '所有奖品的中奖概率不能超过100%'
          tempObj.probabilityValidate = true
          this.prizeList.splice(index, 1, tempObj)
        } else if (feeTarget.probability - 1 + 1 < 0) {
          tempObj.prizeProbabilityWarning = '中奖概率不能小于0'
          tempObj.probabilityValidate = true
          this.prizeList.splice(index, 1, tempObj)
        } else {
          tempObj.prizeProbabilityWarning = ''
          tempObj.probabilityValidate = false
          this.prizeList.splice(index, 1, tempObj)
        }
      }
    },
    // 显示活动日期
    displayStart (date) {
      this.threePartForm.displayStartValue = new Date(date).valueOf()
    },
    // 添加奖品选择优惠券
    getCouponList () {
      findUsableCouponByType({ type: this.addPrizeForm.couponType }).then(res => {
        if (res.status === 'true') {
          this.couponList = res.info
          this.couponList = this.couponList.filter(v => v.notUseQuantity > 0 && v)
        }
      })
    },
    // 优惠券类型变化
    couponTypeChange () {
      this.addPrizeForm.selCouponId = ''
      findUsableCouponByType({ type: this.addPrizeForm.couponType }).then(res => {
        if (res.status === 'true') {
          this.couponList = res.info
          if (this.couponList.length > 0 && this.prizeList.length > 0) {
            for (let i = 0; i < this.couponList.length; i++) {
              for (let j = 0; j < this.prizeList.length; j++) {
                if (this.prizeList[j] && this.couponList[i] && this.prizeList[j].id === this.couponList[i].id) {
                  this.couponList.splice(i, 1)
                } else if (this.prizeList[j] && this.couponList[i] && this.couponList[i].notUseQuantity <= 0) {
                  this.couponList.splice(i, 1)
                }
              }
            }
          }
          this.couponList = this.couponList.filter(v => v.notUseQuantity > 0 && v)
        }
      })
    },
    // 富文本编辑器
    onTextChange1(editor) {
      // 针对只是列表的可以满足需求，但是复杂就不好做字数限制了
      let formartObject
      formartObject = this.$refs.myQuillEditor1.quill.getFormat(0, this.$refs.myQuillEditor1.quill.getLength())
      this.editor1TextLength = this.$refs.myQuillEditor1.quill.getLength() - 1

      // console.log('text-change111', this.$refs.myQuillEditor1.quill.getLength())
      if (this.$refs.myQuillEditor1.quill.getLength() > this.quillLenght + 1) {
        this.$refs.myQuillEditor1.quill.setText(this.$refs.myQuillEditor1.quill.getText().substring(0, this.quillLenght))
        this.$refs.myQuillEditor1.quill.formatText(0, this.$refs.myQuillEditor1.quill.getLength(), formartObject)
      }
      // console.log('text-change1112222222', this.$refs.myQuillEditor1.quill.getLength())
    }
  },
  watch: {
    'addPrizeForm.addPrizeType': function (val, oldVal) {
      if (val === '2') {
        this.addPrizeForm.showRedEnvelope = true
      } else {
        this.addPrizeForm.showRedEnvelope = false
      }
    }
  },
  created () {
    this.getCouponList()
  }
}

/**
 * part 2
 */
const checkPrice = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入租金'));
  } else if (!POSITIVE_INTEGER.test(value)) {
    callback(new Error('请输入大于0的正整数'));
  } else {
    callback();
  }
};
// 参与人数
const checkNum = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入最大允许参与人数'));
  } else if (!POSITIVE_INTEGER.test(value)) {
    callback(new Error('请输入大于0的正整数'));
  } else {
    callback();
  }
};
// 最大中奖次数
const checkWinningTimes = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入每人最大允许中奖数'));
  } else if (!POSITIVE_INTEGER.test(value)) {
    callback(new Error('请输入大于0的正整数'));
  } else if (POSITIVE_INTEGER.test(value) && value > 999) {
    callback(new Error('初始抽奖次数不得大于999'));
  } else {
    callback();
  }
};
// 初始中奖次数
const checkOriginalTimes = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入初始可抽奖次数'));
  } else if (!POSITIVE_INTEGER.test(value)) {
    callback(new Error('请输入大于0的正整数'));
  } else if (POSITIVE_INTEGER.test(value) && value > 999) {
    callback(new Error('每人最大允许中奖数不得大于999'));
  } else {
    callback();
  }
};
// 分享后获得的抽奖次数
const checkShareAddTimes = (rule, value, callback) => {
  if (!value && value !== 0) {
    callback(new Error('请输入分享成功后额外抽奖次数'));
  } else if (!NATURAL_NUM.test(value)) {
    callback(new Error('请输入0—999内的整数'));
  } else if (POSITIVE_INTEGER.test(value) && value > 999) {
    callback(new Error('分享成功后额外抽奖次数不得大于999'));
  } else {
    callback();
  }
};
// 奖品中奖概率
const checkWinProsibility = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入奖品中奖概率'));
  } else if (!POSITIVE_INTEGER.test(value)) {
    callback(new Error('请输入大于0的正整数'));
  } else {
    callback();
  }
};
// 微信红包单个红包金额输入验证
const validateRedEnvelopeAmount = (rule, value, callback) => {
  let temp = value.replace(/\./g, '')
  if (!value) {
    callback(new Error('请输入单个红包的金额'));
  } else if (temp - 1 + 1 <= 0) {
    callback(new Error('红包金额必须大于0'));
  } else if (!NATURAL_NUM.test(temp)) {
    callback(new Error('红包金额必须数字'));
  } else if (NATURAL_NUM.test(temp)) {
    if (value > 200) {
      callback(new Error('红包金额不能大于200'));
    } else {
      if (value.split('')[0] - 1 + 1 === 0 && value.split('')[1] !== '.') {
        callback(new Error('红包金额必须大于0'));
      } else {
        callback();
      }
    }
  } else {
    callback();
  }
}

