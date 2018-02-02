<template>
  <div class="main-content client-modify">
    <lh-title :title="pageTitle" :level2="true" @goBack="handleBackList"></lh-title>
    <div class="card-padding card-padding-vertical">
      <el-form label-width="180px" :model="dataForm" ref="dataForm">
        <!-- 基础信息 -->
        <h3 class="grid-title">基础信息</h3>
        <base-info :model-form="dataForm" :has-account="true"/>

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
              :disabled="dataForm.isPermanent || dataForm.productStatus === 0"
              type="date"
              placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              style="width: 300px">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="fl">
            <el-checkbox v-model="dataForm.isPermanent" :disabled="dataForm.productStatus === 0"
              @change="resetItemField('validity', true)">永久</el-checkbox>
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
          <el-switch v-model="dataForm.isOpenPayment"
            @change="resetItemField(['mchId', 'mchKey', 'certificate'], false)">
          </el-switch>
        </el-form-item>

        <el-form-item label="客户服务号mch_ID" prop="mchId" ref="mchId"
          :rules="dataRules.mchId" :required="dataForm.isOpenPayment">
          <el-input
            v-model.trim="dataForm.mchId"
            class="width300px"
            :disabled="!dataForm.isOpenPayment"
            placeholder="客户微信支付商号mch_ID"></el-input>
        </el-form-item>

        <el-form-item label="客户服务号key" prop="mchKey" ref="mchKey"
          :rules="dataRules.mchKey" :required="dataForm.isOpenPayment">
          <el-input
            v-model.trim="dataForm.mchKey"
            class="width300px"
            :disabled="!dataForm.isOpenPayment"
            placeholder="客户微信支付商号API密钥"></el-input>
        </el-form-item>

        <el-form-item label="客户服务号支付证书" prop="certificate" ref="certificate"
          :rules="dataRules.certificate" :required="dataForm.isOpenPayment">
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
        <span v-if="isCreateSuccess && !isOpenSuccess" class="el-icon-success"></span>
        <p v-if="isCreateSuccess && !isOpenSuccess" class="success-tip">已保存</p>
        <span slot="footer" v-if="dialogType === 'save'">
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

  export default {
    name: 'modify',
    mixins: [commonMixins],
    data() {
      return {
        pageTitle: '',
        dialogType: '',
        createLoading: false,
        isCreateSuccess: false,
        isOpenSuccess: false
      }
    },
    props: {},
    components: { baseInfo },
    mounted() {},
    watch: {},
    computed: {},
    filters: {},
    methods: {
      // 获取详情
      handleGetDetail() {
        let obj = { id: this.clientId }
        console.log(obj)
        this.dataForm.isCreateAccount = true
        this.pageTitle = this.dataForm.name = '广州雷猴软件开发有限公司'
        this.dataForm.contact = 'PN'
        this.dataForm.phone = '13566666666'
        this.dataForm.productId = '1'
        this.dataForm.isPermanent = true
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

      // 提交修改
      submitDataForm () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dialogType = 'save'
            if (this.hasChangeForm) {
              this.dialogVisible = true
            } else {
              this.$message.info('信息未改动！')
            }
          } else {
            return false
          }
        })
      },
      // 更新客户资料
      handleUpdateClient() {
        console.log('hhhh')
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
