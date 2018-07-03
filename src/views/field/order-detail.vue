<template>
  <div class="order-field-detail">
    <lh-title :title="'单号：'+order.orderNum" :bb="0">
      <el-tag type="success" style="vertical-align: middle" class="order-status" v-if="order.status === 10">待使用</el-tag>
      <el-tag type="danger" style="vertical-align: middle" class="order-status" v-if="order.status === 5">未支付</el-tag>
      <el-tag type="primary" style="vertical-align: middle" class="order-status" v-if="order.status === 20">已使用</el-tag>
      <el-tag type="info" style="vertical-align: middle" class="order-status" v-if="order.status === 30">已取消</el-tag>
      <el-tag type="danger" style="vertical-align: middle" class="order-status" v-if="order.status === 40">待退款</el-tag>
      <el-tag type="info" style="vertical-align: middle" class="order-status" v-if="order.status === 50">已退款</el-tag>
    </lh-title>

    <div class="page-title-info">
      <el-row>
        <el-col :span="16">
          <el-row :gutter="20">
            <el-col :span="8">
              <lh-item label="预约场地：" label-width="auto">{{fieldInfo.fieldName}}</lh-item>
            </el-col>
            <el-col :span="8">
              <lh-item label="预约日期：" label-width="auto">{{platformOrderField.reservationDate}}</lh-item>
            </el-col>
            <el-col :span="8">
              <lh-item label="预约时段：" label-width="auto" v-if="fieldInfo.type === 1">
                {{platformOrderField.bookStartTime}}～{{platformOrderField.bookEndTime}}</lh-item>
              <lh-item label="预约数量：" label-width="auto" v-if="fieldInfo.type === 3">{{platformOrderField.quantity}}</lh-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <lh-item label="生成时间：" label-width="auto">{{order.created}}</lh-item>
            </el-col>
            <el-col :span="8">
              <lh-item label="客户：" label-width="auto">{{orderContact.name}}</lh-item>
            </el-col>
            <el-col :span="8">
              <lh-item label="联系方式：" label-width="auto">{{orderContact.telephone}}</lh-item>
            </el-col>
          </el-row>

          <!--<el-row :gutter="20">-->
            <!--<el-col :span="8">-->
              <!--<lh-item label="联系方式：" label-width="auto">{{orderContact.telephone}}</lh-item>-->
            <!--</el-col>-->

            <!--<el-col :span="8">-->
              <!--<lh-item label="预约号：" label-width="auto" v-if="order.checkInNum">{{order.checkInNum}}</lh-item>-->
            <!--</el-col>-->
          <!--</el-row>-->
        </el-col>

        <div class="page-title-right">
          <div class="p-item">
            <div class="theme-gray">验证码</div>
            <div class="p-con" v-if="platformOrderField.setupLock === 1 && platformOrderField.setupPassword === 1">{{platformOrderField.staffCode}}-{{platformOrderField.password}}</div>
            <div class="p-con" v-else>{{order.checkInNum || '----'}}</div>
          </div>

          <div class="p-item">
            <p class="theme-gray">订单金额</p>
            <p class="p-con">￥{{orderPay.orderAmount}}</p>
          </div>
        </div>
      </el-row >
    </div>

    <div class="content-body">
      <div class="card-body">
        <div class="basics-title">场地信息</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <lh-item label="空间名称：" label-width="auto">{{space.spaceName}}</lh-item>
          </el-col>
          <el-col :span="8">
            <lh-item label="场地名称：" label-width="auto">{{fieldInfo.fieldName}}</lh-item>
          </el-col>
          <el-col :span="8">
            <lh-item label="场地联系人：" label-width="auto">{{fieldInfo.contactName}}</lh-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <lh-item label="门店名称：" label-width="auto">{{store.storeName}}</lh-item>
          </el-col>
          <el-col :span="8">
            <lh-item label="场地类型：" label-width="auto">{{fieldInfo.typeName}}</lh-item>
          </el-col>
          <el-col :span="8">
            <lh-item label="联系方式：" label-width="auto">{{fieldInfo.contactTel}}</lh-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <lh-item label="场地地址：" label-width="70px">{{fieldAddress}}</lh-item>
          </el-col>
        </el-row>

        <div class="basics-title mt8">支付信息</div>
        <el-table border :data="tableData" class="width100">
          <el-table-column label="支付金额" :formatter="formatPrice"></el-table-column>
          <el-table-column label="支付时间" prop="payDate"></el-table-column>
          <el-table-column label="交易号" prop="transactionId"></el-table-column>
          <el-table-column label="支付方式" prop="payTypeText"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 10">未支付</span>
              <span v-else-if="scope.row.status === 20">已支付</span>
              <span v-else>已退款</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="senior-title mt24">优惠信息</div>
      <div class="card-body">
        <el-table border :data="couponInfo" class="width100">
          <el-table-column label="优惠券名称">
            <template slot-scope="scope">
              <template slot-scope="scope">
                <span>{{ scope.row.couponName }}</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="优惠券类型">
            <template slot-scope="scope">
              <span v-if="type === 1">小时券</span>
              <span v-if="type === 2">代金券</span>
            </template>
          </el-table-column>
          <el-table-column label="本次优惠金额">
            <template slot-scope="scope">
              <span>{{ scope.row.couponAmount }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="senior-title mt24">订单日志</div>
      <div class="card-body">
        <el-table border :data="orderLogs" class="width100">
          <el-table-column label="操作人">
            <template slot-scope="scope">
              <span v-if="scope.row.customerName">{{ scope.row.customerName }}</span>
              <span v-if="scope.row.supervisorName">{{ scope.row.supervisorName }}</span>
              <span v-if="!scope.row.supervisorName && !scope.row.customerName">-</span>
            </template>
          </el-table-column>
          <el-table-column label="操作时间">
            <template slot-scope="scope">
              <span>{{ scope.row.created }}</span>
            </template>
          </el-table-column>
          <el-table-column label="内容备注">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import { typeList } from '@/mixins/data'
  import { fieldOrderDetail } from '@/service/order'
  import fieldDetailMixins from './order-detail.mixins'

  export default {
    mixins: [fieldDetailMixins],
    components: {},
    data () {
      return {
        orderId: this.$route.query.id,
        dialogStatus: false,
        typeList,
        type: '',
        order: {}, // 订单基本信息
        station: {}, // 工位基本信息
        orderContact: {}, // 订单联系人信息
        orderPay: {}, // 订单支付信息
        fieldInfo: {}, // 场地信息
        store: {}, // 门店信息
        couponList: [], // 优惠券
        orderLogs: [], // 订单日志
        fieldAddress: '', // 场地地址
        space: {}, // 空间信息
        platformOrderField: {} // 预定日期
      }
    },
    props: {},
    watch: {},
    computed: {},
    created() {
      this.getPageData()
    },
    methods: {
      formatPrice(row, column) {
        return '￥ ' + row.payAmount
      },
      getPageData() {
        fieldOrderDetail({ id: this.orderId }).then(res => {
          if (res.status === 'true') {
            this.order = res.info.platformOrderDetail.platformOrder
            // this.platformOrderField = res.info.platformOrderDetail.platformOrderField
            this.orderContact = res.info.platformOrderDetail.platformOrderContact
            this.orderPay = res.info.platformOrderDetail.platformOrderPay
            this.fieldInfo = res.info.platformOrderDetail.fieldSnapshot
            this.store = res.info.platformOrderDetail.store
            this.orderLogs = res.info.platformOrderLogList
            this.couponInfo = res.info.couponInfo
            this.fieldAddress = res.info.platformOrderDetail.store.cityName + res.info.platformOrderDetail.store.districtName + res.info.platformOrderDetail.store.address
            this.space = res.info.platformOrderDetail.space
            if (!res.info.platformOrderDetail.platformOrderPay.payDate) {
              res.info.platformOrderDetail.platformOrderPay.payDate = '-'
            }
            if (!res.info.platformOrderDetail.platformOrderPay.transactionId) {
              res.info.platformOrderDetail.platformOrderPay.transactionId = '-'
            }
            if (!res.info.platformOrderDetail.platformOrderPay.payType) {
              res.info.platformOrderDetail.platformOrderPay.payType = '-'
            }
            if (res.info.platformOrderDetail.platformOrderPay.payType === 10) {
              res.info.platformOrderDetail.platformOrderPay.payTypeText = '现金支付'
            } else if (res.info.platformOrderDetail.platformOrderPay.payType === 20) {
              res.info.platformOrderDetail.platformOrderPay.payTypeText = '微信支付'
            }
            this.tableData.push(res.info.platformOrderDetail.platformOrderPay)

            for (let item of this.typeList) {
              if (this.fieldInfo.type === item.key) {
                this.fieldInfo.typeName = item.label
              }
            }

            if (this.fieldInfo.type === 1) {
              this.platformOrderField = res.info.platformOrderDetail.platformOrderField
              this.platformOrderField.reservationDate = res.info.platformOrderDetail.platformOrderField.bookDate
            } else if (this.fieldInfo.type === 2) {
              this.platformOrderField = res.info.platformOrderDetail.platformOrderRoadshowHall
              this.platformOrderField.reservationDate = res.info.platformOrderDetail.platformOrderRoadshowHall.bookDate
            } else if (this.fieldInfo.type === 3) {
              this.platformOrderField = res.info.platformOrderDetail.platformOrderStation
              this.platformOrderField.reservationDate = res.info.platformOrderDetail.platformOrderStation.bookStartDate + '～' + res.info.platformOrderDetail.platformOrderStation.bookEndDate
            } else if (this.fieldInfo.type === 4) {
              this.platformOrderField = res.info.platformOrderDetail.platformOrderOther
              this.platformOrderField.reservationDate = res.info.platformOrderDetail.platformOrderOther.bookDate
            }
          } else {
            this.setMsg('error', res.msg)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .order-field-detail {
    .order-status {
      margin-left: 10px;
    }
  }
</style>
