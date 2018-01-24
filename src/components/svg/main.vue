<template>
  <svg class="lh-svg" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
  export default {
    name: 'LhSvg',
    props: ['iconClass'],
    computed: {
      iconName() {
        return '#' + this.iconClass
      }
    }
  }
</script>

<style lang="scss" scoped>
  .lh-svg {
  }
</style>
