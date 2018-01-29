<template>
  <div class="main-content client-data">
    <lh-title :title="pageTitle"></lh-title>
    <div class="page-title">
      <span @click="handleBackList" class="fr"><i class="el-icon-close"></i></span>
    </div>
    <div class="card-padding card-padding-vertical">
      <el-form label-width="180px" :model="dataForm" ref="dataForm">
        <h3 class="grid-title">基础信息</h3>
        <base-info :model-form="dataForm"></base-info>

        <el-collapse-transition>
          <h3 class="grid-title" v-show="dataForm.isCreateAccount">开通账户</h3>
        </el-collapse-transition>

        <el-collapse-transition>
          <div class="account-form" v-show="dataForm.isCreateAccount">
            <el-form-item label="产品" prop="product" ref="product"
              :rules="dataRules.product" :required="dataForm.isCreateAccount">
              <el-select v-model="dataForm.product" class="width300px">
                <el-option value="完整版"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="有效期" required>
              <el-form-item prop="validity" ref="validity" class="fl mr20"
                :rules="dataRules.validity" :required="dataForm.isCreateAccount && !dataForm.isPermanent">
                <el-date-picker
                  v-model="dataForm.validity"
                  :disabled="dataForm.isPermanent"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 300px">
                </el-date-picker>
              </el-form-item>
              <el-form-item class="fl">
                <el-checkbox v-model="dataForm.isPermanent" @change="resetItemField('validity', true)">永久</el-checkbox>
              </el-form-item>
            </el-form-item>

            <el-form-item label="管理后台登录账户" prop="account" ref="account"
              :rules="dataRules.account" :required="dataForm.isCreateAccount">
              <el-input
                v-model="dataForm.account"
                class="width300px"
                placeholder="输入管理后台登录账户（手机格式）"
                :maxlength="11"></el-input>
            </el-form-item>

            <el-form-item label="客户服务号AppID" prop="appId" ref="appId"
              :rules="dataRules.appId" :required="dataForm.isCreateAccount">
              <el-input
                v-model="dataForm.appId"
                class="width300px"
                placeholder="客户微信服务号AppID"></el-input>
            </el-form-item>

            <el-form-item label="客户服务号AppSecret" prop="appSecret" ref="appSecret"
              :rules="dataRules.appSecret" :required="dataForm.isCreateAccount">
              <el-input
                v-model="dataForm.appSecret"
                class="width300px"
                placeholder="客户微信服务号AppSecret"></el-input>
            </el-form-item>

            <el-form-item label="客户服务号JS接口文件" prop="interfaceFile" ref="interfaceFile"
              :rules="dataRules.interfaceFile" :required="dataForm.isCreateAccount">
              <el-input
                v-model="dataForm.interfaceFile"
                readonly
                placeholder='选择后缀名为"txt"的JS接口文件'
                class="width300px upload-input">
                <el-upload
                  v-show="!uploadLoading1"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  accept="text/plain"
                  name="interfaceFile"
                  :multiple="false"
                  :data="{appId: dataForm.appId, appSecret: dataForm.appSecret}"
                  :show-file-list="false"
                  :on-change="changeInFile"
                  :before-upload="beforeUploadInFile"
                  :on-success="successUploadInFile"
                  slot="suffix">
                  <span class="el-input__icon el-icon-upload"></span>
                </el-upload>
                <span v-show="uploadLoading1" slot="suffix" class="el-input__icon el-icon-loading upload-loading"></span>
              </el-input>
            </el-form-item>

            <el-form-item label="开通微信支付功能">
              <el-switch v-model="dataForm.isOpenPayment"
                @change="resetItemField(['mchId', 'serviceKey', 'certificate'], false)">
              </el-switch>
            </el-form-item>

            <el-form-item label="客户服务号mch_ID" prop="mchId" ref="mchId"
              :rules="dataRules.mchId" :required="dataForm.isCreateAccount && dataForm.isOpenPayment">
              <el-input
                v-model="dataForm.mchId"
                class="width300px"
                :disabled="!dataForm.isOpenPayment"
                placeholder="客户微信支付商号mch_ID"></el-input>
            </el-form-item>

            <el-form-item label="客户服务号key" prop="serviceKey" ref="serviceKey"
              :rules="dataRules.serviceKey" :required="dataForm.isCreateAccount && dataForm.isOpenPayment">
              <el-input
                v-model="dataForm.serviceKey"
                class="width300px"
                :disabled="!dataForm.isOpenPayment"
                placeholder="客户微信支付商号API密钥"></el-input>
            </el-form-item>

            <el-form-item label="客户服务号支付证书" prop="certificate" ref="certificate"
              :rules="dataRules.certificate" :required="dataForm.isCreateAccount && dataForm.isOpenPayment">
              <el-input
                v-model="dataForm.certificate"
                readonly
                :disabled="!dataForm.isOpenPayment"
                placeholder='选择后缀名为"p12"的支付证书文件'
                class="width300px upload-input">
                <el-upload
                  v-show="!uploadLoading2"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  accept="application/x-pkcs12"
                  name="certificate"
                  :multiple="false"
                  :data="{mchId: dataForm.mchId, key: dataForm.serviceKey}"
                  :show-file-list="false"
                  :on-change="changeCeFile"
                  :before-upload="beforeUploadCeFile"
                  :on-success="successUploadCeFile"
                  :disabled="!dataForm.isOpenPayment"
                  slot="suffix">
                  <span :class="['el-input__icon', 'el-icon-upload', {'disabled-upload' : !dataForm.isOpenPayment}]"></span>
                </el-upload>
                <span v-show="uploadLoading2" slot="suffix" class="el-input__icon el-icon-loading upload-loading"></span>
              </el-input>
            </el-form-item>
          </div>
        </el-collapse-transition>

        <el-form-item>
          <el-button type="primary" class="width120px" @click="submitDataForm">保存</el-button>
        </el-form-item>
      </el-form>

      <el-dialog
        :visible.sync="dialogVisible"
        top="32vh"
        class="sp-confirm-box"
        :show-close="!isCreateSuccess && !isOpenSuccess"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        center>
        <span class="text-center">
          <p v-if="!isCreateSuccess && !isOpenSuccess">是否确认仅创建客户资料？</p>
          <p v-if="!isCreateSuccess && !isOpenSuccess">（暂不开通客户账户）</p>
          <span v-if="isCreateSuccess && !isOpenSuccess" class="el-icon-success"></span>
          <p v-if="isCreateSuccess && !isOpenSuccess" class="success-tip">创建成功！</p>
          <p v-if="isOpenSuccess" class="success-tip">开通成功！</p>
          <p v-if="isOpenSuccess">
            <router-link :to="'/client/detail?id=' + clientId" class="theme-blue">点击查看</router-link>
          </p>
          <p v-if="isOpenSuccess">或点击对应客户操作区的 <i class="el-icon-edit theme-blue"></i> 按钮查看</p>
        </span>
        <span slot="footer" v-if="!isCreateSuccess && !isOpenSuccess">
          <el-button type="primary" class="width120px" @click="createClient">确定</el-button>
          <el-button class="width120px" @click="cancelSave">放弃</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import baseInfo from './components/base-info'
  import { PHONEREG } from '@/config/env'

  export default {
    name: 'add',
    data() {
      // 自定义校验规则
      var checkTel = (rule, value, callback) => {
        if (this.dataForm.isCreateAccount) {
          if (!value) {
            return callback(new Error('登录账号不能为空！'))
          }
          if (!PHONEREG.test(value)) {
            callback(new Error('账号格式错误（正确的手机号码）！'))
          }
          callback()
        }
        callback()
      }
      var checkProduct = (rule, value, callback) => {
        if (this.dataForm.isCreateAccount) {
          if (!value) {
            return callback(new Error('产品不能为空！'))
          }
          callback()
        }
        callback()
      }
      var checkValidity = (rule, value, callback) => {
        if (this.dataForm.isCreateAccount && !this.dataForm.isPermanent) {
          if (!value || value.length < 2) {
            return callback(new Error('请选择有效期限或永久有效'))
          }
          callback()
        }
        callback()
      }
      var checkAppId = (rule, value, callback) => {
        if (this.dataForm.isCreateAccount) {
          if (!value) {
            return callback(new Error('AppID不能为空！'))
          }
          callback()
        }
        callback()
      }
      var checkAppSecret = (rule, value, callback) => {
        if (this.dataForm.isCreateAccount) {
          if (!value) {
            return callback(new Error('AppSecret不能为空！'))
          }
          callback()
        }
        callback()
      }
      var checkInFile = (rule, value, callback) => {
        if (this.dataForm.isCreateAccount) {
          if (!value) {
            if (this.hasJsFile > 0) {
              return callback(new Error('非正确的接口文件！'))
            } else {
              return callback(new Error('未上传接口文件！'))
            }
          }
          callback()
        }
        callback()
      }
      var checkMchId = (rule, value, callback) => {
        if (this.dataForm.isCreateAccount && this.dataForm.isOpenPayment) {
          if (!value) {
            return callback(new Error('mch_ID不能为空！'))
          }
          callback()
        }
        callback()
      }
      var checkServiceKey = (rule, value, callback) => {
        if (this.dataForm.isCreateAccount && this.dataForm.isOpenPayment) {
          if (!value) {
            return callback(new Error('key不能为空！'))
          }
          callback()
        }
        callback()
      }
      var checkCeFile = (rule, value, callback) => {
        if (this.dataForm.isCreateAccount && this.dataForm.isOpenPayment) {
          if (!value) {
            if (this.hasP12File > 0) {
              return callback(new Error('非正确的证书！'))
            } else {
              return callback(new Error('未上传证书！'))
            }
          }
          callback()
        }
        callback()
      }
      return {
        title: this.$route.query.id ? '客户详情' : '新增客户',
        pageTitle: this.$route.query.id ? 'xx有限公司' : '新增客户',
        clientId: this.$route.query.id,

        hasJsFile: 0,
        hasP12File: 0,
        uploadLoading1: false,
        uploadLoading2: false,
        dialogVisible: false,
        isCreateSuccess: false,
        isOpenSuccess: false,
        dataForm: {
          // 客户基础信息
          clientName: '',
          userName: '',
          tel: '',
          email: '',
          address: '',
          wxService: '',
          remark: '',
          saleManager: '',
          isCreateAccount: false,

          // 开通账户信息
          product: '',
          validity: '', // 有效期
          isPermanent: false, // 是否永久有效
          account: '',
          appId: '',
          appSecret: '',
          interfaceFile: '', // JS接口文件

          // 开通微信支付功能
          isOpenPayment: false,
          mchId: '', // 客户服务号mch_ID
          serviceKey: '', // 客户服务号key
          certificate: '' // 支付证书
        },
        dataRules: {
          product: [{validator: checkProduct, trigger: 'blur, change'}],
          validity: [{validator: checkValidity, trigger: 'blur, change', type: 'array'}],
          account: [{validator: checkTel, trigger: 'blur, change'}],
          appId: [{validator: checkAppId, trigger: 'blur, change'}],
          appSecret: [{validator: checkAppSecret, trigger: 'blur, change'}],
          interfaceFile: [{validator: checkInFile, trigger: 'blur, change'}],
          mchId: [{validator: checkMchId, trigger: 'blur, change'}],
          serviceKey: [{validator: checkServiceKey, trigger: 'blur, change'}],
          certificate: [{validator: checkCeFile, trigger: 'blur, change'}]
        }
      }
    },
    props: {},
    components: {
      baseInfo
    },
    mounted() {
      document.title = this.title
    },
    watch: {},
    computed: {},
    filters: {},
    methods: {
      // 返回列表页
      handleBackList() {
        this.$router.replace('/client/list')
      },
      /**
       * @description 重置一个或多个表单域
       * @param {String | Array} fieldName 表单域的ref
       * @param {Boolean} isClearAll true 清除全部（内容和校验结果）；false 只清除校验结果（保留内容）
       */
      resetItemField(fieldName, isClearAll) {
        if (typeof (fieldName) === 'string') {
          if (isClearAll) {
            this.$refs[fieldName].resetField()
          } else {
            this.$refs[fieldName].clearValidate()
          }
        } else if (fieldName.length > 0) {
          if (isClearAll) {
            for (let i = 0; i < fieldName.length; i++) {
              this.$refs[fieldName[i]].resetField()
            }
          } else {
            for (let i = 0; i < fieldName.length; i++) {
              this.$refs[fieldName[i]].clearValidate()
            }
          }
        }
      },
      resetAccountFrom() {
        let itemArr = [
          'product',
          'validity',
          'account',
          'appId',
          'appSecret',
          'interfaceFile',
          'mchId',
          'serviceKey',
          'certificate'
        ]
        this.resetItemField(itemArr, true)
        this.dataForm.isPermanent = false
        this.dataForm.isOpenPayment = false
      },

      // JS接口文件状态改变时
      changeInFile(file, fileList) {
        if (file.status === 'success') {
          this.hasJsFile = fileList.length
        }
      },
      // JS接口文件上传之前判断AppID、AppSecret和txt格式
      beforeUploadInFile(file) {
        this.uploadLoading1 = true
        const isCompleted = !!this.dataForm.appId && !!this.dataForm.appSecret
        const isTxt = file.type === 'text/plain'
        if (!isCompleted) {
          this.uploadLoading1 = false
          this.$message.error('请先填写AppID和AppSecret！')
          this.$refs['appId'].validate()
          this.$refs['appSecret'].validate()
          this.$refs['appId'].validateMessage = 'AppId不能为空！'
          this.$refs['appSecret'].validateMessage = 'AppSecret不能为空！'
          return isCompleted
        }
        if (!isTxt) {
          this.uploadLoading1 = false
          this.dataForm.interfaceFile = ''
          this.$refs['interfaceFile'].validate()
          this.$refs['interfaceFile'].validateMessage = '非正确的接口文件！'
          this.$message.error('请选择后缀名为"txt"的JS接口文件')
          return isTxt
        } else {
          this.dataForm.interfaceFile = file.name
        }
        return isTxt && isCompleted
      },
      // JS接口文件上传成功
      successUploadInFile(response, file, fileList) {
        this.uploadLoading1 = false
      },

      // 支付证书文件状态改变时
      changeCeFile(file, fileList) {
        if (file.status === 'success') {
          this.hasP12File = fileList.length
        }
      },
      // 支付证书文件上传之前判断AppID、AppSecret和txt格式
      beforeUploadCeFile(file) {
        this.uploadLoading2 = true
        const isCompleted = !!this.dataForm.mchId && !!this.dataForm.serviceKey
        const isP12 = file.type === 'application/x-pkcs12'
        if (!isCompleted) {
          this.uploadLoading2 = false
          this.$message.error('请先填写mch_ID和key！')
          this.$refs['mchId'].validate()
          this.$refs['serviceKey'].validate()
          this.$refs['mchId'].validateMessage = 'mch_ID不能为空！'
          this.$refs['serviceKey'].validateMessage = 'key不能为空！'
          return isCompleted
        }
        if (!isP12) {
          this.uploadLoading2 = false
          this.dataForm.certificate = ''
          this.$refs['certificate'].validate()
          this.$refs['certificate'].validateMessage = '非正确的证书！'
          this.$message.error('请选择后缀名为"p12"的支付证书文件')
          return isP12
        } else {
          this.dataForm.certificate = file.name
        }
        return isP12 && isCompleted
      },
      // 支付证书文件上传成功
      successUploadCeFile(response, file, fileList) {
        this.uploadLoading2 = false
      },

      // 提交信息
      submitDataForm() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let clientObj, accountObj, payObj
            // 开通账户被收起时，提交之前先清空开通账户信息
            if (!this.dataForm.isCreateAccount) {
              this.resetAccountFrom()
              this.dialogVisible = true
            } else {
              this.dialogVisible = true
              this.isOpenSuccess = true
              if (!this.dataForm.isOpenPayment) {
                // 取消开通微信支付时，提交前清空微信支付开通信息
                this.resetItemField(['mchId', 'serviceKey', 'certificate'], true)
              }
            }
            console.log(this.dataForm, clientObj, accountObj, payObj)
          } else {
            this.$message.error('submit error!')
          }
        })
      },
      // 创建客户资料
      createClient() {
        setTimeout(() => { // TODO 发送请求创建客户资料
          this.isCreateSuccess = true
          setTimeout(() => {
            this.dialogVisible = false
            this.$router.replace('/client/list')
          }, 1000)
        }, 1000)
      },
      // 放弃保存
      cancelSave() {
        this.dialogVisible = false
      }
    }
  }
