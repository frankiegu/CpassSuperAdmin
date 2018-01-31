<template>
  <el-breadcrumb class="app-levelbar" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        v-for="(item,index) in levelList"
        :key="index">
        <router-link v-if="item.name" :to="item.redirect || item.path">{{item.name}}</router-link>
        <span v-else>{{navCrumb}}</span>
      </el-breadcrumb-item>
    </transition-group>
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
    watch: {
      $route () {
        this.getBreadcrumb()
      }
    },
    computed: {
      ...mapGetters([
        'navCrumb'
      ])
    },
    methods: {
      getBreadcrumb () {
        let matched = this.$route.matched
        const first = matched[0]
        if (first && (first.name !== '首页' || first.path !== '')) {
          matched = [{ name: '首页', path: '/' }].concat(matched)
        }
        this.levelList = matched
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
  }
</style>
