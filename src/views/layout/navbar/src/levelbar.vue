<template>
  <el-breadcrumb class="app-levelbar" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="index">

        <span v-if="item.name">
          <span class="nactive-bread" v-if="index < (levelList.length -1) " @click="linkTo(item, index)">{{item.name}}</span>
          <span class="active-bread" v-else>{{item.name}}</span>
        </span>
        <span class="active-bread" v-else>{{navCrumb}}</span>

      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    created() {
      this.getBreadcrumb()
    },
    data() {
      return {
        levelList: null
      }
    },
    watch: {
      $route() {
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
        } else {
          matched = [{ name: '首页', path: '/' }]
        }
        this.levelList = matched
      },
      // 跳转路由
      linkTo (item, index) {
        // 禁止第二个路由跳转，涉及到权限跳转问题
        if (index === 0 || index === 1) return
        this.$router.push({
          path: item.redirect || item.path
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-levelbar.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 64px;
    margin-left: 10px;
    outline: none;
    background-color: #fff;
    .nactive-bread {
      color: rgba(0,0,0,.45);
      cursor: pointer;
    }
    .active-bread {
      color: rgba(0,0,0,.65);
    }
  }
</style>
