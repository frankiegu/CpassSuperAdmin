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
              :rules="dataForm.isCreateAccount ? dataRules.product : []">
              <el-select v-model="dataForm.product" class="width300px">
                <el-option value="完整版"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="有效期" required>
              <el-form-item prop="validity" ref="validity" class="fl mr20"
                :rules="dataForm.isCreateAccount && !dataForm.isPermanent ? dataRules.validity : []">
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
                <el-checkbox v-model="dataForm.isPermanent" @change="resetField('validity')">永久</el-checkbox>
              </el-form-item>
            </el-form-item>

            <el-form-item label="管理后台登录账户" prop="account" ref="account"
              :rules="dataForm.isCreateAccount ? dataRules.account : []">
              <el-input
                v-model="dataForm.account"
                class="width300px"
                placeholder="输入管理后台登录账户（手机格式）"
                :maxlength="11"></el-input>
            </el-form-item>

            <el-form-item label="客户服务号AppID" prop="appId" ref="appId"
              :rules="dataForm.isCreateAccount ? dataRules.appId : []">
              <el-input
                v-model="dataForm.appId"
                class="width300px"
                placeholder="客户微信服务号AppID"></el-input>
            </el-form-item>

            <el-form-item label="客户服务号AppSecret" prop="appSecret" ref="appSecret"
              :rules="dataForm.isCreateAccount ? dataRules.appSecret : []">
              <el-input
                v-model="dataForm.appSecret"
                class="width300px"
                placeholder="客户微信服务号AppSecret"></el-input>
            </el-form-item>

            <el-form-item label="客户服务号JS接口文件"></el-form-item>

            <el-form-item label="开通微信支付功能">
              <el-switch v-model="dataForm.isOpenPayment"></el-switch>
            </el-form-item>

            <!-- TODO -->
            <el-form-item label="客户服务号mch_ID" prop="mchId" ref="mchId"
              :rules="dataForm.isCreateAccount && dataForm.isOpenPayment ? dataRules.mchId : []">
              <el-input
                v-model="dataForm.mchId"
                class="width300px"
                placeholder="客户微信支付商号mch_ID"></el-input>
            </el-form-item>

            <el-form-item label="客户服务号key" prop="serviceKey" ref="serviceKey"></el-form-item>
            <el-form-item label="客户服务号支付证书"></el-form-item>
          </div>
        </el-collapse-transition>
        <el-form-item>
          <el-button type="primary" class="width120px" @click="submitDataForm">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import baseInfo from './components/base-info'
  import { PHONEREG } from '@/config/env'

  export default {
    name: 'add',
    data() {
      // 自定义手机号码校验规则
      var checkTel = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('登录账号不能为空！'))
        }
        if (!PHONEREG.test(value)) {
          callback(new Error('账号格式错误（正确的手机号码）！'))
        }
        callback()
      }
      return {
        title: this.$route.query.id ? '客户详情' : '新增客户',
        pageTitle: this.$route.query.id ? 'xx有限公司' : '新增客户',
        clientId: this.$route.query.id,

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
          isCreateAccount: true,

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
          product: [{required: true, message: '产品不能为空！', trigger: 'blur, change'}],
          validity: [{required: true, message: '请选择有效期限或永久有效', trigger: 'blur, change', type: 'array'}],
          account: [{required: true, validator: checkTel, trigger: 'blur, change'}],
          appId: [{required: true, message: 'AppID不能为空！', trigger: 'blur, change'}],
          appSecret: [{required: true, message: 'AppSecret不能为空！', trigger: 'blur, change'}],
          mchId: [{required: true, message: 'mch_ID不能为空！', trigger: 'blur, change'}],
          serviceKey: [{required: true, message: 'key不能为空！', trigger: 'blur, change'}]
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
      // 重置账户信息表单
      resetField(fieldName) {
        this.$refs[fieldName].resetField()
      },
      resetAccountFrom() {
        this.$refs['product'].resetField()
        this.$refs['validity'].resetField()
        this.dataForm.isPermanent = false
        this.$refs['account'].resetField()
        this.$refs['appId'].resetField()
        this.$refs['appSecret'].resetField()
        // this.$refs['interfaceFile'].resetField()
      },
      // 提交信息
      submitDataForm() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // 开通账户被收起时，提交之前先清空开通账户信息
            if (!this.dataForm.isCreateAccount) {
              this.resetAccountFrom()
            }
            console.log(this.dataForm)
            this.$message.success('submit success!')
          } else {
            this.$message.error('submit error!')
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .client-data {
  }
</style>
