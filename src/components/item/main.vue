<template>
  <div class="detail-item">
    <div class="label" :style="labelStyle">{{ label }}</div>
    <div
      class="label-con"
      :class="{'theme-black-important': oneColor}"
      :style="conStyle">
      <!-- 再写兼容详情的样式 -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LhItem',
    props: ['label', 'labelWidth', 'labelHeight', 'labelAlign', 'labelConAlign', 'con-width', 'size', 'pb', 'oneColor'],
    data () {
      return {}
    },
    computed: {
      labelStyle() {
        return {
          'text-align': this.labelAlign,
          'width': this.labelWidth,
          'height': this.labelHeight,
          'font-size': `${this.size}px`,
          'padding-bottom': `${this.pb}px`
        }
      },
      conStyle() {
        return {
          'text-align': this.labelConAlign,
          'margin-left': this.labelWidth,
          'width': this.conWidth,
          'font-size': `${this.size}px`,
          'padding-bottom': `${this.pb}px`
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
  @import "src/styles/common/var";
  .detail-item {
    // clear: both; // 放开适用性更强
    box-sizing: border-box;

    // 使用默认行高适配更好
    .label {
      float: left;
      font-size: 14px;
      color: $theme-black; // 按照原型模板来
      text-align: left;
      line-height: 22px;
      // 3px 相当于一个空格的距离
      // 距离右侧12px最佳，因此做减法12 - 3
      // 设置 label-width="68px"
      padding: 0 3px 12px 0;
      vertical-align: middle;
      box-sizing: border-box;
    }
    // 使用默认行高适配更好
    .label-con {
      font-size: 14px;
      text-align: left;
      color: $theme-gray;
      line-height: 22px;
      // 因为右侧可能有按钮、tag的情况，高于文本且垂直居中会撑开内容，所以不能加padding-bottom
      // 后，考虑放开clear，放开更方便
      padding-bottom: 12px;
      // 单行过长时应该出现省略号
      white-space: nowrap;
      text-overflow: ellipsis;
      // overflow: hidden; // 不能加overflow，有按钮要对齐的情况下会切割按钮
    }
  }
</style>
