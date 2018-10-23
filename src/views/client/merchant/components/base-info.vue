<template>
  <div class="base-info">
    <el-form-item label="商户类型" prop="merchantId" ref="merchantId" label-width="110px"
      :rules="[{ required: infoType !== 'detail', message: '商户类型不能为空！', trigger: ['blur', 'change'] }]">
      <p class="label-content" v-if="infoType === 'detail'">{{modelForm.merchantName}}</p>
      <el-select v-model="modelForm.merchantId" class="width100" v-else>
        <el-option v-for="item in clientTypeList" :key="item.id" :value="+item.id" :label="item.name"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="品牌名称" prop="brandName" ref="brandName" label-width="110px"
      :error="errorField === 'brandName' ? errorMsg : ''"
      :rules="[{ required: infoType !== 'detail', message: '品牌名称不能为空！', trigger: ['blur', 'change'] }]">
      <p class="label-content" v-if="infoType === 'detail'">{{modelForm.brandName}}</p>
      <el-input v-model.trim="modelForm.brandName" class="width100" placeholder="请输入品牌名称"
        :maxlength="30" v-else></el-input>
    </el-form-item>

    <el-form-item label="公司名称" prop="companyName" ref="companyName" label-width="110px"
      :error="errorField === 'companyName' ? errorMsg : ''"
      :rules="[{ required: infoType !== 'detail', message: '公司名称不能为空！', trigger: ['blur', 'change'] }]">
      <p class="label-content" v-if="infoType === 'detail'">{{modelForm.companyName}}</p>
      <el-input v-model.trim="modelForm.companyName" class="width100" placeholder="请输入公司名称"
        :maxlength="30" v-else></el-input>
    </el-form-item>

    <el-form-item label="联系人" prop="contact" ref="contact" label-width="110px"
      :rules="[{ required: infoType !== 'detail', message: '联系人不能为空！', trigger: ['blur', 'change'] }]">
      <p class="label-content" v-if="infoType === 'detail'">{{modelForm.contact}}</p>
      <el-input v-model.trim="modelForm.contact" class="width100" placeholder="请输入联系人"
        :maxlength="100" v-else></el-input>
    </el-form-item>

    <el-form-item label="联系电话" prop="phone" :rules="checkTel" ref="phone" label-width="110px">
      <p class="label-content" v-if="infoType === 'detail'">{{modelForm.phone}}</p>
      <el-input v-model.trim="modelForm.phone" class="width100" placeholder="请输入联系电话"
        :maxlength="100" v-else></el-input>
    </el-form-item>

    <el-form-item label="邮箱" prop="email" :rules="checkEmail" ref="email" label-width="110px"
      v-if="infoType === 'detail' && (modelForm.email && !!modelForm.email.length) || !infoType">
      <p class="label-content" v-if="infoType === 'detail'">{{modelForm.email}}</p>
      <el-input v-model.trim="modelForm.email" class="width100" placeholder="请输入邮箱"
        :maxlength="200" v-else></el-input>
    </el-form-item>

    <el-form-item label="微信服务号" prop="weixin" :rules="checkWeixin" ref="weixin" label-width="110px"
      :error="errorField === 'weixin' ? errorMsg : ''"
      v-if="infoType === 'detail' && (modelForm.weixin && !!modelForm.weixin.length) || !infoType">
      <p class="label-content" v-if="infoType === 'detail'">{{modelForm.weixin}}</p>
      <el-input v-model.trim="modelForm.weixin" class="width100" placeholder="请输入微信服务号" v-else></el-input>
    </el-form-item>

    <el-form-item label="官方网址" prop="officialWebsite" :rules="checkIP" ref="officialWebsite" label-width="110px"
      :error="errorField === 'officialWebsite' ? errorMsg : ''"
      v-if="infoType === 'detail' && (modelForm.officialWebsite && !!modelForm.officialWebsite.length) || !infoType">
      <p class="label-content" v-if="infoType === 'detail'">{{modelForm.officialWebsite}}</p>
      <el-input v-model.trim="modelForm.officialWebsite" class="width100" placeholder="请输入官方网址" v-else></el-input>
    </el-form-item>

    <el-form-item label="联系地址" ref="address" label-width="110px"
      v-if="infoType === 'detail' && (modelForm.address && !!modelForm.address.length) || !infoType">
      <p class="label-content" v-if="infoType === 'detail'">{{modelForm.address}}</p>
      <el-form-item v-else>
        <el-row justify="space-between" type="flex" :gutter="14" align="middle">
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-select placeholder="国家" v-model="modelForm.countryId">
              <el-option v-for="item in countryList" :key="item.name" :value="item.id" :label="item.cnName"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
            <el-cascader :options="cityTree" v-model="city" :props="cityProps" @change="changeCity" filterable
              placeholder="请选择城市" class="width100" :disabled="!modelForm.countryId">
            </el-cascader>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item class="mb0" v-if="infoType !== 'detail'">
        <el-input v-model.trim="modelForm.address" class="width100" placeholder="请输入详细地址"
          :maxlength="300"></el-input>
      </el-form-item>
    </el-form-item>

    <el-form-item label="公司/品牌简介" ref="remark" label-width="110px"
      v-if="infoType === 'detail' && (modelForm.remark && !!modelForm.remark.length) || !infoType">
      <p class="label-content" v-if="infoType === 'detail'">{{modelForm.remark}}</p>
      <el-input type="textarea" v-model.trim="modelForm.remark" :rows="4"
        class="width100" placeholder="请输入公司/品牌简介" :maxlength="300" v-else></el-input>
    </el-form-item>

    <el-form-item label="销售经理" ref="saleManager" label-width="110px"
      v-if="infoType === 'detail' && (modelForm.saleManager && !!modelForm.saleManager.length) || !infoType">
      <p class="label-content" v-if="infoType === 'detail'">{{modelForm.saleManager}}</p>
      <el-input v-model.trim="modelForm.saleManager" class="width100"
        placeholder="填写负责跟进该客户的销售经理" :maxlength="100" v-else></el-input>
    </el-form-item>

    <!--<el-form-item label="创建智众账户" v-if="!infoType && !hasAccount">-->
      <!--<el-switch v-model="isCreateAccount" @change="changeCreateStatus"></el-switch>-->
    <!--</el-form-item>-->
  </div>
