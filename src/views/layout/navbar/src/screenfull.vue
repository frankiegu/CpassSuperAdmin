<template>
  <div @click="toggleScreen">
    <el-tooltip
      :content="(isFullscreen ? '点击展开全屏' : '点击收起全屏')"
      placement="bottom"
      effect="light">
      <lh-svg
        :iconClass="(isFullscreen ? 'icon-caozuo-quanping-zhankai' : 'icon-caozuo-quanping-shousuo')"
        class="screenfull"></lh-svg>
    </el-tooltip>
  </div>
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

  .screenfull {
    width: 30px;
    height: 30px;
    margin: 15px 40px 0 0;
    color: $theme-gray;
  }
</style>
