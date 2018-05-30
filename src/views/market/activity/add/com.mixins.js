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
      activityTab: 2,     // tab 的门
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
        originalTimes: '' // 初始抽奖次数
      },
      twoPartFormRule: {
        payType: [{ required: true, message: '请至少勾选一种支付方式', trigger: ['blur', 'change'], type: 'array' }],

        // 办公室验证
        startUseTime: [{ required: true, message: '请选择可以开始进驻的日期', trigger: ['blur', 'change'] }],
        minRentMonth: [{ required: true, validator: checkMinRentMonth, trigger: ['blur', 'change'] }],
        price: [{ required: true, validator: checkPrice, trigger: ['blur', 'change'] }],
        attendNum: [{ required: true, validator: checkNum, trigger: ['blur', 'change'] }],
        winningTimes: [{ required: true, validator: checkWinningTimes, trigger: ['blur', 'change'] }],
        originalTimes: [{ required: true, validator: checkOriginalTimes, trigger: ['blur', 'change'] }]
      },

      // part 3
      threePartForm: {
        mainImg: '', // 在验证的时候需要
        imgs: [{}],
        contactName: '',
        telLineSelected: '0', // 0手机号码，1固定电话
        contactTel: '',
        facilitiesAndServices: '',
        instructionsForUse: '',
        isEffect: false // 马上生效
      },
      threePartFormRule: {
        contactName: [{ required: true, message: '请填写场地联系人姓名', trigger: ['blur', 'change'] }],
        contactTel: [{ required: true, validator: validateTel, trigger: ['blur', 'change'] }]
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
  } else if (!POSITIVE_INTEGER.test(value)) {
    callback(new Error('请输入大于0的正整数'));
  } else {
    callback();
  }
};
// 初始中奖次数
const checkOriginalTimes = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入每人最大允许中奖数'));
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
