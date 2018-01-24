<template>
  <el-breadcrumb class="app-levelbar" separator="/">
    <el-breadcrumb-item v-for="(item,index) in levelList" :key="index">

      <router-link v-if="item.name" :to="item.path">{{item.name}}</router-link>
      <router-link v-else to="">{{navCrumb}}</router-link>

    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    created () {
      this.getBreadcrumb()
    },
    data () {
      return {
        levelList: null
      }
    },
    computed: {
      ...mapGetters([
        'navCrumb'
      ])
    },
    methods: {
      getBreadcrumb () {
        let matched = this.$route.matched;
        const first = matched[0];
        if (first && (first.name !== '首页' || first.path !== '')) {
          matched = [{ name: '首页', path: '/' }].concat(matched)
        }
        this.levelList = matched;
      }
    },
    watch: {
      $route () {
        this.getBreadcrumb();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-levelbar.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    outline: none;

    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
