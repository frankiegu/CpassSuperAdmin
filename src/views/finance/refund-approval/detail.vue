<template>
  <div class="refund-detail">

    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <h1>退款详情</h1>
    </div>
    <div class="form-box card-padding card-padding-vertical">
      <h3 class="grid-title">订单信息</h3>

      <el-row>
        <el-col :span="6">
          <div class="detail-info">
            <div class="label">订单号</div>
            <div class="label-con">
              {{ order.orderNum }}
            </div>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="detail-info">
            <div class="label">订单状态</div>
            <div class="label-con">
              <span v-if="order.status === 5">待支付</span>
              <span v-if="order.status === 10">待使用</span>
              <span v-if="order.status === 20">已使用</span>
              <span v-if="order.status === 30">已取消</span>
              <span v-if="order.status === 40">待退款</span>
              <span v-if="order.status === 50">已退款</span>
            </div>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="detail-info">
            <div class="label">订单类型</div>
            <div class="label-con">
              <span v-if="orderRefund.type === 10">场地预约</span>
              <span v-if="orderRefund.type === 20">增值服务</span>
            </div>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="detail-info">
            <div class="label">订单金额</div>
            <div class="label-con">
              {{ '￥' + orderPay.payAmount }}
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <div class="detail-info">
            <div class="label">联系人</div>
            <div class="label-con"><span>{{ orderContact.name }}</span></div>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="detail-info">
            <div class="label">联系方式</div>
            <div class="label-con">{{ orderContact.telephone }}</div>
          </div>
        </el-col>

      </el-row>

      <el-row>

        <el-col :span="6">
          <div class="detail-info">
            <div class="label">场地名称</div>
            <div class="label-con"><div class="intro-desc">{{ field.fieldName }}</div></div>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="detail-info">
            <div class="label">预约时段</div>
            <div class="label-con"><div class="intro-desc">{{ orderField.bookDate }} {{ orderField.bookStartTime }}{{ '-' + orderField.bookEndTime }}</div></div>
          </div>
        </el-col>

      </el-row>

      <h3 class="grid-title">退款申请</h3>

      <el-row>
        <!--<el-col :span="6">-->
          <!--<div class="detail-info">-->
            <!--<div class="label">审批状态</div>-->
            <!--<div class="label-con">-->
              <!--<el-tag v-if="refundInfo.status === 10" type="primary">待审批</el-tag>-->
              <!--<el-tag v-else-if="refundInfo.status === 20" type="success">已通过</el-tag>-->
              <!--<el-tag v-else-if="refundInfo.status === 30" type="danger">已驳回</el-tag>-->
            <!--</div>-->
          <!--</div>-->
        <!--</el-col>-->

        <el-col :span="6">
          <div class="detail-info">
            <div class="label">申请金额</div>
            <div class="label-con"><div class="intro-desc">{{ '￥' + orderRefund.refundAmount }}</div></div>
          </div>
        </el-col>

      </el-row>

      <el-row>
        <el-col :span="16">
          <div class="detail-info">
            <div class="label">退款备注</div>
            <div class="label-con"><div class="intro-desc">{{ orderRefund.userRemark || '未填写' }}</div></div>
          </div>
        </el-col>
      </el-row>

      <h3 class="grid-title">退款操作</h3>

      <div class="refund-log" v-if="orderRefundLogList" v-for="(item,index) in orderRefundLogList">
        <el-row>
          <el-col :span="6">
            <div class="detail-info">
              <div class="label">申请状态</div>
              <el-tag v-if="item.type === 10" type="primary">待审批</el-tag>
              <el-tag v-else-if="item.type === 20" type="success">已通过</el-tag>
              <el-tag v-else-if="item.type === 30" type="danger">已驳回</el-tag>
            </div>
          </el-col>

          <el-col :span="6" v-if="item.type === 20">
            <div class="detail-info">
              <div class="label">退款金额</div>
              <div class="label-con"><div class="intro-desc">{{ orderRefund.actualRefundAmount }}</div></div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="detail-info">
              <div class="label">操作人</div>
              <div class="label-con"><div class="intro-desc">{{ item.name }}</div></div>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="detail-info">
              <div class="label">操作日期</div>
              <div class="label-con"><div class="intro-desc">{{ item.created }}</div></div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="detail-info">
              <div class="label">审批回复</div>
              <div class="label-con"><div class="intro-desc">{{ item.remark || '未填写' }}</div></div>
            </div>
          </el-col>
        </el-row>
        <!--审批的按钮出现的条件： 最后一条数据 并且是待审批 已驳回并且驳回次数小于2次时显示-->
        <el-row
          v-permissions="'/manage/orderRefund/approve'"
          v-if="(index === orderRefundLogList.length - 1) && (item.type === 10 || item.type === 30)">
          <el-col :span="24" class="margin-mid" v-if="(rejectTimes < 2 && rejectTimes >= 0)">
            <div class="detail-info">
              <el-button type="primary" @click="dialogFormVisible = true">审批</el-button>
            </div>
          </el-col>
        </el-row>
      </div>

      <div v-if="!orderRefundLogList || !orderRefundLogList.length">
        <el-row>
          <el-col :span="6">
            <div class="detail-info">
              <div class="label">申请状态</div>
              <el-tag v-if="orderRefund.status === 10" type="primary">待审批</el-tag>
              <el-tag v-else-if="orderRefund.status === 20" type="success">已通过</el-tag>
              <el-tag v-else-if="orderRefund.status === 30" type="danger">已驳回</el-tag>
            </div>
          </el-col>
        </el-row>
        <!--审批的按钮 仅在log的最后一条数据并且是待审批并且已驳回并且驳回次数小于2次时显示-->
        <el-row
          v-permissions="'/manage/orderRefund/approve'"
          v-if="orderRefund.status === 10 || orderRefund.status === 30">
          <el-col :span="24" class="margin-mid">
            <div class="detail-info">
              <el-button type="primary" @click="dialogFormVisible = true">审批</el-button>
            </div>
          </el-col>
        </el-row>
      </div>

    </div>

    <!--审批Dialog-->
    <el-dialog title="退款审批" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="申请金额" :label-width="formLabelWidth">
          <div class="label-con"><div class="intro-desc">{{ '￥' + orderRefund.refundAmount }}</div></div>
        </el-form-item>
        <el-form-item label="退款金额" :label-width="formLabelWidth">
          <el-input class="input-name" type="number" v-model.number="form.account" placeholder="请输入退款金额"></el-input>
        </el-form-item>
        <el-form-item label="审批回复" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :rows="2"
            :maxlength="50"
            placeholder="请输入内容"
            v-model="form.adminUserRemark">
          </el-input>
          <span>限制输入50字，驳回时请填写驳回原因</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="passApprove">通 过</el-button>
        <el-button type="danger" @click="rejectApprove">驳 回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { findOrderRefund, orderRefundApprove } from '../../../service/index'
  export default {
    data () {
      return {
        title: '退款详情',
        id: this.$route.query.id,
        charge: this.$route.query.charge,

        refundInfo: '',
        rejectDesc: '', // 驳回备注

        // Dialog
        dialogFormVisible: false,
        formLabelWidth: '120px',
        form: {
          account: '',
          adminUserRemark: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },

        // 退款详情
        field: '',
        orderRefund: '',
        orderField: '',
        order: '',
        orderContact: '',
        orderPay: '',
        rejectTimes: '',
        orderRefundLogList: ''
      }
    },
    mounted: function () {
      const self = this
      // 获取申请详情
      self.getRefundDetail()
    },
    methods: {
      // 查询申请详情
      getRefundDetail () {
        const self = this
        findOrderRefund({
          orderRefundId: self.id
        }).then(res => {
          if (res.status === 'true') {
            self.field = res.info.field
            self.orderRefund = res.info.orderRefund
            self.orderContact = res.info.orderContact
            self.orderPay = res.info.orderPay
            self.orderField = res.info.orderField
            self.order = res.info.order
            self.rejectTimes = res.info.rejectTimes
            self.orderRefundLogList = res.info.orderRefundLogList
            self.form.account = res.info.orderRefund.refundAmount
          }
        })
      },
      // 审批通过
      passApprove() {
        const self = this
        // 退款金额大于申请金额不允通过
        // 退款金额小于0.01也不允通过
        if (!self.form.account) {
          self.$message({
            showClose: true,
            message: '请输入退款金额！',
            type: 'error'
          });
          return
        }

        if (self.form.account > self.orderRefund.refundAmount) {
          self.$message({
            showClose: true,
            message: '退款金额不能大于申请金额哦！',
            type: 'error'
          });
          return
        }
        if (self.form.account < 0.01) {
          self.$message({
            showClose: true,
            message: '退款金额不合法！',
            type: 'error'
          });
          return
        }
        orderRefundApprove({
          orderRefundId: self.id,
          adminUserRemark: self.form.adminUserRemark,
          actualRefundAmount: self.form.account,
          status: 20
        }).then(res => {
          if (res.status === 'true') {
            self.getRefundDetail()
            self.dialogFormVisible = false
          } else {
            self.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
        })
      },
      // 审批驳回
      rejectApprove() {
        const self = this
        if (!self.form.adminUserRemark) {
          self.$message({
            showClose: true,
            message: '审批回复不能为空哦！',
            type: 'error'
          });
          return
        }
        orderRefundApprove({
          orderRefundId: self.id,
          adminUserRemark: self.form.adminUserRemark,
          status: 30
        }).then(res => {
          if (res.status === 'true') {
            self.getRefundDetail()
            self.dialogFormVisible = false
          } else {
            self.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .refund-detail {
    .grant-switch {
      float: right;
      margin-top: -2px;
    }
    .delete-coupon {
      position: absolute;
      top: 20px;
      right: 25px;
    }
    .grant {
      float: right;
      margin-top: -38px;
    }
    .settled-subtitle{
      background: rgba(242, 242, 242, 1);
      height: 60px;
      margin-bottom: 10px;
      margin-top: 10px;
    }
    .settled-text-box{
      width: 65%;
    }
    .mar-center{
      margin-top: 50px;
      text-align: center;
    }
    .intro-desc{
      display: inline-block;
      line-height: 20px;
      margin-top: 7px;
    }
    .margin-mid{
      text-align: center;
      margin-top: 30px;
    }
    .input-name{
      width: 40%;
    }
    .refund-log{
      margin-bottom: 20px;
    }
  }
</style>
