<template>
  <div>
    <template v-for="item in routes">
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
          <lh-svg v-if='item.icon' :iconClass="item.icon" class="icon"></lh-svg>

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
  </div>
</template>

<script>
  import svg from '@/components/svg'
  export default {
    components: { [svg.name]: svg },
    props: {
      routes: { type: Array }
    },
    mounted () {
      // console.log('sidebar-item: ', this.routes)
      // console.log('space: ', this.handleHasPermissions('/manage/field/list'));
    }
  }
</script>

<style lang="scss">
  .sidebar-wrapper {
    .el-submenu__icon-arrow {
      right: 20px;
    }
    .el-submenu .el-menu-item {
      min-width: 180px;
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
