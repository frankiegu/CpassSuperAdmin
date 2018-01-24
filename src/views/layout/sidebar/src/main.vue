<template>
  <el-menu class="sidebar-box" mode="vertical" :unique-opened="uniqueOpened" theme="light" :default-active="$route.path">
    <sidebar-item :routes='getAddRouters'></sidebar-item>
  </el-menu>
</template>

<script>
  import sidebarItem from './sidebar-item'
  import {constantRouterMap} from '@/router/src/routes'
  export default {
    components: { sidebarItem },
    computed: {
      getAddRouters: function () {
        return constantRouterMap
      }
    },
    data () {
      return {
        uniqueOpened: true
      }
    },
    mounted () {
    }
  }
</script>

<style lang="scss">
  .sidebar-box {
    .el-submenu .el-menu-item {
      min-width: 180px;
      padding-left: 51px !important;
      padding-right: 0 !important;
    }
    .el-menu {
      background-color: #fff !important;
    }
    .el-submenu .el-menu-item:hover, .el-menu-item.is-active, .el-submenu__title:hover {
      background-color: #F3F3F9
    }
    .app-wrapper .sidebar-container {
      right: 0 !important;
      overflow: auto !important;
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .sidebar-box {
    .el-menu {
      min-height: 100%;
    }
  }
</style>

