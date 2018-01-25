<template>
  <div>
    <template v-for="item in routes">
      <router-link
        v-if="!item.hidden && item.noDropdown && item.children.length > 0"
        :to="item.path">

        <el-menu-item :index="item.path">
          <lh-svg v-if='item.icon' :icon-class="item.icon" class="icon" />
          {{item.children[0].name}}
        </el-menu-item>
      </router-link>

      <el-submenu
        v-if="!item.noDropdown && !item.hidden"
        :index="item.name">

        <template slot="title">
          <!-- <router-link class="menu-indent db" :to="item.path"> -->
          <lh-svg v-if='item.icon' :icon-class="item.icon" class="icon" />
            {{item.name}}
          <!-- </router-link> -->
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
  export default {
    props: {
      routes: { type: Array }
    },
    mounted () {
      // console.log('sidebar-item: ', this.routes)
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .sidebar-wrapper {
    .svg-icon {
      margin-right: 15px;
    }
    .hideSidebar .menu-indent{
      display: block;
      text-indent: 10px;
    }
    .icon {
      width: 20px;
      height: 20px;
      color: #484c6a;
      vertical-align: -5.3px;
      padding-right: 10px;
    }
  }
  .el-submenu__title {
    padding-left: 18px !important;
  }
  .el-submenu__icon-arrow {
    right: 37px;
  }
  .iconfont {
    font-size: 24px;
    margin-right: 8px;
  }
  i {
    vertical-align: sub;
  }
</style>
