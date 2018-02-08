<template>
  <div class="detail-item">
    <div class="label" :style="labelStyle">{{ label }}</div>
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
          'margin-left': this.labelWidth,
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
      vertical-align: middle;
      float: left;
      font-size: 14px;
      line-height: 1;
      padding: 11px 16px 11px 16px;
      box-sizing: border-box;
    }
    .label-con {
      line-height: 22px;
      font-size: 14px;
      color: $theme-gray;
      padding-top: 7px;
      text-align: left;
    }
  }
</style>
