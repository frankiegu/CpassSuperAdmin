<template>
  <div class="base-info">
    <!-- TODO(jingyi) 基础信息新增"商户类型"、"品牌/公司名称"、"官方网址"、"联系地址"、"公司/品牌简介" -->
    <el-form-item label="商户类型" prop="clientType" ref="clientType"
      :rules="[{ required: true, message: '商户类型不能为空！', trigger: ['blur', 'change'] }]">
      <p class="label-content" v-if="infoType === 'detail'">{{modelForm.clientType}}</p>
      <el-select v-model="modelForm.clientType" class="width100" v-else>
        <el-option v-for="(value, key) in clientTypeList" :key="key" :value="+key" :label="value"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="品牌名称" prop="name" ref="name"
      :error="errorField === 'name' ? errorMsg : ''"
      :rules="[{ required: true, message: '品牌名称不能为空！', trigger: ['blur', 'change'] }]">
      <p class="label-content" v-if="infoType === 'detail'">{{modelForm.name}}</p>
      <el-input v-model.trim="modelForm.name" class="width100" placeholder="请输入品牌名称"
        :maxlength="30" v-else></el-input>
    </el-form-item>

    <el-form-item label="公司名称" prop="companyName" ref="companyName"
      :error="errorField === 'companyName' ? errorMsg : ''"
      :rules="[{ required: true, message: '公司名称不能为空！', trigger: ['blur', 'change'] }]">
      <p class="label-content" v-if="infoType === 'detail'">{{modelForm.companyName}}</p>
      <el-input v-model.trim="modelForm.companyName" class="width100" placeholder="请输入公司名称" :maxlength="30" v-else></el-input>
    </el-form-item>

    <el-form-item label="联系人" prop="contact" ref="contact"
      :rules="[{ required: true, message: '联系人不能为空！', trigger: ['blur', 'change'] }]">
      <p class="label-content" v-if="infoType === 'detail'">{{modelForm.contact}}</p>
      <el-input v-model.trim="modelForm.contact" class="width100" placeholder="请输入联系人" :maxlength="100" v-else></el-input>
    </el-form-item>

    <el-form-item label="联系电话" prop="phone" :rules="checkTel" ref="phone">
      <p class="label-content" v-if="infoType === 'detail'">{{modelForm.phone}}</p>
      <el-input v-model.trim="modelForm.phone" class="width100" placeholder="请输入联系电话" :maxlength="100" v-else></el-input>
    </el-form-item>

    <el-form-item label="邮箱" prop="email" :rules="checkEmail" ref="email"
      v-if="infoType === 'detail' && (modelForm.email && !!modelForm.email.length) || !infoType">
      <p class="label-content" v-if="infoType === 'detail'">{{modelForm.email}}</p>
      <el-input v-model.trim="modelForm.email" class="width100" placeholder="请输入邮箱" :maxlength="200" v-else></el-input>
    </el-form-item>

    <el-form-item label="微信服务号" prop="weixin" :rules="checkWeixin" ref="weixin"
      :error="errorField === 'weixin' ? errorMsg : ''"
      v-if="infoType === 'detail' && (modelForm.weixin && !!modelForm.weixin.length) || !infoType">
      <p class="label-content" v-if="infoType === 'detail'">{{modelForm.weixin}}</p>
      <el-input v-model.trim="modelForm.weixin" class="width100" placeholder="请输入微信服务号" v-else></el-input>
    </el-form-item>

    <el-form-item label="官方网址" prop="webAddress" :rules="checkIP" ref="webAddress"
      :error="errorField === 'webAddress' ? errorMsg : ''"
      v-if="infoType === 'detail' && (modelForm.webAddress && !!modelForm.webAddress.length) || !infoType">
      <p class="label-content" v-if="infoType === 'detail'">{{modelForm.webAddress}}</p>
      <el-input v-model.trim="modelForm.webAddress" class="width100" placeholder="请输入官方网址" v-else></el-input>
    </el-form-item>

    <el-form-item label="联系地址" ref="address"
      v-if="infoType === 'detail' && (modelForm.address && !!modelForm.address.length) || !infoType">
      <p class="label-content" v-if="infoType === 'detail'">{{modelForm.address}}</p>
      <el-input v-model.trim="modelForm.address" class="width100" placeholder="请输入详细地址" :maxlength="500" v-else></el-input>
    </el-form-item>

    <el-form-item label="公司/品牌简介" ref="remark"
      v-if="infoType === 'detail' && (modelForm.remark && !!modelForm.remark.length) || !infoType">
      <p class="label-content" v-if="infoType === 'detail'">{{modelForm.remark}}</p>
      <el-input type="textarea" v-model.trim="modelForm.remark" :rows="4"
        class="width100" placeholder="请输入公司/品牌简介" :maxlength="300" v-else></el-input>
    </el-form-item>

    <!--<el-form-item label="销售经理" ref="saleManager"-->
      <!--v-if="infoType === 'detail' && (modelForm.saleManager && !!modelForm.saleManager.length) || !infoType">-->
      <!--<p class="label-content" v-if="infoType === 'detail'">{{modelForm.saleManager}}</p>-->
      <!--<el-input v-model.trim="modelForm.saleManager" class="width100"-->
        <!--placeholder="填写负责跟进该客户的销售经理" :maxlength="100" v-else></el-input>-->
    <!--</el-form-item>-->

    <!--<el-form-item label="创建智众账户" v-if="!infoType && !hasAccount">-->
      <!--<el-switch v-model="isCreateAccount" @change="changeCreateStatus"></el-switch>-->
    <!--</el-form-item>-->
  </div>
