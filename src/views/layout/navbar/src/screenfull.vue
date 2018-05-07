<template>
  <el-tooltip
    :content="(isFullscreen ? '点击展开全屏' : '点击收起全屏')"
    placement="bottom">
    <lh-svg
      @click.native="toggleScreen"
      :iconClass="(isFullscreen ? 'icon-shipinquanping' : 'icon-tuichuquanping')"
      class="screenfull-style"></lh-svg>
  </el-tooltip>
</template>

<script>
  import screenfull from 'screenfull'
  export default {
    data () {
      return {
        levelList: null,
        isFullscreen: !screenfull.isFullscreen
      }
    },
    methods: {
      toggleScreen() {
        this.isFullscreen = !this.isFullscreen
        if (!screenfull.enabled) {
          this.setMsg('warning', 'you browser can not work')
          return false
        }
        screenfull.toggle()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/config';

  .screenfull-style {
    width: 20px;
    height: 20px;
    margin: 10px 0 0 0;
    color: $theme-gray;
  }
</style>
