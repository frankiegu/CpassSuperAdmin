import { PWD_RRGULAR, EMAILREG, LHEMAILE } from '@/config/env'
import { checkPhone } from '@/config/utils'

export default {
  data () {
    const checkEmail = (rule, value, callback) => {
      let emailReg = EMAILREG
      let lhEmailReg = LHEMAILE
      if (!value) {
        callback(new Error('邮箱不能为空'))
      } else if (!emailReg.test(value)) {
        callback(new Error('邮箱格式不正确'))
      } else if (!lhEmailReg.test(value)) {
        callback(new Error('例：xx@gzleihou.cn，xx@cpass.net'))
      } else {
        callback()
      }
    }
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
    return {
      // 修改手机号码模块
      replace: {
        tel: '',
        newTel: '',
        qrCode: '',
        qrFocused: false,
        dialogFormVisible: false
      },
      rules1: {
        tel: [{ required: true, trigger: ['blur', 'change'], validator: validateTel }],
        newTel: [{ required: true, trigger: ['blur', 'change'], validator: validateNewTel }],
        qrCode: [{ required: true, message: '请输入验证码', trigger: ['blur', 'change'] }]
      },
      // 修改个人信息模块
      userInfo: {
        email: '',
        isSuper: false,
        username: '',
        name: '',
        openId: null,
        headImgUrl: ''
      },
      rules2: {
        oldPwd: [{ required: true, validator: validateOldPwd, trigger: 'blur' }],
        newPwd: [{ required: true, validator: validateNewPwd, trigger: 'blur' }],
        secondNewPwd: [{ required: true, validator: validateSecondNewPwd, trigger: 'blur' }]
      },
      // 修改密码模块
      replacePwd: {
        oldPwd: '',
        newPwd: '',
        secondNewPwd: ''
      },
      rules: {
        name: [{ required: true, trigger: ['blur', 'change'], validator: checkName }],
        email: [{ required: true, trigger: ['blur', 'change'], validator: checkEmail }],
        headImgUrl: [{ required: true, message: '头像不能为空', trigger: ['blur', 'change'] }]
      },
      hostnameList: [
        {
          wx: 'so-m.tunnel.gzleihou.cn',
          admin: 'so-admin.tunnel.gzleihou.cn'
        }, {
          wx: 'so-m.tunnel.gzleihou.cn',
          admin: 'tt.so-admin.com'
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
          wx: 'so-m-local.tunnel.gzleihou.cn',
          admin: 'localhost'
        }
      ]
    }
  }
}
