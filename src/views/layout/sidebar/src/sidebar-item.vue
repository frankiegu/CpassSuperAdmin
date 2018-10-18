<template>
  <div class="components-sidebar-wrapper">
    <template v-for="(item, key) in routes">
      <router-link
        :key="key"
        v-if="!item.hidden && item.noDropdown && item.children.length > 0
         && handleHasPermissions(item.ajaxPermissions)"
        :to="item.path">

        <el-menu-item :index="item.path">
          <lh-svg v-if='item.icon' :iconClass="item.icon" class="icon" /><span slot="title">{{item.children[0].name}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu
        :key="key"
        v-if="(item.hidden === 'development') || (!item.hidden && !item.noDropdown && handleHasPermissions(item.ajaxPermissions))"
        :index="item.name">
        <template slot="title">
          <lh-svg v-if='item.icon' :iconClass="item.icon" class="icon"></lh-svg>{{item.name}}
        </template>

        <template v-for="(child, idx2) in item.children"
                  v-if="(item.hidden === 'development') || (!child.hidden && handleHasPermissions(child.ajaxPermissions))">

          <router-link
            :key="idx2"
            v-if="child.path[0] === '/'"
            class="menu-indent"
            :to="child.path">

            <el-menu-item :index="item.path+'/' + child.path">{{child.name}}</el-menu-item>
          </router-link>

          <router-link
            v-else
            :key="idx2"
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
    console.log('sidebar-item: ', this.routes)
    // console.log('space: ', this.handleHasPermissions('/manage/field/list'));
  }
}
</script>

<style lang="scss">
@import "src/styles/config";
.components-sidebar-wrapper {
  .el-menu-item {
    height: 50px;
    line-height: 50px;

    &.is-active {
      .icon {
        fill: $theme-blue;
      }
    }
  }
  .el-menu-item, .el-submenu__title {
    transition: all ease .25s;

    &:hover {
      color: $theme-blue;

      i {
        color: $theme-blue;
      }
      .icon {
        fill: $theme-blue;
      }
    }
  }
  .el-menu-item:hover, .el-menu-item:focus {
    color: $theme-blue;
    background-color: $theme-sidebar;
  }
  .el-submenu__icon-arrow {
    right: 20px;
  }
  .el-submenu .el-menu-item {
    min-width: 180px;
  }
}
.hideSidebar {
  .components-sidebar-wrapper {
    .el-menu-item, .el-submenu__title {
      padding: 0 14px !important;

      .el-tooltip {
        padding: 0 14px !important;
      }
    }
    .el-submenu__icon-arrow {
      display: none;
    }
    .lh-svg {
      margin-right: 14px;
    }
  }
}
.el-menu--popup .el-menu-item {
  height: 45px;
  line-height: 45px;
}
</style>
<style lang="scss" scoped>
@import "src/styles/config";
.components-sidebar-wrapper {
  .icon {
    width: 18px;
    height: 18px;
    fill: $theme-gray;
    margin-right: 12px;
    vertical-align: -0.3em;
  }
}
</style>
