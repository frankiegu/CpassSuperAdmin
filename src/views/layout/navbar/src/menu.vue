<template>
  <div class="navbar-menu-box">
    <el-menu :default-active="activeIndex" mode="horizontal">
      <!-- <el-menu-item index="1" class="fr el-submenu__title">
        <screenfull class="svg-style"></screenfull>
      </el-menu-item> -->

      <!--<el-menu-item index="1" class="notice-item svg-box" @click="handleToggleMsgBar">-->
        <!--<lh-svg v-if="messageNum === 0" :iconClass="'icon-bells'" class="icon svg-style fl"/>-->
        <!--<el-badge v-if="messageNum > 0 && messageNum <= 99" :value="messageNum" :max="99" class="red-point">-->
          <!--<lh-svg :iconClass="'icon-bells'" class="icon svg-style fl"/>-->
        <!--</el-badge>-->
        <!--<el-badge v-if="messageNum > 99" :value="'···'" class="item red-point fl">-->
          <!--<lh-svg :iconClass="'icon-bells'" class="icon svg-style fl"/>-->
        <!--</el-badge>-->
      <!--</el-menu-item>-->

      <el-submenu index="2" class="profile-box">
        <template slot="title">
          <div class="avatar-cont">
            <img v-if="avatar" :src="avatar">
            <img v-else src="/static/images/default-logo.png">
          </div>
          <span class="fl user-name ml8">{{name}}</span>
        </template>

        <el-menu-item class="a-link" index="2-1">
          <router-link to="/system/profile">
            个人信息
          </router-link>
          <!--个人信息-->
        </el-menu-item>

        <!--<el-menu-item class="a-link" index="2-2" disabled>-->
          <!--&lt;!&ndash; <lh-svg icon-class="icon-setting1"></lh-svg> &ndash;&gt;-->
          <!--设置-->
        <!--</el-menu-item>-->

        <el-menu-item index="2-3" @click="logout" class="a-link">
          <!-- <lh-svg icon-class="icon-logout"></lh-svg> -->
          <span>退出登录</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import screenfull from './screenfull'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: { screenfull },
  data () {
    return {
      activeIndex: ' ',
      totalNum: 0,
      orderNum: 0
    }
  },
  watch: { '$route': 'closeMsgBar' },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'messageNum'
    ])
  },
  methods: {
    closeMsgBar() {
      this.handleToggleMsgBar('close')
    },
    ...mapActions({
      handleToggleMsgBar: 'toggleMsgBar'
    }),
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
@import "src/styles/common/var";
/* reset menu
 * 动态DOM的样式，ele自定义主题的方式实现，文件：styles/element-variables.scss
-------------------------- */
.navbar-menu-box {
  .user-name {
    height: 40px;
    line-height: 40px;
  }
  .el-menu--horizontal > .el-menu-item.is-active {
    border: 0;
  }
  .el-menu--horizontal {
    display: flex;
    align-items: center;

    .el-submenu .el-submenu__icon-arrow {
      display: none;
    }
  }
  .el-submenu > .el-menu {
    left: auto!important;
    right: 0 !important;
  }
  .el-submenu .el-submenu__icon-arrow {
    display: none;
  }
  .el-submenu__title, .el-menu-item {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 50px;
    height: 34px;
    line-height: 100%;
    border-radius: 2px;
    border-bottom: 0 !important;
    box-sizing: border-box;

    .svg-style {
      display: inline-block;
      width: 18px;
      height: 18px;
      vertical-align: middle;
      text-align: center;
    }
  }
  .profile-box .el-submenu__title{
    height: 40px;
    line-height: 40px;
  }

  .el-submenu__title:hover {
    background-color: $theme-sidebar !important;

    .svg-style {
      fill: $theme-black;
    }
  }

  .el-submenu .el-submenu__title,
  .el-menu--horizontal {
    border-bottom: 0 !important;
  }
  .el-menu--horizontal .el-menu-item a {
    display: block;
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
@import "src/styles/common/var";
.navbar-menu-box {
  height: 40px;
  margin: 12px 16px 0 0;

  .notice-item {
    &:focus, &:hover {
      background-color: #fff!important;
    }
  }
  .red-point sup {
    top: -2px;
    height: 14px;
    line-height: 14px;
    font-size: 12px;
    padding: 0 4px;
  }
  .avatar-cont {
    display: inline-block;
    border-radius: 50%;
    overflow: hidden;
    float: left;
    width: 24px;
    height: 24px;
    vertical-align: middle;
    background-color: $theme-black;
    text-align: center;
    line-height: 24px;

    span {
      color: #fff;
      font-size: 16px;
      font-weight: $font-bold;
    }
    img {
      width: 24px;
      height: 24px;
      vertical-align: top;
      border-radius: 50%;
    }
  }
  .lh-svg {
    fill: $theme-gray;
  }
}
</style>
