<template>
  <div class="login-container">
    <div class="logo-box">
      <img class="logo mr5" src="./imgs/leihou-logo.png">
      酷雷托智能空间总管理后台
    </div>

    <el-form :model="formData" :rules="formRules" ref="formData" label-width="0px" class="card-box login-form">
      <!-- <div class="mask-box"></div> -->

      <div class="login-box">
        <el-form-item>
          <p class="login-in">
            <lh-svg slot="prefix" icon-class="icon-log-in" class="theme-blue" /> 欢迎登陆
          </p>
        </el-form-item>

        <div class="login-box-in">
          <el-form-item class="username" prop="username">
            <el-input
              autoComplete="on"
              :maxlength="11"
              v-model.trim="formData.username"
              @keyup.native.enter="handleLogin('formData')"
              placeholder="请输入账号">
              <lh-svg slot="prefix" icon-class="icon-user" class="svg-icon" />
            </el-input>
          </el-form-item>

          <el-form-item class="password" prop="password">
            <el-input
              name="password1"
              type="password"
              autoComplete="off"
              :maxlength="10"
              v-model.trim="formData.password"
              @keyup.native.enter="handleLogin('formData')"
              placeholder="请输入密码">
              <lh-svg slot="prefix" icon-class="icon-password" class="svg-icon" />
            </el-input>
          </el-form-item>

          <el-button
            @click.native.prevent="handleLogin('formData')"
            :loading="loading"
            class="login-btn width100"
            size="small"
            type="primary">登录</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  import store from '@/store'
  import loginMixins from './login.mixins'

  export default {
    mixins: [loginMixins], // 长变量，可以抽出一个mixins
    data() {
      return {
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
            this.loading = true
            store.dispatch('loginByPhone', this.formData).then(() => {
              this.loading = false
              this.$router.push({ path: '/' })
            }).catch(err => {
              this.setMsg('error', err)
              this.loading = false
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/common.scss';
  .login-container {
    @include relative;
    min-height: 100vh;
    background: url('./imgs/login-background1.png') center center no-repeat fixed;
    filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../img/bgs/landscape.jpg', sizingMethod='scale');
    -ms-filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../img/bgs/landscape.jpg', sizingMethod='scale')";
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;

    // .mask-box {
    //   position: fixed;
    //   z-index: 1;
    //   top: 0;
    //   right: 0;
    //   width: 390px;
    //   @media screen and (min-width: 1367px) {
    //     width: 480px
    //   }
    //   height: 100%;
    //   opacity: .1;
    //   background: #000;
    // }
    .svg-icon {
      height: 100%;
      width: 15px;
      margin: 0 5px;
      fill: $theme-blue;
      text-align: center;
      transition: all .3s;
    }
    .logo-box {
      color: $theme-blue;
      font-size: 18px;
      font-weight: 500;
      line-height: 30px;
      padding: 24px 0 0 24px;

      .logo {
        width: 30px;
        height: 30px;
      }
    }
    .login-box {
      position: absolute;
      z-index: 2;
      top: 50%;
      left: 50%;
      margin-left: -150px;
      width: 300px;
      -webkit-transform: translateY(-50%);
      transform: translateY(-50%);
      background: #fff;
      border-radius: 4px;

      .login-in {
        line-height: 16px;
        padding: 14px 16px;
        font-weight: 700;
        border-bottom: 1px solid #e9eaec;
      }
      .login-box-in {
        position: relative;
        padding: 0 16px;
        transition: all 0.2s ease-in-out;

        .login-btn {
          color: #fff;
          letter-spacing: 2;
          margin: 2px 0 36px;
          background: $theme-blue;
          border-radius: 4px;
        }
      }
    }
    .el-form-item {
      color: #454545;
    }
  }
</style>
