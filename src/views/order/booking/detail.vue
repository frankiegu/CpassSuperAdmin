<template>
  <div class="order-detail">
    <div class="page-title"> <h1>场地预约订单详情</h1> </div>

    <div v-if="orderInfo" class="card-padding card-padding-vertical">

      <h3 class="grid-title">订单详情</h3>
        <!-- 1 -->
        <el-row>
          <el-col :span="8">
            <div class="detail-info">
              <div class="label">订单号</div>
              <div class="label-con"> {{ orderInfo.order.orderNum }} </div>
            </div>
          </el-col>

          <el-col :span="8">
            <div class="detail-info">
              <div class="label">订单状态</div>
              <div class="label-con">
                <span
                  v-for="(item, index) in statusList"
                  v-if="orderInfo.order.status === item.val"
                  :key="index">{{ item.text }}</span>
              </div>
            </div>
          </el-col>
        </el-row>
        <!-- 2 -->
        <el-row>
          <el-col :span="8">
            <div class="detail-info">
              <div class="label">场地名称</div>
              <div class="label-con">{{ orderInfo.fieldSnapshot.fieldName }}</div>
            </div>
          </el-col>

          <el-col :span="8">
            <div class="detail-info">
              <div class="label">场地类型</div>
              <div class="label-con">
                <span v-if="orderInfo.fieldSnapshot.type === 1">会议室</span>
                <span v-else>工位</span>
              </div>
            </div>
          </el-col>

          <el-col :span="8">
            <div class="detail-info">
              <div class="label">所属门店</div>
              <div class="label-con">{{ orderInfo.store.storeName }}</div>
            </div>
          </el-col>
        </el-row>
        <!-- 3 -->
        <el-row>
          <el-col :span="8">
            <div class="detail-info">
              <div class="label">预约时间</div>
              <div class="label-con">
                <i class="el-icon-time"></i>
                {{ orderInfo.orderField ? orderInfo.orderField.bookDate : null }}

                {{ orderInfo.orderField ? orderInfo.orderField.bookStartTime : null }}&nbsp;-&nbsp;{{ orderInfo.orderField ? orderInfo.orderField.bookEndTime : null }}
              </div>
            </div>
          </el-col>

          <el-col :span="8">
            <div class="detail-info">
              <div class="label">
                <span v-if="orderInfo.fieldSnapshot.type === 1">预约时长</span>
                <span v-else>预约数量</span>
              </div>
              <div class="label-con">
                <span v-if="orderInfo.fieldSnapshot.type === 1">
                  {{ orderInfo.orderField ? orderInfo.orderField.hour : null }} 小时
                </span>
                <span v-else>
                  {{ orderInfo.orderStation.days || 0 }}
                </span>
              </div>
            </div>
          </el-col>
        </el-row>

      <h3 class="grid-title">支付状态</h3>
        <!-- 1 -->
        <el-row>
          <el-col :span="8">
            <div class="detail-info">
              <div class="label">支付状态</div>
              <div class="label-con">
                <el-tag v-if="orderInfo.orderPay.status === 10" type="primary">未支付</el-tag>
                <el-tag v-else-if="orderInfo.orderPay.status === 20" type="success">已支付</el-tag>
                <el-tag v-else type="gray">已经退款</el-tag>
              </div>
            </div>
          </el-col>

          <el-col :span="8">
            <div class="detail-info">
              <div class="label">支付方式</div>
              <div class="label-con">
                <span v-if="orderInfo.orderPay.payType === 10">现金支付</span>
                <span v-else>微信支付</span>
              </div>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <div class="detail-info">
              <div class="label">订单金额</div>
              <div class="label-con">￥{{ orderInfo.orderPay.orderAmount }}</div>
            </div>
          </el-col>

          <el-col :span="8">
            <div class="detail-info">
              <div class="label">需支付金额</div>
              <div class="label-con">￥{{ orderInfo.orderPay.payAmount }}</div>
            </div>
          </el-col>

          <el-col v-show="couponName && totalPoint" :span="8">
            <div class="detail-info">
              <div class="label">使用优惠</div>
              <div class="label-con" v-show="totalPoint">
                <div class="line-height22 pt7">
                  积分<span class="ml15">{{ totalPoint }} </span>
                </div>
                <div class="line-height22" v-show="couponName">
                  优惠券<span class="ml15">{{ couponName }} </span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- 2 -->
        <el-row>
          <el-col v-show="charge === 1" :span="8">
            <div class="detail-info">
              <div class="label">收费金额</div>
              <div class="label-con">
                <el-input
                  type="number"
                  class="width100px"
                  :disabled="true"
                  placeholder="请输入支付金额"
                  v-model="orderInfo.orderPay.payAmount"></el-input>
              </div>
            </div>
          </el-col>
        </el-row>

      <h3 class="grid-title">联系人信息</h3>
        <!-- 1 -->
        <el-row>
          <el-col :span="8">
            <div class="detail-info">
              <div class="label">预约人</div>
              <div class="label-con"><span>{{ orderInfo.orderContact.name }}</span></div>
            </div>
          </el-col>

          <el-col :span="8">
            <div class="detail-info">
              <div class="label">联系方式</div>
              <div class="label-con">+86 <span class="ml5">{{ orderInfo.orderContact.telephone }}</span></div>
            </div>
          </el-col>

          <el-col :span="8">
            <div class="detail-info">
              <div class="label">登记号码</div>
              <div class="label-con">
                <!-- 如果有工号，就展示工号和密码；今后可能会没有工号，但是会有密码 -->
                <span v-if="orderInfo.orderField ? orderInfo.orderField.staffCode : null">
                  {{ orderInfo.orderField ? orderInfo.orderField.staffCode : null }}&nbsp;-&nbsp;{{ orderInfo.orderField ? orderInfo.orderField.password : null }}
                </span>

                <span v-else>
                  <span v-if="orderInfo.orderField && orderInfo.orderField.password">
                    {{ orderInfo.orderField ? orderInfo.orderField.password : null }}
                  </span>
                  <span v-else>{{ orderInfo.order.checkInNum }}</span>
                </span>
              </div>
            </div>
          </el-col>
        </el-row>
        <!-- 2 -->
        <el-row>
          <el-col :span="8">
            <div v-show="orderInfo.orderPay.status === 20" class="detail-info">
              <div class="label">已支付金额</div>
              <div class="label-con">￥{{ orderInfo.orderPay.payAmount }}</div>
            </div>
          </el-col>
        </el-row>
        <!-- 5 -->
        <div class="text-center mt40">
          <el-button
            v-show="charge === 1 && orderInfo.orderPay.status !== 20"
            @click="chargeFee"
            class="width120px"
            type="primary" >确认收费</el-button>
        </div>
    </div>
  </div>
</template>

<script>
  import {pageData} from './com.data'
  import {orderDetail, confirmPay} from '@/service'
  export default {
    data () {
      return {
        id: this.$route.query.id,
        charge: this.$route.query.charge,
        statusList: pageData.statusList,
        orderInfo: null,
        couponName: '',
        totalPoint: ''
      }
    },
    mounted() {
      this.getPageData()
    },
    methods: {
      getPageData() {
        orderDetail({ orderId: this.id }).then(res => {
          if (res.status === 'true') {
            let data = res.info
            this.orderInfo = data
            this.couponName = data.coupon ? data.coupon.name : ''
            this.totalPoint = data.orderPay ? data.orderPay.totalPoint : ''
          }
        })
      },
      chargeFee() {
        confirmPay({orderId: this.id}).then(res => {
          if (res.status === 'true') {
            this.setMsg('success', '收费成功！')
            // 后退一步记录，等同于 history.back()
            this.$router.go(-1)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .order-detail {}
</style>
