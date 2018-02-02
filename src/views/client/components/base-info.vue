<template>
  <div class="base-info">
    <el-form-item label="客户名称" prop="name"
      :rules="[
        { required: true, message: '客户名称不能为空！', trigger: 'blur, change' }
      ]">
      <p v-if="infoType === 'detail'">{{modelForm.name}}</p>
      <el-input v-model.trim="modelForm.name" class="width300px" placeholder="填写完整客户名称" :maxlength="200" v-else></el-input>
    </el-form-item>

    <el-form-item label="联系人" prop="contact"
      :rules="[
        { required: true, message: '联系人不能为空！', trigger: 'blur, change' }
      ]">
      <p v-if="infoType === 'detail'">{{modelForm.contact}}</p>
      <el-input v-model.trim="modelForm.contact" class="width300px" placeholder="填写联系人名称" :maxlength="100" v-else></el-input>
    </el-form-item>

    <el-form-item label="联系电话" prop="phone" :rules="checkTel">
      <p v-if="infoType === 'detail'">{{modelForm.phone}}</p>
      <el-input v-model.trim="modelForm.phone" class="width300px" placeholder="填写联系人电话号码" :maxlength="100" v-else></el-input>
    </el-form-item>

    <el-form-item
      label="联系邮箱" prop="email" :rules="checkEmail"
      v-if="infoType === 'detail' && !!modelForm.email.length || !infoType">
      <p v-if="infoType === 'detail'">{{modelForm.email}}</p>
      <el-input v-model.trim="modelForm.email" class="width300px" placeholder="填写联系人的邮箱地址" :maxlength="200" v-else></el-input>
    </el-form-item>

    <el-form-item label="联系地址" v-if="infoType === 'detail' && !!modelForm.address.length || !infoType">
      <p v-if="infoType === 'detail'">{{modelForm.address}}</p>
      <el-input v-model.trim="modelForm.address" class="width300px" placeholder="填写联系人的联系地址" :maxlength="500" v-else></el-input>
    </el-form-item>

    <el-form-item label="微信服务号" v-if="infoType === 'detail' && !!modelForm.weixin.length || !infoType">
      <p v-if="infoType === 'detail'">{{modelForm.weixin}}</p>
      <el-input v-model.trim="modelForm.weixin" class="width300px" placeholder="填写微信服务号" v-else></el-input>
    </el-form-item>

    <el-form-item label="备注" v-if="infoType === 'detail' && !!modelForm.remark.length || !infoType">
      <p v-if="infoType === 'detail'">{{modelForm.remark}}</p>
      <el-input type="textarea" v-model.trim="modelForm.remark"
        class="width300px" placeholder="可填写联系人职位、负责事宜等内容" :maxlength="500" v-else></el-input>
    </el-form-item>

    <el-form-item label="销售经理" v-if="infoType === 'detail' && !!modelForm.saleManager.length || !infoType">
      <p v-if="infoType === 'detail'">{{modelForm.saleManager}}</p>
      <el-input v-model.trim="modelForm.saleManager" class="width300px"
        placeholder="填写负责跟进该客户的销售经理" :maxlength="100" v-else></el-input>
    </el-form-item>

    <el-form-item label="创建智众账户" v-if="!infoType && !hasAccount">
      <el-switch v-model="isCreateAccount" @change="changeCreateStatus"></el-switch>
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
        isCreateAccount: this.isCreate,
        checkTel: [
          { required: true, validator: checkTel, trigger: 'blur, change' }
        ],
        checkEmail: [
          { validator: checkEmail, trigger: 'blur, change' }
        ]
      }
    },
    props: {
      modelForm: [Object], // 表单数据
      infoType: [String], // 信息类型（未定义则默认为输入类型，'detail'为详情类型）
      hasAccount: [Boolean], // 是否存在账号
      isCreate: [Boolean] // TODO 是否创建账号 未传入
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
