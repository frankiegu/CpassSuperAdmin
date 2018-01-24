<template>
  <el-dialog
    title="确认接单？"
    :visible="dialogVisible"
    :before-close="handleCloseTree"
    class="housekeeper-order"
    width="420px">

    <el-form
      :model="dialogForm"
      :rules="ruleDialogForm"
      ref="dialogForm"
      label-width="100px"
      label-position="right">
      <el-form-item label="联系人">
        <span class="theme-gray">{{ name }}</span>
      </el-form-item>

      <el-form-item label="联系方式" prop="phone">
        <el-input
          v-model="dialogForm.phone"
          placeholder="请输入联系方式"
          class="width210px"></el-input>
      </el-form-item>

      <p class="theme-gray text-center">接单后不可更改接单管家，且用户将看到你的联系方式</p>

      <div class="dialog-footer text-center mt22">
        <el-button
          @click="submitForm('dialogForm')"
          type="primary"
          class="width100px">确认</el-button>
        <el-button @click="handleCloseTree" class="width100px">取 消</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
  import { PHONEREG } from '@/config/env'
  import { mapGetters } from 'vuex'
  import { keeperOrderAccept } from '@/service/housekeeper/order'
  export default {
    props: ['dialogVisible', 'orderId'],
    data () {
      var checkTel = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入联系方式'));
          return
        }
        if (!PHONEREG.test(value)) {
          callback(new Error('联系方式不正确'))
        }
        callback()
      }
      return {
        dialogForm: { phone: this.getUsername },
        ruleDialogForm: {
          phone: [{required: true, validator: checkTel, trigger: 'blur, change'}]
        }
      }
    },
    computed: {
      ...mapGetters([
        'name',
        'getUsername'
      ])
    },
    watch: {
      dialogVisible(val, oldVal) {
        this.dialogForm.phone = this.getUsername
      }
    },
    methods: {
      handleCloseTree() {
        this.$emit('updateDialogStatus', false)
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            keeperOrderAccept({
              id: this.orderId,
              phone: this.dialogForm.phone
            }).then(res => {
              if (res.status === 'true') {
                this.setMsg('success', '接单成功!')
                this.$emit('updateDialogStatus', false)
                this.$emit('getPageData')
              } else {
                this.setMsg('error', res.msg)
              }
            })
          } else return
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .housekeeper-order {}
</style>
