<template>
  <el-menu class="components-navbar" mode="horizontal">
    <!--<router-link-->
      <!--:class="{'sidebar-close': !sidebar.opened}"-->
      <!--class="logo-box db" to="/" tag="a">-->
      <!--<img src="/static/images/default-logo.png">-->
      <!--<span>酷雷托总后台</span>-->
    <!--</router-link>-->
    <div
      :class="{'sidebar-close': !sidebar.opened}"
      class="logo-box db">
      <img src="/static/images/default-logo.png">
      <span>酷雷托总后台</span>
    </div>

    <!-- 给变化加上transition，效果好上很多 -->
    <transition name="fade" mode="out-in">
      <lh-svg
        @click.native="toggleSideBarWay"
        :iconClass="(sidebar.opened ? 'icon-menufold' : 'icon-menuunfold')"
        class="svg-icon hamburger hamburger-container" />
    </transition>

    <levelbar class="fl"></levelbar>

    <navbar-menu class="fr reset-menu mr30 el-menu-demo"></navbar-menu>
  </el-menu>
</template>

<script>
  import levelbar from './levelbar'
  import navbarMenu from './menu'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    components: { levelbar, navbarMenu },
    data () {
      return {}
    },
    computed: {
      ...mapGetters([
        'sidebar'
      ])
    },
    methods: {
      ...mapActions({
        toggleSideBarWay: 'toggleSideBar'
      })
    }
  }
</script>

<style lang="scss" scoped>
@import "src/styles/config";
  .components-navbar {
    border-radius: 0px !important;
    background-color: #ffffff;

    .lh-svg {
      fill: $theme-gray;
    }
    .hamburger {
      display: inline-block;
      cursor: pointer;
      width: 20px;
      height: 20px;
      transform: rotate(0deg);
      transition: .38s;
      transform-origin: 50% 50%;
    }
    .hamburger.is-active {
      // transform: rotate(90deg);
    }
    .logo-box {
      position: relative;
      width: 200px;
      height: 64px;
      line-height: 64px;
      float: left;
      margin-right: 17px;
      transition: width .28s;
      outline: none;
      overflow: hidden;

      @keyframes rainbow2 {
        0% {
          transform: rotate(-360deg);
          -ms-transform: rotate(-360deg);   /* IE 9 */
          -webkit-transform: rotate(-360deg); /* Safari and Chrome */
          -o-transform: rotate(-360deg);    /* Opera */
          -moz-transform: rotate(-360deg);    /* Firefox */
        }
        100% {
          transform: rotate(0deg);
          -ms-transform: rotate(0deg);   /* IE 9 */
          -webkit-transform: rotate(0deg); /* Safari and Chrome */
          -o-transform: rotate(0deg);    /* Opera */
          -moz-transform: rotate(0deg);    /* Firefox */
        }
      }
      @keyframes rainbow {
        0% {
          transform: rotate(0deg);
          -ms-transform: rotate(0deg);   /* IE 9 */
          -webkit-transform: rotate(0deg); /* Safari and Chrome */
          -o-transform: rotate(0deg);    /* Opera */
          -moz-transform: rotate(0deg);    /* Firefox */
        }
        100% {
          transform: rotate(-360deg);
          -ms-transform: rotate(-360deg);   /* IE 9 */
          -webkit-transform: rotate(-360deg); /* Safari and Chrome */
          -o-transform: rotate(-360deg);    /* Opera */
          -moz-transform: rotate(-360deg);    /* Firefox */
        }
      }
      img {
        float: left;
        width: 40px;
        height: 40px;
        margin: 12px 15px 0 18px;
        vertical-align: middle;
        border-radius: 50%;
        // animation: .5s rainbow2;
        transition: all ease .25s;
      }
      span {
        position: absolute;
        left: 70px;
        width: 110px;
        height: 42px;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;

        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #1C1C2F;
        letter-spacing: 0;
      }
    }
    .hamburger-container {
      line-height: 58px;
      width: 23px;
      height: 21px;
      float: left;
      margin-left: 6px;
      margin-top: 21.5px;
      transition: margin-left .28s ease-out;
      opacity: 0.65;
    }
    .sidebar-close {
      width: 64px;
      margin-right: 0;

      img {
        width: 30px;
        height: 30px;
        margin: 15px 7px;
        // animation: .5s rainbow;
      }
    }
    .hamburger-close {
      margin-left: 4px;
    }
  }
</style>
