<template>
  <div class="client-account main-content">
    <lh-title
      title="账户信息"
      @downloadPdf="downloadPdf"></lh-title>

    <div class="detail-box" id="captureDom">
      <div class="detail-head">
        基础信息
        <el-button
          @click="sendMsg"
          icon="el-icon-bell"
          class="ml15"
          type="primary"
          size="mini">短信通知</el-button>
      </div>

      <div class="detail-content">
        <lh-item label="访问地址" label-width="180px" align="right">
          http://so.admin.symunity.cn/
        </lh-item>
        <lh-item label="登录账户" label-width="180px" con-width="280px" align="right">
          <span>{{ pagaData.tel }}</span>
          <el-button @click="showDialog('account')" class="fr mt4" type="primary" size="mini">重置账户</el-button>
        </lh-item>
        <lh-item label="登录密码" label-width="180px" con-width="280px" align="right">
          <!-- @#TODO 根据密码的长度，展示相同数量的* -->
          <span>***********</span>
          <el-button @click="showDialog('pwd')" class="fr mt4" type="primary" size="mini">重置密码</el-button>
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

            <a :href="qrUrl" :download="'公司名+二维码'" class="lh-button">
              <el-button
                icon="el-icon-download"
                class="mt10 download-qr"
                type="success"
                size="mini"
                width="120"
                height="28">下载二维码</el-button>
            </a>
          </lh-item>
        </div>
      </div>
    </div>

    <client-dialog
      :dialogStatus="dialogStatus"
      :type="type"
      :tel="pagaData.tel"
      @closeDialog="closeDialog"></client-dialog>
  </div>
</template>

<script>
  import accountMixins from './account.mixins'
  import ClientDialog from './components/dialog'
  import qrCode from 'vue-qrcode-component'
  import capturePdfMixins from '@/config/mixins/capture-pdf'
  export default {
    mixins: [accountMixins, capturePdfMixins],
    components: { qrCode, [ClientDialog.name]: ClientDialog },
    data () {
      return {
        dialogStatus: false,
        type: '',
        pagaData: {
          tel: '15989026006'
        },

        qrUrl: 'http://shared-office.oss-cn-shenzhen.aliyuncs.com/shared-office/img/20171128/20171128155642227pVi.jpg?x-oss-process=image/resize,m_lfit,h_80,w_80'
      }
    },
    props: {},
    watch: {},
    computed: {},
    mounted() {},
    methods: {
      downloadPdf() {
        // 第一个参数name: 客户名+账户信息
        // 第二个参数：下载的dom，id选择器
        this.capturePdf('连明堂')
      },
      closeDialog(status) {
        this.dialogStatus = status
        this.type = ''
      },
      showDialog(type) {
        this.type = type
        this.dialogStatus = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .client-account {
    .download-qr {
      width: 120px;
      height: 28px;
    }
  }
</style>
