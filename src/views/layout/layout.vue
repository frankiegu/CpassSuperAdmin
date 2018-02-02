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
  import { mapGetters } from 'vuex'
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
      min-height: 77vh;
    }
    .layout-footer {
      padding: 0 16px;
      margin: 70px 0 24px;
      text-align: center;
    }
    &.hideSidebar {
      .sidebar-wrapper {
        left: -10px;
        width: 50px;
      }
      .main-container {
        margin-left: 40px;
      }
      .sidebar-wrapper {
        width: 50px;
      }
    }
    .navbar-wrapper {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1001;
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

      .sidebar-container {
        width: 100%;
        height: 100%;
        overflow-y: auto;
      }
    }
    .main-container {
      padding: 0 30px;
      min-height: 100%;
      margin-left: 180px;
    }
    .app-main {
      min-height: 88vh;
    }
  }
</style>
