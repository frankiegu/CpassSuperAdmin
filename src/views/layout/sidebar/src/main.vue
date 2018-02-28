<template>
  <el-menu
    :unique-opened="true"
    :default-active="$route.path"
    :collapse="!sidebar.opened"
    :class="['sidebar-box', {hideSidebar:!sidebar.opened}]"
    mode="vertical"
    theme="light">

    <template v-for="item in getAddRouters">
      <router-link
        v-if="!item.hidden && item.noDropdown && item.children.length > 0"
        :to="item.redirect">

        <el-menu-item :index="item.redirect">
          <lh-svg v-if='item.icon' :iconClass="item.icon" class="icon"></lh-svg>

          <span slot="title">{{item.name}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu
        v-if="!item.noDropdown && !item.hidden"
        :index="item.name">

        <template slot="title">
          <lh-svg v-if="item.icon" :iconClass="item.icon" class="icon"></lh-svg>

          <span slot="title">{{item.name}}</span>
        </template>

        <template
          v-if='!child.hidden'
          v-for="child in item.children">

          <sidebar-item
            v-if='child.children && child.children.length>0'
            :routes='[child]'
            class='menu-indent'></sidebar-item>

          <router-link
            v-else
            class="menu-indent"
            :to="item.path+'/' + child.path">

            <el-menu-item :index="item.path+'/' + child.path">{{child.name}}</el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>

  </el-menu>
</template>

<script>
  import { mapGetters } from 'vuex'
  import svg from '@/components/svg'
  import { constantRouterMap } from '@/router/src/routes'
  export default {
    components: {
      [svg.name]: svg
    },
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

<style lang="scss">
  .sidebar-box {
    .el-submenu .el-menu-item {
      min-width: 180px;
    }
    &.hideSidebar {
      .el-submenu__icon-arrow {
        visibility: hidden !important;
      }
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  .sidebar-wrapper {
    .icon {
      width: 20px;
      height: 20px;
      color: #484c6a;
      vertical-align: -5.3px;
      padding-right: 10px;
    }
  }
</style>