</template>

<script>
  import { PHONEREG, FIXPHONEREG, EMAILREG } from '@/config/env'
  export default {
    name: 'base-info',
    data() {
      // 自定义手机号码校验规则
      var checkTel = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('联系电话不能为空'))
        }
        if (value.indexOf('-') !== -1 || value.indexOf('(') !== -1) {
          if (!FIXPHONEREG.test(value)) {
            callback(new Error('固定电话号码格式不正确'))
          }
        } else {
          if (!PHONEREG.test(value)) {
            callback(new Error('手机号码格式不正确'))
          }
        }
        callback()
      }
      // 自定义邮箱地址校验规则
      var checkEmail = (rule, value, callback) => {
        if (!value) {
          return callback()
        }
        if (!EMAILREG.test(value)) {
          callback(new Error('邮箱地址不正确'))
        }
        callback()
      }
      // 自定义微信号校验规则
      var WXREG = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/
      var checkWeixin = (rule, value, callback) => {
        if (!value) {
          return callback()
        }
        if (!WXREG.test(value)) {
          callback(new Error('请输入正确的微信号'))
        }
        callback()
      }
      // 自定义网址校验规则
      var IPREG = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$/
      var checkIP = (rule, value, callback) => {
        if (!value) {
          return callback()
        }
        if (!IPREG.test(value)) {
          callback(new Error('请输入正确的网址'))
        }
        callback()
      }
      return {
        clientTypeList: {
          1: '场地提供方',
          2: '服务供应商',
          3: '场地提供方&服务供应商'
        },
        isCreateAccount: false,
        checkTel: [
          { required: true, validator: checkTel, trigger: ['blur', 'change'] }
        ],
        checkEmail: [
          { validator: checkEmail, trigger: ['blur', 'change'] }
        ],
        checkWeixin: [
          { validator: checkWeixin, trigger: ['blur', 'change'] }
        ],
        checkIP: [
          { validator: checkIP, trigger: ['blur', 'change'] }
        ]
      }
    },
    props: {
      modelForm: [Object], // 表单数据
      infoType: [String], // 信息类型（未定义则默认为输入类型，'detail'为详情类型）
      hasAccount: [Boolean], // 是否存在账号
      errorField: [String],
      errorMsg: [String]
    },
    components: {},
    mounted() {
      this.$nextTick(() => {
      })
    },
    watch: {},
    computed: {},
    filters: {},
    methods: {
      changeCreateStatus(val) {
        this.$emit('changeCreateStatus', this.isCreateAccount)
      }
    }
  }
</script>

<style lang="scss" scoped></style>
