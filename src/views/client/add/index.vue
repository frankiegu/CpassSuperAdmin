<template>
  <div class="main-content client-data">
    <lh-title :title="$route.query.id ? dataForm.name : '新增客户'" :level2="true" @goBack="handleBackList"></lh-title>
    <div class="card-padding card-padding-vertical">
      <el-form label-width="180px" :model="dataForm" ref="dataForm">
        <h3 class="grid-title">基础信息</h3>
        <base-info :model-form="dataForm" @changeCreateStatus="changeCreateStatus"></base-info>

        <el-collapse-transition>
          <h3 class="grid-title" v-show="isCreateAccount">开通账户</h3>
        </el-collapse-transition>

        <el-collapse-transition>
          <div class="account-form" v-show="isCreateAccount">
            <el-form-item label="产品" prop="productId" ref="productId"
              :rules="dataRules.productId" :required="isCreateAccount">
              <el-select v-model="dataForm.productId" class="width300px">
                <el-option v-for="(value, key) in productList" :key="key" :value="key" :label="value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="有效期至" required>
              <el-form-item prop="validity" ref="validity" class="fl mr20"
                :rules="dataRules.validity" :required="isCreateAccount && !dataForm.isPermanent">
                <el-date-picker
                  v-model="dataForm.validity"
                  :disabled="!!dataForm.isPermanent"
                  type="date"
                  placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                  style="width: 300px">
                </el-date-picker>
              </el-form-item>
              <el-form-item class="fl">
                <el-checkbox v-model="dataForm.isPermanent" :true-label="1" :false-label="0"
                  @change="resetItemField('validity', true)">永久</el-checkbox>
              </el-form-item>
            </el-form-item>

            <el-form-item label="管理后台登录账户" prop="adminUsername" ref="adminUsername"
              :error="errorField === 'adminUsername' ? errorMsg : ''"
              :rules="dataRules.adminUsername" :required="isCreateAccount">
              <el-input
                v-model.trim="dataForm.adminUsername"
                class="width300px"
                placeholder="输入管理后台登录账户（手机格式）"
                :maxlength="11"></el-input>
            </el-form-item>

            <el-form-item label="客户服务号AppID" prop="appId" ref="appId"
              :error="errorField === 'appId' ? errorMsg : ''"
              :rules="dataRules.appId" :required="isCreateAccount">
              <el-input
                v-model.trim="dataForm.appId"
                class="width300px"
                placeholder="客户微信服务号AppID"></el-input>
            </el-form-item>

            <el-form-item label="客户服务号AppSecret" prop="appSecret" ref="appSecret"
              :rules="dataRules.appSecret" :required="isCreateAccount">
              <el-input
                v-model.trim="dataForm.appSecret"
                class="width300px"
                placeholder="客户微信服务号AppSecret"></el-input>
            </el-form-item>

            <el-form-item label="客户服务号JS接口文件" prop="jsFile" ref="jsFile"
              :rules="dataRules.jsFile" :required="isCreateAccount">
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
                  :headers="uploadHeaders"
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
              :rules="dataRules.mchId" :required="isCreateAccount && !!dataForm.isOpenPayment">
              <el-input
                v-model.trim="dataForm.mchId"
                class="width300px"
                :disabled="!dataForm.isOpenPayment"
                placeholder="客户微信支付商号mch_ID"></el-input>
            </el-form-item>

            <el-form-item label="客户服务号key" prop="mchKey" ref="mchKey"
              :rules="dataRules.mchKey" :required="isCreateAccount && !!dataForm.isOpenPayment">
              <el-input
                v-model.trim="dataForm.mchKey"
                class="width300px"
                :disabled="!dataForm.isOpenPayment"
                placeholder="客户微信支付商号API密钥"></el-input>
            </el-form-item>

            <el-form-item label="客户服务号支付证书" prop="certificate" ref="certificate"
              :rules="dataRules.certificate" :required="isCreateAccount && !!dataForm.isOpenPayment">
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
          </div>
        </el-collapse-transition>

        <el-form-item>
          <el-button type="primary" class="width120px" @click="createSubmit"
            :loading="isCreateAccount && createLoading">
            {{isCreateAccount && createLoading ? '执行中...' : '保存'}}
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
          <span v-if="isCreateSuccess || isOpenSuccess" class="el-icon-success"></span>
          <p v-if="isCreateSuccess && !isOpenSuccess" class="success-tip">{{clientId ? '已保存！' : '创建成功！'}}</p>
          <p v-if="isOpenSuccess" class="success-tip">{{clientId ? '已保存！' : '开通成功！'}}</p>
          <!--<p v-if="isOpenSuccess">-->
            <!--<router-link :to="'/client/detail?id=' + clientId" class="theme-blue">点击查看</router-link><br>-->
            <!--或点击对应客户操作区的 <i class="el-icon-edit theme-blue"></i> 按钮查看-->
          <!--</p>-->
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
  import { baseInfo } from '../components/index'
  import commonMixins from '../common.mixins'
  import { addClient, updateClientInfo, createAccount, bindWeixinPay } from '@/service'

  export default {
    name: 'add',
    mixins: [commonMixins],
    data() {
      return {
        title: this.$route.query.id ? '修改客户基础信息' : '新增客户',
        dialogType: '',
        errorField: '',
        errorMsg: '',
        createLoading: false,
        isCreateSuccess: false,
        isOpenSuccess: false,
        hasChangeInfo: false
      }
    },
    props: {},
    components: {
      baseInfo
    },
    mounted() {
      document.title = this.title
      this.$store.commit('NAV_CRUMB', this.title)
      this.$route.meta.title = this.title
      if (!this.$route.name) {
        this.$store.dispatch('addVisitedViews', this.$route)
      }
    },
    watch: {},
    computed: {},
    filters: {},
    methods: {
      // 【创建账户】收起时，点击【保存】丢弃已录入的开通资料
      resetAccountFrom() {
        let itemArr = [
          'productId',
          'validity',
          'adminUsername',
          'appId',
          'appSecret',
          'jsFile',
          'mchId',
          'mchKey',
          'certificate'
        ]
        this.resetItemField(itemArr, true)
        this.dataForm.isPermanent = 0
        this.dataForm.isOpenPayment = 0
      },

      // 提交创建信息
      createSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dialogType = 'save'
            if (this.clientId && !this.hasChangeForm) {
              this.$message.info('信息未改动！')
            } else {
              if (!this.isCreateAccount) {
                // 开通账户被收起时，提交之前先清空账户开通信息
                this.resetAccountFrom()
                this.dialogVisible = true
              } else {
                if (!this.dataForm.isOpenPayment) {
                  // 开通账户但不开通微信支付时，提交前清空微信支付开通信息
                  this.resetItemField(['mchId', 'mchKey', 'certificate'], true)
                }
                if (this.clientId && !this.isCreateSuccess) {
                  this.dialogVisible = true
                } else {
                  this.createClient()
                }
              }
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
      // 创建或更新客户资料
      createClient() {
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
        // 编辑时有更改基础信息才调用更新基础信息的接口
        if (this.hasChangeInfo && !this.isCreateSuccess) {
          let promise = this.clientId ? updateClientInfo(clientObj) : addClient(clientObj)
          promise.then(res => {
            if (res.status === 'true') {
              this.isCreateSuccess = true
              // 如果仅创建客户，则1秒后关闭对话框并跳转至列表页；否则继续开通账户
              if (!this.isCreateAccount) {
                this.createLoading = false
                setTimeout(() => {
                  this.dialogVisible = false
                  this.$router.replace('/client/list')
                }, 1000)
              } else {
                if (res.info) this.clientId = res.info.id
                this.openAccount()
              }
            } else {
              this.$message.error(res.msg)
              this.isCreateSuccess = false
              this.dialogVisible = false
              this.createLoading = false
            }
          })
        } else if (this.isCreateAccount) {
          this.isCreateSuccess = true
          this.openAccount()
        }
      },
      // 开通账户
      openAccount() {
        let accountObj = {
          clientId: this.clientId,
          productId: this.dataForm.productId,
          // productStartDate: this.dataForm.validity[0],
          productEndDate: this.dataForm.validity,
          isPermanent: this.dataForm.isPermanent,
          adminUsername: this.dataForm.adminUsername,
          appId: this.dataForm.appId,
          appSecret: this.dataForm.appSecret,
          jsFile: this.dataForm.jsFile
        }
        createAccount(accountObj).then(res => {
          if (res.status === 'true') {
            this.isOpenSuccess = true
            if (!this.dataForm.isOpenPayment) {
              this.dialogVisible = true
              this.createLoading = false
              setTimeout(() => {
                this.$router.replace('/client/detail?id=' + this.clientId)
              }, 1000)
            } else {
              this.openPayment()
            }
          } else {
            this.isOpenSuccess = false
            this.createLoading = false
            this.dialogVisible = false
            this.$message.error(res.msg)
            if (res.info) {
              this.errorField = res.info
              this.errorMsg = res.msg
              this.$refs[res.info].$children[0].$refs.input.focus()
            }
          }
        })
      },
      // 开通支付
      openPayment() {
        let payObj = {
          clientId: this.clientId,
          mchId: this.dataForm.mchId,
          mchKey: this.dataForm.mchKey,
          payCertFile: this.dataForm.certificate
        }
        bindWeixinPay(payObj).then(res => {
          if (res.status === 'true') {
            this.createLoading = false
            this.dialogVisible = true
            setTimeout(() => {
              this.$router.replace('/client/detail?id=' + this.clientId)
            }, 1000)
          } else {
            this.createLoading = false
            this.dialogVisible = false
            this.$message.error(res.msg)
          }
        })
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
  @import "../../../styles/config";
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
</style>
