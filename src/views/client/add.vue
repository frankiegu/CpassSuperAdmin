<template>
  <div class="main-content client-data">
    <lh-title :title="pageTitle" :level2="true" @goBack="handleBackList"></lh-title>
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
                v-model.trim="dataForm.account"
                class="width300px"
                placeholder="输入管理后台登录账户（手机格式）"
                :maxlength="11"></el-input>
            </el-form-item>

            <el-form-item label="客户服务号AppID" prop="appId" ref="appId"
              :rules="dataRules.appId" :required="dataForm.isCreateAccount">
              <el-input
                v-model.trim="dataForm.appId"
                class="width300px"
                placeholder="客户微信服务号AppID"></el-input>
            </el-form-item>

            <el-form-item label="客户服务号AppSecret" prop="appSecret" ref="appSecret"
              :rules="dataRules.appSecret" :required="dataForm.isCreateAccount">
              <el-input
                v-model.trim="dataForm.appSecret"
                class="width300px"
                placeholder="客户微信服务号AppSecret"></el-input>
            </el-form-item>

            <el-form-item label="客户服务号JS接口文件" prop="jsFile" ref="jsFile"
              :rules="dataRules.jsFile" :required="dataForm.isCreateAccount">
              <el-input
                v-model="dataForm.jsFile"
                readonly
                placeholder='选择后缀名为"txt"的JS接口文件'
                class="width300px upload-input">
                <el-upload
                  v-show="!uploadLoading1"
                  :action="jsUploadPath"
                  accept="text/plain"
                  name="jsFile"
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
                v-model.trim="dataForm.mchId"
                class="width300px"
                :disabled="!dataForm.isOpenPayment"
                placeholder="客户微信支付商号mch_ID"></el-input>
            </el-form-item>

            <el-form-item label="客户服务号key" prop="serviceKey" ref="serviceKey"
              :rules="dataRules.serviceKey" :required="dataForm.isCreateAccount && dataForm.isOpenPayment">
              <el-input
                v-model.trim="dataForm.serviceKey"
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
          <el-button type="primary" class="width120px" @click="createSubmit"
            :loading="dataForm.isCreateAccount && createLoading">
            {{dataForm.isCreateAccount && createLoading ? '执行中...' : '保存'}}
          </el-button>
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

        <!-- 仅创建客户确认弹窗内容 -->
        <span class="text-center" v-if="dialogType === 'save'">
          <p v-if="!clientId && !isCreateSuccess && !isOpenSuccess">是否确认仅创建客户资料？<br>（暂不开通客户账户）</p>
          <p v-if="clientId && !isCreateSuccess && !isOpenSuccess">确认保存修改内容？</p>
          <span v-if="isCreateSuccess && !isOpenSuccess" class="el-icon-success"></span>
          <p v-if="isCreateSuccess && !isOpenSuccess" class="success-tip">{{clientId ? '已保存！' : '创建成功！'}}</p>
          <p v-if="isOpenSuccess" class="success-tip">{{clientId ? '已保存！' : '开通成功！'}}</p>
          <p v-if="isOpenSuccess">
            <router-link :to="'/client/detail?id=' + clientId" class="theme-blue">点击查看</router-link><br>
            或点击对应客户操作区的 <i class="el-icon-edit theme-blue"></i> 按钮查看
          </p>
        </span>
        <span slot="footer" v-if="!isCreateSuccess && !isOpenSuccess && dialogType === 'save'">
          <el-button type="primary" class="width120px" @click="createClient" :loading="createLoading">
            {{createLoading ? '执行中...' : '确定'}}
          </el-button>
          <el-button class="width120px" @click="dialogVisible = false">放弃</el-button>
        </span>

        <!-- 跳转确认弹窗内容 -->
        <p class="text-center" v-if="dialogType === 'jump'">已录入的资料将丢失，确定取消？</p>
        <span slot="footer" v-if="dialogType === 'jump'">
          <el-button type="primary" class="width120px" @click="$router.replace('/client/list')">确定</el-button>
          <el-button class="width120px" @click="dialogVisible = false">放弃</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {baseInfo} from './components'
  import commonMixins from './common.mixins'
  import {addClient, updateClientInfo, createAccount} from '@/service'

  export default {
    name: 'add',
    mixins: [commonMixins],
    data() {
      return {
        pageTitle: this.$route.query.id ? '' : '新增客户',
        dialogType: '',
        createLoading: false,
        isCreateSuccess: false,
        isOpenSuccess: false
      }
    },
    props: {},
    components: {
      baseInfo
    },
    mounted() {
      if (this.clientId) this.handleGetDetail()
    },
    watch: {},
    computed: {},
    filters: {},
    methods: {
      // 【创建账户】收起时，点击【保存】丢弃已录入的开通资料
      resetAccountFrom() {
        let itemArr = [
          'product',
          'validity',
          'account',
          'appId',
          'appSecret',
          'jsFile',
          'mchId',
          'serviceKey',
          'certificate'
        ]
        this.resetItemField(itemArr, true)
        this.dataForm.isPermanent = false
        this.dataForm.isOpenPayment = false
      },

      // 获取客户详情
      handleGetDetail() {
        this.pageTitle = this.dataForm.name = '广州雷猴软件开发有限公司'
        this.dataForm.contact = 'PN'
        this.dataForm.phone = '13566666666'
      },

      // 提交创建信息
      createSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dialogType = 'save'
            if (this.clientId && !this.hasChangeForm) {
              this.$message.info('信息未改动！')
            } else {
              if (!this.dataForm.isCreateAccount) {
                // 开通账户被收起时，提交之前先清空账户开通信息
                this.resetAccountFrom()
                this.dialogVisible = true
              } else {
                if (!this.dataForm.isOpenPayment) {
                  // 开通账户但不开通微信支付时，提交前清空微信支付开通信息
                  this.resetItemField(['mchId', 'serviceKey', 'certificate'], true)
                }
                this.createClient()
              }
            }
          } else {
            return false
          }
        })
      },
      // 创建或更新客户资料
      createClient: function () {
        // console.log(this.dataForm)
        let clientObj = {
          id: this.clientId,
          name: this.dataForm.name,
          contact: this.dataForm.contact,
          phone: this.dataForm.phone,
          email: this.dataForm.email,
          address: this.dataForm.address,
          weixin: this.dataForm.weixin,
          remark: this.dataForm.remark,
          saleManager: this.dataForm.saleManager
        }
        this.createLoading = true
        let promise = this.clientId ? updateClientInfo(clientObj) : addClient(clientObj)
        promise.then(res => {
          if (res.status === 'true') {
            this.isCreateSuccess = true
            // 如果仅创建客户，则1秒后关闭对话框并跳转至列表页；否则继续开通账户
            if (!this.dataForm.isCreateAccount) {
              this.createLoading = false
              setTimeout(() => {
                this.dialogVisible = false
                this.$router.replace('/client/list')
              }, 1000)
            } else {
              // this.$message.info('客户创建成功，等待开通账户。。。')
              if (res.info) this.clientId = res.info.id
              this.openAccount()
            }
          } else {
            this.$message.error(res.msg)
          }
        })
        setTimeout(() => {
          this.isCreateSuccess = true
          // 如果仅创建客户，则1秒后关闭对话框并跳转至列表页；否则继续开通账户
          if (!this.dataForm.isCreateAccount) {
            this.createLoading = false
            setTimeout(() => {
              this.dialogVisible = false
              this.$router.replace('/client/list')
            }, 1000)
          } else {
            this.openAccount()
          }
        }, 2000)
      },
      // 开通账户
      openAccount() {
        let accountObj = {
          product: this.dataForm.product
        }
        setTimeout(() => {
          this.isOpenSuccess = true
          if (!this.dataForm.isOpenPayment) {
            this.dialogVisible = true
            this.createLoading = false
          } else {
            this.openPayment()
          }
        }, 3000)
        console.log(accountObj, 'openAccount')
      },
      // 开通支付
      openPayment() {
        let payObj = {
          mchId: this.dataForm.mchId
        }
        setTimeout(() => {
          this.createLoading = false
          this.dialogVisible = true
        }, 300)
        console.log(payObj, 'openPayment')
      },

      // 返回按钮事件
      handleBackList() {
        if (this.hasChangeForm) {
          this.dialogType = 'jump'
          this.dialogVisible = true
        } else {
          this.$router.replace('/client/list')
        }
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
