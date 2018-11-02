<template>
  <div class="main-content client-detail">
    <lh-title :title="dataForm.name" :level2="false">
      <el-button size="mini" class="mr10 fr" type="primary">
        <router-link v-if="isCreateAccount" :to="'/client/modify?id=' + clientId">编辑</router-link>
        <router-link :to="'/client/add?id=' + clientId" v-else>编辑</router-link>
      </el-button>
    </lh-title>

    <div class="card-padding card-padding-vertical">
      <el-form label-width="160px" :model="dataForm" label-position="left">
        <!-- 如该客户未开通账户，则“签约信息”和“客户微信服务号资料”内容隐藏 -->
        <el-row :gutter="40">
          <!-- 基础信息 -->
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <h3 class="grid-title">基础信息</h3>
            <base-info :model-form="dataForm" info-type="detail"></base-info>
          </el-col>

          <!-- 签约信息 -->
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="isCreateAccount">
            <h3 class="grid-title">签约信息</h3>
            <el-form-item label="签约版本"><p class="theme-red">{{dataForm.productName}}</p></el-form-item>

            <el-form-item label="有效期">
              <p v-if="!!dataForm.isPermanent" class="theme-red">永久</p>
              <p class="theme-red" v-else>
                {{dataForm.productStartDate | formatTime}} 至 {{dataForm.productEndDate | formatTime}}</p>
            </el-form-item>

            <el-form-item label="服务费比例">
              <p>{{dataForm.serviceFeeProportion + '%'}}</p>
            </el-form-item>

            <el-form-item label="结算周期">
              <p>{{+dataForm.settlementCycle === 1 ? '固定日期 ' + '' : '周期结算 '}}
                <span>{{+dataForm.settlementCycle === 1 ? '每月 ' : '每 '}}</span>
                <span class="theme-red">{{dataForm.settlementDate}}</span>
                <span>{{+dataForm.settlementCycle === 1 ? '日' : dataForm.settlementCycleTypeName}}</span>
              </p>
            </el-form-item>

            <el-form-item label="结算方式">
              <div>{{'转账至' + dataForm.settlementTypeName}}
                <p class="theme-red">{{dataForm.bankCardNum || dataForm.weixinPayNum || dataForm.aliPayNum}}</p>
                <p v-if="+dataForm.settlementType === 3">{{dataForm.bank}}</p>
              </div>
            </el-form-item>

            <el-form-item label="使用状态">
              <p class="theme-red">{{dataForm.productStatus === 1 ? '正常' : '停用'}}</p>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="40" v-if="isCreateAccount">
          <!-- 开通公众服务号 -->
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <h3 class="grid-title">公众号</h3>
            <el-form-item label="公众服务号">
              <p class="theme-red">{{dataForm.appId ? '已开通' : '关闭'}}</p>
            </el-form-item>

            <div v-if="dataForm.appId">
              <el-form-item label="客户服务号AppID"><p class="label-content">{{dataForm.appId}}</p></el-form-item>
              <el-form-item label="客户服务号AppSecret"><p class="label-content">{{dataForm.appSecret}}</p></el-form-item>
            </div>
          </el-col>

          <!-- 开通微信支付功能 -->
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <h3 class="grid-title">微信支付</h3>
            <el-form-item label="支付功能">
              <p class="theme-red">{{dataForm.spaceWeixinPayStatus ? '已开通' : '关闭'}}</p>
            </el-form-item>

            <!-- 如没有开通支付，则无mch_id和key信息 -->
            <el-form-item label="客户服务号mch_ID" v-if="dataForm.mchId">
              <p class="label-content">{{dataForm.mchId}}</p>
            </el-form-item>
            <el-form-item label="客户服务号key" v-if="dataForm.mchKey">
              <p class="label-content">{{dataForm.mchKey}}</p>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
  import baseInfo from '../components/base-info'
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

    .el-form-item p {
      line-height: 32px;
    }
  }
</style>