</script>

<style lang="scss">
  @import "../../styles/config";
  .client-data {
    .el-input .el-icon-upload {
      display: block;
      font-size: 22px;
      color: $theme-blue;
      cursor: pointer;
      z-index: 1;
      width: 100%;
      text-align: right;
      &.disabled-upload {
        cursor: not-allowed;
      }
    }
    .upload-input .el-input__suffix{
      width: 100%;
      text-align: right;
    }
    .el-input .upload-loading {
      width: auto;
      font-size: 22px;
      color: $theme-blue;
    }
    .el-upload {
      display: block;
    }
  }
  .sp-confirm-box {
    border: none;
    .el-dialog {
      border-radius: 4px;
      width: 420px;
    }
    .el-message-box__header, .el-dialog__header {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      padding-top: 10px;
      /*background-color: $theme-blue;*/
    }
    .el-message-box__headerbtn, .el-dialog__headerbtn {
      top: 10px;
      .el-message-box__close, .el-dialog__close {
        /*color: #ffffff;*/
      }
    }
    .el-message-box__content, .el-dialog__body {
      padding-top: 20px;
      padding-bottom: 20px;
    }
    span.el-icon-success {
      display: block;
      margin: 10px auto;
      font-size: 30px;
      color: $theme-blue;
    }
    .success-tip {
      font-size: 18px;
      margin-bottom: 12px;
    }
  }
</style>
