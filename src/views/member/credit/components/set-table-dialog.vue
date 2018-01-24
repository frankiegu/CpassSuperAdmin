<template>
  <div class="set-table-dialog">
    <div :class="['panel', dialogType === 'creditRewardForm' ? 'scroll-panel' : '']">
      <h1 class=""><i @click="cancelDialogSet(dialogType)" class="el-icon-arrow-right fl callback theme-gray"></i>{{ dialogTitle }}</h1>

      <!-- 信用奖励设置侧弹窗 -->
      <el-form
        :model="creditRewardForm"
        ref="creditRewardForm"
        :rules="creditRewardRules"
        label-width="80px"
        :class="['content', 'mt40', {'mb22': !handleHasPermissions('/manage/creditRule/updateReward')}]"
        v-if="dialogType === 'creditRewardForm'">

        <div class="level-cont">
          <el-form-item label="标签">
            <el-tag type="success">极好</el-tag>
          </el-form-item>
          <el-form-item label="信用值">1000</el-form-item>
          <el-form-item label="积分奖励" prop="point1">
            <el-col :span="7">每月奖励</el-col>
            <el-col :span="9" v-permissions="'/manage/creditRule/updateReward'">
              <el-input type="number" v-model.number="creditRewardForm.point1"></el-input>
            </el-col>
            <span v-if="!handleHasPermissions('/manage/creditRule/updateReward')">{{creditRewardForm.point1}}</span>
            <span>&nbsp;&nbsp;积分</span>
          </el-form-item>
          <el-form-item label="其他奖励" prop="otherReward1">
            <el-col :span="20" v-permissions="'/manage/creditRule/updateReward'">
              <el-input v-model.trim="creditRewardForm.otherReward1" :maxlength="30" type="textarea" :autosize="{ minRows: 1, maxRows: 3}"></el-input>
            </el-col>
            <span v-if="!handleHasPermissions('/manage/creditRule/updateReward')">{{creditRewardForm.otherReward1}}</span>
            <span v-permissions="'/manage/creditRule/updateReward'">&nbsp;&nbsp;30</span>
          </el-form-item>
        </div>

        <div class="level-cont">
          <el-form-item label="标签">
            <el-tag type="primary">良好</el-tag>
          </el-form-item>
          <el-form-item label="信用值">800-999</el-form-item>
          <el-form-item label="积分奖励" prop="point2">
            <el-col :span="7">每月奖励</el-col>
            <el-col :span="9" v-permissions="'/manage/creditRule/updateReward'">
              <el-input type="number" v-model.number="creditRewardForm.point2"></el-input>
            </el-col>
            <span v-if="!handleHasPermissions('/manage/creditRule/updateReward')">{{creditRewardForm.point2}}</span>
            <span>&nbsp;&nbsp;积分</span>
          </el-form-item>
          <el-form-item label="其他奖励" prop="otherReward2">
            <el-col :span="20" v-permissions="'/manage/creditRule/updateReward'">
              <el-input v-model.trim="creditRewardForm.otherReward2" :maxlength="30" type="textarea" :autosize="{ minRows: 1, maxRows: 3}"></el-input>
            </el-col>
            <span v-if="!handleHasPermissions('/manage/creditRule/updateReward')">{{creditRewardForm.otherReward2}}</span>
            <span v-permissions="'/manage/creditRule/updateReward'">&nbsp;&nbsp;30</span>
          </el-form-item>
        </div>

        <div class="level-cont">
          <el-form-item label="标签">
            <el-tag type="warning">一般</el-tag>
          </el-form-item>
          <el-form-item label="信用值">500-799</el-form-item>
          <el-form-item label="积分奖励" prop="point3">
            <el-col :span="7">每月奖励</el-col>
            <el-col :span="9" v-permissions="'/manage/creditRule/updateReward'">
              <el-input type="number" v-model.number="creditRewardForm.point3"></el-input>
            </el-col>
            <span v-if="!handleHasPermissions('/manage/creditRule/updateReward')">{{creditRewardForm.point3}}</span>
            <span>&nbsp;&nbsp;积分</span>
          </el-form-item>
          <el-form-item label="其他奖励" prop="otherReward3">
            <el-col :span="20" v-permissions="'/manage/creditRule/updateReward'">
              <el-input v-model.trim="creditRewardForm.otherReward3" :maxlength="30" type="textarea" :autosize="{ minRows: 1, maxRows: 3}"></el-input>
            </el-col>
            <span v-if="!handleHasPermissions('/manage/creditRule/updateReward')">{{creditRewardForm.otherReward3}}</span>
            <span v-permissions="'/manage/creditRule/updateReward'">&nbsp;&nbsp;30</span>
          </el-form-item>
        </div>

        <div class="level-cont">
          <el-form-item label="标签">
            <el-tag type="danger">较差</el-tag>
          </el-form-item>
          <el-form-item label="信用值"><500</el-form-item>
          <el-form-item label="积分奖励">
            <span>无奖励</span>
          </el-form-item>
        </div>

        <el-form-item class="btn-bar" label-width="0" v-permissions="'/manage/creditRule/updateReward'">
          <el-button class="btn-save" type="primary" @click="submitReward('creditRewardForm')">保存</el-button>
          <el-button @click="cancelDialogSet('creditRewardForm')" class="btn-clear">取消</el-button>
        </el-form-item>
      </el-form>

      <!-- 评定规则 -->
      <el-form
        :model="accessRuleForm"
        ref="accessRuleForm"
        :rules="accessRule"
        label-width="100px"
        class="content mt40"
        v-if="dialogType === 'accessRuleForm'">

        <el-form-item label="信用项名称" prop="ruleName">
          <el-col :span="20">
            <p v-if="accessRuleForm.accessWay === '系统判定'">{{accessRuleForm.ruleName}}</p>
            <el-input v-model.trim="accessRuleForm.ruleName" placeholder="请输入评分项名称" v-else></el-input>
          </el-col>
          <span v-if="accessRuleForm.accessWay === '人工判定'">&nbsp;&nbsp;10</span>
        </el-form-item>

        <el-form-item label="信用项说明" prop="ruleDesc">
          <el-col :span="20">
            <p v-if="accessRuleForm.accessWay === '系统判定'">{{accessRuleForm.ruleDesc}}</p>
            <el-input
              v-model.trim="accessRuleForm.ruleDesc"
              :maxlength="50"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5}"
              placeholder="请输入评分项说明（50个字以内）"
              v-else></el-input>
          </el-col>
          <span v-if="accessRuleForm.accessWay === '人工判定'">&nbsp;&nbsp;50</span>
        </el-form-item>

        <el-form-item label="判定方式">{{ accessRuleForm.accessWay }}</el-form-item>

        <el-form-item label="分值" required>
          <el-col :span="7">
            <el-form-item prop="symbol">
              <el-select
                v-model="accessRuleForm.symbol"
                placeholder="">
                <el-option label="加" :value="1"></el-option>
                <el-option label="减" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="16">
            <el-form-item prop="creditPoint">
              <el-input
                type="number"
                v-model.number="accessRuleForm.creditPoint"
                placeholder="请输入评分项分值"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item class="btn-bar" label-width="0">
          <el-button class="btn-save" type="primary" @click="submitAccessRule('accessRuleForm')">保存</el-button>
          <el-button @click="cancelDialogSet('accessRuleForm')" class="btn-clear">取消</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div @touchmove.prevent @click="cancelDialogSet(dialogType)" class="v-modal"></div>
  </div>
