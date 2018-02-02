<template>
  <div class="main-content client-modify">
    <lh-title :title="pageTitle" :level2="true" @goBack="handleBackList"></lh-title>
    <div class="card-padding card-padding-vertical">
      <el-form label-width="180px" :model="dataForm" ref="dataForm">
        <!-- 基础信息 -->
        <h3 class="grid-title">基础信息</h3>
        <base-info :model-form="dataForm" :has-account="true" @changeCreateStatus="changeCreateStatus"/>

        <!-- 状态管理 -->
        <h3 class="grid-title">状态管理</h3>
        <el-form-item label="产品版本" prop="productId" ref="productId" :rules="dataRules.productId" :required="true">
          <el-select v-model="dataForm.productId" class="width300px" :disabled="dataForm.productStatus === 0">
            <el-option v-for="(value, key) in productList" :key="key" :value="key" :label="value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="有效期至" required>
          <el-form-item prop="validity" ref="validity" class="fl mr20"
            :rules="dataRules.validity" :required="!dataForm.isPermanent">
            <el-date-picker
              v-model="dataForm.validity"
              :disabled="!!dataForm.isPermanent || dataForm.productStatus === 0"
              type="date"
              placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              style="width: 300px">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="fl">
            <el-checkbox v-model="dataForm.isPermanent" :disabled="dataForm.productStatus === 0"
              @change="resetItemField('validity', true)" :true-label="1" :false-label="0">永久
            </el-checkbox>
          </el-form-item>
        </el-form-item>

        <el-form-item label="使用控制">
          <el-switch v-model="dataForm.productStatus" :inactive-value="0" :active-value="1"
            @change="changeUseStatus"></el-switch>
        </el-form-item>

        <!-- 开通资料 -->
        <h3 class="grid-title">开通资料</h3>
        <el-form-item label="客户服务号AppID" prop="appId" ref="appId"
          :rules="dataRules.appId" :required="true">
          <el-input
            v-model.trim="dataForm.appId"
            class="width300px"
            placeholder="客户微信服务号AppID"></el-input>
        </el-form-item>

        <el-form-item label="客户服务号AppSecret" prop="appSecret" ref="appSecret"
          :rules="dataRules.appSecret" :required="true">
          <el-input
            v-model.trim="dataForm.appSecret"
            class="width300px"
            placeholder="客户微信服务号AppSecret"></el-input>
        </el-form-item>

        <el-form-item label="客户服务号JS接口文件" prop="jsFile" ref="jsFile"
          :rules="dataRules.jsFile" :required="true">
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
          <el-switch v-model="dataForm.isOpenPayment" :active-value="1" :inactive-value="0"
            @change="resetItemField(['mchId', 'mchKey', 'certificate'], false)">
          </el-switch>
        </el-form-item>

        <el-form-item label="客户服务号mch_ID" prop="mchId" ref="mchId"
          :rules="dataRules.mchId" :required="!!dataForm.isOpenPayment">
          <el-input
            v-model.trim="dataForm.mchId"
            class="width300px"
            :disabled="!dataForm.isOpenPayment"
            placeholder="客户微信支付商号mch_ID"></el-input>
        </el-form-item>

        <el-form-item label="客户服务号key" prop="mchKey" ref="mchKey"
          :rules="dataRules.mchKey" :required="!!dataForm.isOpenPayment">
          <el-input
            v-model.trim="dataForm.mchKey"
            class="width300px"
            :disabled="!dataForm.isOpenPayment"
            placeholder="客户微信支付商号API密钥"></el-input>
        </el-form-item>

        <el-form-item label="客户服务号支付证书" prop="certificate" ref="certificate"
          :rules="dataRules.certificate" :required="!!dataForm.isOpenPayment">
          <el-input
            v-model="dataForm.certificate"
            readonly
            :disabled="!dataForm.isOpenPayment"
            placeholder='选择后缀名为"p12"的支付证书文件'
            class="width300px upload-input">
            <el-upload
              v-show="!uploadLoading2"
              :action="p12UploadPath"
              accept="application/x-pkcs12"
              name="payCertFile"
              :multiple="false"
              :data="{mchId: dataForm.mchId, key: dataForm.mchKey}"
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

        <el-form-item>
          <el-button type="primary" class="width120px" @click="submitDataForm">保存</el-button>
        </el-form-item>
      </el-form>

      <el-dialog
        :visible.sync="dialogVisible"
        top="32vh"
        class="sp-confirm-box"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        center>

        <!-- 保存修改确认弹窗 -->
        <p class="text-center" v-if="dialogType === 'save'">确认保存修改内容？</p>
        <span v-if="hasUpdateComplete" class="el-icon-success"></span>
        <p v-if="hasUpdateComplete" class="success-tip">已保存！</p>
        <span slot="footer" v-if="dialogType === 'save' && !hasUpdateComplete">
          <el-button type="primary" class="width120px" @click="handleUpdateClient">确定</el-button>
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
  import { baseInfo } from './components'
  import commonMixins from './common.mixins'
  import {
    updateClientInfo, updateAccount, setAccountStatus,
    bindWeixinPay, updateWeixinPay, setWeixinPayStatus
  } from '@/service'

  export default {
    name: 'modify',
    mixins: [commonMixins],
    data() {
      return {
        pageTitle: '',
        dialogType: '',
        createLoading: false,
        hasUpdateInfo: false,
        hasUpdateAccount: false,
        hasUpdatePay: false,
        hasUpdateComplete: false, // TODO 判断更新完成状态

        hasChangeInfo: false,
        hasChangeAccount: false,
        hasChangePay: false
      }
    },
    props: {},
    components: { baseInfo },
    mounted() {
      const initInfo = this.infoStr
      const initAccount = this.accountStr
      const initPay = this.payStr
      this.$watch('infoStr', {
        handler: function (newVal) {
          if (!newVal || newVal === initInfo) {
            this.hasChangeInfo = false
          } else if (newVal !== initInfo) {
            this.hasChangeInfo = true
          }
        }
      })
      this.$watch('accountStr', {
        handler: function (newVal) {
          if (!newVal || newVal === initAccount) {
            this.hasChangeAccount = false
          } else if (newVal !== initAccount) {
            this.hasChangeAccount = true
          }
        }
      })
      this.$watch('payStr', {
        handler: function (newVal) {
          if (!newVal || newVal === initPay) {
            this.hasChangePay = false
          } else if (newVal !== initPay) {
            this.hasChangePay = true
          }
        }
      })
    },
    watch: {},
    computed: {
      infoStr: function () {
        return Object.values(this.dataForm).slice(0, 8).join('')
      },
      accountStr: function () {
        return Object.values(this.dataForm).slice(9, 17).join('')
      },
      payStr: function () {
        return Object.values(this.dataForm).slice(17).join('')
      }
    },
    filters: {},
    methods: {
      // 获取详情
      handleGetDetail() {
        let obj = { id: this.clientId }
        console.log(obj)
        this.isCreateAccount = true
        this.pageTitle = this.dataForm.name = '广州雷猴软件开发有限公司'
        this.dataForm.contact = 'PN'
        this.dataForm.phone = '13566666666'
        this.dataForm.productId = '1'
        this.dataForm.isPermanent = 1
        this.dataForm.appId = 'sad'
        this.dataForm.appSecret = 'dad'
        this.dataForm.jsFile = 'dad.txt'
      },

      // 关闭使用时置灰产品和有效期控件并清除校验
      changeUseStatus(currStatus) {
        if (currStatus === 0) {
          console.log(currStatus, this.$refs['productId'])
          this.resetItemField(['productId', 'validity'])
        }
      },

      // 提交修改打开确认弹窗
      submitDataForm() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dialogType = 'save'
            if (this.hasChangeForm) {
              // 表单发生改动时，弹窗确认是否保存修改
              this.dialogVisible = true
            } else {
              this.$message.info('信息未改动！')
            }
          } else {
            return false
          }
        })
      },
      // 点击弹窗确定按钮更新客户资料
      handleUpdateClient() {
        // 表单根据新增时分为三个部分：基础信息、账户信息、支付信息
        // 若基础信息未发生修改
        if (!this.hasChangeInfo) {
          // 账户信息也未发生修改
          if (!this.hasChangeAccount) {
            // 那支付信息一定发生了修改
            this.updatePay()
          } else {
            // 或账户信息发生了修改
            this.updateAccount()
            // 或支付信息发生了修改
            if (this.hasChangePay) this.updatePay()
          }
        } else {
          // 或基础信息发生了修改
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
          updateClientInfo(clientObj).then(res => {
            if (res.status === 'true') {
              this.hasUpdateInfo = true
            } else {
              this.$message.error(res.msg)
            }
          })
          // 或账户信息发生了修改
          if (this.hasChangeAccount) this.updateAccount()
          // 或支付信息发生了修改
          if (this.hasChangePay) this.updatePay()
        }
      },
      // 更新产品信息
      updateAccount() {
        let statusObj = {
          clientId: this.clientId,
          status: this.dataForm.productStatus
        }
        if (this.dataForm.productStatus === 0) {
          setAccountStatus(statusObj).then(res => {
            if (res.status === 'true') {
              this.hasUpdateAccount = true
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          let accountObj = {
            clientId: this.clientId,
            productId: this.dataForm.productId,
            productEndDate: this.dataForm.validity,
            isPermanent: this.dataForm.isPermanent,
            appId: this.dataForm.appId,
            appSecret: this.dataForm.appSecret,
            jsFile: this.dataForm.jsFile
          }
          updateAccount(accountObj).then(res => {
            if (res.status === 'true') {
              setAccountStatus(statusObj).then(resp => {
                if (resp.status === 'true') {
                  this.hasUpdateAccount = true
                } else {
                  this.$message.error(resp.msg)
                }
              })
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      },
      // 更新或开通支付
      updatePay() {
        let payObj = {
          clientId: this.clientId,
          mchId: this.dataForm.mchId,
          mchKey: this.dataForm.mchKey,
          payCertFileName: this.dataForm.certificate
        }
        if (this.dataForm.isOpenPayment) {
          // 控件状态为开启时，且该客户未开通支付，则新开通支付功能
          if (!this.dataForm.spaceWeixinPayId || !this.dataForm.spaceWeixinPayId.length) {
            bindWeixinPay(payObj).then(res => {
              if (res.status === 'true') {
                this.createLoading = false
                this.dialogVisible = true
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            // 控件状态为开启时，且该客户已开通支付，则更新支付信息
            setWeixinPayStatus({
              clientId: this.clientId,
              status: this.dataForm.isOpenPayment
            }).then(res => {
              if (res.status === 'true') {
                updateWeixinPay(payObj).then(resp => {
                  if (resp.status === 'true') {
                    this.hasUpdatePay = true
                  } else {
                    this.$message.error(resp.msg)
                  }
                })
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        } else {}
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

  .client-modify {
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
    .upload-input .el-input__suffix {
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
</style>
