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
        <tags-view v-if="!hideRouter"></tags-view>
        <transition name="fade" mode="out-in">
          <router-view class="app-in" :key="key"></router-view>
        </transition>
      </section>

      <!--可自定义按钮的样式、show/hide临界点、返回的位置  -->
      <!--如需文字提示，可在外部添加element的<el-tooltip></el-tooltip>元素  -->
      <el-tooltip placement="top" content="置顶" effect="light">
        <scrool-top
          transitionName="fade"
          :customStyle="myBackToTopStyle"
          :visibilityHeight="300"
          :backPosition="50"></scrool-top>
      </el-tooltip>

      <p class="layout-footer theme-gray">Copyright © {{ year }} 广州雷猴软件开发有限公司</p>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import navbar from './navbar'
  import tagsView from './components/tags-view'
  import levelbar from './navbar/src/levelbar'
  import sidebar from './sidebar'
  import scroolTop from '@/components/scrool-top'

  export default {
    components: { navbar, tagsView, levelbar, sidebar, scroolTop },
    data () {
      return {
        hideRouter: false,
        hideRouters: ['/500', '/not-permission', '/not-found'],
        myBackToTopStyle: {
          right: '50px',
          bottom: '50px',
          width: '40px',
          height: '40px',
          'border-radius': '4px',
          'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
          background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
        },
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
    },
    watch: {
      $route() {
        this.hideRouter = this.hideRouters.includes(this.$route.path)
      }
    },
    mounted() {
      this.hideRouter = this.hideRouters.includes(this.$route.path)
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/config";
  .app-wrapper {
    position: relative;
    min-height: 100vh;
    width: 100%;
    background-color: #f0f2f7;
    overflow: hidden;

    .layout-footer {
      padding: 0 16px;
      margin: 70px 0 24px;
      text-align: center;
    }
    &.hideSidebar {
      .sidebar-wrapper {
        width: 60px;
      }
      .main-container {
        margin-left: 60px;
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
      top: 60px;
      bottom: 0;
      left: 0;
      z-index: 1000;
      box-shadow: 1px 0 4px rgba(0,21,41,.08);
      overflow: hidden;

      .sidebar-container {
        width: 100%;
        height: 100%;
        overflow-y: auto;
      }
    }
    .main-container {
      /*padding: 0 30px;*/
      min-height: 100%;
      margin-left: 180px;
    }
    .app-in {
      min-height: 73vh;
    }
  }
</style>
