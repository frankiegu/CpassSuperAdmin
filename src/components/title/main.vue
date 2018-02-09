<template>
  <div class="page-title">
    <h1>{{ title }}</h1>

    <!-- 如果非一级页面，显示返回上一页按钮 -->
    <i
      v-if="$route.meta.level2"
      @click="goBack"
      class="el-icon-close fr"></i>

    <el-tooltip
      v-if="$route.meta.pdf"
      content="下载账户信息的主要内容为pdf格式"
      placement="bottom"
      effect="light">
      <el-button
        @click="downloadPdf"
        class="mr10 fr download-pdf"
        icon="el-icon-download"
        size="mini">下载PDF</el-button>
    </el-tooltip>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'LhTitle',
    props: ['title', 'level2'],
    watch: {},
    computed: {
    },
    components: {
    },
    mounted() {
    },
    methods: {
      downloadPdf() {
        this.$emit('downloadPdf')
      },
      goBack() {
        // 如果表单页，用表单的事件，否则返回上一页
        if (this.level2) {
          this.$emit('goBack')
        } else {
          this.$router.go(-1)
        }
      }
    }
  }
</script>

<style lang="scss">
  @import 'src/styles/config.scss';

  .page-title {
    height: 40px;
    line-height: 40px;
    padding: 0 12px 0 20px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    background-color: $theme-blue;
    color: #fff;
    overflow: hidden;

    h1 {
      float: left;
      font-size: 16px;
      font-weight: 700;
      color: #fff;
    }
    .el-icon-close {
      padding: 6px;
      margin-top: 5px;
      font-size: 18px;
      vertical-align: middle;
      cursor: pointer;
    }
    .el-button{
      margin-top: 5.5px;
    }
  }
</style>