</template>

<script>
  import { PHONEREG, FIXPHONEREG, EMAILREG } from '@/config/env'
  import { merchantSelect, listCountry, regionList } from '@/service'
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
        clientTypeList: [], // 商户类型列表
        countryList: [], // 国家列表
        cityTree: [], // 省市区列表
        cityProps: {
          value: 'code',
          label: 'name'
        },
        city: [],

        isCreateAccount: false,
        checkTel: [
          { required: this.infoType !== 'detail', validator: checkTel, trigger: ['blur', 'change'] }
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
      this.getMerchantList()
      this.getCountryList()
      if (this.modelForm.countryId) {
        this.getRegionList()
      }
    },
    watch: {
      'modelForm.countryId'(val, old) {
        if (val) {
          this.getRegionList()
        }
      }
    },
    computed: {},
    filters: {},
    methods: {
      // 获取国家列表
      getCountryList() {
        listCountry().then(res => {
          if (res.status === 'true') {
            this.countryList = res.info
          } else {
            this.$message.error('获取国家列表：：' + res.msg)
          }
        })
      },
      // 获取省市区列表
      getRegionList() {
        this.city = []
        regionList({ countryId: this.modelForm.countryId }).then(res => {
          if (res.status === 'true' && res.info) {
            this.cityTree = res.info.children
            this.city = [this.modelForm.provinceCode, this.modelForm.cityCode, this.modelForm.regionCode]
          } else {
            this.$message.error('获取省市区列表：：' + res.msg)
          }
        })
      },
      // 获取商户类型列表
      getMerchantList() {
        merchantSelect().then(res => {
          if (res.status === 'true') {
            this.clientTypeList = res.info
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 提交省市区code
      changeCity(val) {
        if (val && val.length > 0) {
          this.modelForm.provinceCode = val[0]
          this.modelForm.cityCode = val[1]
          this.modelForm.regionCode = val[2]
        }
      },
      changeCreateStatus(val) {
        this.$emit('changeCreateStatus', this.isCreateAccount)
      }
    }
  }
</script>

<style lang="scss" scoped></style>
