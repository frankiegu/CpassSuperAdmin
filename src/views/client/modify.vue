<template>
  <div class="main-content client-modify">
    <lh-title :title="dataForm.name" :level2="true" @goBack="handleBackList"></lh-title>
    <div class="card-padding card-padding-vertical">
      <el-form label-width="180px" :model="dataForm" ref="dataForm">
        <!-- 基础信息 -->
        <h3 class="grid-title">基础信息</h3>
        <base-info ref="baseInfo" :model-form="dataForm" :has-account="true" @changeCreateStatus="changeCreateStatus"/>

        <!-- 状态管理 -->
        <h3 class="grid-title">状态管理</h3>
        <el-form-item label="产品版本" prop="productId" ref="productId" :rules="dataRules.productId" required>
          <el-select v-model="dataForm.productId" class="width300px" :disabled="!dataForm.productStatus">
            <el-option v-for="(value, key) in productList" :key="key" :value="parseInt(key)" :label="value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="有效期至" required>
          <el-form-item prop="validity" ref="validity" class="fl mr20"
            :rules="dataRules.validity" :required="!dataForm.isPermanent">
            <el-date-picker
              v-model="dataForm.validity"
              :disabled="!!dataForm.isPermanent || !dataForm.productStatus"
              type="date"
              placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              style="width: 300px">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="fl">
            <el-checkbox v-model="dataForm.isPermanent" :disabled="!dataForm.productStatus"
              @change="resetItemField('validity', true)" :true-label="1" :false-label="0">永久
            </el-checkbox>
          </el-form-item>
        </el-form-item>

        <el-form-item label="使用控制">
          <el-tooltip placement="top" content="关闭后微端和web-admin均不可使用">
            <el-switch v-model="dataForm.productStatus" :inactive-value="0" :active-value="1"
              @change="changeUseStatus"></el-switch>
          </el-tooltip>
        </el-form-item>

        <!-- 开通资料 -->
        <h3 class="grid-title">开通资料</h3>
        <el-form-item label="客户服务号AppID" prop="appId" ref="appId" :rules="dataRules.appId" :required="true">
          <el-input
            v-model.trim="dataForm.appId"
            class="width300px"
            :disabled="!dataForm.productStatus"
            placeholder="客户微信服务号AppID"></el-input>
        </el-form-item>

        <el-form-item label="客户服务号AppSecret" prop="appSecret" ref="appSecret"
          :rules="dataRules.appSecret" :required="true">
          <el-input
            v-model.trim="dataForm.appSecret"
            class="width300px"
            :disabled="!dataForm.productStatus"
            placeholder="客户微信服务号AppSecret"></el-input>
        </el-form-item>

        <el-form-item label="客户服务号JS接口文件" prop="jsFile" ref="jsFile"
          :rules="dataRules.jsFile" required>
          <el-input
            v-model="dataForm.jsFile"
            readonly
            :disabled="!dataForm.productStatus"
            placeholder='选择后缀名为"txt"的JS接口文件'
            class="width300px upload-input">
            <el-upload
              v-show="!uploadLoading1"
              :action="jsUploadPath"
              accept="text/plain"
              name="jsFile"
              :multiple="false"
              :headers="uploadHeaders"
              :data="{appId: dataForm.appId, appSecret: dataForm.appSecret}"
              :show-file-list="false"
              :on-change="changeInFile"
              :before-upload="beforeUploadInFile"
              :on-success="successUploadInFile"
              :disabled="!dataForm.productStatus"
              slot="suffix">
              <span :class="['el-input__icon', 'el-icon-upload', {'disabled-upload' : !dataForm.productStatus}]"></span>
            </el-upload>
            <span v-show="uploadLoading1" slot="suffix" class="el-input__icon el-icon-loading upload-loading"></span>
          </el-input>
        </el-form-item>

        <el-form-item label="开通微信支付功能">
          <el-tooltip placement="top" content="账户可用时才可以开启支付功能">
            <el-switch v-model="dataForm.isOpenPayment" :active-value="1" :inactive-value="0"
              :disabled="!dataForm.productStatus"
              @change="changePayStatus">
            </el-switch>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="客户服务号mch_ID" prop="mchId" ref="mchId"
          :rules="dataRules.mchId" :required="!!dataForm.isOpenPayment">
          <el-input
            v-model.trim="dataForm.mchId"
            class="width300px"
            :disabled="!dataForm.isOpenPayment || !dataForm.productStatus"
            placeholder="客户微信支付商号mch_ID"></el-input>
        </el-form-item>

        <el-form-item label="客户服务号key" prop="mchKey" ref="mchKey"
          :rules="dataRules.mchKey" :required="!!dataForm.isOpenPayment">
          <el-input
            v-model.trim="dataForm.mchKey"
            class="width300px"
            :disabled="!dataForm.isOpenPayment || !dataForm.productStatus"
            placeholder="客户微信支付商号API密钥"></el-input>
        </el-form-item>

        <el-form-item label="客户服务号支付证书" prop="certificate" ref="certificate"
          :rules="dataRules.certificate" :required="!!dataForm.isOpenPayment">
          <el-input
            v-model="dataForm.certificate"
            readonly
            :disabled="!dataForm.isOpenPayment || !dataForm.productStatus"
            placeholder='选择后缀名为"p12"的支付证书文件'
            class="width300px upload-input">
            <el-upload
              v-show="!uploadLoading2"
              :action="p12UploadPath"
              accept="application/x-pkcs12"
              name="payCertFile"
              :multiple="false"
              :headers="uploadHeaders"
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
        :show-close="!hasUpdateComplete"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        center>

        <!-- 保存修改确认弹窗 -->
        <p class="text-center" v-if="dialogType === 'save' && !hasUpdateComplete">确认保存修改内容？</p>
        <span v-if="hasUpdateComplete" class="el-icon-success text-center"></span>
        <p v-if="hasUpdateComplete" class="success-tip text-center">已保存！</p>
        <span slot="footer" v-if="dialogType === 'save' && !hasUpdateComplete">
          <el-button type="primary" class="width120px" @click="handleUpdateClient" :loading="updateLoading">
            {{updateLoading ? '执行中...' : '确定'}}
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
        isCreateAccount: true,
        dialogType: '',
        updateLoading: false,
        hasUpdateInfo: false,
        hasUpdateAccount: false,
        hasUpdatePay: false,

        hasChangeInfo: false,
        hasChangeAccount: false,
        hasChangeAccountStatus: false,
        hasChangePay: false,
        hasChangePayStatus: false
      }
    },
    props: {},
    components: { baseInfo },
    mounted() {},
    watch: {},
    computed: {
      hasUpdateComplete: function () {
        return this.hasUpdateAccount && this.hasUpdateInfo && this.hasUpdatePay
      }
    },
    filters: {},
    methods: {
      // 关闭使用时置灰产品和有效期控件并清除校验
      changeUseStatus(currStatus) {
        this.hasChangeAccountStatus = true
        if (currStatus === 0) {
          this.resetItemField(['productId', 'validity', 'appId', 'appSecret', 'jsFile'])
          this.hasChangeAccount = false
          this.hasChangePayStatus = false
          this.hasChangePay = false
        }
      },
      changePayStatus() {
        this.hasChangePayStatus = true
        this.resetItemField(['mchId', 'mchKey', 'certificate'], false)
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
            let arr = this.$refs['dataForm'].fields
            arr.some((item) => {
              if (item.validateState === 'error') {
                // 验证所有的fields的结构是否一致
                // console.log(this.$refs['productId'].$children[0].$refs.reference.$refs.input)
                // console.log(this.$refs['validity'].$children[0].$refs.reference.$refs.input)
                // console.log(item.$children[0])
                item.$children[0].$refs.input ? item.$children[0].$refs.input.focus()
                  : item.$children[0].$refs.reference.$refs.input.focus()
                return true
              } else {
                return false
              }
            })
          }
        })
      },
      // 点击弹窗确定按钮更新客户资料
      handleUpdateClient() {
        this.updateLoading = true
        // 表单根据新增时分为三个部分：基础信息、账户信息、支付信息
        // 若基础信息未发生修改
        if (!this.hasChangeInfo) {
          this.hasUpdateInfo = true
          // 账户信息也未发生修改
          if (!this.hasChangeAccount && !this.hasChangeAccountStatus) {
            this.hasUpdateAccount = true
            // 那支付信息一定发生了修改
            this.updatePay()
          } else {
            // 或账户信息发生了修改
            this.updateAccount()
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
              if (this.hasUpdateComplete) this.handleUpdateComplete()
            } else {
              this.hasUpdateInfo = false
              this.$message.error(res.msg)
            }
          })
          // 或账户信息发生了修改
          if (this.hasChangeAccount || this.hasChangeAccountStatus) {
            this.updateAccount()
          } else {
            this.hasUpdateAccount = true
            if (this.hasUpdateComplete) this.handleUpdateComplete()

            if (this.hasChangePay || this.hasChangePayStatus) {
              this.updatePay()
            } else {
              this.hasUpdatePay = true
              if (this.hasUpdateComplete) this.handleUpdateComplete()
            }
          }
        }
      },
      // 更新产品信息
      updateAccount() {
        let accountObj = {
          clientId: this.clientId,
          productId: this.dataForm.productId,
          productEndDate: this.dataForm.validity,
          isPermanent: this.dataForm.isPermanent,
          appId: this.dataForm.appId,
          appSecret: this.dataForm.appSecret,
          jsFile: this.dataForm.jsFile
        }
        setAccountStatus({
          clientId: this.clientId,
          status: this.dataForm.productStatus
        }).then(res => {
          if (res.status === 'true') {
            // 1.更新账户使用状态成功后，关闭使用则无需更新产品信息
            // 启用并且产品信息有更改，则更新产品信息
            if (this.dataForm.productStatus === 1 && this.hasChangeAccount) {
              updateAccount(accountObj).then(resp => {
                if (resp.status === 'true') {
                  this.hasUpdateAccount = true
                  if (this.hasUpdateComplete) this.handleUpdateComplete()
                } else {
                  this.hasUpdateAccount = false
                  this.$message.error(resp.msg)
                }
              })
            } else {
              this.hasUpdateAccount = true
              if (this.hasUpdateComplete) this.handleUpdateComplete()
            }
            // 2.支付信息或支付状态发生了修改
            if (this.hasChangePay || this.hasChangePayStatus) {
              this.updatePay()
            } else {
              this.hasUpdatePay = true
              if (this.hasUpdateComplete) this.handleUpdateComplete()
            }
          } else {
            // 更新账户使用状态失败
            this.hasUpdateAccount = false
            this.$message.error(res.msg)
          }
        })
      },
      // 更新或开通支付
      updatePay() {
        let payObj = {
          clientId: this.clientId,
          mchId: this.dataForm.mchId,
          mchKey: this.dataForm.mchKey,
          payCertFile: this.dataForm.certificate
        }
        // 新开通支付
        if (!this.dataForm.spaceWeixinPayId && this.dataForm.isOpenPayment) {
          bindWeixinPay(payObj).then(resp => {
            if (resp.status === 'true') {
              this.hasUpdatePay = true
              if (this.hasUpdateComplete) this.handleUpdateComplete()
            } else {
              this.hasUpdatePay = false
              this.updateLoading = false
              this.$message.error(resp.msg)
            }
          })
          return
        }
        // 更新微信支付状态
        setWeixinPayStatus({
          clientId: this.clientId,
          status: this.dataForm.isOpenPayment
        }).then(res => {
          if (res.status === 'true') {
            // 微信支付状态更新成功后，关闭支付功能则无需更新支付信息
            // 开启支付功能并且支付信息有更改，则更新支付信息
            if (this.dataForm.isOpenPayment === 1 && this.hasChangePay) {
              updateWeixinPay(payObj).then(resp => {
                if (resp.status === 'true') {
                  this.hasUpdatePay = true
                  if (this.hasUpdateComplete) this.handleUpdateComplete()
                } else {
                  this.hasUpdatePay = false
                  this.updateLoading = false
                  this.$message.error(resp.msg)
                }
              })
            } else {
              this.hasUpdatePay = true
              if (this.hasUpdateComplete) this.handleUpdateComplete()
            }
          } else {
            // 更新支付状态失败
            this.hasUpdatePay = false
            this.updateLoading = false
            this.$message.error(res.msg)
          }
        })
      },

      // 更新完成1s后自动跳转回列表页
      handleUpdateComplete() {
        setTimeout(() => {
          this.$router.replace('/client/list')
        }, 1000)
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
