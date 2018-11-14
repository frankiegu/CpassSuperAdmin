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
              <lh-svg slot="prefix" icon-class="icon-mine1" class="svg-icon" />
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

          <el-form-item v-if="isShowImgCode" class="pwd-box" prop="verifyCode">
            <el-input
              autoComplete="off"
              :maxlength="4"
              v-model.trim="formData.verifyCode"
              @keyup.native.enter="handleLogin('formData')"
              placeholder="输入图片验证码">
              <lh-svg slot="prefix" iconClass="icon-qrcode" class="svg-icon" />
              <img v-if="imgCode" slot="suffix" class="img-code" @click="getImgCode" :src="imgCode" alt="">
              <span class="img-code" slot="suffix" v-else>加载中</span>

            </el-input>

          </el-form-item>


          <!--</el-form-item>-->

          <!-- <span @click.native.prevent="handleLogin('formData')" class="login-btn width100 to-bottom-right">登录</span> -->
          <el-button
            @click.native.prevent="handleLogin('formData')"
            :loading="loading"
            class="login-btn to-bottom-right"
            type="primary">登录</el-button>
        </div>
      </div>
    </el-form>

    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :show-close="false"
      title="首次登录，请重置密码"
      width="526px">

      <el-form
        :model="replacePwd"
        ref="replacePwd"
        :rules="rules2"
        label-width="180px"
        class="demo-ruleForm">

        <el-form-item label="新密码" prop="newPwd">
          <el-input
            type="password"
            style="width: 200px;"
            v-model.trim="replacePwd.newPwd"
            :maxlength="10"
            placeholder="6-10位字母数字组合密码"></el-input></el-form-item>

        <el-form-item label="再次输入" prop="secondNewPwd">
          <el-input
            type="password"
            :maxlength="10"
            style="width: 200px;"
            v-model.trim="replacePwd.secondNewPwd"
            placeholder="6-10位字母数字组合密码"></el-input></el-form-item>

        <el-form-item class="align-left">
          <el-button
            @click="submitForm('replacePwd')"
            class="width80px mt30"
            type="primary">保 存</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
  import store from '@/store'
  import loginMixins from './login.mixins'
  import { API_PATH, PWD_RRGULAR } from '@/config/env'
  import { firstLoginResetPassword } from '@/service'

  export default {
    mixins: [loginMixins], // 长变量，可以抽出一个mixins
    data() {
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
      return {
        dialogVisible: false,
        rules2: {
          newPwd: [{ required: true, validator: validateNewPwd, trigger: 'blur' }],
          secondNewPwd: [{ required: true, validator: validateSecondNewPwd, trigger: 'blur' }]
        },
        // 修改密码模块
        replacePwd: {
          newPwd: '',
          secondNewPwd: ''
        },
        redirectRouter: '',
        loading: false,
        isShowImgCode: false,
        imgCode: ''
      }
    },
    beforeDestroy () {
      window.removeEventListener('beforeunload', this.beforeUnloadHandler)
    },
    mounted () {
      this.redirectRouter = encodeURI(this.$route.query.redirect || '')
      window.addEventListener('beforeunload', this.beforeUnloadHandler)
    },
    methods: {
      beforeUnloadHandler () {
        sessionStorage.removeItem('token')
      },
      handleLogin (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true
            if (!this.isShowImgCode) {
              delete this.formData.verifyCode
            }
            store.dispatch('loginByPhone', this.formData).then(() => {
              this.loading = false
              // 如果是第一次登录
              if (store.getters.firstLogin === 1) {
                this.dialogVisible = true
              } else {
                this.$router.push({ path: '/' })
              }
            }).catch(err => {
              this.setMsg('error', err.msg || '请输入验证码')
              if (err.msg === '验证码错误') {
                this.getImgCode()
              }
              this.loading = false
              // 判断需要验证码（前提：同一个账户输入错误密码三次以及三次以上）
              if (err.info === 'false') {
                this.isShowImgCode = true
                this.getImgCode()
              }
            })
          }
        })
      },
      getImgCode () {
        this.imgCode = API_PATH + '/supervisor/captcha/getLoginCode' + '?random=' + Math.random()
      },
      // 阻止用户关闭弹窗
      handleClose() {
        this.$alert('用户首次登录需更改默认密码', '提示', {
          confirmButtonText: '确定',
          callback: action => {
          }
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            firstLoginResetPassword({
              newPassword: this.replacePwd.secondNewPwd
            }).then(res => {
              if (res.status === 'true') {
                // this.setMsg('success', '短信验证码已发送至您的手机，请注意查收!')
                this.setMsg('success', '密码修改成功，请重新登录!')
                this.dialogVisible = false
                this.formData.password = ''
                // 判断是否有图形验证码，修改密码之后图形验证码需要刷新
                if (this.isShowImgCode) {
                  this.getImgCode()
                  this.formData.verifyCode = ''
                }
              } else this.setMsg('error', res.msg)
            })
          } else {
            return false;
          }
        });
      }
    }
  }
</script>

<style lang="scss">
  .pwd-box {
    .el-input__suffix {
      position: absolute;
      height: 100%;
      right: 0;
      top: 0;
    }
  }
</style>

<style lang="scss" scoped>
  @import 'src/styles/common.scss';
  @import 'src/styles/mixins/mixins';
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
      color: $theme-blue;
      text-align: center;
      // transition: all .3s;
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
      margin-top: -150px;
      width: 300px;
      // -webkit-transform: translateY(-50%);
      // transform: translateY(-50%);
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

        .pwd-box {
          .img-code {
            float: right;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            width: 82px;
            height: 100%;
          }
          .svg-container {
            margin-left: 12px;
            width: 20px;
            height: 20px;
            fill: $theme-light-gray;
            transition: all ease .25s;

            &.active-icon {
              fill: $theme-blue;
            }
          }
        }

        .login-btn {
          width: 100%;
          height: 32px;
          line-height: 32px;
          padding: 0;
          text-align: center;
          color: #fff;
          letter-spacing: 2px;
          margin: 0 0 36px;

          &:hover {
            height: 32px;
            line-height: 32px;
            border: 0;
          }
        }
      }
    }
    .el-form-item {
      color: #454545;
    }
  }
</style>
