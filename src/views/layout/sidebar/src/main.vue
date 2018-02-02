<template>
  <el-menu
    :unique-opened="true"
    :default-active="$route.path"
    :collapse="!sidebar.opened"
    class="sidebar-box"
    mode="vertical"
    theme="light">
    <sidebar-item :routes='getAddRouters'></sidebar-item>
  </el-menu>
</template>

<script>
  import { mapGetters } from 'vuex'
  import sidebarItem from './sidebar-item'
  import { constantRouterMap } from '@/router/src/routes'
  export default {
    components: { sidebarItem },
    data () {
      return {}
    },
    computed: {
      ...mapGetters([
        'sidebar'
      ]),
      getAddRouters: function () {
        return constantRouterMap
      }
    },
    mounted () {
      // console.log('sidebar: ', this.getAddRouters)
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>

