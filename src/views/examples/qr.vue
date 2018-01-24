<template>
  <div id="app">
    <qr-code :text="textUrl"></qr-code>
  </div>
</template>

<script>
  import qrCode from 'vue-qrcode-component'
  export default {
    components: {
      qrCode
    },
    name: 'app',
    data () {
      return {
        textUrl: 'https://www.baidu.com'
      }
    }
  }
</script>
