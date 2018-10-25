<template>
  <div class="main-content client-modify">
    <lh-title :title="dataForm.name" :level2="true" @goBack="handleBackList"></lh-title>
    <div class="card-padding card-padding-vertical">
      <el-form label-width="180px" :model="dataForm" ref="dataForm">
        <el-row :gutter="40">
          <!-- 基础信息 -->
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <h3 class="grid-title">基础信息</h3>
            <base-info ref="baseInfo" :model-form="dataForm"
              :error-field="errorField" :error-msg="errorMsg"
              :has-account="true" @changeCreateStatus="changeCreateStatus"/>
          </el-col>

          <!-- 签约信息 -->
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <h3 class="grid-title">签约信息</h3>
            <el-form-item label="签约版本" prop="productId" ref="productId" :rules="dataRules.productId" required>
              <el-select v-model="dataForm.productId" class="width300px" :disabled="!dataForm.productStatus">
                <el-option v-for="item in productList" :key="item.id" :value="+item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="有效期至" required>
              <el-form-item prop="validity" ref="validity" class="mb0"
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
              <!--<el-form-item class="fl">-->
                <!--<el-checkbox v-model="dataForm.isPermanent" :disabled="!dataForm.productStatus"-->
                  <!--@change="resetItemField('validity', true)" :true-label="1" :false-label="0">永久-->
                <!--</el-checkbox>-->
              <!--</el-form-item>-->
            </el-form-item>

            <el-form-item label="服务费比例" prop="serviceFeeProportion" ref="serviceFeeProportion"
              :error="errorField === 'serviceFeeProportion' ? errorMsg : ''"
              :rules="dataRules.serviceFeeProportion" required>
              <el-input
                v-model.number.trim="dataForm.serviceFeeProportion"
                class="width120px"
                :disabled="!dataForm.productStatus"></el-input>
              <span class="input-unit">%</span>
            </el-form-item>

            <el-form-item label="结算周期" prop="settlementCycle" ref="settlementCycle"
              :error="errorField === 'settlementCycle' ? errorMsg : ''" required :rules="dataRules.settlementCycle">
              <el-form-item>
                <el-radio v-model="dataForm.settlementCycle" :label="1" :disabled="!dataForm.productStatus">
                  固定日期
                </el-radio>
                <span class="input-unit">每月</span>
                <el-select v-model="dataForm.settlementDate1" class="small-input"
                  :disabled="!dataForm.productStatus || +dataForm.settlementCycle !== 1">
                  <el-option v-for="i in 31" :key="i + '日'" :label="i + '日'" :value="i">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item class="mb0">
                <el-radio v-model="dataForm.settlementCycle" :label="2" :disabled="!dataForm.productStatus"
                  style="margin-right: 1em">
                  周期结算
                </el-radio>
                <span class="input-unit">每</span>
                <el-input v-model.number.trim="dataForm.settlementDate2" class="small-input"
                  :disabled="!dataForm.productStatus || +dataForm.settlementCycle !== 2"></el-input>
                <el-select v-model="dataForm.settlementCycleType" class="small-input ml8"
                  :disabled="!dataForm.productStatus || +dataForm.settlementCycle !== 2">
                  <el-option v-for="item in settlementCycleTypeList" :key="item.name" :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form-item>

            <el-form-item label="结算方式" required>
              <el-form-item prop="settlementType" ref="settlementType"
                :error="errorField === 'settlementType' ? errorMsg : ''"
                :rules="[{required: true, message: '请选择结算方式' }]">
                <el-select v-model="dataForm.settlementType" class="width100"
                  :disabled="!dataForm.productStatus">
                  <el-option v-for="item in settlementTypeList" :key="item.name" :label="'转账至' + item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item prop="weixinPayNum" ref="weixinPayNum" v-show="+dataForm.settlementType === 1"
                :required="+dataForm.settlementType === 1"
                :rules="dataRules.weixinPayNum" class="mb0">
                <el-input v-model.trim="dataForm.weixinPayNum" placeholder="请输入微信号"
                  :disabled="!dataForm.productStatus || +dataForm.settlementType !== 1"></el-input>
              </el-form-item>

              <el-form-item prop="aliPayNum" ref="aliPayNum" v-show="+dataForm.settlementType === 2"
                :required="+dataForm.settlementType === 2"
                :rules="dataRules.aliPayNum" class="mb0">
                <el-input v-model.trim="dataForm.aliPayNum" placeholder="请输入支付宝账号"
                  :disabled="!dataForm.productStatus || +dataForm.settlementType !== 2"></el-input>
              </el-form-item>

              <el-form-item prop="bankCardNum" ref="bankCardNum" v-show="+dataForm.settlementType === 3"
                :required="+dataForm.settlementType === 3"
                :rules="dataRules.bankCardNum">
                <el-input v-model.trim="dataForm.bankCardNum" placeholder="请输入收款账号"
                  :disabled="!dataForm.productStatus || +dataForm.settlementType !== 3"></el-input>
              </el-form-item>

              <el-form-item prop="bank" ref="bank" v-show="+dataForm.settlementType === 3"
                :required="+dataForm.settlementType === 3"
                :rules="dataRules.bank" class="mb0">
                <el-input v-model.trim="dataForm.bank" placeholder="请输入开户行"
                  :disabled="!dataForm.productStatus || +dataForm.settlementType !== 3"></el-input>
              </el-form-item>
            </el-form-item>

            <el-form-item label="使用控制">
              <el-tooltip placement="top" content="关闭后微端和web-admin均不可使用">
                <el-switch v-model="dataForm.productStatus" :inactive-value="0" :active-value="1"
                  active-color="#7ED321" inactive-color="#A9ADBC"
                  @change="changeUseStatus"></el-switch>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="40">
          <!-- 开通公众服务号 -->
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <h3 class="grid-title">公众号</h3>
            <el-form-item label="开通公众服务号">
              <el-switch v-model="dataForm.isOpenWxService" :active-value="1" :inactive-value="0"
                active-color="#7ED321" inactive-color="#A9ADBC"
                :disabled="!isCreateAccount" @change="changeOfficeStatus">
              </el-switch>
            </el-form-item>

            <el-form-item label="客户服务号AppID" prop="appId" ref="appId" :rules="dataRules.appId"
              :required="isCreateAccount && !!dataForm.isOpenWxService">
              <el-input
                v-model.trim="dataForm.appId"
                class="width300px"
                :disabled="!dataForm.isOpenWxService"
                placeholder="客户微信服务号AppID"></el-input>
            </el-form-item>

            <el-form-item label="客户服务号AppSecret" prop="appSecret" ref="appSecret"
              :rules="dataRules.appSecret" :required="isCreateAccount && !!dataForm.isOpenWxService">
              <el-input
                v-model.trim="dataForm.appSecret"
                class="width300px"
                :disabled="!dataForm.isOpenWxService"
                placeholder="客户微信服务号AppSecret"></el-input>
            </el-form-item>

            <el-form-item label="客户服务号JS接口文件" prop="jsFile" ref="jsFile"
              :rules="dataRules.jsFile" :required="isCreateAccount && !!dataForm.isOpenWxService">
              <el-input
                v-model="dataForm.jsFile"
                readonly
                :disabled="!dataForm.isOpenWxService"
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
                  :disabled="!dataForm.isOpenWxService"
                  slot="suffix">
                  <span :class="['el-input__icon', 'el-icon-upload', {'disabled-upload' : !dataForm.productStatus}]"></span>
                </el-upload>
                <span v-show="uploadLoading1" slot="suffix" class="el-input__icon el-icon-loading upload-loading"></span>
              </el-input>
            </el-form-item>
          </el-col>

          <!-- 开通微信支付功能 -->
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <h3 class="grid-title">微信支付</h3>
            <el-form-item label="开通微信支付功能">
              <el-tooltip placement="top" content="账户可用时才可以开启支付功能">
                <el-switch v-model="dataForm.isOpenPayment" :active-value="1" :inactive-value="0"
                  active-color="#7ED321" inactive-color="#A9ADBC"
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
          </el-col>
        </el-row>

        <el-form-item label-width="0" class="mt60">
          <el-button class="width100px" @click="handleBackList">取消</el-button>
          <el-button type="primary" class="width100px" @click="submitDataForm">保存</el-button>
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
  import { baseInfo } from '../components/index'
  import commonMixins from '../common.mixins'
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
        hasUpdateOffice: false,
        hasUpdatePay: false,

        hasChangeInfo: false,
        hasChangeAccount: false,
        hasChangeAccountStatus: false,
        hasChangeOffice: false,
        hasChangeOfficeStatus: false,
        hasChangePay: false,
        hasChangePayStatus: false,

        errorField: '',
        errorMsg: ''
      }
    },
    props: {},
    components: { baseInfo },
    mounted() {},
    watch: {},
    computed: {
      hasUpdateComplete: function () {
        return this.hasUpdateAccount && this.hasUpdateInfo && this.hasUpdatePay && this.hasUpdateOffice
      }
    },
    filters: {},
    methods: {
      // 关闭使用时置灰产品和有效期控件并清除校验
      changeUseStatus(currStatus) {
        this.hasChangeAccountStatus = true
        this.dataForm.isOpenWxService = 0
        this.dataForm.isOpenPayment = 0
        if (currStatus === 0) {
          this.resetItemField(['productId', 'validity', 'appId', 'appSecret', 'jsFile'])
          this.hasChangeAccount = false
          this.hasChangePayStatus = false
          this.hasChangePay = false
          this.hasChangeOffice = false
          this.hasChangeOfficeStatus = false
        }
      },
      changeOfficeStatus() {
        this.hasChangeOfficeStatus = true
        this.resetItemField(['appId', 'appSecret', 'jsFile'], false)
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
      // 表单根据新增时分为四个部分：基础信息、账户信息、公众号信息、支付信息
      async handleUpdateClient() {
        this.updateLoading = true
        // 如果基础信息发生了修改
        if (this.hasChangeInfo) {
          this.updateClientInfo()
        } else {
          this.hasUpdateInfo = true
          if (this.hasUpdateComplete) this.handleUpdateComplete()
        }

        // 如果账户信息发生了修改
        if (this.hasChangeAccount || this.hasChangeAccountStatus) {
          await this.updateAccount()

          // 如果公众号信息发生了修改
          if (this.hasChangeOffice || this.hasChangeOfficeStatus) {
            let hasOpenOfficial = await this.handleOpenOfficial(this.spaceId)
            if (hasOpenOfficial) {
              this.hasUpdateOffice = true
              this.dialogVisible = false
              this.updateLoading = false
              if (this.hasUpdateComplete) this.handleUpdateComplete()

              // 如果支付信息发生了修改
              if (this.hasChangePay || this.hasChangePayStatus) {
                this.updatePay()
              } else {
                this.hasUpdatePay = true
                if (this.hasUpdateComplete) this.handleUpdateComplete()
              }
            } else {
              this.hasUpdateOffice = false
              this.dialogVisible = false
              this.updateLoading = false
            }
          } else {
            this.hasUpdateOffice = true
            if (this.hasUpdateComplete) this.handleUpdateComplete()

            // 如果支付信息发生了修改
            if (this.hasChangePay || this.hasChangePayStatus) {
              this.updatePay()
            } else {
              this.hasUpdatePay = true
              if (this.hasUpdateComplete) this.handleUpdateComplete()
            }
          }
        } else {
          this.hasUpdateAccount = true

          // 如果公众号信息发生了修改
          if (this.hasChangeOffice || this.hasChangeOfficeStatus) {
            let hasOpenOfficial = await this.handleOpenOfficial(this.spaceId)
            if (hasOpenOfficial) {
              this.hasUpdateOffice = true
              this.dialogVisible = false
              this.updateLoading = false
              if (this.hasUpdateComplete) this.handleUpdateComplete()

              // 如果支付信息发生了修改
              if (this.hasChangePay || this.hasChangePayStatus) {
                this.updatePay()
              } else {
                this.hasUpdatePay = true
                if (this.hasUpdateComplete) this.handleUpdateComplete()
              }
            } else {
              this.hasUpdateOffice = false
              this.dialogVisible = false
              this.updateLoading = false
            }
          } else {
            this.hasUpdateOffice = true
            if (this.hasUpdateComplete) this.handleUpdateComplete()

            // 如果支付信息发生了修改
            if (this.hasChangePay || this.hasChangePayStatus) {
              this.updatePay()
            } else {
              this.hasUpdatePay = true
              if (this.hasUpdateComplete) this.handleUpdateComplete()
            }
          }
        }
      },

      // 更新基础信息
      async updateClientInfo() {
        let clientObj = {
          id: this.clientId,
          merchantId: this.dataForm.merchantId,
          companyName: this.dataForm.companyName,
          brandName: this.dataForm.brandName,
          contact: this.dataForm.contact,
          phone: this.dataForm.phone,
          email: this.dataForm.email,
          weixin: this.dataForm.weixin,
          officialWebsite: this.dataForm.officialWebsite,
          countryId: this.dataForm.countryId,
          provinceCode: this.dataForm.provinceCode,
          cityCode: this.dataForm.cityCode,
          regionCode: this.dataForm.regionCode,
          address: this.dataForm.address,
          remark: this.dataForm.remark,
          saleManager: this.dataForm.saleManager
        }
        let res = await updateClientInfo(clientObj)
        if (res.status === 'true') {
          this.hasUpdateInfo = true
          if (this.hasUpdateComplete) this.handleUpdateComplete()
        } else {
          this.hasUpdateInfo = false
          this.$message.error(res.msg)
          this.dialogVisible = false
          this.updateLoading = false
          if (res.info) {
            this.errorField = res.info
            this.errorMsg = res.msg
            this.$refs['baseInfo'].$refs[res.info].$children[0].$refs.input.focus()
          }
        }
      },
      // 先更新产品使用状态， 再更新产品信息
      async updateAccount() {
        let accountObj = {
          clientId: this.clientId,
          productId: this.dataForm.productId,
          productEndDate: this.dataForm.validity,
          isPermanent: this.dataForm.isPermanent,
          serviceFeeProportion: this.dataForm.serviceFeeProportion,
          settlementCycle: this.dataForm.settlementCycle,
          settlementCycleType: this.dataForm.settlementCycleType,
          settlementType: this.dataForm.settlementType
        }
        accountObj.settlementDate = +this.dataForm.settlementCycle === 1
          ? this.dataForm.settlementDate1 : this.dataForm.settlementDate2
        switch (+this.dataForm.settlementType) {
          case 1:
            accountObj.weixinPayNum = this.dataForm.weixinPayNum
            break
          case 2:
            accountObj.aliPayNum = this.dataForm.aliPayNum
            break
          case 3:
            accountObj.bankCardNum = this.dataForm.bankCardNum
            accountObj.bank = this.dataForm.bank
            break
          default:
            break
        }
        let resAccountStatus = await setAccountStatus({
          clientId: this.clientId,
          status: this.dataForm.productStatus,
          productEndDate: this.dataForm.validity,
          isPermanent: this.dataForm.isPermanent
        })
        if (resAccountStatus.status === 'true') {
          // 1.更新账户使用状态成功后，关闭使用则无需更新产品信息
          // 启用并且产品信息有更改，则更新产品信息
          if (this.dataForm.productStatus === 1 && this.hasChangeAccount) {
            let resAccount = await updateAccount(accountObj)
            if (resAccount.status === 'true') {
              this.hasUpdateAccount = true
              if (this.hasUpdateComplete) this.handleUpdateComplete()
              return resAccount
            } else {
              this.hasUpdateAccount = false
              this.$message.error(resAccount.msg)
            }
          } else {
            this.hasUpdateAccount = true
            if (this.hasUpdateComplete) this.handleUpdateComplete()
          }
        } else {
          // 更新账户使用状态失败
          this.hasUpdateAccount = false
          this.$message.error(resAccountStatus.msg)
          this.dialogVisible = false
          this.updateLoading = false
        }
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
            this.$message.error(res.msg)
            this.dialogVisible = false
            this.updateLoading = false
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
  @import "../../../../styles/config";

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
    .input-unit {
      margin-left: 12px;
      vertical-align: middle;
    }

    .text-center {
      text-align: center;
    }
    .small-input {
      width: 80px;
    }
  }
</style>
