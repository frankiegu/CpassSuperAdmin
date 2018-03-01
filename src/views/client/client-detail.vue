<template>
  <div class="main-content client-detail">
    <lh-title :title="dataForm.name" :level2="false">
      <el-button size="mini" plain class="mr10 fr">
        <router-link v-if="isCreateAccount" :to="'/client/modify?id=' + clientId">编辑</router-link>
        <router-link :to="'/client/add?id=' + clientId" v-else>编辑</router-link>
      </el-button>
    </lh-title>

    <div class="card-padding card-padding-vertical">
      <el-form label-width="180px" :model="dataForm">
        <!-- 基础信息 -->
        <h3 class="grid-title">基础信息</h3>
        <base-info :model-form="dataForm" info-type="detail"></base-info>

        <!-- 如该客户未开通账户，则“产品信息”和“客户微信服务号资料”内容隐藏 -->
        <div v-if="isCreateAccount">
          <!-- 产品信息 -->
          <h3 class="grid-title">产品信息</h3>
          <el-form-item label="产品版本"><p class="theme-red">{{dataForm.productName}}</p></el-form-item>

          <el-form-item label="有效期">
            <p v-if="!!dataForm.isPermanent" class="theme-red">永久</p>
            <p class="theme-red" v-else>{{dataForm.productStartDate | formatTime}} 至 {{dataForm.productEndDate | formatTime}}</p>
          </el-form-item>

          <el-form-item label="使用状态">
            <p class="theme-red">{{dataForm.productStatus === 1 ? '正常' : '停用'}}</p>
          </el-form-item>

          <el-form-item label="支付功能">
            <p class="theme-red">{{dataForm.spaceWeixinPayStatus ? '已开通' : '关闭'}}</p>
          </el-form-item>

          <!-- 客户微信服务号资料 -->
          <h3 class="grid-title">客户微信服务号资料</h3>
          <el-form-item label="客户服务号AppID"><p class="label-content">{{dataForm.appId}}</p></el-form-item>
          <el-form-item label="客户服务号AppSecret"><p class="label-content">{{dataForm.appSecret}}</p></el-form-item>
          <!-- 如没有开通支付，则无mch_id和key信息 -->
          <el-form-item label="客户服务号mch_ID" v-if="dataForm.spaceWeixinPayId"><p class="label-content">{{dataForm.mchId}}</p></el-form-item>
          <el-form-item label="客户服务号key" v-if="dataForm.spaceWeixinPayId"><p class="label-content">{{dataForm.mchKey}}</p></el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import baseInfo from './components/base-info'
  import { clientDetail } from '@/service'
  export default {
    name: 'detail',
    data() {
      return {
        clientId: this.$route.query.id,
        isCreateAccount: true,
        dataForm: {
          // 客户基础信息
          name: '',
          contact: '',
          phone: '',
          email: '',
          address: '',
          weixin: '',
          remark: '',
          saleManager: '',

          // 开通账户信息
          productName: '',
          productStartDate: '', // 有效期开始时间
          productEndDate: '', // 有效期结束时间
          isPermanent: 0, // 是否永久有效
          productStatus: 1,
          appId: '',
          appSecret: '',

          // 开通微信支付功能
          spaceWeixinPayStatus: 0,
          spaceWeixinPayId: '',
          mchId: '', // 客户服务号mch_ID
          mchKey: '' // 客户服务号key
        }
      }
    },
    props: {},
    components: { baseInfo },
    mounted() {
      this.handleGetDetail()
    },
    watch: {},
    computed: {},
    filters: {
      formatTime(time) {
        if (!time) return ''
        return time.split(' ')[0] // 保留至日期
        // return time.replace(/:\d{2}$/, '') // 保留至分钟
      }
    },
    methods: {
      // 获取客户详情
      handleGetDetail() {
        let obj = { clientId: this.clientId }
        clientDetail(obj).then(res => {
          if (res.status === 'true' && res.info) {
            this.dataForm = res.info
            this.isCreateAccount = !!res.info.productId
          } else {
            this.$message.error(res.msg | '暂无数据')
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .client-detail {
    .label-content{
      word-break: break-all;
    }
  }
</style>
