<template>
  <el-menu class="navbar" mode="horizontal">
    <router-link
      :class="{'sidebar-close': !sidebar.opened}"
      class="logo-box db"
      tag="a"
      to="/">

      <img src="/static/images/login-logo.png">
      <span>酷雷托智能空间总管理后台</span>
    </router-link>

    <div @click="toggleSideBarWay" class="outline-none">
      <lh-svg
        :iconClass="(sidebar.opened ? 'icon-menufold' : 'icon-menuunfold')"
        class="svg-icon hamburger hamburger-container"></lh-svg>
    </div>

    <levelbar></levelbar>

    <screenfull class="fr"></screenfull>
  </el-menu>
</template>

<script>
  import levelbar from './levelbar'
  import screenfull from './screenfull'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    components: { levelbar, screenfull },
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

<style lang="scss">
  .navbar {
    .app-levelbar.el-breadcrumb {
      line-height: 60px !important;
    }
  }
</style>
<style lang="scss" scoped>
  .navbar {
    height: 60px;
    line-height: 60px;
    border-radius: 0px !important;
    background-color: #ffffff;

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
      width: 180px;
      height: 60px;
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
        margin: 10px 7px 0 13px;
        vertical-align: middle;
        border-radius: 50%;
        animation: .5s rainbow2;
      }
      span {
        position: absolute;
        left: 60px;
        width: 120px;
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
    .sidebar-close {
      width: 60px;
      margin-right: 0;

      img {
        margin-left: 10px;
        animation: .5s rainbow;
      }
    }
    .hamburger-container {
      line-height: 58px;
      width: 25px;
      height: 21px;
      float: left;
      margin-left: 9px;
      margin-top: 19px;
      transition: margin-left .28s ease-out;
    }
  }
</style>
