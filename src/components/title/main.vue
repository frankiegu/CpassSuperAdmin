<template>
  <div class="page-title">
    <h1>{{ title }}</h1>

    <!-- 如果非一级页面，显示返回上一页按钮 -->
    <i v-if="$route.meta.level2" @click="goBack" class="el-icon-close fr"></i>
  </div>
</template>

<script>
  export default {
    name: 'LhTitle',
    props: ['title'],
    watch: {},
    computed: {
    },
    components: {
    },
    mounted() {
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="scss" scoped>
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
  }
</style>
