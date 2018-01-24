<template>
  <div class="navbar-menu-box">
    <el-menu :default-active="activeIndex" text-color="#2d2f33" mode="horizontal">
      <el-submenu class="mr15" index="1">
        <template slot="title">
          <lh-svg :iconClass="'icon-notice_icon'" class="icon user-avatar2 fl mt15"></lh-svg>

          <el-badge v-if="getMessageTotalNum > 0" :value="getMessageTotalNum" :max="99" class="item notice-style fl ml5"/>
        </template>

        <el-menu-item v-if="'/manage/order/orderList'" index="1-1">
          <router-link class='align-center' to="/order/booking">
            场地预约订单 <el-badge v-if="getMessageOrderNum > 0" :value="getMessageOrderNum" :max="99" class="mark ml5"/>
          </router-link>
        </el-menu-item>

        <!-- so-admin-v1.1暂不实现退款流程
          <el-menu-item index="2-2">
            <router-link class='inlineBlock' to="/finance/refund-approval">
              退款申请&nbsp;&nbsp;<el-badge class="mark" :value="12" />
            </router-link>
          </el-menu-item>
        -->
      </el-submenu>

      <el-submenu index="2">
        <template slot="title">
          <span class="fl">{{ name }}</span>
          <lh-svg :iconClass="'icon-member'" class="icon user-avatar fl ml5 mt15"></lh-svg>
        </template>

        <el-menu-item index="2-1">
          <router-link to="/personal-info">个人信息设置</router-link>
        </el-menu-item>

        <el-menu-item index="2-2">
          <router-link to="/spatial-info">空间信息设置</router-link>
        </el-menu-item>

        <el-menu-item @click="logout" index="2-3">退出登录</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  import svg from '@/components/svg'
  import {mapGetters, mapActions} from 'vuex'
  export default {
    components: {[svg.name]: svg},
    data () {
      return {
        activeIndex: '',
        totalNum: 0,
        orderNum: 0
      }
    },
    watch: {'$route': 'getMessager'},
    computed: {
      ...mapGetters([
        'name',
        'getMessageTotalNum',
        'getMessageOrderNum'
      ])
    },
    mounted () {
      // 当路由没有切换，在本页面刷新的时候，刷新一下消息接口
      this.getMessager()
    },
    methods: {
      ...mapActions({
        getMessager: 'getMessagerWay'
      }),
      logout () {
        this.$store.dispatch('logout').then(res => {
          this.$router.push({path: '/login', query: {redirect: this.$route.path}})
        })
      }
    }
  }
</script>
<style lang="scss">
  .navbar-menu-box {
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
      padding: 0 10px;
    }
    .el-menu--horizontal .el-menu-item:hover,
    .el-submenu .el-submenu__title:hover, {
      background-color: #F3F3F9;
    }
    .el-submenu.is-active .el-submenu__title {
      border-bottom: 0 !important;
    }
  }
</style>
<style lang="scss" scoped>
  .navbar-menu-box {
    .user-avatar2 {
      width: 25px;
      height: 25px;
      border-radius: 10px;
      vertical-align: middle;
      padding-top: 2.5px;
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
