<template>
  <div class="navbar-menu-box">
    <el-menu :default-active="activeIndex" text-color="#2d2f33" mode="horizontal">
      <el-submenu index="1">
        <template slot="title">
          <span class="fl user-name">酷雷托</span>
          <lh-svg :icon-class="'icon-member'" class="icon user-avatar fl ml5 mt5"></lh-svg>
        </template>

        <el-menu-item index="1-1" disabled>
          <lh-svg icon-class="icon-user"></lh-svg>
          <router-link to="/personal-info" tag="span">个人中心</router-link>
        </el-menu-item>

        <el-menu-item index="1-2" disabled>
          <lh-svg icon-class="icon-setting1"></lh-svg>
          <router-link to="/spatial-info" tag="span">设置</router-link>
        </el-menu-item>

        <el-menu-item index="1-3" @click="logout">
          <lh-svg icon-class="icon-logout"></lh-svg>
          <span>退出登录</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  import svg from '@/components/svg'
  export default {
    components: { [svg.name]: svg },
    data () {
      return {
        activeIndex: ' ',
        totalNum: 0,
        orderNum: 0
      }
    },
    methods: {
      logout () {
        this.$store.dispatch('logout').then(res => {
          this.$router.push({
            path: '/login',
            query: {
              redirect: this.$route.path
            }
          })
        })
      }
    }
  }
</script>
<style lang="scss">
  @import "src/styles/config";
  // 动态DOM的样式，ele自定义主题的方式实现，文件：styles/element-variables.scss
  .navbar-menu-box {
    .el-submenu__title:hover {
      background-color: $theme-sidebar !important;

      .svg-style {
        fill: $theme-black;
      }
    }
    .user-name {
      height: 40px;
      line-height: 40px;
    }
    .el-menu--horizontal .el-submenu .el-submenu__icon-arrow {
      display: none;
    }
    .el-submenu > .el-menu {
      left: auto!important;
      right: 0 !important;
    }
    .el-submenu .el-menu-item {
      padding: 0 20px !important;
      min-width: auto !important;
    }
    .el-submenu .el-submenu__icon-arrow {
      display: none;
    }
    .el-submenu__title {
      padding: 0 8px;
    }
    .el-submenu.is-active .el-submenu__title,
    .el-menu--horizontal,
    .el-submenu,
    .el-menu .el-menu-item,
    .el-menu .el-submenu__title {;
      height: 40px !important;
    }
  }
</style>
<style lang="scss" scoped>
  .navbar-menu-box {
    height: 40px;
    padding-top: 10px;

    .user-avatar2 {
      width: 25px;
      height: 25px;
      border-radius: 10px;
      vertical-align: middle;
    }
    .user-avatar {
      width: 25px;
      height: 25px;
      padding-top: 2.5px;
      padding-left: 3px;
      border-radius: 10px;
      vertical-align: middle;
    }
  }
</style>
