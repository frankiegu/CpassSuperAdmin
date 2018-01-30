<template>
  <div class="icons-container">
    <div class="page-title mt30"><h1>图标</h1></div>

    <div class="icons-wrapper">
      <div
        v-for="item of iconsMap"
        :key="item"
        @click="handleClipboard(generateIconCode(item),$event)">
        <el-tooltip placement="top">
          <div slot="content">{{generateIconCode(item)}}</div>

          <div class="icon-item">
            <lh-svg :iconClass="'icon-' + item" />
            <span>{{item}}</span>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import icons from './generateIconsView'
import clipboard from '@/config/utils/clipboard'

export default {
  name: 'icons',
  data() {
    return {
      iconsMap: []
    }
  },
  mounted() {
    const iconsMap = icons.state.iconsMap.map((i) => {
      return i.default.id.split('icon-')[1]
    })
    console.log('iconsMap', iconsMap)
    this.iconsMap = iconsMap
  },
  methods: {
    generateIconCode(symbol) {
      return `<lh-svg icon-class="icon-${symbol}" />`
    },
    handleClipboard(text, event) {
      clipboard(text, event)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icons-container {
  margin: 10px 0 0;
  overflow: hidden;
  .icons-wrapper {
    margin: 0 auto;
  }
  .icon-item {
    margin: 20px;
    height: 110px;
    text-align: center;
    width: 110px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }
  span {
    display: block;
    font-size: 24px;
    margin-top: 10px;
  }
}
</style>
