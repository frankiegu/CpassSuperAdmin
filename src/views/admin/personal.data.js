import {PWD_RRGULAR} from '@/config/env'
import {checkPhone} from '@/config/utils'

const checkName = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('姓名不能为空'));
  }
  callback();
};
const validateOldPwd = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'));
  } else if (value.length < 6) {
    callback(new Error('密码不能小于6位'));
  } else {
    callback();
  }
};
const validateNewPwd = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'));
  } else if (value.length < 6) {
    callback(new Error('密码不能小于6位'));
  } else if (!PWD_RRGULAR.test(value)) {
    callback(new Error('请输入6-10位字母数字组合密码'));
  } else if (value === this.replacePwd.oldPwd) {
    callback(new Error('新密码不能与旧密码相同'));
  } else {
    if (this.replacePwd.secondNewPwd !== '') {
      this.$refs.replacePwd.validateField('secondNewPwd');
    }
    callback();
  }
};
const validateSecondNewPwd = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请再次输入密码'));
  } else if (value.length < 6) {
    callback(new Error('密码不能小于6位'));
  } else if (!PWD_RRGULAR.test(value)) {
    callback(new Error('请输入6-10位字母数字组合密码'));
  } else if (value !== this.replacePwd.newPwd) {
    callback(new Error('两次输入密码不一致!'));
  } else {
    callback();
  }
};
const validateTel = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入您现有的手机号'));
  } else if (!checkPhone(value)) {
    callback(new Error('请输入正确的手机号'));
  } else {
    if (this.replace.newTel !== '') {
      this.$refs.replace.validateField('newTel');
    }
    callback();
  }
};
const validateNewTel = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入您的手机号'));
  } else if (!checkPhone(value)) {
    callback(new Error('请输入正确的手机号'));
  } else if (value === this.replace.tel) {
    callback(new Error('两次输入了同一个手机号!'));
  } else {
    this.isAble = false
    callback();
  }
};
export let replacePwd = function () {
  return {
    oldPwd: '',
    newPwd: '',
    secondNewPwd: ''
  }
}
export let userInfo = function () {
  return {
    isSuper: false,
    name: '',
    openId: null
  }
}
export let replace = function () {
  return {
    tel: '',
    newTel: '',
    qrCode: '',
    qrFocused: false,
    dialogFormVisible: false
  }
}

export const pageData = {
  rules1: {
    tel: [{required: true, trigger: 'blur,change', validator: validateTel}],
    newTel: [{required: true, trigger: 'blur,change', validator: validateNewTel}],
    qrCode: [{required: true, message: '请输入验证码', trigger: 'blur,change'}]
  },
  rules: {
    name: [{required: true, trigger: 'blur,change', validator: checkName}]
  },
  rules2: {
    oldPwd: [{required: true, validator: validateOldPwd, trigger: 'blur'}],
    newPwd: [{required: true, validator: validateNewPwd, trigger: 'blur'}],
    secondNewPwd: [{required: true, validator: validateSecondNewPwd, trigger: 'blur'}]
  },
  hostnameList: [
    {
      wx: 'so-m.tunnel.gzleihou.cn',
      admin: 'so-admin.tunnel.gzleihou.cn'
    }, {
      wx: 'sowx.uat.gzleihou.cn',
      admin: 'soadmin.uat.gzleihou.cn'
    }, {
      wx: 'so.wx.symunity.cn',
      admin: 'so.admin.symunity.cn'
    }, {
      wx: 'sowx.gzleihou.cn',
      admin: 'soadmin.gzleihou.cn'
    }, {
      wx: 'leihou.natapp1.cc',
      admin: 'localhost'
    }
  ]
};
