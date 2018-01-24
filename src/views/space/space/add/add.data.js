import {checkPhone} from '@/config/utils'
import {FIXPHONEREG, POSITIVE_INTEGER} from '@/config/env'

const checkImgs = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入上传图片'));
  } else {
    callback();
  }
};
const checkStore = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请选择门店'));
  } else {
    callback();
  }
};
const validateUserName = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入您的联系方式'));
  }
  if (this.telLineSelected === '0' && !checkPhone(value)) {
    callback(new Error('请输入正确的电话'));
  }
  if (this.telLineSelected === '1' && !FIXPHONEREG.test(value)) {
    callback(new Error('固定电话号码格式不正确。例：020-8888888'))
  }

  callback();
};
const validateHourPrice = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请填写收费标准'));
  } else if (!POSITIVE_INTEGER.test(value)) {
    callback(new Error('请输入大于0的正整数'));
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
    callback(new Error('请输入大于0的正整数'));
  } else {
    callback();
  }
};

export let onePartForm = function () {
  return {
    fieldName: '',
    type: '',
    storeId: '',
    maxAdmissibleNum: '',
    area: '',
    imgs: [{}],
    mainImg: '',
    storeAddr: '',
    currentUploadIndex: ''
  }
}
export let twoPartForm = function () {
  return {
    dateStartTime: '00:00',
    startTime: '',
    endTime: '',
    type: '1',
    hourPrice: '',
    cancalBeforeHours: 3,
    payType: [],
    canUseCoupon: 0,
    canUsePoint: 0,
    stationNum: null
  }
}
export let threePartForm = function () {
  return {
    contactName: '',
    contactTel: '',
    facilitiesAndServices: '',
    instructionsForUse: ''
  }
}
export const pageData = {
  editorOption1: {
    modules: {
      toolbar: [
        [{'list': 'bullet'}]
      ]
    },
    placeholder: ' ',
    theme: 'snow'  // or 'bubble'
  },
  hoursList: [
    {value: '1', label: '1'},
    {value: '2', label: '2'},
    {value: '3', label: '3'},
    {value: '6', label: '6'},
    {value: '12', label: '12'}
  ],
  onePartFormRule: {
    fieldName: [{required: true, trigger: 'blur,change', message: '请填写场地名称'}],
    type: [{required: true, trigger: 'click', validator: checkType}],
    maxAdmissibleNum: [{required: true, trigger: 'blur,change', validator: checkMaxAdmissibleNum}],
    area: [{required: true, trigger: 'blur,change', validator: checkArea}],
    imgs: [{required: true, trigger: 'click', validator: checkImgs}],
    storeId: [{required: true, trigger: 'selected', validator: checkStore}]
  },
  twoPartFormRule: {
    startTime: [{required: true, message: '请选择起始时间', trigger: 'blur,change'}],
    endTime: [{required: true, message: '请选择结束时间', trigger: 'blur,change'}],
    hours: [{required: true, message: '请填写场地名称', trigger: 'blur,change'}],
    type: [{required: true, message: '请设置取消时间相关参数', trigger: 'blur,change'}],
    hourPrice: [{required: true, validator: validateHourPrice, trigger: 'blur,change'}],
    payType: [{required: true, message: '请至少勾选一种支付方式', trigger: 'blur,change', type: 'array'}],
    stationNum: [{required: true, validator: validateStationNum, trigger: 'blur,change'}]
  },
  threePartFormRule: {
    contactName: [{required: true, message: '请填写场地联系人姓名', trigger: 'blur,change'}],
    contactTel: [{required: true, trigger: 'blur,change', validator: validateUserName}]
  }
};
