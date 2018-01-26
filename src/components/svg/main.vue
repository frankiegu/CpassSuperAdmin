<template>
  <svg class="icon" :style="style" aria-hidden="true">
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
  .icon {
    width: 1em; height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
