<template>
  <div class="datePicker">
    <span class="datePicker-prepend">{{ label }}</span>
    <div class="datePicker-con">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        @change="handleChange(dateRange, dateType)"
        align="right"
        clearable
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        placeholder="选择日期"
        :picker-options="pickerOptions"></el-date-picker>
    </div>
  </div>
</template>
<script>
  import pickerOptions from '@/mixins/pickerOptions'
  export default {
    name: 'LhDatePicker',
    mixins: [pickerOptions],
    props: ['label', 'dateType'], // dateType,一个页面出现多次使用时，利用dateType区分
    data () {
      return {
        dateRange: null
      }
    },
    computed: {
    },
    mounted () {
    },
    methods: {
      handleChange(dateRange, dateType) {
        // 如果页面中只使用一次datePicker，则此emit可以直接调用方法getPageData(page, dateRange)
        // 如果页面中有两个以上会使用datePicker，则触发动作时需要在父组件中判断是哪一个在触发，再赋值
        this.$emit('datePickerChange', 1, dateRange, dateType)
      }
    }
  }
</script>
<style lang="scss">
  @import "src/styles/common/var";
  .datePicker {
    font-size: 0;
    .datePicker-prepend {
      display: inline-block;
      font-size: 14px;
      padding: 3px 5px;
      border-bottom-left-radius: 4px;
      border-top-left-radius: 4px;
      border: 1px solid #dcdfe6;
      border-right: 0;
      line-height: 24px;
      color: rgba(0, 0, 0, 0.65);
    }
    .datePicker-con {
      display: inline-block;
    }
    .el-date-editor {
      border-bottom-left-radius: inherit;
      border-top-left-radius: inherit;
    }
  }
</style>
