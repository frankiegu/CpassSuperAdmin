<template>
  <div class="order-field-detail">
    <div class="content-body">
      <div class="senior-title">订单信息</div>
      <div class="card-body">
        <el-row :gutter="20">
          <el-col :span="6">
            <lh-item label="订单号：" label-width="auto">壹空间</lh-item>
          </el-col>
          <el-col :span="6">
            <lh-item label="订单状态：" label-width="auto">壹空间会议室003室</lh-item>
          </el-col>
          <el-col :span="6">
            <lh-item label="订单类型：" label-width="auto">金先生</lh-item>
          </el-col>
          <el-col :span="6">
            <lh-item label="订单金额：" label-width="auto">￥120</lh-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <lh-item label="联系人：" label-width="auto">邓先生</lh-item>
          </el-col>
          <el-col :span="6">
            <lh-item label="联系方式：" label-width="auto">13800138000</lh-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <lh-item label="场地名称：" label-width="auto">豪华大酒店</lh-item>
          </el-col>
          <el-col :span="6">
            <lh-item label="预约时段：" label-width="auto">2018-02-21 21:02</lh-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <lh-item label="所属空间：" label-width="auto">雷猴空间</lh-item>
          </el-col>
          <el-col :span="6">
            <lh-item label="所属门店：" label-width="auto">super门店</lh-item>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="content-body">
      <div class="senior-title">退款申请</div>
      <div class="card-body">
        <el-row :gutter="20">
          <el-col :span="24">
            <lh-item label="申请金额：" label-width="auto">￥120</lh-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <lh-item label="设施与服务：" label-width="84px">深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V</lh-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <lh-item label="设施与服务：" label-width="84px">深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V撒发生地方的所发生的深V</lh-item>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="content-body">
      <div class="senior-title">退款操作</div>
      <div class="card-body">
        <el-row :gutter="20">
          <el-col :span="24">
            <lh-item label="申请状态：" label-width="auto">
              <el-tag type="primary">待审批</el-tag>
            </lh-item>
          </el-col>

          <el-col :span="24">
            <lh-item label="" label-width="auto">
              <el-button type="primary" @click="dialogStatus = true">审批</el-button>
            </lh-item>
          </el-col>

        </el-row>
      </div>
    </div>

    <!--审批Dialog-->
    <el-dialog title="退款审批" :visible.sync="dialogStatus">
      <el-form :model="form">
        <el-form-item label="申请金额" :label-width="formLabelWidth">
          <div class="label-con"><div class="intro-desc">{{ '￥'}}</div></div>
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
  import { accountInfo } from '@/service/client'
  import refundDetailMixins from './detail.mixins'

  export default {
    mixins: [refundDetailMixins],
    components: {},
    data () {
      return {
        clientId: this.$route.query.id,
        // dialog
        dialogStatus: false,
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
        type: '',
        pagaData: {
          username: '',
          spaceId: '',
          name: '',
          manageUrl: '',
          wxUrl: ''
        }
      }
    },
    props: {},
    watch: {},
    computed: {},
    mounted() {
      // this.getPageData()
    },
    methods: {
      getPageData() {
        accountInfo({ clientId: this.clientId }).then(res => {
          if (res.status === 'true') {
            let data = res.info
            this.pagaData = {
              username: data.username,
              spaceId: data.spaceId,
              name: data.name,
              manageUrl: data.manageUrl,
              wxUrl: data.wxUrl
            }
          } else {
            this.setMsg('error', res.msg)
          }
        })
      },
      passApprove () {},
      rejectApprove () {}
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .order-field-detail {
  }
</style>
