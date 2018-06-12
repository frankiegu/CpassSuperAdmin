<template>
  <div class="member-market">
    <lh-title title="场地统计">
    </lh-title>
    <div class="main-box">
      <el-row :gutter="24">
        <el-col :span="8">
          <div class="modular-item">
            <div class="i-head">
              <span class="icon-text">门店</span>
            </div>
            <div class="i-main">
              <span class="con-num">1</span>
              <span class="con-unit">个</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="modular-item">
            <div class="i-head">
              <span class="icon-text">门店</span>
            </div>
            <div class="i-main">
              <span class="con-num">1</span>
              <span class="con-unit">个</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="modular-item">
            <div class="i-head">
              <span class="icon-text">门店</span>
            </div>
            <div class="i-main">
              <span class="con-num">1</span>
              <span class="con-unit">个</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="select-box">
      <lh-tab :tabList="tabList"/>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import lhTab from '@/components/tab'

  export default {
    mixins: [],
    data() {
      return {
        tabList: [
          { type: 1, text: '场地统计', name: '/site-statistics/statistics-site' },
          { type: 2, text: '浏览统计', name: '/site-statistics/statistics-browsing' },
          { type: 3, text: '地区分析', name: '/site-statistics/statistics-area' }
        ]
      }
    },
    props: {},
    components: { lhTab },
    mounted() {
    },
    watch: {},
    computed: {},
    filters: {},
    methods: {}
  }
</script>

<style lang="scss" scoped>
  .main-box{
    padding: 24px 36px;
    box-sizing: border-box;
    width: 100%;
    background: #fff;

    .modular-item{
      box-shadow: 0 1px 4px 0 rgba(0,21,41,0.12);
      cursor: pointer;
      position: relative;
      height: 74px;
      background-color: #fff;
      border-radius: 2px;
      padding: 15px;
    }
  }
  .page-title{
    border-bottom: 1px solid #f2f2f8;
  }
  .select-box{
    width: 100%;
    height: 45px;
    background: #fff;
  }
</style>
