<!-- 用法示例 其他属性需要时再补充 -->
<!--<lh-textarea-->
  <!--class="width420px"-->
  <!--:textData="ruleForm.description"-->
  <!--:maxlength="100"-->
  <!--placeholder="请输入描述内容"-->
  <!--:minRows="3"-->
  <!--:maxRows="3"-->
  <!--@input="val => ruleForm.description = val" />-->
<template>
  <div :class="['lh-textarea', {'is-disabled': disabled}]">
    <el-input
      v-model.trim="data"
      type="textarea"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :disabled="disabled"
      :autosize="{ minRows: minRows, maxRows: maxRows }"
      @input="handleInput"></el-input>
    <span class="lh-textarea-limit">{{data.length + '/' + maxlength }}</span>
  </div>
</template>

<script>
  export default {
    name: 'lhTextarea',
    data() {
      return {}
    },
    props: {
      textData: {
        type: String,
        default: ''
      },
      maxlength: {
        type: Number
      },
      placeholder: {
        type: String,
        default: '请输入'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      minRows: {
        type: Number,
        default: 2
      },
      maxRows: {
        type: Number,
        default: 2
      }
    },
    computed: {
      data: {
        get: function () {
          return this.textData || ''
        },
        set: function () {}
      }
    },
    methods: {
      handleInput(e) {
        this.$emit('input', e)
      }
    }
  }
</script>

<style lang="scss">
  .lh-textarea {
    position: relative;
    padding-bottom: 24px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

    &.is-disabled {
      background-color: #f5f7fa;
      border-color: #e4e7ed;
      color: #c0c4cc;
      cursor: not-allowed;
    }

    .lh-textarea-limit {
      position: absolute;
      bottom: 8px;
      right: 12px;
      font-size: 12px;
      line-height: 12px;
      color: #A9ADBC;
      font-family: PingFangSC-Regular;
    }

    textarea {
      resize: none;
    }

    .el-textarea__inner {
      border: none;
    }
  }
</style>
