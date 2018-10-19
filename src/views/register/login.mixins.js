import Cookies from 'js-cookie'
import { checkPhone } from '@/config/utils'

export default {
  data () {
    // 为防止拿不到验证规则，变量要放在 export 前面
    const validatePass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入密码'));
      } else if (value.length < 6) {
        callback(new Error('密码不能小于6位'));
      } else {
        callback();
      }
    };
    const validateUserName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入账号'));
      } else if (!checkPhone(value)) {
        callback(new Error('请输入正确的账号'));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入验证码'));
      } else if (value.length < 4) {
        callback(new Error('请输入4位验证码'));
      } else {
        callback();
      }
    };
    return {
      formData: {
        username: Cookies.get('sospTelphone') || '',
        password: '',
        verificationCode: ''
      },
      formRules: {
        username: [{ required: true, trigger: ['blur', 'change'], validator: validateUserName }],
        password: [{ required: true, trigger: ['blur', 'change'], validator: validatePass }],
        verificationCode: [{ required: true, trigger: ['blur', 'change'], validator: validateCode }]
      }
    }
  }
}
