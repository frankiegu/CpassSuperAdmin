<template>
  <div class="main-content client-detail">
    <lh-title :title="dataForm.name" :level2="false"></lh-title>

    <div class="card-padding card-padding-vertical">
      <el-form label-width="180px" :model="dataForm">
        <!-- 基础信息 -->
        <h3 class="grid-title">基础信息</h3>
        <base-info :model-form="dataForm" info-type="detail"></base-info>

        <!-- 如该客户未开通账户，则“产品信息”和“客户微信服务号资料”内容隐藏 -->
        <div v-if="dataForm.isCreateAccount">
          <!-- 产品信息 -->
          <h3 class="grid-title">产品信息</h3>
          <el-form-item label="产品版本"><p class="theme-red">{{dataForm.product}}</p></el-form-item>

          <el-form-item label="有效期">
            <p v-if="dataForm.isPermanent" class="theme-red">永久</p>
            <p class="theme-red" v-else>{{dataForm.startTime}} 至 {{dataForm.endTime}}</p>
          </el-form-item>

          <el-form-item label="使用状态">
            <p class="theme-red">{{dataForm.useStatus === 1 ? '正常' : '停用'}}</p>
          </el-form-item>

          <el-form-item label="支付功能">
            <p class="theme-red">{{dataForm.isOpenPayment ? '已开通' : '关闭'}}</p>
          </el-form-item>

          <!-- 客户微信服务号资料 -->
          <h3 class="grid-title">客户微信服务号资料</h3>
          <el-form-item label="客户服务号AppID"><p>{{dataForm.appId}}</p></el-form-item>
          <el-form-item label="客户服务号AppSecret"><p>{{dataForm.appSecret}}</p></el-form-item>
          <!-- 如没有开通支付，则无mch_id和key信息 -->
          <el-form-item label="客户服务号mch_ID" v-if="dataForm.isOpenPayment"><p>{{dataForm.mchId}}</p></el-form-item>
          <el-form-item label="客户服务号key" v-if="dataForm.isOpenPayment"><p>{{dataForm.serviceKey}}</p></el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import baseInfo from './components/base-info'
  export default {
    name: 'detail',
    data() {
      return {
        clientId: this.$route.query.id,
        dataForm: {
          // 客户基础信息
          name: '广州雷猴软件开发有限公司',
          contact: 'PN',
          phone: '13566666666',
          email: '13566666666@163.com',
          address: '广东省广州市天河区天河北路233号中信广场3708室',
          weixin: 'gzleihou',
          remark: '汇聚青春，集结创意',
          saleManager: '黄兴镇',
          isCreateAccount: true,

          // 开通账户信息
          product: '完整版',
          startTime: '2017-12-25', // 有效期开始时间
          endTime: '2018-12-24', // 有效期结束时间
          isPermanent: false, // 是否永久有效
          useStatus: 1,
          appId: 'e2r22g44asg4g4g',
          appSecret: 'g44syy5setwyg5g54',

          // 开通微信支付功能
          isOpenPayment: true,
          mchId: 'faaaaaageagea', // 客户服务号mch_ID
          serviceKey: 'daegahikljldajigjaie' // 客户服务号key
        }
      }
    },
    props: {},
    components: {baseInfo},
    mounted() {
      this.handleGetDetail()
    },
    watch: {},
    computed: {},
    filters: {},
    methods: {
      // 获取客户详情
      handleGetDetail() {
        let obj = {id: this.clientId}
        console.log(obj)
      }
    }
  }
</script>

<style lang="scss" scoped></style>
