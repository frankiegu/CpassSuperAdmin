<template>
  <el-dialog
    title=""
    :visible="!!dialogStatus"
    :before-close="closeDialog"
    class="set-dialog"
    width="420px">

    <el-form
      :model="dialogForm"
      ref="dialogForm"
      :rules="rules"
      v-on:submit.native.prevent
      label-width="110px"
      label-position="right">
      <!-- 1.  重置登录账户 -->
      <el-form-item
        v-if="dialogType === 'account'"
        label="重置登录账户"
        prop="account">
        <el-input
          class="fl width220px"
          v-model.trim="dialogForm.account"
          :maxlength="11"
          placeholder="请输入新的空间管理后台登陆账号"></el-input>
      </el-form-item>
      <!-- 2. 重置登录密码 -->
      <p v-if="dialogType === 'pwd'" class="text-center dialog-tip">确定要重置登录密码？</p>

      <!-- 3. 登录账户重置成功！ -->
      <div v-if="dialogType === 'resetAccount'" class="text-center">
        <p class="dialog-tip">登录账户重置成功！</p>
        <span>是否短信通知客户（ {{ dialogForm.account || tel }} ）</span>
      </div>

      <!-- 4. 短信发送成功！ -->
      <div v-if="dialogType === 'sendAccSuc'" class="text-center">
        <i class="el-icon-success theme-green"></i>
        <p class="dialog-tip">短信发送成功！</p>
        <span>（ {{ dialogForm.account || tel }} ）</span>
        <p class="theme-red">{{ countdown }} s</p>
      </div>

      <!-- 5. 短信发送成功！ -->
      <div v-if="dialogType === 'sendPwaSuc'" class="text-center">
        <i class="el-icon-success theme-green"></i>
        <p class="dialog-tip">登录密码重置成功！</p>
        <p>新密码已发送至您的手机，请注意查收!</p>
        <span>（ {{ dialogForm.account || tel }} ）</span>
        <p class="theme-red">{{ countdown }} s</p>
      </div>
    </el-form>

    <div v-if="dialogType !== 'sendAccSuc' && dialogType !== 'sendPwaSuc'" slot="footer" class="dialog-footer text-center">
      <el-button
        :loading="loadingStatus"
        @click="submitForm('dialogForm')"
        class="min-width100px"
        type="primary">
        {{ sureBtn }}
      </el-button>
      <el-button @click="closeDialog" class="width100px">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { checkPhone } from '@/config/utils'
  import accountMixins from '../account/account.mixins'
  import { clientResetAccount, clientResetPassword, clientSendSms } from '@/service/client'

  export default {
    name: 'ClientDialog',
    mixins: [accountMixins],
    props: ['dialogStatus', 'type', 'tel', 'clientId'],
    data () {
      const validateTel = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入登录账号'));
        } else if (!checkPhone(value)) {
          callback(new Error('请输入正确的登录账号'));
        } else {
          callback();
        }
      };
      return {
        sureBtn: '',
        cancelBtn: '',
        dialogType: '',
        countdown: 6,
        loadingStatus: false,
        dialogForm: {
          account: ''
        },
        rules: {
          account: [{ required: true, trigger: ['blur', 'change'], validator: validateTel }]
        }
      }
    },
    watch: {
      type: {
        handler: function (val, oldVal) {
          this.dialogType = val
        },
        immediate: true
      },
      dialogType: {
        handler: function (val, oldVal) {
          this.watchType()
        },
        immediate: true
      }
    },
    mounted () {
    },
    methods: {
      submitForm(formName) {
        switch (this.dialogType) {
          case 'pwd':
            this.loadingStatus = true

            clientResetPassword({
              clientId: this.clientId
            }).then(res => {
              if (res.status === 'true') {
                this.loadingStatus = false
                this.dialogType = 'sendPwaSuc'
              } else {
                this.loadingStatus = false
                this.setMsg('error', res.msg)
              }
            })
            break;
          case 'account':
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.loadingStatus = true

                clientResetAccount({
                  clientId: this.clientId,
                  username: this.dialogForm.account
                }).then(res => {
                  if (res.status === 'true') {
                    this.loadingStatus = false
                    this.dialogType = 'resetAccount'

                    this.$emit('toggleAcc', this.dialogForm.account)
                  } else {
                    this.loadingStatus = false
                    this.setMsg('error', res.msg)
                  }
                })
              }
            });
            break;
          case 'resetAccount':
            clientSendSms({
              username: this.dialogForm.account
            }).then(res => {
              if (res.status === 'true') {
                this.dialogType = 'sendAccSuc'
              } else {
                this.setMsg('error', res.msg)
              }
            })
            break;
        }
      },
      settime () {
        if (this.countdown === 0) {
          this.closeDialog()
          this.countdown = 6
        } else {
          this.countdown--
          setTimeout(() => {
            if (this.dialogType === 'sendAccSuc' || this.dialogType === 'sendPwaSuc') {
              this.settime()
            }
          }, 1000)
        }
      },
      watchType() {
        switch (this.dialogType) {
          case 'pwd':
            this.sureBtn = '确 认'
            break;
          case 'account':
            this.sureBtn = '确定修改'
            break;
          case 'resetAccount':
          case 'resetPwd':
            this.sureBtn = '发送短信通知'
            break;
          case 'sendAccSuc':
          case 'sendPwaSuc':
            setTimeout(() => {
              this.settime()
            }, 300)
            break;
        }
      },
      closeDialog() {
        this.sureBtn = ''
        this.cancelBtn = ''
        this.dialogType = ''
        this.countdown = 5
        this.dialogForm.account = ''
        this.$emit('closeDialog', false)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/config';
  .dialog-tip {
    font-size: 18px;
    font-weight: 500;
    line-height: 32px;
  }
  .min-width100px {
    min-width: 100px;
  }
  span {
    display: inline-block;
    color: $theme-gray;
    line-height: 22px;
  }
  .el-icon-success {
    font-size: 72px;
    margin-bottom: 16px;
  }
</style>
