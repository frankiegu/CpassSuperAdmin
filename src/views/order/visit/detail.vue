<template>
  <div class="visit-detail">

    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <h1>预约详情</h1>
    </div>

    <div class="form-box card-padding card-padding-vertical" v-if="visitInfo">
      <h3 class="grid-title">预约人信息</h3>

      <el-row>
        <el-col :span="8">
          <div class="detail-info">
            <div class="label">预约人</div>
            <div class="label-con">
              {{ visitInfo.reservator }}
            </div>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="detail-info">
            <div class="label">联系电话</div>
            <div class="label-con">
              {{ visitInfo.mobile	 }}
            </div>
          </div>
        </el-col>

      </el-row>

      <el-row>
        <el-col :span="8">
          <div class="detail-info">
            <div class="label">进驻类型</div>
            <div class="label-con">
              <span v-if="visitInfo.attendType === 1">个人</span>
              <span v-if="visitInfo.attendType === 2">企业</span>
            </div>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="detail-info">
            <div class="label">公司名称</div>
            <div class="label-con"><span>{{ visitInfo.companyName }}</span></div>
          </div>
        </el-col>
      </el-row>

      <h3 class="grid-title">
        预约信息
        <span class="label-con margin-lr6">
          <el-tag v-if="visitInfo.statusCode === 1" type="primary" class="margin-tp16">未确认</el-tag>
          <el-tag v-if="visitInfo.statusCode === 2" type="success" class="margin-tp16">已确认</el-tag>
          <el-tag v-if="visitInfo.statusCode === 3" type="success" class="margin-tp16">已完成</el-tag>
          <el-tag v-if="visitInfo.statusCode === 4" type="danger" class="margin-tp16">已取消</el-tag>
        </span>
      </h3>

      <el-row>
        <el-col :span="8">
          <div class="detail-info">
            <div class="label">提交时间</div>
            <div class="label-con">{{ visitInfo.createDate }}</div>
          </div>
        </el-col>

      </el-row>

      <el-row>

        <el-col :span="8">
          <div class="detail-info">
            <div class="label">参观门店</div>
            <div class="label-con">{{ visitInfo.storeName }}</div>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="detail-info">
            <div class="label">参观人数</div>
            <div class="label-con">{{ visitInfo.numOfAttendPeople }}</div>
          </div>
        </el-col>

      </el-row>

      <el-row>
        <el-col :span="8">
          <div class="detail-info">
            <div class="label">参观时间</div>
            <div class="label-con">{{ visitInfo.visitDate }}</div>
          </div>
        </el-col>

        <!--调整时间威哥说暂时先不做  留在这里先-->
        <!--<el-col :span="8">-->
          <!--<div class="detail-info">-->
            <!--<div class="label">调整时间</div>-->
            <!--<div class="label-con"></div>-->
          <!--</div>-->
        <!--</el-col>-->
      </el-row>

      <el-row>

        <el-col :span="16">
          <div class="detail-info">
            <div class="label">预约备注</div>
            <div class="label-con"><div class="note-desc">{{ visitInfo.note || '未设置' }}</div></div>
          </div>
        </el-col>

      </el-row>

      <h3 class="grid-title">空间联系人</h3>

          <el-row>
            <el-col :span="20">
              <div class="detail-info">
                <div class="label">联系人</div>
                <div class="label-con">{{ visitInfo.contactName }}</div>
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="20">
              <div class="detail-info">
                <div class="label">联系方式</div>
                <div class="label-con">{{ visitInfo.contactTel }}</div>
              </div>
            </el-col>
          </el-row>

          <el-row class="change-btn">
            <el-col :span="24">
          <div class="detail-info">
            <el-button @click="stopVisible = true" v-if="visitInfo.statusCode === 1" type="primary">确认</el-button>
          </div>
        </el-col>
      </el-row>

    </div>

    <!-- 确认预约申请？ -->
    <el-dialog class="set-dialog"
               :title="dialogTitle"
               :visible.sync="stopVisible"
               width="420px">

      <p class="">确认预约？</p>

      <div slot="footer" class="dialog-footer">
        <el-button @click="stopVisible = false">取消</el-button>
        <el-button @click="btnConfirm" type="primary">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getVisitReservationDetail, confirmVisitReservation } from '@/service'
  export default {
    data () {
      return {
        title: '预约详情',
        id: this.$route.query.id,
        charge: this.$route.query.charge,
        visitInfo: null,
        couponName: '',
        totalPoint: '',

        // 确认预约弹窗
        dialogTitle: '确认预约？',
        stopVisible: false
      }
    },
    mounted: function () {
      const self = this
      // 获取预约详情
      self.getVisitDetail()
    },
    methods: {
      // 查询预约详情
      getVisitDetail () {
        const self = this
        getVisitReservationDetail({
          id: self.id
        }).then(res => {
          if (res.status === 'true') {
            self.visitInfo = res.info
          }
        })
      },
      // 确认预约
      btnConfirm () {
        const self = this
        const prameObj = {
          id: self.id
        }
        confirmVisitReservation(prameObj).then(res => {
          if (res.status === 'true') {
            self.stopVisible = false
            self.getVisitDetail()
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
  .visit-detail {
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
      margin-top: 20px;
      text-align: center;
    }
    .change-btn{
      margin-top: 20px;
      text-align: center;
    }
    .margin-tp16{
      margin-top: 16px;
    }
    .note-desc{
      line-height: 20px;
      display: inline-block;
      margin-top: 7px;
    }
  }
</style>
