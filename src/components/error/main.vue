<template>
  <div :class="classObject" class="error-style">
    <div :class="{'zoom': !isNoFound, 'no-found': this.isNoFound}">
      <img src="/static/images/no-found.png">

      <div :class="['con-box', {'com-style': isNoFound, '/not-found': !isNoFound}]">
        <div class="cont-title">{{ conTitle }}</div>

        <div class="third-party-login">
          <span :class="{'bgcfff': !isNoFound, 'bgc-gray': isNoFound}">{{ conDec }}</span>
          <div class="hr"></div>
        </div>

        <div class="count-time">
          <span class="theme-red">{{ countdown }}</span>&nbsp;s&nbsp;后自动返回首页
        </div>

        <router-link class="btn-link" to="/">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LhError',
    props: ['route', 'conTitle', 'conDec'],
    data () {
      return {
        empty: '',
        isNoFound: (this.$route.path === '/not-found'),
        classObject: {
          'mt90': (this.$route.path !== '/not-found'),
          'store-setting': (this.$route.path !== '/not-found'),
          'card-padding': (this.$route.path !== '/not-found')
        },
        countdown: 10,
        pagaData: null
      }
    },
    mounted () {
      if (this.$route.path === this.route) {
        this.settime()
      }
    },
    methods: {
      settime () {
        if (this.countdown === 0) {
          this.$router.replace({ path: '/' })

          this.countdown = 10
        } else {
          this.countdown--
          setTimeout(() => {
            // 如果输入错误的路哟与，就会跳转到当前404页面，
            // 这时，如果手动切换正确路由，就停止倒计时
            if (this.$route.path === this.route) {
              this.settime()
            }
          }, 1000)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .error-style {
    text-align: center;
    overflow: hidden;

    .no-found {
      position: absolute;
      top: 40%;
      left: 50%;
      font-size: 16px;
      margin: -300px 0 0 -350px;

      @media screen and (max-width: 1366px) {
        transform: scale(0.77);
      }
    }
    .zoom {
      width: 700px;
      margin: 60px auto 0;
      font-size: 16px;

      @media screen and (max-width: 1366px) {
        transform: scale(0.77);
        transform-origin: 50% 0;
      }
    }
    .com-style {
      @media screen and (min-width: 1366px) {
        padding-bottom: 110px;
      }
    }
    .con-box {
      .btn-link {
        width: 140px;
      }
      .count-time {
        margin: 40px 0 80px;

        span {
          vertical-align: text-bottom;
        }
      }
      .cont-title {
        color: $theme-blue;
        font-size: 25px;
        font-weight: 700;
        margin: 25px 0 70px;
      }
    }
    .third-party-login {
      position: relative;
      width: 700px;
      height: 20px;
      margin: 0 auto;

      span {
        position: absolute;
        left: 50%;
        z-index: 2;
        display: block;
        width: 340px;;
        margin-left: -170px;
        color: $theme-black;
        font-size: 16px;
        text-align: center;
      }
      .bgcfff {
        background-color: #fff;
      }
      .bgc-gray {
        background-color: #f0f2f7;
      }
      .hr {
        position: absolute;
        top: 50%;
        z-index: 0;
        width: 100%;
        height: 1px;
        background-color: #d1d1d1;
      }
    }
  }
</style>
