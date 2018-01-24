<template>
  <div class="admin-personal">
    <div class="page-title"> <h1>个人信息</h1> </div>

    <div class="form-box card-padding card-padding-vertical">
      <h3 class="grid-title">修改个人信息</h3>
      <el-form
        :model="userInfo"
        ref="userInfo"
        :rules="rules"
        label-width="180px"
        class="demo-ruleForm">

        <el-form-item label="姓名" prop="name">
          <el-input v-model.trim="userInfo.name" auto-complete="off"></el-input>
          &nbsp;&nbsp;
          <el-tag v-show="userInfo.isSuper" type="warning">超级管理员</el-tag>
        </el-form-item>

        <el-form-item label="手机号码">
          <el-input :disabled="true" v-model.trim="replace.tel" auto-complete="off"></el-input>
          &nbsp;&nbsp;
          <span @click="replace.dialogFormVisible = true" class="replace-tel">修改</span>
        </el-form-item>

        <el-form-item class="align-left">
          <el-button
            @click="replaceName('userInfo')"
            class="theme-btn-blue width120"
            type="primary">保存</el-button></el-form-item>
      </el-form>

      <h3 class="grid-title">修改密码</h3>
      <el-form
        :model="replacePwd"
        ref="replacePwd"
        :rules="rules2"
        label-width="180px"
        class="demo-ruleForm">

        <el-form-item label="旧密码" prop="oldPwd">
          <el-input
            type="password"
            v-model.trim="replacePwd.oldPwd"
            :maxlength="10"
            placeholder="请输入旧的密码"></el-input>
            &nbsp;&nbsp;
            <span class="theme-gray">初始密码：123456</span></el-form-item>

        <el-form-item label="新密码" prop="newPwd">
          <el-input
            type="password"
            v-model.trim="replacePwd.newPwd"
            :maxlength="10"
            placeholder="6-10位字母数字组合密码"></el-input></el-form-item>

        <el-form-item label="再次输入" prop="secondNewPwd">
          <el-input
            type="password"
            :maxlength="10"
            v-model.trim="replacePwd.secondNewPwd"
            placeholder="6-10位字母数字组合密码"></el-input></el-form-item>

        <el-form-item class="align-left">
          <el-button
            @click="submitForm('replacePwd')"
            class="theme-btn-blue width120"
            type="primary">保存</el-button>
        </el-form-item>
      </el-form>

      <h3 class="grid-title">绑定微信</h3>
      <div class="detail-info">
        <div class="label">微信号：</div>
        <div class="label-con">
          <el-tag v-if="!userInfo.openId" type="info">未绑定</el-tag>
          <el-tag v-else type="success">{{ userInfo.openId }}</el-tag>
        </div>
      </div>
      <div class="detail-info">
        <div class="label"></div>
        <div class="label-con">
          <el-button
            @click="showQrCode"
            class="theme-btn-blue width120"
            type="primary">{{ !userInfo.openId ? '添加' : '编辑' }}</el-button>
        </div>
      </div>
    </div>

    <!-- qr -->
    <el-dialog
      :visible.sync="qrDialogVisible"
      width="298px"
      class="qr-box-more">

      <div class="qr-box">
        <qr-code
          :text="qrUrl"
          :size="258"
          error-level="L"></qr-code>

        <p class="theme-gray text-center mt10">微信扫码绑定微信号</p>
      </div>
    </el-dialog>

    <!-- 修改手机号码 -->
    <el-dialog
      :visible.sync="replace.dialogFormVisible"
      title="修改手机号码"
      width="526px">
      <div class="important">
        <i class="el-icon-warning"></i>
        <div class="fl">
          <p>手机号码作为登录账号，请谨慎修改。</p>
          <p>修改后将以新的手机号码为登录账号</p>
        </div>
      </div>

      <el-row>
        <el-col :gutter="10">
          <el-form
            :model="replace"
            ref="replace"
            :rules="rules1"
            label-width="180px" >
            <el-form-item label="现有手机号码" label-width="180px" prop="tel">
              <el-row>
                <el-col :span="20">
                  <el-input
                    :maxlength="11"
                    v-model.trim="replace.tel"
                    auto-complete="off"
                    disabled
                    placeholder="现有手机号码"></el-input>
                </el-col>
              </el-row>
            </el-form-item>

            <el-form-item label="新手机号码" label-width="180px" prop="newTel">
              <el-row>
                <el-col :span="20">
                  <el-input
                    :maxlength="11"
                    v-model.trim="replace.newTel"
                    auto-complete="off"
                    placeholder="新手机号码"></el-input>
                </el-col>
              </el-row>
            </el-form-item>

            <el-form-item label="验证码" label-width="180px" prop="qrCode">
              <el-row>
                <el-col :span="10">
                  <el-input
                    v-model.trim="replace.qrCode"
                    auto-complete="off"
                    v-focus="replace.qrFocused"
                    @focus="replace.qrFocused = true"
                    @blur="replace.qrFocused = false"
                    placeholder="验证码"></el-input>
                </el-col>

                <el-col :span="1">
                  <div class="width30"></div>
                </el-col>

                <el-col :span="9">
                  <el-button @click="getQrCode" type="primary" :disabled="isAble" v-text="smsText"></el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer text-center">
        <el-button @click="replace.dialogFormVisible = false">取 消</el-button>
        <el-button @click="replaceTel('replace')" type="primary">确定修改</el-button>
      </div>
    </el-dialog>

    <!-- 修改手机号码 弹出框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      class="dialog-visible"
      width="526px">
        <p class="p1">手机号码已变更，稍后将重新登录</p>
        <p class="theme-gray p2">您将在{{ threeTime }}s后跳转至登录页</p>

      <div slot="footer" class="dialog-footer text-center">
        <el-button type="primary" @click="logout">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import qrCode from 'vue-qrcode-component'
  import {mixin as focusMixin} from 'vue-focus'
  import countdown from '@/config/mixins/countdown'
  import {pageData, replacePwd, userInfo, replace} from './personal.data'
  import {adminUserInfo, updateName, resetByPassword, resetUsername, sendResetUsernameCode, userIsExist, generateSecret} from '@/service'

  export default {
    mixins: [countdown, focusMixin],
    components: {qrCode},
    data() {
      return {
        // 修改手机号码成功弹窗状态
        qrDialogVisible: false,  // qr状态
        dialogVisible: false,
        qrUrl: '',
        threeTime: 4,

        // 修改手机号码模块
        replace: replace(),
        rules1: pageData.rules1,

        // 修改个人信息模块
        userInfo: userInfo(),
        rules: pageData.rules,

        // 修改密码模块
        replacePwd: replacePwd(),
        rules2: pageData.rules2,

        // 绑定微信模块
        locationProtocol: location.protocol,
        locationHostname: location.hostname,
        hostnameList: pageData.hostnameList,
        secret: ''
      }
    },
    mounted () {
      this.getUserInfo()
    },
    methods: {
      // 访问智众后台管理：本地、测试、正式、symunity等环境，扫码跳转到微信端对应路由
      showQrCode() {
        const self = this
        generateSecret().then(res => {
          if (res.status === 'true') {
            self.secret = res.info

            let domain
            let spaceId = self.$store.getters.getSpaceId
            for (let item of self.hostnameList) {
              if (self.locationHostname === item.admin) {
                domain = item.wx
              }
            }

            self.qrUrl = self.locationProtocol + '//' + domain + '/#/' + spaceId + '/manager/administrator-bind?secret=' + self.secret
            // demo: http://so-m-dev.tunnel.gzleihou.cn/#/1001/administrator-bind
            // console.log('qrUrl: ', self.qrUrl, self.locationHostname, spaceId);

            self.qrDialogVisible = true
          } else self.setMsg('error', res.msg)
        })
      },
      logout () {
        const self = this
        self.$store.dispatch('logout').then(res => {
          self.dialogVisible = false
          Cookies.set('telphone', self.replace.newTel)

          self.$router.push({path: '/login', query: {redirect: self.$route.path}})
        })
      },
      threeDown () {
        const self = this
        if (self.threeTime === 0) {
          self.threeTime = 4

          // 清空数据，跳转到login
          self.logout()
        } else {
          self.threeTime--

          setTimeout(() => {
            self.threeDown()
          }, 1000)
        }
      },
      getQrCode () {
        const self = this
        if (self.isAble) return

        // 验证用户是否存在之后，在确定要不要获取验证码
        userIsExist({ telephone: self.replace.tel }).then(res => {
          if (res.status === 'true') {
            sendResetUsernameCode({ telephone: self.replace.newTel }).then(res => {
              if (res.status === 'true') {
                self.isAble = true
                self.settime()

                self.replace.qrFocused = true
                self.setMsg('success', '短信验证码已发送至您的手机，请注意查收!')
              } else self.setMsg('error', res.msg)
            })
          } else self.setMsg('error', res.msg)
        })
      },
      replaceTel (formName) {
        const self = this
        self.$refs[formName].validate((valid) => {
          if (valid) {
            resetUsername({
              telephone: self.replace.newTel,
              verifyCode: self.replace.qrCode
            }).then(res => {
              if (res.status === 'true') {
                // 隐藏修改手机弹窗
                self.replace.dialogFormVisible = false
                // 弹出提示框
                self.dialogVisible = true

                // 显示倒计时
                self.threeDown()
              } else self.setMsg('error', res.msg)
            })
          } else return
        });
      },
      replaceName (formName) {
        const self = this
        self.$refs[formName].validate((valid) => {
          if (valid) {
            updateName({ name: self.userInfo.name }).then(res => {
              if (res.status === 'true') {
                sessionStorage.setItem('username', self.userInfo.name)
                self.$store.commit('SET_USERNAME', self.userInfo.name)

                self.setMsg('success', '修改成功！')
              } else self.setMsg('error', res.msg)
            })
          } else return
        });
      },
      getUserInfo () {
        const self = this
        adminUserInfo().then(res => {
          if (res.status === 'true') {
            let data = res.info
            self.userInfo = {
              name: data.adminUser.name,
              isSuper: data.adminUser.isSuper,
              openId: data.openId
            }
            self.replace.tel = data.adminUser.username
          } else self.setMsg('error', res.msg)
        })
      },
      submitForm(formName) {
        const self = this
        self.$refs[formName].validate((valid) => {
          if (valid) {
            resetByPassword({
              oldPassword: self.replacePwd.oldPwd,
              newPassword: self.replacePwd.secondNewPwd
            }).then(res => {
              if (res.status === 'true') {
                self.setMsg('success', '短信验证码已发送至您的手机，请注意查收!')

                self.logout()
              } else self.setMsg('error', res.msg)
            })
          } else return
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/common.scss';
  .admin-personal {
    .form-box {
      padding-bottom: 100px;

      .el-input {
        width: 210px;
      }
    }
    .dialog-visible {
      p {
        text-align: center;
      }
      .p1 {
        font-size: 18px;
        margin-bottom: 20px;
      }
      .p2 {
        font-size: 14px;
      }
    }
    .important {
      text-align: center;
      width: 300px;
      height: 40px;
      margin: -10px auto 30px;

      div {
        width: 238px;
      }
      i {
        float: left;
        font-size: 40px;
        color: $theme-red;
        line-height: 40px;
        margin-right: 20px;
      }
      p {
        float: left;
        color: $theme-red;
      }
    }
    .info-box {
      width: 100%;
      min-height: 100px;
      background-color: #fff;
      border-radius: 6px;
    }
    .replace-tel {
      color: $theme-blue;
      cursor: pointer;
    }
    .dialog-footer {
      text-align: center;
      margin-top: -22px;
    }
  }
  .qr-box-more {
    .el-dialog__body {
      padding: 20px 20px 20px !important;
    }
  }
</style>
