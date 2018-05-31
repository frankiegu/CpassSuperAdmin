import { checkPhone } from '@/config/utils'
import { FIXPHONEREG, POSITIVE_INTEGER, NATURAL_NUM } from '@/config/env'

export default {
  data () {
    // 需要用到this，要放在data里面
    const validateTel = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入您的联系方式'));
      }
      if (this.telLineSelected === '0' && !checkPhone(value)) {
        callback(new Error('请输入正确的电话'));
      }
      if (this.telLineSelected === '1' && !FIXPHONEREG.test(value)) {
        callback(new Error('固定电话号码格式不正确。例：020-88888888'))
      }
      callback();
    };
    const validateActivityName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入活动名称'));
      }
      callback();
    };
    const validateActivityDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择活动有效期'));
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
      disabledweixinPay: false, // 场地费用有0就禁止微信支付，费用默认为null，不禁止
      addEditType: 0,     // 区分编辑还是新增
      activityTab: 3,     // tab 的门
      tabSwitch: 1,       // tab 的值
      tabList: ['① 基本配置', '② 活动配置', '③ 发布设置'],

      // tab 1
      imgsLenght: 5,      // 限制上传图片数量
      storeList: [],

      // tab 2
      paymentList: [],    // 支付方式列表
      equipmentsList: [], // 设备列表

      giveUpEditing: false,
      quillLenght: 1000,   // 富文本编辑器的length
      editor1TextLength: 0,
      editor2TextLength: 0,
      // 切换区分工作日的数据
      openData: [],
      openWeek: [{
        status: 1,
        startTime: '',
        endTime: '',
        endStartTime: '00:00', // 时段结束时间的起始值
        price: '', // 场地费用
        workState: 1,
        restState: 1
      }],
      /**
       * 预约设置，数据放在一起，类型用页面的场地类型
       * 初始数据，每处用到的地方会赋值一次
       * 注意：保留此结构，场地新增和编辑有用到
       */
      openPeriod: [{
        type: 1, // 1 工作日，2 非工作日，3 整周
        status: 1,
        startTime: '',
        endTime: '',
        endStartTime: '00:00', // 时段结束时间的起始值
        price: '', // 场地费用
        workState: 1,
        restState: 1
      }, {
        type: 2,
        status: 1,
        startTime: '',
        endTime: '',
        endStartTime: '00:00', // 时段结束时间的起始值
        price: '', // 场地费用
        workState: 1,
        restState: 1
      }],

      editorOption1: {
        modules: {
          toolbar: [
            [{ 'list': 'bullet' }]
          ]
        },
        placeholder: ' ',
        theme: 'snow'  // or 'bubble'
      },
      hoursList: [],

      /**
       * 信息完整度
       * 添加100%之后调用编辑接口
       * 否则，调用添加接口
       * 第一步：30，第二步70，第三步100
       */
      dataFinishPercent: null,
      dataFinishInterface: null, // 用来区分添加和编辑的接口名
      step: null, // 添加步骤 1:第一步 2:第二步 3:第三步
      loadingOnePart: false,
      loadingTwoPart: false,
      loadingThreePart: false,

      // part 1
      onePartForm: {
        type: '',
        fieldName: '',
        storeId: '',
        storeAddr: '', // 门店地址
        area: '',
        maxAdmissibleNum: 5, // 可以容纳多少人
        stationNum: 5, // 工位总数

        activityName: '', // 活动名称
        activityRules: '', // 活动规则
        activityTemplate: 'goldenEggs', // 活动模板
        activityType: 'interactive', // 活动类型
        activityStartDate: '', // 活动开始日期
        activityEndDate: '', // 活动结束日期
        rangeDate: '', // 活动日期
        bannerPic: '' // 活动banner
      },
      onePartFormRule: {
        type: [{ required: true, trigger: 'click', validator: checkType }],
        activityName: [{ required: true, trigger: ['blur', 'change'], validator: validateActivityName }],
        activityRules: [{ required: true, trigger: ['blur', 'change'], validator: validateActivityRules }],
        fieldName: [{ required: true, message: '请填写场地名称', trigger: ['blur', 'change'] }],
        storeId: [{ required: true, trigger: 'selected', validator: checkStore }],
        maxAdmissibleNum: [{ required: true, trigger: ['blur', 'change'], validator: checkMaxAdmissibleNum }],
        area: [{ required: true, trigger: ['blur', 'change'], validator: checkArea }],
        stationNum: [{ required: true, validator: validateStationNum, trigger: ['blur', 'change'] }],
        rangeDate: [{ required: true, trigger: ['blur', 'change'], validator: validateActivityDate }],
        bannerPic: [{ required: true, trigger: ['blur', 'change'], validator: validateActivityBanner }]
      },

      // part 2
      // 备份，判断表单是否有改动
      twoPartMonitor: null,
      twoPartStatus: true,
      openDataMonitor: null,
      orderLoading: false,
      prizeList: [
        {
          prizeName: '1小时优惠券',
          type: 1,
          quantity: 1,
          probability: 5,
          maxQuantity: 5,
          id: 123,
          validate: false, // 奖品数量的输入验证通过为false, 验证不通过为true
          probabilityValidate: false // 奖品中奖概率的输入, 验证通过为false, 验证不通过为true
        },
        {
          prizeName: '普通红包（9.9元）',
          type: 2,
          quantity: 2,
          probability: 15,
          id: 124,
          validate: false, // 奖品数量的输入验证通过为false, 验证不通过为true
          probabilityValidate: false // 奖品中奖概率的输入, 验证通过为false, 验证不通过为true
        }
      ], // 奖品列表
      twoPartForm: {
        cancelBeforeTime: '3',
        timeType: '', // 允许取消事件的单位 hour 小时 today天
        type: '1', // 是否允许取消, 0-不允许, 1-允许
        canUseCoupon: 0, // 是否可使用优惠卷 , 1=可使用, 0=不可使用
        canUsePoint: 0, // 是否可使用积分, 1=可使用, 0=不可使用
        payType: [],

        /**
         * 非办公室
         * 工作日营业状态 1:营业 0:休息
         * appointmentTimeType 无论为1或2都必传,当appointmentTimeType为1时 workState必须传 1
         * 注意：整周用workState、workPriceDetail
         */
        workState: 1,
        // 如果workState=0 则不需要传
        workPriceDetail: [],
        appointmentTimeType: 2, // 是否区分工作日 1:不区分 2:区分
        workPrice: '', // 工作日价格
        restState: 1,  // 非工作日营业状态 1:营业 0:休息
        restPrice: '', // 非工作日价格时
        // restState=0 则不需要传
        restPriceDetail: [],

        /**
         * 办公室
         */
        minRentMonth: '', // 最少预定多少个月
        startUseTime: '', // 开始使用时间
        price: '',         // 租金

        attendNum: '', // 参与人数
        winningTimes: '', // 允许的最大中奖次数
        originalTimes: '', // 初始抽奖次数
        shareAddTimes: '' // 分享后获得的抽奖次数
      },
      ifPrizeQuantityWarning: false, // 奖品数量错误提示显示/隐藏
      prizeQuantityWarning: '', // 奖品数量错误提示文本
      currentPrizeIds: [], // 奖品数量验证不通过的奖品id
      twoPartFormRule: {
        payType: [{ required: true, message: '请至少勾选一种支付方式', trigger: ['blur', 'change'], type: 'array' }],

        // 办公室验证
        startUseTime: [{ required: true, message: '请选择可以开始进驻的日期', trigger: ['blur', 'change'] }],
        minRentMonth: [{ required: true, validator: checkMinRentMonth, trigger: ['blur', 'change'] }],
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
        addPrizeType: 'RedEnvelope',
        redEnvelopeType: 'commonType',
        redEnvelopeAmount: '',
        couponId: '',
        couponType: '', // 优惠券类型
        allowRepeat: false // 是否允许重复中奖
      }, // 添加奖品
      addPrizeFormRule: {
        redEnvelopeAmount: [{ required: true, validator: validateRedEnvelopeAmount, trigger: ['blur', 'change'] }]
      }, // 添加奖品验证
      // 奖品类型 1-优惠券, 2-微信红包
      prizeType: [
        {
          type: 1,
          name: '小时券'
        },
        {
          type: 2,
          name: '礼品券'
        }
      ],
      couponList: [
        {
          name: '1杯咖啡券',
          id: '110'
        },
        {
          name: '2杯咖啡券',
          id: '112'
        }
      ], // 优惠券列表

      // part 3
      threePartForm: {
        mainImg: '', // 在验证的时候需要
        imgs: [{}],
        contactName: '',
        telLineSelected: '0', // 0手机号码，1固定电话
        contactTel: '',
        facilitiesAndServices: '',
        instructionsForUse: '',
        isEffect: false, // 马上生效

        // 展示端
        displayTerminal: [],
        activityStart: '2018-05-28 12:00', // 活动开始时间
        activityEnd: '2018-06-28 12:00', // 活动结束时间
        activityDisplayStart: '', // 活动展示开始时间
        activityDisplayEnd: '', // 活动展示结束时间
        tipsBeforeStart: '', // 活动未开始提示
        tipsEnd: '', // 活动结束提示
        displayStartValue: '', // 活动显示的开始时间的毫秒数
        terminalList: [
          {
            name: '小程序',
            id: 1
          },
          {
            name: 'APP IOS端',
            id: 2
          },
          {
            name: 'APP 安卓端',
            id: 3
          }
        ]
      },
      threePartFormRule: {
        contactName: [{ required: true, message: '请填写场地联系人姓名', trigger: ['blur', 'change'] }],
        contactTel: [{ required: true, validator: validateTel, trigger: ['blur', 'change'] }],
        tipsBeforeStart: [{ required: true, message: '请输入活动未开始提示', trigger: ['blur', 'change'] }],
        tipsEnd: [{ required: true, message: '请输入活动结束提示', trigger: ['blur', 'change'] }]
      },

      todayList: [
        { value: '0.5', label: '0.5' },
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
        { value: '6', label: '6' },
        { value: '7', label: '7' },
        { value: '8', label: '8' },
        { value: '9', label: '9' },
        { value: '10', label: '10' },
        { value: '11', label: '11' },
        { value: '12', label: '12' }
      ],
      monthList: [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
        { value: '6', label: '6' },
        { value: '7', label: '7' },
        { value: '8', label: '8' },
        { value: '9', label: '9' },
        { value: '10', label: '10' },
        { value: '11', label: '11' },
        { value: '12', label: '12' },
        { value: '13', label: '13' },
        { value: '14', label: '14' },
        { value: '15', label: '15' },
        { value: '16', label: '16' },
        { value: '17', label: '17' },
        { value: '18', label: '18' },
        { value: '19', label: '19' },
        { value: '20', label: '20' },
        { value: '21', label: '21' },
        { value: '22', label: '22' },
        { value: '23', label: '23' },
        { value: '24', label: '24' },
        { value: '25', label: '25' },
        { value: '26', label: '26' },
        { value: '27', label: '27' },
        { value: '28', label: '28' },
        { value: '29', label: '29' },
        { value: '30', label: '30' }
      ]
    }
  },
  methods: {
    validateImgs () {
      if (!this.threePartForm.imgs[0].img) {
        this.setMsg('请上传场地图片')
        return
      }

      this.threePartForm.mainImg = ''
      for (let list of this.threePartForm.imgs) {
        if (list.mainImg === 1) {
          this.threePartForm.mainImg = list.img
        }
      }
      if (!this.threePartForm.mainImg) {
        this.setMsg('请设置场地主图')
        return
      }
      return true
    },
    // 提交表单第二步验证
    verifyNaturalTrue(val) {
      return (!NATURAL_NUM.test(val))
    },
    verifyReservationSetting() {
      // 1 区分工作日，2 不区分工作日
      let msgHead, msgCon
      if (this.twoPartForm.appointmentTimeType === 2) {
        for (let item of this.openData) {
          msgHead = item.type === 1 ? '工作日' : '非工作日'

          if (item.status) {
            if (this.onePartForm.type !== '3') {
              if (!item.startTime) {
                msgCon = '起始时间'
                this.popTip(msgHead, msgCon)
                return
              }
              if (!item.endTime) {
                msgCon = '结束时间'
                this.popTip(msgHead, msgCon)
                return
              }
            }

            if (!item.price) {
              msgCon = '收费标准'
              this.popTip(msgHead, msgCon)
              return
            } else {
              if (this.verifyNaturalTrue(item.price)) {
                msgCon = 'price'
                this.popTip(msgHead, msgCon)
                return
              }
            }
          }
        }
        return true
      } else {
        msgHead = '整周'

        if (this.openData[0].status) {
          if (this.onePartForm.type !== '3') {
            if (!this.openData[0].startTime) {
              msgCon = '起始时间'
              this.popTip(msgHead, msgCon)
              return
            }
            if (!this.openData[0].endTime) {
              msgCon = '结束时间'
              this.popTip(msgHead, msgCon)
              return
            }
          }

          if (this.verifyNaturalTrue(this.openData[0].price)) {
            msgCon = 'price'
            this.popTip(msgHead, msgCon)
            return
          }
        }
        return true
      }
    },
    popTip(msgHead, msgCon) {
      if (msgCon) {
        let head
        if (!msgCon.includes('时间')) {
          head = '请输入'
        } else {
          head = '请选择'
        }

        if (msgCon === 'price') {
          this.setMsg('场地价格仅支持整数')
        } else {
          this.setMsg(`${head}${msgHead}${msgCon}`)
        }
      }
    },
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
      let max = 100
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
      if (!probability) {
        tempObj.probabilityValidate = true
        this.prizeList.splice(index, 1, tempObj)
      }
      if (!POSITIVE_INTEGER.test(probability)) {
        tempObj.prizeProbabilityWarning = '中奖概率必须为正整数'
        tempObj.probabilityValidate = true
        this.prizeList.splice(index, 1, tempObj)
      } else {
        if (feeTarget.probability - 1 + 1 > max) {
          tempObj.prizeProbabilityWarning = '中奖概率不能超过100%'
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
    // 关闭弹窗
    handleCloseDialog(done) {
      // if (this.selectedMembers.length) {
      //   const _this = this
      //   _this.$confirm('未保存添加，是否确认关闭？', {
      //     lockScroll: false
      //   })
      //     .then(_ => {
      //       _this.selectedMembers = []
      //       done()
      //     })
      //     .catch(_ => {
      //     })
      // } else {
      //   done()
      // }
    },
    // 显示活动日期
    displayStart (date) {
      this.threePartForm.displayStartValue = new Date(date).valueOf()
      console.log('date', this.threePartForm.displayStartValue)
    }
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
  } else if (!NATURAL_NUM.test(value)) {
    callback(new Error('请输入数字'));
  } else {
    callback();
  }
};
// 初始中奖次数
const checkOriginalTimes = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入初始可抽奖次数'));
  } else if (!NATURAL_NUM.test(value)) {
    callback(new Error('请输入数字'));
  } else {
    callback();
  }
};
// 分享后获得的抽奖次数
const checkShareAddTimes = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入分享成功后额外抽奖次数'));
  } else if (!NATURAL_NUM.test(value)) {
    callback(new Error('请输入数字'));
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
  if (!value) {
    callback(new Error('请输入单个红包的金额'));
  } else if (!POSITIVE_INTEGER.test(value)) {
    callback(new Error('请输入大于0的正整数'));
  } else {
    callback();
  }
};
const checkMinRentMonth = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入最少预定多少个月'));
  } else if (!POSITIVE_INTEGER.test(value)) {
    callback(new Error('请输入大于0的正整数'));
  } else {
    callback();
  }
};

/**
 * other
 */
const checkStore = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请选择门店'));
  } else {
    callback();
  }
};
const checkType = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请选择场地类型'));
  } else {
    callback();
  }
};
const checkMaxAdmissibleNum = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请填写最大容纳人数'));
  } else if (!POSITIVE_INTEGER.test(value)) {
    callback(new Error('请输入大于0的正整数'));
  } else {
    callback();
  }
};
const checkArea = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请填写场地面积'));
  } else if (!POSITIVE_INTEGER.test(value)) {
    callback(new Error('请输入大于0的正整数'));
  } else {
    callback();
  }
};
const validateStationNum = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入工位数量'));
  } else if (!POSITIVE_INTEGER.test(value)) {
    /* 产品要求 */
    callback(new Error('请输入1-999间的整数'));
  } else {
    callback();
  }
};
