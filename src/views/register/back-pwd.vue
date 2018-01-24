<template>
  <div class="back-pwd">

    <el-form
      :model="loginForm"
      :rules="loginRules"
      ref="loginForm"
      label-width="0px"
      class="card-box login-form">

      <div class="login-box">
        <a href="javascript:(0);" class="login-logo"></a>

        <div class="login-box-in">
          <h3 class="login-title">找回密码</h3>

          <el-form-item prop="telephone">
            <span class="svg-container username"></span>
            <el-input
              autoComplete="off"
              :maxlength="11"
              v-model.trim="loginForm.telephone"
              placeholder="输入您的手机号"></el-input>
          </el-form-item>

          <el-form-item class="pwd-box" prop="imgCodeInput">
            <span class="svg-container img-code-input"></span>
            <el-input
              autoComplete="off"
              :maxlength="4"
              v-model.trim="loginForm.imgCodeInput"
              placeholder="输入图片验证码"></el-input>

            <img @click="getImgCode" :src="imgCode" alt="">
          </el-form-item>

          <el-form-item prop="verifyCode">
            <span class="svg-container number-code"></span>
            <el-input
              class="input-username"
              autoComplete="on"
              v-model.trim="loginForm.verifyCode"
              placeholder="输入验证码"></el-input>

            <div class="get-qr">
              <div class="qr-code" @click.stop="getQrCode" v-bind:class="{'theme-gray': isAble}" v-text="smsText"></div>
            </div>
          </el-form-item>

          <el-form-item prop="newPassword">
            <span class="svg-container new-pwd"></span>
            <!-- 设置name，可以区分不同页面的的密码输入框 -->
            <el-input
              name="password2"
              type="password"
              autoComplete="off"
              :maxlength="10"
              v-model.trim="loginForm.newPassword"
              placeholder="新密码"></el-input>
          </el-form-item>

          <el-button
            v-waves
            class="login-btn"
            type="primary"
            :loading="loading"
            @click.native.prevent="handleLogin('loginForm')">确认</el-button>

          <router-link class="back-login mt10" :to="'/login'">返回登录</router-link>

        </div>
      </div>
  </el-form>
</div>
</template>

<script>
  import { resetByVerifyCode, sendResetPasswordCode } from '@/service'
  import { checkPhone } from '@/config/utils'
  import { API_PATH } from '@/config/env'
  import countdown from '@/config/mixins/countdown'
  import Cookies from 'js-cookie'

  export default {
    mixins: [countdown],
    data() {
      const validateUserName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入您的手机号'));
        } else if (!checkPhone(value)) {
          callback(new Error('请输入正确的手机号'));
        } else {
          callback();
        }
      };
      const validateImgCodeInput = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入图片验证码'));
        } else if (value.length === 4) {
          this.isAble = false
          callback();
        }
      };
      var validatePwd = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入新密码'));
        } else if (value.length < 6) {
          callback(new Error('密码不能小于6位'));
        } else if (!this.numString.test(value)) {
          callback(new Error('请输入6-10位字母数字组合密码'));
        } else {
          callback();
        }
      };
      return {
        title: '找回密码',
        numString: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/,
        // 调用接口的时候，直接把这个对象传过去
        loginForm: {
          telephone: '',
          imgCodeInput: '',
          verifyCode: '',
          newPassword: ''
        },
        loginRules: {
          telephone: [
            { required: true, trigger: 'blur,change', validator: validateUserName }
          ],
          imgCodeInput: [
            { required: true, trigger: 'blur,change', validator: validateImgCodeInput }
          ],
          verifyCode: [
            { required: true, message: '请输入验证码', trigger: 'blur,change' }
          ],
          newPassword: [
            { required: true, validator: validatePwd, trigger: 'blur' }
          ]
        },
        imgCode: '',
        qrStatus: true,
        maxlength: 11,
        loading: false
      }
    },
    mounted () {
      this.getImgCode()
    },
    methods: {
      handleLogin(formName) {
        const self = this
        self.$refs[formName].validate((valid) => {
          if (valid) {
            self.loading = true;

            resetByVerifyCode({
              telephone: self.loginForm.telephone,
              verifyCode: self.loginForm.verifyCode,
              newPassword: self.loginForm.newPassword
            }).then(res => {
              if (res.status === 'true') {
                self.loading = false;

                sessionStorage.removeItem('token')
                let routePath = self.$route.path
                // console.log('self.$route.push', routePath)
                self.$router.push({path: '/login', query: {redirect: routePath}})

                // 保存手机号码
                Cookies.set('telphone', self.loginForm.telephone)
                self.$message({
                  showClose: true,
                  message: '修改成功!',
                  type: 'success'
                });

                // 后退一步记录，等同于 history.back()
                self.$router.go(-1)
              } else {
                self.loading = false;
                self.$message({
                  showClose: true,
                  message: res.msg,
                  type: 'error'
                });
              }
            })
          } else {
            return false;
          }
        });
      },
      getQrCode () {
        const self = this

        if (self.isAble) {
          return
        }
        if (!self.qrStatus) {
          return
        }

        sendResetPasswordCode({
          telephone: this.loginForm.telephone,
          verifyCode: this.loginForm.imgCodeInput
        }).then(res => {
          if (res.status === 'true') {
            // 获取验证码之后，置灰
            self.qrStatus = false

            self.isAble = true
            self.settime()

            self.$message({
              showClose: true,
              message: '短信验证码已发送至您的手机，请注意查收!',
              type: 'success'
            });
          } else {
            self.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
        })
      },
      getImgCode () {
        this.imgCode = API_PATH + '/manage/captcha/getResetPasswordCode' + '?random=' + Math.random()
      }
    }
  }
