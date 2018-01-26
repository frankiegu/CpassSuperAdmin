<template>
  <div class="client-account main-content">
    <lh-title title="账户信息"></lh-title>

    <div class="detail-box">
      <div class="grid-title">
        基础信息
        <!-- <el-button class="ml10" type="primary" size="mini">短信通知</el-button> -->
      </div>

      <div class="detail-content">
        <qr-code
          :text="qrUrl"
          :size="80"
          error-level="L"></qr-code></div>

        <a
          :href="qrUrl"
          download="公司名+二维码">下载二维码</a>
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
