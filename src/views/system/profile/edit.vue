<template>
  <div class="admin-personal">
    <lh-title/>

    <div class="lh-card-box">
      <h3 class="desc-title">基础信息</h3>

      <div class="lh-card-body">

        <el-form
        :model="userInfo"
        ref="userInfo"
        :rules="rules"
        label-width="58px"
        class="demo-ruleForm">

          <el-row>
            <el-col :span="6">
              <p class="mb16 mt6 input-title">登录名</p>
              <el-form-item class="ml85 mb6" prop="username">
                <el-input class="phoneInput" :disabled="true" v-model.trim="userInfo.username"></el-input>
                <!--<p style="color: #8492A6">暂不支持修改登录名</p>-->
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <p class="text-title mb16 mt6 input-title">昵称</p>
              <el-form-item class="ml85" prop="name">
                <el-input class="phoneInput" v-model.trim="userInfo.name" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <p class="mb16 mt6 input-title">电子邮箱</p>
              <el-form-item prop="email" class="ml85">
                <el-input class="phoneInput" placeholder="请输入邮箱" v-model.trim="userInfo.email" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <p class="mb16 mt6 input-title">手机号码</p>
              <el-form-item class="ml85">
                <el-input class="phoneInput" :disabled="true" v-model.trim="replace.tel" auto-complete="off"></el-input>
                &nbsp;&nbsp;
                <span @click="replace.dialogFormVisible = true" class="replace-tel">修改</span>
              </el-form-item>
            </el-col>

          </el-row>

          <el-row>
            <el-col :span="12">
              <p class="text-title mb16 input-title">头像</p>
              <el-form-item prop="headImgUrl" class="ml85 mb4">
                <lh-upload
                  :imgUrl="userInfo.headImgUrl ? userInfo.headImgUrl : '/static/images/default-avatar.png'"
                  :disabled="hanPermission"
                  :size="128"
                  @uploadImg="val => userInfo.headImgUrl = val"
                  class="fl"></lh-upload>
                <span class="advice-img">建议上传图片尺寸为80*80，大小不超过1M</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-button
              @click="replaceName('userInfo')"
              class="width80px mt30 infoBtn mt16"
              type="primary">保 存</el-button>
          </el-row>

      </el-form>

      </div>

    </div>

    <!--<div class="lh-card-box">-->
      <!--<h3 class="desc-title">我的推送</h3>-->
      <!--<div class="lh-card-body">-->
        <!--<el-row>-->
          <!--<el-col :span="20">-->
            <!--<lh-item label="绑定微信：" label-width="auto" pb="24">-->
              <!--<el-button @click="showQrCode" v-if="!userInfo.openId" type="info">未绑定</el-button>-->
              <!--<el-button @click="showQrCode" v-else type="success">{{ userInfo.nickname || '已绑定' }}</el-button>-->
            <!--</lh-item>-->
          <!--</el-col>-->
        <!--</el-row>-->

        <!--<el-row>-->
          <!--<el-col :span="24">-->
            <!--<lh-item label="推送范围：" label-width="auto" pb="24">-->
              <!--<el-table-->
                <!--border-->
                <!--:data="statusList"-->
                <!--style="width: 90%;">-->
                <!--&lt;!&ndash; 不同类型，都显示场地预约 &ndash;&gt;-->
                <!--<el-table-column :label="item.name" v-for="(item, index) in pushPermis" :key="index">-->
                  <!--<template slot-scope="scope">-->
                    <!--<el-checkbox :checked="item.status === 1" disabled></el-checkbox>-->
                  <!--</template>-->
                <!--</el-table-column>-->
              <!--</el-table>-->
            <!--</lh-item>-->
          <!--</el-col>-->
        <!--</el-row>-->
      <!--</div>-->

    <!--</div>-->

    <!-- qr -->
    <el-dialog
      :visible.sync="qrDialogVisible"
      :before-close="closeQrDialog"
      width="298px"
      class="qr-box-more">

      <div class="qr-box">
        <qr-code
          :text="qrUrl"
          :size="258"
          error-level="L"
          title="微信扫码绑定微信号"></qr-code>

        <!-- 未绑定和已绑定的状态 -->
        <div class="theme-gray text-center mt10">
          <!-- 可以区分添加和绑定 -->
          <!-- 已经绑定 -->
          <div v-if="this.userInfo.nickName">

          </div>
          <p v-if="this.copyNickName" class="bind-style">
            <span v-if="this.copyNickName !== this.userInfo.nickName">
              <i class="el-icon-success theme-green mr5"></i>绑定成功
            </span>
            <span v-else>微信扫码重新绑定微信号</span>
          </p>
          <p v-else>
            <span v-if="this.userInfo.nickName">
              <i class="el-icon-success theme-green mr5"></i>绑定成功
            </span>
            <span v-else>微信扫码绑定微信号</span>
          </p>
        </div>
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
        <el-button @click="replaceTel('replace')" type="primary" class="linner-blue-btn">确定修改</el-button>
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
  import lhUpload from '@/components/upload'
  import Cookies from 'js-cookie'
  import qrCode from 'vue-qrcode-component'
  import { mixin as focusMixin } from 'vue-focus'
  import countdown from '@/mixins/countdown'
  import personalMixins from './personal.mixins'
  // import { adminUserDetail, resetUsername, sendResetUsernameCode, userIsExist, generateSecret, adminUserUpdate } from '@/service'

  export default {
    mixins: [countdown, focusMixin, personalMixins],
    components: {
      [lhUpload.name]: lhUpload,
      qrCode
    },
    data() {
      return {
        checked: true,
        hanPermission: !this.handleHasPermissions('/manage/space/updateSpaceInfo'),
        // 修改手机号码成功弹窗状态
        qrDialogVisible: false,  // qr状态
        dialogVisible: false,
        qrUrl: '',
        threeTime: 4,
        statusList: [],
        pushPermis: [],

        // 绑定微信模块
        isEmpty: 0, // 不变
        isEmptyJudge: 0, // 不变
        editQr: 1,
        copyNickName: null, // 同时用来备份已经绑定过的微信昵称
        spaceId: '',
        domain: '',
        countdown: 33,
        countSwitch: 3000, // 先是一次轮询3秒，之后就关闭开关 设置为1；同时也充当倒计时 时长
        locationProtocol: location.protocol,
        locationHostname: location.hostname,
        secret: '',
        billOrderList: [{
          one: true,
          two: true,
          three: true,
          four: true,
          five: true,
          six: true
        }]
      }
    },
    mounted () {
      // this.getUserInfo()
    },
    methods: {
      // 添加的时候
      // 接口还是在调用
      pollPersonInfo() {
        if (this.countdown !== 0) {
          if (this.countdown >= 27 && this.countSwitch === 3000) {
            if (this.countdown === 27) {
              this.countSwitch = 1000
            }
            this.countdown -= 2
          } else {
            this.countdown--
          }

          setTimeout(() => {
            // console.log('test', !(this.copyNickName && (this.copyNickName !== this.userInfo.nickName)) && this.qrDialogVisible && (this.$route.path === '/personal-info'));
            if (!((this.copyNickName && this.copyNickName !== this.userInfo.nickName) || !!this.isEmpty) && this.qrDialogVisible && (this.$route.path === '/personal-info')) {
              this.pollPersonInfo()
              this.getUserInfo()
            }
          }, this.countSwitch)
        }
      },
      showQrCode() {
        // generateSecret().then(res => {
        //   if (res.status === 'true') {
        //     this.secret = res.info
        //
        //     if (!this.spaceId) {
        //       this.spaceId = this.$store.getters.getSpaceId
        //     }
        //     if (!this.domain) {
        //       for (let item of this.hostnameList) {
        //         if (this.locationHostname === item.admin) {
        //           this.domain = item.wx
        //         }
        //       }
        //     }
        //
        //     this.qrUrl = this.locationProtocol + '//' + this.domain + '/#/' + this.spaceId + '/manager/administrator-bind?secret=' + this.secret
        //     // demo: http://so-m-dev.tunnel.gzleihou.cn/#/1001/administrator-bind
        //     // console.log('qrUrl: ', this.qrUrl, this.locationHostname, this.spaceId);
        //
        //     this.qrDialogVisible = true
        //     // 访问智众后台管理：本地、测试、正式、symunity等环境，扫码跳转到微信端对应路由
        //     // 考虑可以编辑的情况：
        //     // 1. 点击添加或者编辑按钮，都要去轮询
        //     // 2. 在退出弹出框的时候，需要再请求一次
        //     // 3. 先是2秒轮询4次，之后，每次轮询的间隔为1秒，30秒之后停止轮询
        //     // 4. 以上情况都是在打开的情况下，并且路由是个人信息，否则不去轮询
        //     // 5. 判断是否绑定，有2种情况，1是从未绑定到绑定，另一个是更新的微信昵称微信昵称
        //
        //     if ((this.editQr === 1) && this.userInfo.openId) {
        //       this.copyNickName = this.userInfo.nickName
        //     }
        //     this.editQr = 0
        //     this.isEmptyJudge = 1
        //     this.pollPersonInfo()
        //   } else this.setMsg('error', res.msg)
        // })
      },
      getUserInfo () {
        // adminUserDetail().then(res => {
        //   if (res.status === 'true') {
        //     let data = res.info
        //     this.userInfo = {
        //       id: data.adminUser.id,
        //       name: data.adminUser.name,
        //       email: data.adminUser.email,
        //       username: data.adminUser.username || null,
        //       headImgUrl: data.adminUser.headImgUrl || null,
        //       isSuper: data.adminUser.isSuper,
        //       openId: data.outh2AdminUser ? data.outh2AdminUser.openId : '',
        //       nickName: data.outh2AdminUser ? data.outh2AdminUser.nickName : ''
        //     }
        //
        //     this.pushPermis = res.info.pushPermis || []
        //     this.statusList = [{}]
        //
        //     // 如果绑定成功了，就改变条件，不在调用接口
        //     // console.log('test', !!(this.isEmptyJudge && (this.copyNickName !== this.userInfo.nickName)), 'val', this.isEmptyJudge, 'nick', this.copyNickName, 'name', this.userInfo.nickName);
        //     if (this.isEmptyJudge && (this.copyNickName !== this.userInfo.nickName)) {
        //       this.isEmpty = 1
        //     }
        //
        //     this.replace.tel = data.adminUser.username
        //   } else this.setMsg('error', res.msg)
        // })
      },
      closeQrDialog(done) {
        if (!this.copyNickName || (this.copyNickName === this.userInfo.nickName)) {
          this.getUserInfo()
        }
        setTimeout(() => {
          this.countdown = 33
          this.countSwitch = 3000
          this.editQr = 1
          this.isEmptyJudge = 0
          this.isEmpty = 0
          this.copyNickName = null
        }, 1000)
        done()
      },
      logout () {
        this.$store.dispatch('logout').then(res => {
          this.dialogVisible = false
          Cookies.set('telphone', this.replace.newTel)

          this.$router.push({
            path: '/login', query: { redirect: this.$route.path }
          })
        })
      },
      threeDown () {
        if (this.threeTime === 0) {
          this.threeTime = 4

          // 清空数据，跳转到login
          this.logout()
        } else {
          this.threeTime--

          setTimeout(() => {
            this.threeDown()
          }, 1000)
        }
      },
      getQrCode () {
        if (this.isAble) return false
        // 验证用户是否存在之后，在确定要不要获取验证码
        // userIsExist({ telephone: this.replace.tel }).then(res => {
        //   if (res.status === 'true') {
        //     sendResetUsernameCode({ telephone: this.replace.newTel }).then(res => {
        //       if (res.status === 'true') {
        //         this.isAble = true
        //         this.settime()
        //
        //         this.replace.qrFocused = true
        //         this.setMsg('success', '短信验证码已发送至您的手机，请注意查收!')
        //       } else this.setMsg('error', res.msg)
        //     })
        //   } else this.setMsg('error', res.msg)
        // })
      },
      replaceTel (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // resetUsername({
            //   telephone: this.replace.newTel,
            //   verifyCode: this.replace.qrCode
            // }).then(res => {
            //   if (res.status === 'true') {
            //     // 隐藏修改手机弹窗
            //     this.replace.dialogFormVisible = false
            //     // 弹出提示框
            //     this.dialogVisible = true
            //
            //     // 显示倒计时
            //     this.threeDown()
            //   } else this.setMsg('error', res.msg)
            // })
          } else {
            return false
          }
        });
      },
      replaceName (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // let dataObj = {
            //   id: this.userInfo.id,
            //   name: this.userInfo.name,
            //   email: this.userInfo.email,
            //   headImgUrl: this.userInfo.headImgUrl,
            //   contactTel: this.replace.tel
            // }
            // adminUserUpdate(dataObj).then(res => {
            //   if (res.status === 'true') {
            //     sessionStorage.setItem('username', this.userInfo.name)
            //     this.$store.commit('SET_NAME', this.userInfo.name)
            //
            //     this.setMsg('success', '修改成功！')
            //   } else this.setMsg('error', res.msg)
            // })
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/common.scss';
  .admin-personal {
    .el-icon-success {
      font-size: 30px;
    }
    .qr-box {
      margin-top: -10px;
    }
    .bind-style {
      margin-bottom: -10px;
    }
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
    .ml85{
      margin-left: -60px!important;
    }
    .phoneInput{
      width: 70%!important;
      input {
        width: 100%!important;
      }
    }
    .infoBtn{
      padding: 9px 15px;
      color: #fff!important;
    }
    .checkbox{
      width: 20px;
      height: 20px;
      display: inline-block;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.7);
    }
    .linner-blue-btn{
      background-image: linear-gradient(to bottom right, #6B9EFF, #4A4CEE);
    }
    .advice-img{
      display: inline-block;
      padding: 50px 0px 0px 15px;
      color: rgba(0, 0, 0, 0.65);
    }
    .input-title{
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      line-height: 16px;
    }
  }
</style>
