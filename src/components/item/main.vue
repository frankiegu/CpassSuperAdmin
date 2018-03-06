<template>
  <div class="detail-item">
    <div class="label" :style="labelStyle">{{ label }}</div>

    <!-- 文字多的情况，单独设置宽度labelWidth，就可以了 -->
    <div class="label-con" :style="conStyle">
      <!-- 再写兼容详情的样式 -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LhItem',
    props: ['label', 'labelWidth', 'labelHeight', 'align', 'con-width'],
    data () {
      return {
      }
    },
    computed: {
      labelStyle() {
        return {
          'text-align': this.align,
          'width': this.labelWidth,
          'height': this.labelHeight
        }
      },
      conStyle() {
        return {
          'margin-left': (this.labelWidth === 'auto') ? '0' : this.labelWidth,
          'width': this.conWidth
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
  .detail-item {
    clear: both;
    box-sizing: border-box;

    .label {
      float: left;
      vertical-align: middle;
      font-size: 14px;
      line-height: 22px;
      padding: 0 0 16px 0;
      box-sizing: border-box;
    }
    .label-con {
      line-height: 22px;
      font-size: 14px;
      color: $theme-gray;
      text-align: left;
      padding-bottom: 16px;
      /*overflow: hidden;*/
    }
  }
</style>
