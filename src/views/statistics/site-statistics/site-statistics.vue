<template>
  <div class="member-market">
    <lh-title title="场地统计">
    </lh-title>
    <div class="main-box">
      <el-row :gutter="24">
        <el-col :span="8">
          <div class="modular-item">
            <div class="modular-item-left">
              <span class="left-title">品牌总数</span>
              <div class="left-count">{{ storeTotalStatistics.total || 0 }}</div>
            </div>
            <div class="modular-item-right">
              <span class="right-site">
                <span class="right-site-title right-site-title-first">近7天新增</span>
                <span class="right-site-count">{{ storeTotalStatistics.totalStatisticsOne || 0 }}</span>
              </span>
              <span class="right-site">
                <span class="right-site-title">近30天新增</span>
                <span class="right-site-count">{{ storeTotalStatistics.totalStatisticsTwo || 0 }}</span>
              </span>
              <span class="right-site">
                <span class="right-site-title">近60天新增</span>
                <span class="right-site-count">{{ storeTotalStatistics.totalStatisticsThree || 0 }}</span>
              </span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="modular-item">
            <div class="modular-item-left">
              <span class="left-title">空间总数</span>
              <div class="left-count">{{ spaceTotalStatistics.total || 0 }}</div>
            </div>
            <div class="modular-item-right">
              <span class="right-site">
                <span class="right-site-title right-site-title-first">近7天新增</span>
                <span class="right-site-count">{{ spaceTotalStatistics.totalStatisticsOne || 0 }}</span>
              </span>
              <span class="right-site">
                <span class="right-site-title">近30天新增</span>
                <span class="right-site-count">{{ spaceTotalStatistics.totalStatisticsTwo || 0 }}</span>
              </span>
              <span class="right-site">
                <span class="right-site-title">近60天新增</span>
                <span class="right-site-count">{{ spaceTotalStatistics.totalStatisticsThree || 0 }}</span>
              </span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="modular-item">
            <div class="modular-item-left">
              <span class="left-title">场地总数</span>
              <div class="left-count">{{ fieldTotalStatistics.total || 0 }}</div>
            </div>
            <div class="modular-item-right">
              <span class="right-site">
                <span class="right-site-title right-site-title-first">近7天新增</span>
                <span class="right-site-count">{{ fieldTotalStatistics.totalStatisticsOne || 0 }}</span>
              </span>
              <span class="right-site">
                <span class="right-site-title">近30天新增</span>
                <span class="right-site-count">{{ fieldTotalStatistics.totalStatisticsTwo || 0 }}</span>
              </span>
              <span class="right-site">
                <span class="right-site-title">近60天新增</span>
                <span class="right-site-count">{{ fieldTotalStatistics.totalStatisticsThree || 0 }}</span>
              </span>
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
  import { fieldTotalStatistics } from '@/service/statistics'

  export default {
    mixins: [],
    data() {
      return {
        tabList: [
          { type: 1, text: '场地统计', name: '/site-statistics/statistics-site' },
          { type: 2, text: '浏览统计', name: '/site-statistics/statistics-browsing' },
          { type: 3, text: '地区分析', name: '/site-statistics/statistics-area' }
        ],
        storeTotalStatistics: '', // 品牌总数
        spaceTotalStatistics: '', // 空间总数
        fieldTotalStatistics: '' // 场地总数
      }
    },
    props: {},
    components: { lhTab },
    watch: {},
    computed: {},
    filters: {},
    mounted () {
      this.getTopData()
    },
    methods: {
      getTopData () {
        fieldTotalStatistics().then(res => {
          if (res.status === 'true') {
            this.storeTotalStatistics = res.info.storeTotalStatistics
            this.spaceTotalStatistics = res.info.spaceTotalStatistics
            this.fieldTotalStatistics = res.info.fieldTotalStatistics
          } else {
            this.setMsg('error', res.msg)
          }
        })
      }
    }
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

      .modular-item-left{
        display: inline-block;
        width: 90px;
        float: left;

        .left-title{
          display: inline-block;
          color: rgba(0, 0, 0, 0.85);
          width: 100%;
          margin-bottom: 20px;
        }
        .left-count{
          display: inline-block;
          color: #000;
          font-size: 28px;
          width: 100%;
        }
      }
      .modular-item-right{
        display: inline-block;
        width: 140px;
        float: right;

        .right-site{
          display: inline-block;
          width: 100%;
          margin-bottom: 8px;

          .right-site-title{
            text-align: left;
            float: left;
            margin-right: 20px;
          }
          .right-site-title-first{
            margin-right: 27px !important;
          }
          .right-site-count{
            text-align: right;
            line-height: 19px;
          }
        }
        .right-site:last-child{
          margin-bottom: 0px;
        }
      }
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
