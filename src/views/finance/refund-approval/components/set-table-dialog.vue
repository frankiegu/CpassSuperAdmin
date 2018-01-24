<template>
  <div class="set-table-dialog">
    <div :class="['panel', 'scroll-panel']">
      <h1><i @click="cancelDialogSet('approveForm')" class="el-icon-arrow-right fl callback theme-gray"></i>{{ dialogTitle }}</h1>

      <el-form
        :model="approveForm"
        ref="approveForm"
        :rules="approveRule"
        label-width="80px"
        class="content mt40">

        <h2 class="title-bar">订单信息</h2>
        <el-form-item label="订单号">{{ approveForm.orderNum }}</el-form-item>
        <el-form-item label="订单状态">{{ approveForm.orderStatus }}</el-form-item>
        <el-form-item label="场地名称">{{ approveForm.siteName }}</el-form-item>
        <el-form-item label="预约时段">{{ approveForm.bookingTime }}</el-form-item>
        <el-form-item label="联系人">{{ approveForm.liablePerson }}</el-form-item>
        <el-form-item label="联系方式">{{ approveForm.tel }}</el-form-item>
        <el-form-item label="退款备注">{{ approveForm.refundRemark }}</el-form-item>

        <h2 class="title-bar">审批备注</h2>
        <div class="approve-record" v-for="(record, index) in approveForm.approveRecord" :key="index" v-if="approveForm.approveRecord">
          <el-form-item label="申请状态">
            <el-tag type="primary" v-if="record.approveStatus === '待审批'">{{ record.approveStatus }}</el-tag>
            <el-tag type="success" v-if="record.approveStatus === '已通过'">{{ record.approveStatus }}</el-tag>
            <el-tag type="danger" v-if="record.approveStatus === '已驳回'">{{ record.approveStatus }}</el-tag>
          </el-form-item>

          <el-form-item label="审批备注" v-if="record || approvePass">{{ record.approveRemark }}</el-form-item>
          <el-form-item label="操作人" v-if="record || approvePass">{{ record.operator }}</el-form-item>
          <el-form-item label="操作日期" v-if=" record || approvePass">{{ record.operateTime }}</el-form-item>
        </div>

        <el-form-item label="申请状态" v-if="approveForm.approveRecord.length === 0">
          <el-tag type="primary">待审批</el-tag>
        </el-form-item>
        <el-form-item label-width="0" prop="approveRemark" v-if="!approveForm.approveRecord || !approvePass && hasApprove || hasRemark">
          <el-input
            v-model.trim="approveForm.approveRemark"
            :maxlength="50"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5}"
            placeholder="驳回原因限制在50个字以内（50个字以内）"
            :disabled="!hasApprove"></el-input>
          <p class="theme-gray">限制输入50字，驳回时请填写驳回原因</p>
        </el-form-item>

        <el-form-item class="btn-bar" label-width="0" v-if="!approvePass">
          <el-button v-if="hasApprove" class="btn-save" type="primary" @click="handleAccept('approveForm')">通过</el-button>
          <el-button v-if="!hasApprove" class="btn-save" type="primary" @click="handleActive">审批</el-button>
          <el-button v-if="hasApprove" @click="handleReject('approveForm')" class="btn-clear">驳回</el-button>
          <el-button v-if="!hasApprove" @click="cancelDialogSet('approveForm')" class="btn-clear">取消</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div @touchmove.prevent @click="cancelDialogSet('approveForm')" class="v-modal"></div>
  </div>
</template>

<script>
  export default {
    name: 'set-table-dialog',
    data () {
      return {
        approvePass: false, // 是否已通过审批（已通过的只能查看不能再审批）
        hasApprove: false, // 是否点击审批（查看待审批或已驳回，false有审批按钮，true有通过按钮和激活的备注框）
        hasRemark: true, // 是否展示备注输入框

        approveForm: {
          orderNum: '011710182023300', // 订单号
          orderStatus: '未使用', // 订单状态
          siteName: '豪华大西洋会议室', // 场地名称
          bookingTime: '2017-10-19 10:00-13:00', // 预约时段
          liablePerson: '林玲漆', // 联系人
          tel: '15622222222', // 联系方式
          refundRemark: '退款备注退款备注退款备注退款备注', // 退款备注
          approveRemark: '', // 审批备注
          approveRecord: [
//            {
//              approveStatus: '已驳回', // 审批状态
//              approveRemark: '驳回备注驳回备注驳回备注', // 审批备注
//              operator: '---', // 操作人
//              operateTime: '2017-10-12' // 操作日期
//            }
//            {
//              approveStatus: '已通过', // 审批状态
//              approveRemark: '----', // 审批备注
//              operator: '---', // 操作人
//              operateTime: '2017-11-03' // 操作日期
//            }
          ]
        },
        approveRule: {
          approveRemark: [
            { required: true, message: '请输入驳回原因', trigger: 'blur,change' },
            { max: 50, message: '驳回原因限制在50个字以内', trigger: 'blur,change' }
          ]
        }
      }
    },
    props: {
      dialogType: String,
      dialogTitle: String,
      dialogId: Number
    },
    components: {},
    mounted () {
    },
    watch: {},
    computed: {},
    filters: {},
    methods: {
      // 激活审批
      handleActive() {
        this.hasApprove = true
      },
      // 驳回申请
      handleReject(formName) {
        console.log('驳回申请', formName)
        this.$refs[formName].resetFields()
        this.$parent.cancelDialogSet()
      },
      // 取消审批
      cancelDialogSet (formName) {
        this.$refs[formName].resetFields()
        this.$parent.cancelDialogSet()
      },
      // 通过审批
      handleAccept(formName) {
        console.log(this.dialogId)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('handleAccept', formName)
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
      padding-bottom: 60px;
      &.scroll-panel {
        width: 410px;
        right: -20px;
      }
    }
    .title-bar {
      font-weight: bold;
      margin: 20px 0;
      &:first-child {
        margin-top: 0;
      }
    }
    .el-form-item {
      margin-bottom: 0;
      padding-bottom: 5px;
    }

    .approve-record {
      margin-bottom: 20px;
    }
  }
  .btn-bar {
    margin-top: 20px;
    padding-bottom: 20px!important;

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
</style>
