<template>
  <div class="settled-detail">

    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <h1>入驻审批</h1>
    </div>
    <div class="form-box card-padding card-padding-vertical" v-if="settledInfo">
      <h3 class="grid-title">申请明细</h3>

      <el-row>
        <el-col :span="6">
          <div class="detail-info">
            <div class="label">申请时间</div>
            <div class="label-con">
              {{ settledInfo.created }}
            </div>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="detail-info">
            <div class="label">进驻门店</div>
            <div class="label-con">
              {{ settledInfo.storeName }}
            </div>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="detail-info">
            <div class="label">公司名称</div>
            <div class="label-con">
              {{ settledInfo.companyName }}
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <div class="detail-info">
            <div class="label">行业类别</div>
            <div class="label-con"><span>{{ settledInfo.professionName }}</span></div>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="detail-info">
            <div class="label">公司规模</div>
            <div class="label-con">{{ settledInfo.companyScaleName }}</div>
          </div>
        </el-col>

        <el-col :span="4">
          <div class="detail-info">
            <div class="label">联系人姓名</div>
            <div class="label-con">{{ settledInfo.name }}</div>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="detail-info">
            <div class="label">联系电话</div>
            <div class="label-con">{{ settledInfo.mobile }}</div>
          </div>
        </el-col>

      </el-row>

      <el-row>
        <el-col :span="16">
          <div class="detail-info">
            <div class="label">公司简介</div>
            <div class="label-con"><div class="intro-desc">{{ settledInfo.introduction || '未填写' }}</div></div>
          </div>
        </el-col>
      </el-row>

      <h3 class="grid-title">审批信息</h3>

      <el-row>
        <el-col :span="6">
          <div class="detail-info">
            <div class="label">审批状态</div>
            <div class="label-con">
              <el-tag v-if="settledInfo.status === 10" type="primary">待审批</el-tag>
              <el-tag v-else-if="settledInfo.status === 20" type="success">已通过</el-tag>
              <el-tag v-else-if="settledInfo.status === 30" type="danger">已驳回</el-tag>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16" v-if="settledInfo.status === 30">
          <div class="detail-info">
            <div class="label">驳回理由</div>
            <div class="label-con"><div class="intro-desc">{{ settledInfo.comment || '未填写' }}</div></div>
          </div>
        </el-col>
      </el-row>

      <div v-if="settledInfo.status === 10">

        <el-row class="margin-top10">
          <el-col :span="16">
            <div class="detail-info">
              <div class="label">备注</div>
              <el-input type="textarea" v-model="rejectDesc" class="settled-text-box" :maxlength="500"></el-input>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <div class="detail-info mar-center">
              <el-button type="primary" @click="passSettled">通过</el-button>
              <el-button type="danger" @click="rejectSettled">驳回</el-button>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <div class="detail-info mar-center">
              通过后将自动生成企业信息并通知企业联系人
            </div>
          </el-col>
        </el-row>

      </div>

    </div>
  </div>
</template>

<script>
  import { enterDetail, enterPass, enterReject } from '@/service'
  export default {
    data () {
      return {
        title: '入驻审批',
        id: this.$route.query.id,
        charge: this.$route.query.charge,

        settledInfo: '',
        rejectDesc: '' // 驳回备注
      }
    },
    mounted: function () {
      const self = this
      // 获取订单详情
      self.getOrderDetail()
    },
    methods: {
      // 查询申请详情
      getOrderDetail () {
        const self = this
        enterDetail({
          id: self.id
        }).then(res => {
          if (res.status === 'true') {
            self.settledInfo = res.info
          }
        })
      },
      // 申请通过
      passSettled() {
        const self = this
        enterPass({
          id: self.id
        }).then(res => {
          if (res.status === 'true') {
            self.getOrderDetail()
          } else {
            self.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
        })
      },
      // 驳回申请
      rejectSettled () {
        const self = this
        if (!self.rejectDesc) {
          self.$message({
            showClose: true,
            message: '请输入驳回理由',
            type: 'error'
          });
          return
        }
        enterReject({
          id: self.id,
          comment: self.rejectDesc
        }).then(res => {
          if (res.status === 'true') {
            self.getOrderDetail()
            self.rejectDesc = ''
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
  .settled-detail {
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
    .margin-top10{
      margin-top: 10px;
    }
  }
</style>