</template>

<script>
  import handleHasPermissions from '@/config/com-mixins'
  import { listReward, updateReward, addCreditRule, updateCreditRule } from '@/service/index'
  export default {
    name: 'set-table-dialog',
    mixins: [handleHasPermissions],
    data () {
      var validateIntegral = (rule, value, callback) => {
        if (value != null) {
          if (value < 0 || value > 9999) {
            callback(new Error('请确认数值不小于0，且最大为9999'))
          }
          if (value.toString().indexOf('.') !== -1) {
            callback(new Error('请确认输入正整数'))
          }
        }
        callback()
      }
      return {
        // 信用奖励设置
        creditRewardForm: {
          id1: 0,
          id2: 0,
          id3: 0,
          point1: null,
          point2: null,
          point3: null,
          otherReward1: '',
          otherReward2: '',
          otherReward3: ''
        },
        creditRewardRules: {
          point1: [
            { validator: validateIntegral, trigger: 'blur,change', type: 'number' }
          ],
          point2: [
            { validator: validateIntegral, trigger: 'blur,change', type: 'number' }
          ],
          point3: [
            { validator: validateIntegral, trigger: 'blur,change', type: 'number' }
          ],
          otherReward1: [
            { max: 30, message: '其他奖励说明限制30个字以内', trigger: 'blur,change' }
          ],
          otherReward2: [
            { max: 30, message: '其他奖励说明限制30个字以内', trigger: 'blur,change' }
          ],
          otherReward3: [
            { max: 30, message: '其他奖励说明限制30个字以内', trigger: 'blur,change' }
          ]
        },

        // 评定规则
        accessRule: {
          ruleName: [
            { required: true, message: '请输入评分项名称', trigger: 'blur' },
            { max: 10, message: '评分项名称限制在10个字以内', trigger: 'blur' }
          ],
          creditPoint: [
            { required: true, message: '请输入评分项分值', trigger: 'blur', type: 'number' },
            { validator: validateIntegral, trigger: 'blur' }
          ]
        }
      }
    },
    props: {
      dialogType: String,
      dialogTitle: String,
      dialogId: Number,
      accessRuleForm: Object
    },
    components: {},
    mounted () {
      // 信用奖励详情
      listReward().then(res => {
        if (res.status === 'true') {
          this.creditRewardForm.id1 = res.info[0].id
          this.creditRewardForm.id2 = res.info[1].id
          this.creditRewardForm.id3 = res.info[2].id
          this.creditRewardForm.point1 = res.info[0].reward
          this.creditRewardForm.point2 = res.info[1].reward
          this.creditRewardForm.point3 = res.info[2].reward
          this.creditRewardForm.otherReward1 = res.info[0].otherReward
          this.creditRewardForm.otherReward2 = res.info[1].otherReward
          this.creditRewardForm.otherReward3 = res.info[2].otherReward
        }
      })
    },
    watch: {},
    computed: {},
    filters: {},
    methods: {
      // 取消信息保存并关闭弹窗
      cancelDialogSet (formName) {
        if (!this.dialogId) {
          this.$refs[formName].resetFields()
        } else {
          this.$refs[formName].clearValidate()
        }
        this.$parent.cancelDialogSet()
      },

      // 更新信用奖励
      submitReward(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const rewardParams = {
              rewards: [
                {id: this.creditRewardForm.id1, reward: this.creditRewardForm.point1, otherReward: this.creditRewardForm.otherReward1},
                {id: this.creditRewardForm.id2, reward: this.creditRewardForm.point2, otherReward: this.creditRewardForm.otherReward2},
                {id: this.creditRewardForm.id3, reward: this.creditRewardForm.point3, otherReward: this.creditRewardForm.otherReward3}
              ]
            }
            updateReward(rewardParams).then(res => {
              if (res.status === 'true') {
                this.$parent.cancelDialogSet()
                this.$message.success('保存成功！')
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        })
      },

      // 提交评定规则
      submitAccessRule(formName) {
        this.$refs[formName].validate((valid) => {
          const self = this
          if (valid) {
            const accessParams = {
              detailId: self.dialogId,
              pointItem: self.accessRuleForm.ruleName,
              pointRemark: self.accessRuleForm.ruleDesc,
              creditPoint: self.accessRuleForm.creditPoint,
              operate: self.accessRuleForm.symbol
            }
            if (this.dialogId) {
              // 编辑后保存
              updateCreditRule(accessParams).then(res => {
                if (res.status === 'true') {
                  self.$parent.cancelDialogSet()
                  self.$parent.findCreditRuleList()
                  self.$message.success('修改成功！')
                } else {
                  self.$message.error(res.msg)
                }
              })
            } else {
              // 生成新鲜热辣的信用规则
              addCreditRule(accessParams).then(res => {
                if (res.status === 'true') {
                  self.$parent.cancelDialogSet()
                  self.$parent.findCreditRuleList()
                  self.$message.success('添加成功！')
                } else {
                  self.$message.error(res.msg)
                }
              })
            }
          } else {
            self.$message.error('请确认表单填写正确')
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../styles/config";
  // 侧弹窗
  .set-table-dialog {
    top: 60px;
    .v-modal {
      position: absolute;
      top: 0;
    }
    .panel {
      position: absolute;
      overflow: auto;
      top: 0;
      padding-bottom: 40px;
      &.scroll-panel {
        width: 410px;
        right: -20px;
      }
    }
  }
  .btn-bar {
    margin-top: 40px;
    padding-bottom: 20px;

    button {
      vertical-align: top;
    }
  }
  .btn-save {
    width: 200px;
  }
  .btn-clear {
    float: right;
    width: 100px;
  }
  .level-cont {
    margin-bottom: 20px;
    border: 1px solid $theme-light-gray;
    border-radius: 4px;
    padding: 20px 8px;

    .el-form-item {
      margin-bottom: 15px;
    }
  }
</style>
