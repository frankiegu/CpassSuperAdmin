<template>
  <div class="service-detail main-content">
    <lh-title></lh-title>
    <div class="card-padding card-padding-vertical">
      <h3 class="grid-title">基础信息</h3>
      <el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <lh-item label="订单号：" label-width="auto" class="custom-label">{{orderData.orderNum}}
              <el-tag v-if="orderData.orderStatus===1" type="primary" style="vertical-align: middle">待接单</el-tag>
              <el-tag v-else type="success" style="vertical-align: middle">已接单</el-tag>
            </lh-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <lh-item label="联系人：" label-width="auto">{{orderData.contact}}</lh-item>
            <lh-item label="生成时间：" label-width="auto">{{orderData.createDate}}</lh-item>
            <lh-item label="意向内容：" label-width="auto" v-if="orderData.content">{{orderData.content}}</lh-item>
          </el-col>
          <el-col :span="8">
            <lh-item label="联系方式：" label-width="auto">{{orderData.phone}}</lh-item>
          </el-col>
        </el-row>
      </el-row>

      <h3 class="grid-title">服务信息</h3>
      <el-row>
        <el-col :span="10">
          <lh-item label="服务名称：" label-width="auto">{{orderData.serviceName}}</lh-item>
          <lh-item label="服务商：" label-width="auto">{{orderData.providerName}}</lh-item>
          <lh-item label="服务联系人：" label-width="auto">{{orderData.providerContact}}</lh-item>
        </el-col>
        <el-col :span="8">
          <lh-item label="服务类型：" label-width="auto">{{orderData.typeName}}</lh-item>
          <lh-item label="关联品牌：" label-width="auto">{{orderData.spaceName}}</lh-item>
          <lh-item label="联系方式：" label-width="auto">{{orderData.providerPhone}}</lh-item>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { serviceOrderDetail } from '@/service/order'
  export default {
    name: 'service-detail',
    data() {
      return {
        orderId: this.$route.query.id,
        orderData: {
          orderNum: 'CS5859303344',
          orderStatus: 0,
          contact: '邓先生',
          createDate: '2018-03-06 15:09:35',
          intentionCon: '这里是客户的意向内容这里是客户的意向内容',
          phone: '13760886805',
          name: '小微企业待办服务',
          supplier: '广东金冠财税会计事务所',
          supplierContact: '邓先生',
          serviceType: '企业财税',
          relativeSpace: '矢量品牌',
          supplierPhone: '13566666666'
        }
      }
    },
    props: {},
    components: {},
    mounted() {},
    watch: {},
    computed: {},
    filters: {},
    methods: {
      getOrderDetail () {
        serviceOrderDetail({ orderId: this.orderId }).then(res => {
          if (res.status === 'true') {
            this.orderData = res.info
          }
        })
      }
    },
    created () {
      this.getOrderDetail()
    }
  }
</script>

<style lang="scss">
  .service-detail {
    .custom-label.detail-item {
      .label, .label-con {
        font-size: 18px;
        line-height: 28px;
      }
    }
  }
</style>
