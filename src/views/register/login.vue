<template>
  <div class="login-container">
    <el-form :model="formData" :rules="formRules" ref="formData" label-width="0px" class="card-box login-form">
      <div class="login-box">
        <a href="javascript:(0);" class="login-logo"> <img src="../../images/login-logo.png" alt=""> </a>

        <div class="login-box-in">
          <h3 class="login-title">欢迎<span>登录！</span></h3>

          <el-form-item class="account" prop="username">
            <span class="svg-container username"></span>

            <el-input
              :autofocus="formData.username.length === 0"
              autoComplete="on"
              :maxlength="11"
              v-model.trim="formData.username"
              @keyup.native.enter="handleLogin('formData')"
              placeholder="请输入账号"></el-input>
          </el-form-item>

          <el-form-item class="password" prop="password">
            <span class="svg-container pwd"></span>

            <el-input
              :autofocus="formData.username.length > 0"
              name="password1"
              type="password"
              autoComplete="off"
              :maxlength="10"
              v-model.trim="formData.password"
              @keyup.native.enter="handleLogin('formData')"
              placeholder="请输入密码"></el-input>
          </el-form-item>

          <el-checkbox class="fl" :value="true">记住我</el-checkbox>
          <router-link to="/back-pwd" class="forget-pwd">忘记密码？</router-link>

          <el-button :loading="loading" class="login-btn" type="primary" @click.native.prevent="handleLogin('formData')" >登录</el-button>
        </div>
      </div>
  </el-form>
</div>
</template>

<script>
  import store from '@/store'
  import setMsg from '@/config/com-mixins'
  import {formRules, formData} from './login.text'

  export default {
    mixins: [setMsg],
    data() {
      return {
        formData,
        formRules,
        redirectRouter: '',
        loading: false
      }
    },
    mounted () {
      this.redirectRouter = encodeURI(this.$route.query.redirect || '')
    },
    methods: {
      handleLogin (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            store.dispatch('loginByPhone', this.formData).then(() => {
              this.loading = false

              store.dispatch('getUserInfo').then(res => {
                store.dispatch('getSpaceInfo').then(res => {
                  this.$router.replace({
                    path: this.redirectRouter || '/home'
                  })
                }).catch(err => {
                  this.setMsg('error', err)
                })
              }).catch(err => {
                this.setMsg('error', err)
              })
            }).catch(err => {
              this.setMsg('error', err)
              this.loading = false
            })
          } else return
        })
      }
    }
  }
</script>

<style lang="scss">
  @media screen and (max-width: 3921px) {
    .login-container {
      .login-box {
        transform: scale(0.77);
      }
      input {
        font-size: 20px;
      }
      .el-form-item__error {
        font-size: 15px;
      }
      .el-checkbox__label, .forget-pwd {
        font-size: 16px;
      }
      .el-form-item__error {
        font-size: 15px;
      }
    }
  }
  .login-container {
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
      width: 85%;
    }
  }
</style>
<style lang="scss" scoped>
  @import '../../../src/styles/common.scss';

  .login-container {
    @include relative;
    min-height: 100vh;
    background: url('./imgs/login_background.png') center center no-repeat fixed;
    filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../img/bgs/landscape.jpg', sizingMethod='scale');
    -ms-filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../img/bgs/landscape.jpg', sizingMethod='scale')";
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;

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
        margin-bottom: 121px;

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

        img {
          display: block;
          width: 120px;
          height: 120px;
        }
      }
      .login-box-in {
        height: 520px;
        padding: 30px 80px 38px;
        background-color: #fff;
        box-sizing: border-box;
        border-radius: 6px;

        .login-btn {
          width: 100%;
          height: 60px;
          font-family: PingFangSC-Regular;
          font-size: 18px;
          color: #FFFFFF;
          letter-spacing: 0;
          margin: 22px 0;
          background: #7A96E8;
          border-radius: 6px;
        }
      }
    }
    .account {
      margin-bottom: 40px;
    }
    .password {
      margin-bottom: 45px;
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
    @mixin com {
      content: '';
      display: inline-block;
      position: absolute;
      top: 50%;
      left: 0;
      margin-top: -16px;
      width: 24px;
      height: 24px;
      background-size: cover;
    }
    .username {
      &:after {
        @include com;
        background: url("./imgs/login_number_icon.png") no-repeat;
      }
    }
    .pwd {
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
