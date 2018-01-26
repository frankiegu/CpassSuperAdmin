<template>
  <div class="client-account main-content">
    <lh-title title="账户信息"></lh-title>

    <div class="detail-box">
      <div class="detail-head">
        基础信息
        <el-button class="ml10" type="primary" size="mini">短信通知</el-button>
      </div>

      <div class="detail-content">
        <lh-item label="优惠券名称" label-width="180px" align="right">
          http://so.admin.symunity.cn/
        </lh-item>
        <lh-item label="登录账户" label-width="180px" con-width="280px" align="right">
          <span>13685974123</span>
          <el-button class="fr mt4" type="primary" size="mini">重置账户</el-button>
        </lh-item>
        <lh-item label="登录密码" label-width="180px" con-width="280px" align="right">
          <span>***********</span>
          <el-button class="fr mt4" type="primary" size="mini">重置密码</el-button>
        </lh-item>
      </div>

      <div class="detail-box">
        <div class="detail-head"> 客户微信公众号 </div>

        <div class="detail-content">
          <lh-item label="微信部署地址" label-width="180px" align="right">
            http://so.admin.symunity.cn/
          </lh-item>
          <lh-item label="二维码" label-width="180px" align="right">
            <qr-code
              :text="qrUrl"
              :size="120"
              class="pt10 qr-code"
              error-level="L"></qr-code>

            <lh-button
              :href="qrUrl"
              title="公司名+二维码"
              text="下载二维码"
              width="120"
              height="28"
              class="mt10"></lh-button>
          </lh-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import qrCode from 'vue-qrcode-component'
  export default {
    mixins: [],
    components: { qrCode },
    data () {
      return {
        qrUrl: 'http://shared-office.oss-cn-shenzhen.aliyuncs.com/shared-office/img/20171128/20171128155642227pVi.jpg?x-oss-process=image/resize,m_lfit,h_80,w_80'
      }
    },
    props: {},
    watch: {},
    computed: {},
    mounted() {},
    methods: {}
  }
</script>

<style lang="scss" scoped>
  .client-account {
  }
</style>
