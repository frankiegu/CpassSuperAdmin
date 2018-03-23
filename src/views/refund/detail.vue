<template>
  <div class="order-field-detail">
    <div class="content-body">
      <div class="senior-title">订单信息</div>
      <div class="card-body">
        <el-row :gutter="20">
          <el-col :span="6">
            <lh-item label="订单号：" label-width="auto">{{ orderNum }}</lh-item>
          </el-col>
          <el-col :span="6">
            <lh-item label="订单状态：" label-width="auto">
              <span v-if="status === 5">待支付</span>
              <span v-if="status === 10">待使用</span>
              <span v-if="status === 20">已使用</span>
              <span v-if="status === 30">已取消</span>
              <span v-if="status === 40">待退款</span>
              <span v-if="status === 50">已退款</span>
            </lh-item>
          </el-col>
          <el-col :span="6">
            <lh-item label="订单类型：" label-width="auto">场地订单</lh-item>
          </el-col>
          <el-col :span="6">
            <lh-item label="订单金额：" label-width="auto">{{ '￥' + payAmount }}</lh-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <lh-item label="联系人：" label-width="auto">{{ contactName }}</lh-item>
          </el-col>
          <el-col :span="6">
            <lh-item label="联系方式：" label-width="auto">{{ telephone }}</lh-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <lh-item label="场地名称：" label-width="auto">{{ fieldName }}</lh-item>
          </el-col>
          <el-col :span="12">
            <lh-item label="预约时段：" label-width="auto">{{ bookDate }} {{ bookStartTime + '-' }}{{ bookEndTime }}</lh-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <lh-item label="所属空间：" label-width="auto">{{ spaceName }}</lh-item>
          </el-col>
          <el-col :span="6">
            <lh-item label="所属门店：" label-width="auto">{{ storeName }}</lh-item>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="content-body">
      <div class="senior-title">退款申请</div>
      <div class="card-body">
        <el-row :gutter="20">
          <el-col>
            <lh-item label="申请金额：" label-width="86px">{{ '￥' + refundAmount }}</lh-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <lh-item label="退款原因：" label-width="86px">{{ customerRemark }}</lh-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <lh-item label="退款备注：" label-width="86px">{{ reason }}</lh-item>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="content-body">
      <div class="senior-title">退款操作</div>
      <div class="card-body">

        <div v-if="" v-for="(item,index) in platformOrderRefundLogVoList">
          <el-row :gutter="20">
            <el-col :span="6">
              <lh-item label="申请状态：" label-width="86px">
                <el-tag type="primary" v-if="item.type === 10">待审批</el-tag>
                <el-tag type="primary" v-if="item.type === 20">已审批</el-tag>
                <el-tag type="error" v-if="item.type === 30">已驳回</el-tag>
              </lh-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="6">
              <lh-item label="操作人：" label-width="86px">{{ item.name }}</lh-item>
            </el-col>
            <el-col :span="12">
              <lh-item label="操作日期：" label-width="86px">{{ item.created }}</lh-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <lh-item label="审批回复：" label-width="86px">{{ customerRemark }}</lh-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24" v-if="item.type === 10 || item.type === 30">
              <lh-item label="" label-width="86px">
                <el-button type="primary" @click="dialogStatus = true">审批</el-button>
              </lh-item>
            </el-col>
          </el-row>

          <!--审批的按钮出现的条件： 最后一条数据 并且是待审批 已驳回并且驳回次数小于2次时显示-->
          <el-row v-if="(index === platformOrderRefundLogVoList.length - 1) && (item.type === 10 || item.type === 30)">
            <el-col :span="24" class="margin-mid" v-if="(rejectTimes < 2 && rejectTimes >= 0)">
              <div class="detail-info">
                <el-button type="primary" @click="dialogFormVisible = true">审批</el-button>
              </div>
            </el-col>
          </el-row>
        </div>

        <div v-if="!platformOrderRefundLogVoList || !platformOrderRefundLogVoList.length">
          <el-row :gutter="20">
            <el-col :span="24">
              <lh-item label="申请状态：" label-width="auto">
                <el-tag type="primary" v-if="refundPayType === 10">待审批</el-tag>
                <el-tag type="primary" v-if="refundPayType === 20">待审批</el-tag>
                <el-tag type="primary" v-if="refundPayType === 30">待审批</el-tag>
              </lh-item>
            </el-col>

            <el-col :span="24" v-if="refundPayType === 30">
              <lh-item label="" label-width="auto">
                <el-button type="primary" @click="dialogStatus = true">审批</el-button>
              </lh-item>
            </el-col>
          </el-row>
        </div>

      </div>
    </div>

    <!--审批Dialog-->
    <el-dialog title="退款审批" :visible.sync="dialogStatus">
      <el-form>
        <el-form-item label="申请金额" :label-width="formLabelWidth">
          <div class="label-con"><div class="intro-desc">{{ '￥' + refundAmount }}</div></div>
        </el-form-item>
        <el-form-item label="退款金额" :label-width="formLabelWidth">
          <el-input class="input-name" type="number" v-model.number="adminRefund" placeholder="请输入退款金额"></el-input>
        </el-form-item>
        <el-form-item label="审批回复" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :rows="2"
            :maxlength="50"
            placeholder="请输入内容"
            v-model="adminUserRemark">
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
  import { refundDetail, refundApprove } from '@/service/refund'
  import refundDetailMixins from './detail.mixins'

  export default {
    mixins: [refundDetailMixins],
    components: {},
    data () {
      return {
        platformOrderRefundId: this.$route.query.id, // 订单退款id
        // dialog
        dialogStatus: false,
        formLabelWidth: '120px',
        // 订单信息
        orderNum: '', // 订单号
        status: '', // 订单状态
        type: '', // 场地类型
        payAmount: '', // 订单金额
        contactName: '', // 联系人
        telephone: '', // 联系方式
        fieldName: '', // 场地名称
        bookDate: '', // 预定的日期（场地）
        bookStartTime: '', // 预定的开始时间（场地）
        bookEndTime: '', // 预定的结束日期（场地）
        bookStartDate: '', // 预定的开始日期（工位）
        bookEndDate: '', // 预定的结束日期（工位）
        spaceName: '', // 所属空间
        storeName: '', // 所属门店

        refundAmount: '', // 申请金额
        customerRemark: '', // 退款原因
        reason: '', // 退款备注

        adminRefund: '', // 管理员审批金额
        adminUserRemark: '', // 管理员审批备注

        platformOrderRefundLogVoList: '', // 审批记录
        refundPayType: '', // 订单退款状态
        rejectTimes: '', // 驳回次数
        approvalType: '', // 申请状态 20 已审批 30已驳回
        actualRefundAmount: '', // 退款金额
        operatName: '', // 操作人
        created: '', // 操作日期
        remark: '' // 审批回复
      }
    },
    props: {},
    watch: {},
    computed: {},
    mounted() {
      this.getPageData()
    },
    methods: {
      getPageData() {
        const self = this
        refundDetail({ platformOrderRefundId: this.platformOrderRefundId }).then(res => {
          if (res.status === 'true') {
            let data = res.info
            if (data) {
              if (data.platformOrder) {
                self.orderNum = data.platformOrder.orderNum || ''
                self.status = data.platformOrder.status || ''
                self.type = data.platformOrder.type || ''
              }
              if (data.platformOrderPay) {
                self.payAmount = data.platformOrderPay.payAmount || '0'
              }
              if (data.platformOrderContact) {
                self.contactName = data.platformOrderContact.name || ''
                self.telephone = data.platformOrderContact.telephone || ''
              }
              if (data.field) {
                self.fieldName = data.field.fieldName || ''
              }
              if (data.platformOrderField) {
                self.bookDate = data.platformOrderField.bookDate || ''
                self.bookStartTime = data.platformOrderField.bookStartTime || ''
                self.bookEndTime = data.platformOrderField.bookEndTime || ''
                self.bookStartDate = data.platformOrderField.bookStartDate || ''
                self.bookEndDate = data.platformOrderField.bookEndDate || ''
              }
              if (data.space) {
                self.spaceName = data.space.spaceName || ''
              }
              if (data.store) {
                self.storeName = data.store.storeName || ''
              }
              if (data.platformOrderRefund) {
                self.refundAmount = data.platformOrderRefund.refundAmount || '0'
                self.customerRemark = data.platformOrderRefund.customerRemark || ''
                self.reason = data.platformOrderRefund.reason || ''
                self.actualRefundAmount = data.platformOrderRefund.actualRefundAmount || ''
              }
              self.platformOrderRefundLogVoList = data.platformOrderRefundLogVoList || ''
              self.rejectTimes = data.rejectTimes || 0
              self.refundPayType = data.platformOrderRefund.refundPayType || ''
            }
          } else {
            this.setMsg('error', res.msg)
          }
        })
      },
      passApprove () {
        const self = this

        if (self.adminRefund === '') {
          this.setMsg('error', '请输入退款金额!')
          return
        }

        if (self.adminRefund > self.refundAmount) {
          this.setMsg('error', '退款金额不能大于申请金额!')
          return
        }

        if (self.adminRefund < 0) {
          this.setMsg('error', '退款金额不合法')
          return
        }

        const paramsObj = {
          platformOrderRefundId: self.platformOrderRefundId,
          actualRefundAmount: self.adminRefund,
          status: 20,
          supervisorRemark: self.adminUserRemark
        }
        refundApprove(paramsObj).then(res => {
          if (res.status === 'true') {
            this.setMsg('success', '操作成功')
            this.getPageData()
          } else {
            this.setMsg('error', 'res.msg')
          }
        })
      },
      rejectApprove () {
        const self = this
        const paramsObj = {
          platformOrderRefundId: self.platformOrderRefundId,
          actualRefundAmount: self.adminRefund,
          status: 30,
          supervisorRemark: self.adminUserRemark
        }
        refundApprove(paramsObj).then(res => {
          if (res.status === 'true') {
            this.setMsg('success', '操作成功')
            this.getPageData()
          } else {
            this.setMsg('error', 'res.msg')
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .order-field-detail {
  }
</style>
