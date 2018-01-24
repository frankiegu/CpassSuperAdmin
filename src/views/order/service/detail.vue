<template>
  <div class="refund-detail">

    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <h1>订单详情</h1>
    </div>
    <div class="form-box card-padding card-padding-vertical">
      <h3 class="grid-title">订单信息</h3>

      <!--1-->
      <el-row>
        <el-col :span="8">
          <div class="detail-info">
            <div class="label">下单时间</div>
            <div class="label-con">
              {{ form.createDate }}
            </div>
          </div>
        </el-col>

        <!--2-->
        <el-col :span="8">
          <div class="detail-info">
            <div class="label">服务单号</div>
            <div class="label-con">
              {{ form.orderNum }}
            </div>
          </div>
        </el-col>

        <!--3-->
        <el-col :span="8">
          <div class="detail-info">
            <div class="label">订单状态</div>
            <div class="label-con">
              <el-tag v-if="form.orderStatus === 1">待接单</el-tag>
              <el-tag v-else-if="form.orderStatus === 2" type="success">已接单</el-tag>
              <el-tag v-else-if="form.orderStatus === 3" type="info">已完成</el-tag>
              <el-tag v-else-if="form.orderStatus === 4" type="danger">已取消</el-tag>
            </div>
          </div>
        </el-col>

        <!--4-->
        <el-col :span="8">
          <div class="detail-info">
            <div class="label">联系人</div>
            <div class="label-con">
              {{ form.contact }}
            </div>
          </div>
        </el-col>

        <!--5-->
        <el-col :span="8">
          <div class="detail-info">
            <div class="label">联系号码</div>
            <div class="label-con">
              {{ form.phone }}
            </div>
          </div>
        </el-col>

      </el-row>

      <h3 class="grid-title">订单内容</h3>

      <!--1-->
      <el-row>
        <el-col :span="8">
          <div class="detail-info">
            <div class="label">服务名称</div>
            <div class="label-con">
              {{ form.serviceName }}
            </div>
          </div>
        </el-col>

        <!--2-->
        <el-col :span="8">
          <div class="detail-info">
            <div class="label">服务类型</div>
            <div class="label-con">
              {{ form.typeName }}
            </div>
          </div>
        </el-col>

        <!--3-->
        <el-col :span="8">
          <div class="detail-info">
            <div class="label">供应商名称</div>
            <div class="label-con">
              {{ form.providerName }}
            </div>
          </div>
        </el-col>

      </el-row>

      <el-row>
        <el-col :span="24" class="margin-mid">
          <div class="detail-info" v-permissions="'/manage/valueAddServiceOrder/acceptOrder'">
            <el-button v-if="form.orderStatus === 1" type="primary" @click="recieveOrder()">接单</el-button>
          </div>
        </el-col>
      </el-row>

    </div>

  </div>
</template>

<script>
  import {
    SERVICE_DETAIL,
    RECIEVE_ORDER
  } from '@/service'
  export default {
    data () {
      return {
        title: '退款详情',
        id: this.$route.query.id,

        form: {}
      }
    },
    mounted: function () {
      const self = this
      // 获取服务订单详情
      self.getServiceBookingDetail()
    },
    methods: {
      // 查询服务订单详情
      getServiceBookingDetail () {
        const self = this
        SERVICE_DETAIL({
          id: self.id
        }).then(res => {
          if (res.status === 'true') {
            let statusName = ''
            switch (res.info.orderStatus) {
              case 1:
                statusName = '待接单'
                break;
              case 2:
                statusName = '已接单'
                break;
              case 3:
                statusName = '已完成'
                break;
              case 4:
                statusName = '已取消'
                break;
            }
            self.form = {
              createDate: res.info.createDate,
              orderNum: res.info.orderNum,
              statusName: statusName,
              orderStatus: res.info.orderStatus,
              contact: res.info.contact,
              phone: res.info.phone,
              serviceName: res.info.serviceName,
              type: res.info.type,
              typeName: res.info.typeName,
              providerName: res.info.providerName
            }
          } else {
            self.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      },
      // 接单
      recieveOrder () {
        const self = this
        const JSON = {
          id: self.id
        }
        self.$confirm('是否对该服务订单进行接单?', '接单', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          RECIEVE_ORDER(JSON).then(res => {
            if (res.status === 'true') {
              self.$message({
                type: 'success',
                message: '接单成功!'
              });
              self.$router.go(-1)
            } else {
              self.$message({
                type: 'error',
                message: res.msg
              });
            }
          })
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消'
          });
        });
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
      margin-top: 80px;
    }
    .input-name{
      width: 40%;
    }
  }
</style>
