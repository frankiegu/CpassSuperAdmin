<template>
  <svg class="lh-svg" :style="style" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
export default {
  name: 'LhSvg',
  props: ['iconClass', 'size', 'color'],
  computed: {
    iconName() {
      return '#' + this.iconClass
    },
    style() {
      return {
        'width': `${this.size}px`,
        'height': `${this.size}px`,
        'color': this.color
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/common/var";
.lh-svg {
  width: 22px;
  height: 22px;
  vertical-align: middle;
  /* svg默认灰色 */
  color: $theme-gray;
  fill: $theme-gray;
  overflow: hidden;
}
</style>
