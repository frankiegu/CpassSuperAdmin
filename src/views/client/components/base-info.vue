<template>
  <div class="base-info">
    <el-form-item label="客户名称" prop="clientName"
      :rules="[
        {required: true, message: '客户名称不能为空！', trigger: 'blur, change'}
      ]">
      <el-input v-model="modelForm.clientName" class="width300px" placeholder="填写完整客户名称" :maxlength="200"></el-input>
    </el-form-item>

    <el-form-item label="联系人" prop="userName"
      :rules="[
        {required: true, message: '联系人不能为空！', trigger: 'blur, change'}
      ]">
      <el-input v-model="modelForm.userName" class="width300px" placeholder="填写联系人名称" :maxlength="100"></el-input>
    </el-form-item>

    <el-form-item label="联系电话" prop="tel" :rules="checkTel">
      <el-input v-model="modelForm.tel" class="width300px" placeholder="填写联系人电话号码" :maxlength="100"></el-input>
    </el-form-item>

    <el-form-item label="联系邮箱" prop="email" :rules="checkEmail">
      <el-input v-model="modelForm.email" class="width300px" placeholder="填写联系人的邮箱地址" :maxlength="200"></el-input>
    </el-form-item>

    <el-form-item label="联系地址">
      <el-input v-model="modelForm.address" class="width300px" placeholder="填写联系人的联系地址" :maxlength="500"></el-input>
    </el-form-item>

    <el-form-item label="微信服务号">
      <el-input v-model="modelForm.wxService" class="width300px" placeholder="填写微信服务号"></el-input>
    </el-form-item>

    <el-form-item label="备注">
      <el-input
        type="textarea"
        v-model="modelForm.remark"
        class="width300px"
        placeholder="可填写联系人职位、负责事宜等内容"
        :maxlength="500"></el-input>
    </el-form-item>

    <el-form-item label="销售经理">
      <el-input v-model="modelForm.saleManager" class="width300px" placeholder="填写负责跟进该客户的销售经理" :maxlength="100"></el-input>
    </el-form-item>

    <el-form-item label="创建智众账户">
      <el-switch v-model="modelForm.isCreateAccount" @change="resetParent"></el-switch>
    </el-form-item>
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
      return {
        checkTel: [
          {required: true, validator: checkTel, trigger: 'blur, change'}
        ],
        checkEmail: [
          {validator: checkEmail, trigger: 'blur, change'}
        ]
      }
    },
    props: {
      modelForm: [Object]
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
      // 触发父级的重置事件
      resetParent(val) {
        if (!val) {
          // this.$parent.$parent.resetAccountFrom()
        }
      }
    }
  }
</script>

<style lang="scss" scoped></style>
