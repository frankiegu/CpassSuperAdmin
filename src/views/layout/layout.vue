<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <div class="navbar-wrapper">
      <navbar></navbar>
    </div>

    <div class="main-container">
      <div class="sidebar-wrapper">
        <sidebar class="sidebar-container"></sidebar>
      </div>

      <section class="app-main mt60">
        <transition name="fade" mode="out-in">
          <router-view class="app-in" :key="key"></router-view>
        </transition>

        <p class="layout-footer theme-gray">Copyright © {{ year }} 广州雷猴软件开发有限公司</p>
      </section>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import navbar from './navbar'
  import sidebar from './sidebar'

  export default {
    components: { navbar, sidebar },
    data () {
      return {
        year: (new Date()).getFullYear()
      }
    },
    computed: {
      key () {
        return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
      },
      ...mapGetters([
        'sidebar'
      ])
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;

    .app-in {
      min-height: 80vh;
      min-width: 600px;
    }
    .layout-footer {
      padding: 0 16px;
      margin: 48px 0 24px;
      text-align: center;
    }
    &.hideSidebar {
      .sidebar-wrapper {
        transform: translate(-140px, 0);
        .sidebar-container {
          transform: translate(132px, 0);
        }
        &:hover {
          transform: translate(0, 0);
          .sidebar-container {
            transform: translate(0, 0);
          }
        }
      }
      .main-container {
        margin-left: 40px;
      }
    }
    .navbar-wrapper {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1001;
      // opacity: .9;
      width: 100%;
    }
    .sidebar-wrapper {
      width: 180px;
      position: fixed;
      top: 90px;
      bottom: 0;
      left: 0;
      z-index: 1001;
      overflow: hidden;
      transition: all .28s ease-out;
    }
    .sidebar-container {
      transition: all .28s ease-out;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: -18px;
      overflow-y: scroll;
    }
    .main-container {
      padding: 0 30px;
      min-height: 100%;
      transition: all .28s ease-out;
      margin-left: 180px;
    }
    .app-main {
      min-height: 90vh;
    }
  }
</style>