</script>


<style lang="scss">
  .back-pwd {
    .pwd-box {
      img {
        float: right;
        width: 81px;
        height: 35px;
      }
    }
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
      -webkit-text-fill-color: #1C1C2F !important;
    }
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 10px 5px 10px 15px;
      color: #1C1C2F;
      font-size: 18px;
      height: 45px;
      box-sizing: border-box;
    }
    .el-input {
      display: inline-block;
      height: 45px;
      width: 70%;
      margin-right: -81px;
    }
  }
</style>
<style lang="scss" scoped>
  @import "src/styles/common.scss";

  .back-pwd {
    @include relative;
    min-height: 100vh;
    background: url('./imgs/login_background.png') center center no-repeat fixed;
    filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../img/bgs/landscape.jpg', sizingMethod='scale');
    -ms-filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../img/bgs/landscape.jpg', sizingMethod='scale')";
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;

    @media screen and (max-width: 1921px) {
      .login-box {
        transform: scale(0.77);

        input {
          font-size: 20px;
        }
        .el-form-item__error {
          font-size: 15px;
        }
        .el-checkbox__label, .forget-pwd {
          font-size: 16px;
        }
      }
    }

    .qr-code {
      cursor: pointer;
    }
    .get-qr {
      position: relative;
      z-index: 2;
      float: right;
      width: 131px;
      font-family: PingFangSC-Regular;
      font-size: 18px;
      color: #5E80E5;
      letter-spacing: 0;
      text-align: center;

      div {
        height: 22px;
        line-height: 22px;
        margin: 11.5px 0;
        border-left: 2px solid #9E9EA8;
      }
    }
    .login-box {
      position: absolute;
      top: 40%;
      left: 0;
      right: 0;
      width: 520px;
      margin: -249px auto 0;

      .login-title {
        font-family: PingFangSC-Regular;
        font-size: 28px;
        color: #1C1C2F;
        letter-spacing: 0;
        text-align: center;
        line-height: 28px;
        margin-bottom: 47px;

        span {
          color: #5E80E5;
        }
      }
      .login-logo {
        display: block;
        width: 120px;
        height: 120px;
        margin: 0 auto 50px;
        border-radius: 50%;
      }
      .login-box-in {
        height: 520px;
        padding: 30px 80px 38px;
        background-color: #fff;
        box-sizing: border-box;

        .login-btn {
          width: 100%;
          height: 60px;
          font-family: PingFangSC-Regular;
          font-size: 18px;
          color: #FFFFFF;
          letter-spacing: 0;
          margin-top: 22px;
          background: #7A96E8;
          border-radius: 6px;

          @media screen and (max-width: 3921px) {
            font-size: 19px;
          }
        }
        .back-login {
          display: block;
          color: $theme-blue;
          text-align: center;
          margin-top: 20px;
          font-size: 16px;

          @media screen and (max-width: 3921px) {
            font-size: 17px;
          }
        }
      }
    }
    .svg-container {
      position: relative;
      display: inline-block;
      width: 24px;
      height: 24px;
      padding: 10px 0;
      float: left;
      // padding: 6px 5px 6px 15px;
      // color: #889aa4;
    }
    @mixin com() {
      content: '';
      display: inline-block;
      position: absolute;
      top: 50%;
      left: 0;
      margin-top: -12px;
      width: 24px;
      height: 24px;
      background-size: 100% 100%;
    }
    .username {
      &:after {
        @include com;
        background: url("./imgs/back_cipher_phone_icon.png") no-repeat;
      }
    }
    .img-code-input {
      &:after {
        @include com;
        background: url("./imgs/back_cipher_verification_icon.png") no-repeat;
      }
    }
    .number-code {
      &:after {
        @include com;
        background: url("./imgs/mima.png") no-repeat;
      }
    }
    .new-pwd {
      &:after {
        @include com;
        background: url("./imgs/login_cipher_icon.png") no-repeat;
      }
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      color: #1C1C2F;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .el-form-item {
      color: #454545;
      border-bottom: 1px solid #BFBFCB;
    }
    .forget-pwd {
      float: right;
      color: #5E80E5;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 5px;
    }
  }
</style>
