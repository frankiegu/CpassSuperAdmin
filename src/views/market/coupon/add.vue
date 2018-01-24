<template>
  <div class="coupon">

    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <h1>新建优惠劵</h1>
    </div>

    <div class="form-box card-padding">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        :rules="rules"
        label-width="180px">
        <el-form-item label="优惠券名称" prop="name">
          <el-input
            class="width240px"
            v-model.trim="ruleForm.name"
            :maxlength="10"
            placeholder="请填写优惠券名称，10个字以内"></el-input>
        </el-form-item>

        <el-form-item label="优惠设置" prop="type">
          <el-radio-group v-model="ruleForm.type" @change="toggleType('ruleForm')">
            <el-radio class="radio" label="0">折扣</el-radio>
            <el-radio class="radio" label="1">满减</el-radio>
          </el-radio-group>
        </el-form-item>

        <div v-if="ruleForm.type == '0'">
          <el-form-item prop="discount">
            <el-input
              class="width100px fl"
              v-model.trim="ruleForm.discount"
              auto-complete="off"
              :maxlength="2"
              @input="afterDiscountNumber = ruleForm.discount / 10"
              placeholder="1-99"></el-input>

            <span class="theme-gray fl">&nbsp;&nbsp;{{ afterDiscountNumber }}折</span>
          </el-form-item>
        </div>

        <div v-if="ruleForm.type == '1'">
          <el-form-item class="fl">
            <span class="theme-black fl mr10">满</span>

            <el-form-item class="width100px fl" prop="full">
              <el-input v-model.number="ruleForm.full" type="text" auto-complete="off" placeholder=""></el-input>
            </el-form-item>

            <span class="theme-gray fl">&nbsp;&nbsp;元</span>
          </el-form-item>

          <el-form-item label-width="0px" class="fl ml30">
            <span class="theme-black fl mr10">减</span>

            <el-form-item class="width100px fl" prop="reduce">
              <el-input v-model.number="ruleForm.reduce" type="text" auto-complete="off" placeholder=""></el-input>
            </el-form-item>

            <span class="theme-gray fl">&nbsp;&nbsp;元</span>
          </el-form-item>
        </div>

        <el-form-item label="券数量" prop="total" class="clearfix">
          <el-input
            class="width100px fl"
            type="text"
            :maxlength="4"
            v-model.trim.number="ruleForm.total"
            placeholder=""></el-input>

          <span class="theme-gray fl">&nbsp;&nbsp;张</span>
        </el-form-item>

        <el-form-item label="优惠券有效期" prop="validPeriod">
          <el-date-picker
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-model="ruleForm.validPeriod"
            type="daterange"
            align="right"
            placeholder="选择优惠券有效期范围"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="备注" prop="mark">
          <el-col :span="9">
            <el-input :maxlength="50" type="textarea" placeholder="请填写优惠券描述，50个字以内" v-model.trim="ruleForm.mark"></el-input>
          </el-col>
        </el-form-item>

        <el-row>
          <el-form-item class="button-row">
            <el-button type="primary" @click="submitForm('ruleForm')">生成优惠券</el-button>
            <p class="theme-gray">优惠券生成后不可修改，请谨慎操作</p>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { formatTimeString } from '@/config/utils'
  import { POSITIVE_INTEGER } from '@/config/env'
  import { couponAdd } from '@/service'
  export default {
    data () {
      var validateFull = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入满减金额'));
        } else if (!POSITIVE_INTEGER.test(value)) {
          callback(new Error('请输入大于0的正整数'));
        } else {
          if (this.ruleForm.reduce !== '') {
            this.$refs.ruleForm.validateField('reduce');
          }
          callback();
        }
      };
      var validateReduce = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入优惠金额'));
        } else if (!POSITIVE_INTEGER.test(value)) {
          callback(new Error('请输入大于0的正整数'));
        } else if (value > this.ruleForm.full) {
          callback(new Error('优惠金额不得大于满减金额'));
        } else {
          callback();
        }
      };
      var validateDiscount = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入折扣'));
        } else if (!POSITIVE_INTEGER.test(value)) {
          callback(new Error('请输入大于0的正整数'));
        } else {
          callback();
        }
      };
      var validateCouponNum = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入券数量'));
        } else if (!POSITIVE_INTEGER.test(value)) {
          callback(new Error('请输入大于0的正整数'));
        } else {
          callback();
        }
      };
      var validatePeriod = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请选择日期范围'));
        } else {
          callback();
        }
      };
      return {
        title: '新建优惠券',
        afterDiscountNumber: 0,

        // 优惠劵有效期
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          },
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        ruleForm: {
          name: '',
          remarks: '',
          type: '0',
          total: '',
          discount: '',
          full: '',
          reduce: '',
          startDate: '',
          endDate: '',
          validPeriod: null
        },
        rules: {
          name: [
            { required: true, message: '请填写优惠券名称，10个字以内', trigger: 'blur,change' }
          ],
          type: [
            { required: true, message: '请设置优惠劵', trigger: 'change' }
          ],
          total: [
            { required: true, validator: validateCouponNum, trigger: 'blur,change' }
          ],
          discount: [
            { required: true, validator: validateDiscount, trigger: 'blur,change' }
          ],
          full: [
            { required: true, validator: validateFull, trigger: 'blur,change' }
          ],
          reduce: [
            { required: true, validator: validateReduce, trigger: 'blur,change' }
          ],
          validPeriod: [
            { required: true, validator: validatePeriod, trigger: 'blur,change' }
          ]
        }
      }
    },
    mounted: function () {
    },
    methods: {
      // 切换优惠类型，清空当前的值
      toggleType (formName) {
        this.$refs[formName].clearValidate()

        if (this.ruleForm.type === '0') {
          this.ruleForm.full = ''
          this.ruleForm.reduce = ''
        } else if (this.ruleForm.type === '1') {
          this.ruleForm.discount = ''
          this.afterDiscountNumber = 0
        }
      },
      submitForm(formName) {
        const self = this
        self.$refs[formName].validate((valid) => {
          if (valid) {
            const paramsJson = {
              name: self.ruleForm.name,
              mark: self.ruleForm.mark,
              type: self.ruleForm.type,
              discount: self.ruleForm.discount,
              full: self.ruleForm.full,
              reduce: self.ruleForm.reduce,
              total: self.ruleForm.total,
              startDate: self.ruleForm.validPeriod ? formatTimeString(self.ruleForm.validPeriod[0]) : null,
              endDate: self.ruleForm.validPeriod ? formatTimeString(self.ruleForm.validPeriod[1]) : null
            }
            // console.log('paramsJson: ', paramsJson)

            couponAdd(paramsJson).then(res => {
              if (res.status === 'true') {
                self.$message({
                  showClose: true,
                  message: '新增成功',
                  type: 'success'
                });

                // 后退一步记录，等同于 history.back()
                self.$router.go(-1)
              } else {
                self.$message({
                  showClose: true,
                  message: res.msg,
                  type: 'error'
                });
              }
            })
          } else {
            return
          }
        });
      }
    }
  }
</script>

<style>
  .coupon {

  }
</style>
