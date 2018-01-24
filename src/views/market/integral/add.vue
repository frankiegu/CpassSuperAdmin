<template>
  <div class="add-rule">

    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <h1>新建积分规则</h1>
    </div>

    <div class="form-box card-padding">
      <el-row class="mb22">
        <el-col :span="8">
          <div class="detail-info">
            <div class="label">创建时间</div>
            <div class="label-con">{{ created }}</div>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="detail-info">
            <div class="label ml30 widthAuto">创建者</div>
            <div class="label-con"><span class="theme-gray">{{ admin }}</span></div>
          </div>
        </el-col>

        <!--<el-col :span="8">-->
          <!--<div class="detail-info">-->
            <!--<div class="label widthAuto">生效时间</div>-->
            <!--<div class="label-con">-->
              <!--<el-tag type="gray">未生效</el-tag>-->
            <!--</div>-->
          <!--</div>-->
        <!--</el-col>-->
      </el-row>

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px" class="demo-ruleForm">
        <el-form-item label="规则名称" prop="name">
          <el-col :span="9"><el-input v-model.trim="ruleForm.name" placeholder=""></el-input></el-col>
          <span class="theme-gray">&nbsp;&nbsp;发放时显示在用户端，限制字数20字</span>
        </el-form-item>

        <el-form-item label="规则内容" required>
          <el-col :span="4">
            <el-form-item prop="months">
              <el-select class="select-center" multiple v-model="ruleForm.months" placeholder="月份" @change="handleMonthChange">
                <el-option-group
                  v-for="group in monthGroupOption"
                  :key="group.value"
                  :label="group.label"
                  :disabled="group.disabled">
                  <el-option
                    v-for="item in group.monthOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="4">
            <el-form-item prop="date">
              <el-select class="select-center" v-model="ruleForm.date" placeholder="日期" @change="handleDateChange">
                <el-option
                  v-for="item in dateOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="14">
            <span class="theme-gray fl">发放&nbsp;&nbsp;</span>
            <el-col :span="12">
              <el-form-item prop="integral"><el-input type="number" v-model.number="ruleForm.integral" class="fl"></el-input></el-form-item>
            </el-col>
            <span class="theme-gray fl">&nbsp;&nbsp;积分</span>
            <span class="theme-gray">&nbsp;&nbsp;（10积分=1元）</span>
          </el-col>
        </el-form-item>

        <el-form-item label="">
          <div class="theme-gray">下次生效日期 {{ nextTakeEffectTime }}</div>
        </el-form-item>

        <el-form-item label="积分有效期" required prop="validDate">
          <el-col :span="2">
            <el-select class="select-center" v-model="ruleForm.validDate" placeholder="">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          &nbsp;&nbsp;
          <span class="theme-gray">天</span>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-col :span="9">
            <el-input type="textarea" placeholder="积分规则备注限制100个字以内" v-model.trim="ruleForm.remark"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item class="item-mb0 button-row">
          <el-button type="primary" @click="handleAddPointRule('ruleForm')">保存</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { formatTimeString } from '../../../config/utils'
  import { addPointRule, getNextTakeEffectTime } from '../../../service/index'
  export default {
    data () {
      var validateIntegral = (rule, value, callback) => {
        if (value < 1 || value > 9999) {
          callback(new Error('积分赠送最少1积分，最多9999积分'))
        }
        if (value.toString().indexOf('.') !== -1) {
          callback(new Error('请确认输入正整数'))
        }
        callback()
      }
      return {
        title: '新建积分规则',
        created: new Date(), // 创建时间
        admin: 'admin', // 创建者
        nextTakeEffectTime: '', // 下次生效时间

        ruleForm: {
          name: '',
          months: '',
          date: '',
          integral: '',
          remark: '',
          validDate: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入规则名称', trigger: 'blur,change' },
            { max: 20, message: '发放时显示在用户端，限制字数20字', trigger: 'blur,change' }
          ],
          date: [
            { required: true, message: '请选择日期', trigger: 'blur,change' }
          ],
          integral: [
            { required: true, message: '请输入正确的积分数额', trigger: 'blur,change', type: 'number' },
            { validator: validateIntegral, trigger: 'blur,change' }
          ],
          validDate: [
            { required: true, message: '请选择积分有效期', trigger: 'change', type: 'number' }
          ],
          remark: [
            { max: 100, message: '积分规则备注限制100个字以内', trigger: 'blur,change' }
          ]
        },

        // 固定每月
        fixMonth: [{
          label: '固定每月',
          value: 1,
          monthOption: [{
            value: 0,
            label: '每月'
          }]
        }],
        // 指定月份
        specifyMonth: [{
          label: '指定月份',
          value: 2,
          monthOption: [{
            value: 1,
            label: '1月'
          }, {
            value: 2,
            label: '2月'
          }, {
            value: 3,
            label: '3月'
          }, {
            value: 4,
            label: '4月'
          }, {
            value: 5,
            label: '5月'
          }, {
            value: 6,
            label: '6月'
          }, {
            value: 7,
            label: '7月'
          }, {
            value: 8,
            label: '8月'
          }, {
            value: 9,
            label: '9月'
          }, {
            value: 10,
            label: '10月'
          }, {
            value: 11,
            label: '11月'
          }, {
            value: 12,
            label: '12月'
          }]
        }],
        // 每月
        monthGroupOption: [{
          label: '固定每月',
          value: 1,
          monthOption: [{
            value: 0,
            label: '每月'
          }]
        }, {
          label: '指定月份',
          value: 2,
          monthOption: [
            {
              value: 1,
              label: '1月'
            }, {
              value: 2,
              label: '2月'
            }, {
              value: 3,
              label: '3月'
            }, {
              value: 4,
              label: '4月'
            }, {
              value: 5,
              label: '5月'
            }, {
              value: 6,
              label: '6月'
            }, {
              value: 7,
              label: '7月'
            }, {
              value: 8,
              label: '8月'
            }, {
              value: 9,
              label: '9月'
            }, {
              value: 10,
              label: '10月'
            }, {
              value: 11,
              label: '11月'
            }, {
              value: 12,
              label: '12月'
            }]
        }],
        // 每日
        dateOption: [{
          value: '1',
          label: '1号'
        }, {
          value: '5',
          label: '5号'
        }, {
          value: '10',
          label: '10号'
        }, {
          value: '15',
          label: '15号'
        }, {
          value: '20',
          label: '20号'
        }, {
          value: '25',
          label: '25号'
        }, {
          value: 'L',
          label: '最后一天'
        }],
        // 积分期限
        options: [{
          value: 3,
          label: '3'
        }, {
          value: 5,
          label: '5'
        }, {
          value: 10,
          label: '10'
        }, {
          value: 15,
          label: '15'
        }, {
          value: 30,
          label: '30'
        }, {
          value: 60,
          label: '60'
        }, {
          value: 90,
          label: '90'
        }]
      }
    },
    mounted: function () {
      const createdAt = new Date()
      this.created = formatTimeString(createdAt)
    },
    methods: {
      // 月份发生改变时执行
      handleMonthChange(value) {
        if (value.includes(0) || this.ruleForm.months.includes(0)) {
          this.monthGroupOption = this.fixMonth
        } else if (!this.ruleForm.months.length) {
          this.monthGroupOption = this.fixMonth.concat(this.specifyMonth)
        } else {
          this.monthGroupOption = this.specifyMonth
        }
        this.handleGetNextEffectTime()
      },
      // 日期发生改变时执行
      handleDateChange() {
        this.handleGetNextEffectTime()
      },
      // 获取下次生效时间
      handleGetNextEffectTime() {
        if (this.ruleForm.date) {
          const nextParams = {
            grantRule: (this.ruleForm.months.length === 0 || this.ruleForm.months.length >= 12 || this.ruleForm.months.includes(0)) ? 1 : 2,
            months: this.ruleForm.months,
            day: this.ruleForm.date
          }
          getNextTakeEffectTime(nextParams).then(res => {
            if (res.status === 'true') {
              this.nextTakeEffectTime = formatTimeString(res.info)
            } else {
              console.log(res.msg)
            }
          })
        }
      },
      // 创建积分规则
      handleAddPointRule(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const addParams = {
              ruleName: this.ruleForm.name,
              remark: this.ruleForm.remark,
              point: this.ruleForm.integral,
              effectiveDays: this.ruleForm.validDate,
              months: this.ruleForm.months,
              day: this.ruleForm.date,
              grantRule: (this.ruleForm.months.length === 0 || this.ruleForm.months.length >= 12 || this.ruleForm.months.includes(0)) ? 1 : 2
            }
            addPointRule(addParams).then(res => {
              if (res.status === 'true') {
                this.$message.success('新建成功！')
                this.$router.go(-1)
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style lang="scss">
  .add-rule {
    .el-select .el-tag {
      width: 52px;
      text-align: center;
    }
    .el-select .el-tag__close.el-icon-close {
      right: 0;
    }
  }
</style>
<style lang="scss" scoped>
  .add-rule {
    .select-center {
      width: 100%;
    }
    .button-row {
      button {
        width: 120px;
      }
    }
  }
</style>
