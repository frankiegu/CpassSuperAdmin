<template>
  <div class="lh-layout" :class="{hideSidebar:!sidebar.opened}">
    <div class="lh-navbar"> <navbar /> </div>

    <div class="lh-content">
      <div class="lh-sidebar"> <sidebar class="lh-sidebar-box" /> </div>
      <section class="lh-main">
        <!-- <tags-view v-if="!hideRouter"></tags-view> -->
        <tags-view></tags-view>

        <transition name="fade" mode="out-in">
          <router-view class="lh-main-box" :key="key"></router-view>
        </transition>

        <p class="lh-footer theme-light-gray">
          <!-- 链接没有下划线和颜色高亮  -->
          Copyright © {{ year }} <a class="theme-light-gray" href="http://www.gzleihou.cn/#/home" target="_blank">广州雷猴软件开发有限公司<br />
          www.gzleihou.cn</a>
        </p>
      </section>

      <!--可自定义按钮的样式、show/hide临界点、返回的位置  -->
      <!--如需文字提示，可在外部添加element的<el-tooltip></el-tooltip>元素  -->
      <el-tooltip placement="top" content="置顶">
        <scrool-top
          transitionName="fade"
          :customStyle="myBackToTopStyle"
          :visibilityHeight="300"
          :backPosition="50"></scrool-top>
      </el-tooltip>
    </div>
    <messagebar />

    <el-dialog
      title="提示"
      :visible.sync="logoutStatus"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="30%">
      <span>{{ logoutPrompt }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmLogout">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import navbar from './navbar'
import sidebar from './sidebar'
import { scroolTop } from '@/components'
import tagsView from './components/tags-view'
import messagebar from './messagebar'

export default {
  components: { navbar, sidebar, scroolTop, tagsView, messagebar },
  data () {
    return {
      // hideRouter: false,
      // hideRouters: ['/500', '/401', '/404'],
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
      'sidebar',
      'logoutStatus',
      'logoutPrompt'
    ])
  },
  watch: {
    $route() {
      // this.hideRouter = this.hideRouters.includes(this.$route.path)
    }
  },
  mounted() {
    // this.hideRouter = this.hideRouters.includes(this.$route.path)
  },
  methods: {
    ...mapActions([
      'setLogoutStatus'
    ]),
    // 点击确定，退出登录
    confirmLogout() {
      // 去掉弹窗
      this.setLogoutStatus(false)

      // 退出登录，到登录页面
      this.$store.dispatch('logout').then(res => {
        this.$router.push({
          path: '/login',
          query: { redirect: this.$route.path }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/styles/config';
.lh-layout {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background-color: $bgc;
  overflow: hidden;

  /* @#issue低级的自适应方法，今后有空需要改成flex布局 */
  .lh-footer {
    position: absolute;
    left: 50%;
    bottom: 24px;
    width: 284px;
    line-height: 21px;
    margin-left: -142px;
    text-align: center;
  }
  &.hideSidebar {
    .lh-content {
      margin-left: 44px;
    }
    .lh-sidebar {
      width: 44px;
    }
  }
  .lh-sidebar {
    width: 200px;
    position: fixed;
    z-index: 1000;
    top: 64px;
    bottom: 0;
    left: 0;
    box-shadow: 1px 0 4px rgba(0,21,41,.08);
    overflow: hidden;

    .lh-sidebar-box {
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
  .lh-content {
    min-height: 100vh;
    margin-left: 200px;

    .lh-main {
      min-height: 100vh;
      padding: 64px 0 116px;
      position: relative;
      box-sizing: border-box;
    }
    .lh-main-box {
    }
  }
  .lh-navbar {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1001;
    width: 100%;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  }
}
</style>
