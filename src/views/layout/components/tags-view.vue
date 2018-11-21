<template>
  <div class="tags-view-container">
    <scroll-pane class='tags-view-wrapper' ref='scrollPane'>
      <!--<router-link ref='tag' class="tags-view-item" :class="isActive(tag)?'active':''"-->
        <!--v-for="tag in Array.from(visitedViews)" :to="tag.id ? tag.path + '?id=' + tag.id : tag.path"-->
        <!--:key="tag.path" @contextmenu.prevent.native="openMenu(tag,$event)">-->
        <!--{{tag.name}}-->
        <!--<span class='el-icon-close' @click.prevent.stop='closeSelectedTag(tag)'-->
          <!--v-if="tag.path !== visitedViews[0].path"></span>-->
      <!--</router-link>-->
      <router-link ref='tag' class="tags-view-item" :class="isActive(tag)?'active':''"
        v-for="tag in Array.from(visitedViews)" :to="tag.lastPath"
        :key="tag.path" @contextmenu.prevent.native="openMenu(tag,$event)">
        {{tag.path === '/home' ? '首页' : tag.name}}
        <span class='el-icon-close' @click.prevent.stop='closeSelectedTag(tag)'
          v-if="tag.path !== visitedViews[0].path"></span>
      </router-link>
    </scroll-pane>
    <ul class='contextmenu' v-show="visible" :style="{left:left+'px',top:top+'px'}">
      <li @click="closeSelectedTag(selectedTag)">Close</li>
      <li @click="closeOthersTags">Close Others</li>
      <li @click="closeAllTags">Close All</li>
    </ul>
  </div>
</template>

<script>
import scrollPane from '@/components/scroll-pane'

export default {
  components: { scrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {}
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    }
  },
  watch: {
    $route() {
      this.addViewTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.addViewTags()
  },
  methods: {
    generateRoute() {
      if (this.$route.path) {
        return this.$route
      }
      return false
    },
    isActive(route) {
      return route.path === this.$route.path || route.name === this.$route.name
    },
    addViewTags() {
      const route = this.generateRoute()
      if (!route) {
        return false
      }
      this.$store.dispatch('addVisitedViews', route)
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        if (tags) {
          for (const tag of tags) {
            if (tag.to === this.$route.path) {
              this.$refs.scrollPane.moveToTarget(tag.$el)
              break
            }
          }
        }
      })
    },
    closeSelectedTag(view) {
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView.lastPath)
          } else {
            this.$router.push('/')
          }
        }
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag.path)
      this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags() {
      this.$store.dispatch('delAllViews')
      this.$router.push('/')
    },
    openMenu(tag, e) {
      if (this.visitedViews.length > 1) {
        this.visible = true
        this.selectedTag = tag
        this.left = e.clientX - 200
        this.top = e.clientY
      }
    },
    closeMenu() {
      this.visible = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../../styles/config";
.tags-view-container {
  .tags-view-wrapper {
    background: #fff;
    height: 52px;
    border-bottom: 1px solid #E1E1E6;

    .tags-view-item {
      display: inline-block;
      position: relative;
      color: #495060;
      background: #fff;
      padding: 12px 16px 8px;
      font-size: 14px;
      margin-left: 5px;
      margin-top: 4px;
      user-select: none;
      &:first-of-type {
        margin-left: 24px;
      }
      &.active {
        color: $theme-blue;
        border-bottom: 1px solid $theme-blue;
      }
      &:hover {
        color: $theme-blue;
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 2;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
//reset element css of el-icon-close
@import "../../../styles/config";
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      position: absolute;
      top: 50%;
      right: 0;
      margin-top: -7px;
      margin-left: 4px;
      width: 14px;
      height: 14px;
      opacity: 0;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        display: inline-block;
        vertical-align: -1px;
      }
      &:hover {
        background-color: $theme-light-blue;
        color: #fff;
      }
    }
    &:hover {
      .el-icon-close {
        opacity: 1;
      }
    }
  }
}
</style>
