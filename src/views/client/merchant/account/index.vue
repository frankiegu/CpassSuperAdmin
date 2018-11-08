<template>
  <div class="client-account main-content">
    <lh-title
      :title="pagaData.brandName || '未知品牌' + '账户信息'"
      @downloadPdf="downloadPdf"></lh-title>

    <div class="content-body card-body" id="captureDom">
      <div class="basics-title">
        基础信息
        <!-- <el-button
          @click="sendMsg"
          icon="el-icon-bell"
          class="ml15"
          type="primary"
          size="mini">短信通知</el-button> -->
      </div>

      <lh-item label="访问地址：" label-width="auto">
        {{ pagaData.manageUrl }}
      </lh-item>
      <lh-item label="登录账户：" label-width="auto" con-width="350px">
        <span>{{ pagaData.username }}</span>
        <el-button @click="showDialog('account')" class="fr mt-3" type="primary" size="mini">重置账户</el-button>
      </lh-item>
      <lh-item label="登录密码：" label-width="auto" con-width="350px">
        <span class="dib pt3">***********</span>
        <el-button @click="showDialog('pwd')" class="fr mt-3" type="primary" size="mini">重置密码</el-button>
      </lh-item>

      <div class="lh-divider-horizontal mb32"></div>

      <div class="detail-box">
        <div class="basics-title"> 商户微信公众号 </div>

        <lh-item label="微信部署地址：" label-width="auto">
          {{ pagaData.wxUrl }}
        </lh-item>
        <lh-item label="二维码：" label-width="auto" label-height="171px">
          <qr-code
            :text="pagaData.wxUrl || ''"
            :size="120"
            class="qr-code"
            id="qrCode"
            error-level="L"></qr-code>

          <a @click="downQrImg" href="javascript:;" id="downloadQr">
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

    <client-dialog
      :dialogStatus="dialogStatus"
      :type="type"
      :tel="pagaData.username"
      :clientId="clientId"
      @closeDialog="closeDialog"
      @toggleAcc="val => pagaData.username = val"></client-dialog>
  </div>
</template>

<script>
  import accountMixins from './account.mixins'
  import clientDialog from '../components/dialog'
  import qrCode from 'vue-qrcode-component'
  import capturePdfMixins from '@/mixins/capture-pdf'
  import { accountInfo } from '@/service/client'

  export default {
    mixins: [accountMixins, capturePdfMixins],
    components: { qrCode, [clientDialog.name]: clientDialog },
    data () {
      return {
        clientId: this.$route.query.id,
        dialogStatus: false,
        type: '',
        pagaData: {
          username: '',
          spaceId: '',
          brandName: '',
          manageUrl: '',
          wxUrl: ''
        }
      }
    },
    props: {},
    watch: {},
    computed: {},
    mounted() {
      this.getPageData()
    },
    methods: {
      // 将base64图片构建成画布下载
      downQrImg() {
        // 获取base64的图片节点
        let img = document.getElementById('qrCode').getElementsByTagName('img')[0]
        // 构建画布
        let canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        canvas.getContext('2d').drawImage(img, 0, 0)
        // 构造url
        let url = canvas.toDataURL('image/png')

        // 构造a标签并模拟点击
        let downloadQr = document.getElementById('downloadQr')
        downloadQr.setAttribute('href', url)
        downloadQr.setAttribute('download', this.pagaData.brandName + '二维码.png')
      },
      getPageData() {
        accountInfo({ clientId: this.clientId }).then(res => {
          if (res.status === 'true') {
            let data = res.info
            this.pagaData = {
              username: data.username,
              spaceId: data.spaceId,
              brandName: data.brandName,
              manageUrl: data.manageUrl,
              wxUrl: data.wxUrl
            }
          } else {
            this.setMsg('error', res.msg)
          }
        })
      },
      downloadPdf() {
        // 第一个参数name: 客户名+账户信息
        // 第二个参数：下载的dom，默认<div id="captureDom"></div>
        let name = this.pagaData.brandName + '账户信息'
        this.capturePdf(name)
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
    .qr-code {
      height: 121px;
    }

    .download-qr {
      width: 120px;
      height: 28px;
    }
  }
</style>
