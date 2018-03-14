<template>
  <div class="order-field-detail">
    <lh-title :title="'单号：'+order.orderNum"></lh-title>

    <div class="page-title-info">
      <el-row>
        <el-col :span="16">
          <el-row :gutter="20">
            <el-col :span="8">
              <lh-item label="生成时间：" label-width="auto">{{order.created}}</lh-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <lh-item label="预定人：" label-width="auto">{{orderContact.name}}</lh-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <lh-item label="联系方式：" label-width="auto">{{orderContact.telephone}}</lh-item>
            </el-col>

            <el-col :span="8">
              <lh-item label="预约号：" label-width="auto" v-if="order.checkInNum">{{order.checkInNum}}</lh-item>
            </el-col>
          </el-row>
        </el-col>

        <div class="page-title-right">
          <div class="p-item">
            <div class="theme-gray">状态</div>
            <!--5=待支付,10=待使用, 20=已使用, 30=已取消, 40=待退款, 50=已退款-->
            <div class="p-con" v-if="order.status === 5">待支付</div>
            <div class="p-con" v-if="order.status === 10">待使用</div>
            <div class="p-con" v-if="order.status === 20">已使用</div>
            <div class="p-con" v-if="order.status === 30">已取消</div>
            <div class="p-con" v-if="order.status === 40">待退款</div>
            <div class="p-con" v-if="order.status === 50">已退款</div>
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
            <lh-item label="空间名称：" label-width="auto">壹空间</lh-item>
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
        <el-table :data="tableData" class="width100">
          <el-table-column label="支付金额" prop="payAmount"></el-table-column>
          <el-table-column label="支付时间" prop="payDate"></el-table-column>
          <el-table-column label="交易号" prop="transactionId"></el-table-column>
          <el-table-column label="支付方式" prop="payType"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <!--5=待支付,10=待使用, 20=已使用, 30=已取消, 40=待退款, 50=已退款-->
              <span v-if="scope.row.status === 10">未支付</span>
              <span v-else-if="scope.row.status === 20">已支付</span>
              <span v-else>已退款</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="senior-title mt24">订单日志</div>
      <div class="card-body">
        <el-table :data="orderLogs" class="width100">
          <el-table-column label="操作人" prop="customerName"></el-table-column>
          <el-table-column label="操作时间" prop="created"></el-table-column>
          <el-table-column label="内容备注" prop="action"></el-table-column>
          <!--</el-table-column>-->
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import { fieldOrderDetail } from '@/service/order'
  import fieldDetailMixins from './field-detail.mixins'

  export default {
    mixins: [fieldDetailMixins],
    components: {},
    data () {
      return {
        orderId: this.$route.query.id,
        dialogStatus: false,
        type: '',
        order: {}, // 订单基本信息
        orderContact: {}, // 订单联系人信息
        orderPay: {}, // 订单支付信息
        fieldInfo: {}, // 场地信息
        store: {}, // 门店信息
        orderLogs: [], // 订单日志
        fieldAddress: '', // 场地地址
        pagaData: {
          username: '1231111111111',
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
    created() {
      this.getPageData()
    },
    methods: {
      getPageData() {
        fieldOrderDetail({ id: this.orderId }).then(res => {
          if (res.status === 'true') {
            let data = res.info
            this.order = res.info.order
            this.orderContact = res.info.orderContact
            this.orderPay = res.info.orderPay
            this.fieldInfo = res.info.fieldSnapshot
            this.store = res.info.store
            this.orderLogs = res.info.orderLogs
            this.fieldAddress = res.info.store.cityName + res.info.store.districtName + res.info.store.address
            if (!res.info.orderPay.payDate) {
              res.info.orderPay.payDate = '-'
            }
            if (!res.info.orderPay.transactionId) {
              res.info.orderPay.transactionId = '-'
            }
            if (!res.info.orderPay.payType) {
              res.info.orderPay.payType = '-'
            }
            this.tableData.push(res.info.orderPay)
            if (this.fieldInfo.type === 1) {
              this.fieldInfo.typeName = '会议室'
            } else if (this.fieldInfo.type === 2) {
              this.fieldInfo.typeName = '路演厅'
            } else if (this.fieldInfo.type === 3) {
              this.fieldInfo.typeName = '工位'
            }
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .order-field-detail {
  }
</style>
