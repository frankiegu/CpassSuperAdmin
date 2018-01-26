<!-- A标签，按钮 -->
<template>
  <a
    :href="href"
    :download="title"
    :style="style"
    class="lh-button">{{ text }}</a>
</template>

<script>
  export default {
    name: 'LhButton',
    props: ['href', 'title', 'text', 'height', 'width'],
    data () {
      return {}
    },
    computed: {
      style() {
        return {
          'width': `${this.width}px`,
          'height': `${this.height}px`
        }
      }
    },
    mounted () {
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .lh-button {
    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
    background: $theme-blue;
    color: #ffffff;
    border-radius: 4px;

    &:hover {
      background: rgb(126, 153, 234);
      border-color: rgb(126, 153, 234);
      color: #fff;
    }
  }
</style>
