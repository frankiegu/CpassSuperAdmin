<template>
  <div class="c-pass">
    <lh-title title="C-PASS订单统计">
    </lh-title>
    <div class="main-box">
      <el-row :gutter="24">
        <el-col :span="12">
          <div class="modular-item">
            <div class="modular-item-left">
              <span class="left-title">今日场地订单数</span>
              <div class="left-count">60</div>
            </div>
            <div class="modular-item-right">
              <span class="right-site">
                <span class="right-site-title right-site-title-first">近7天总数</span>
                <span class="right-site-count">990</span>
              </span>
              <span class="right-site">
                <span class="right-site-title">近30天总数</span>
                <span class="right-site-count">2780</span>
              </span>
              <span class="right-site">
                <span class="right-site-title">近60天总数</span>
                <span class="right-site-count">6350</span>
              </span>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="modular-item">
            <div class="modular-item-left">
              <span class="left-title">今日参观预约数</span>
              <div class="left-count">80</div>
            </div>
            <div class="modular-item-right">
              <span class="right-site">
                <span class="right-site-title right-site-title-first">近7天总数</span>
                <span class="right-site-count">990</span>
              </span>
              <span class="right-site">
                <span class="right-site-title">近30天总数</span>
                <span class="right-site-count">2780</span>
              </span>
              <span class="right-site">
                <span class="right-site-title">近60天总数</span>
                <span class="right-site-count">6350</span>
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

  export default {
    mixins: [],
    data() {
      return {
        tabList: [
          { type: 1, text: '场地订单统计', name: '/order-statistics/statistics-order' },
          { type: 2, text: '参观预约统计', name: '/order-statistics/statistics-visit' }
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
  .c-pass{
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
          width: 110px;
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
  }
</style>
<style lang="scss">
  .c-pass {
    .component-tab {
      .tab-link {
        width: 130px !important;
      }
    }
  }
</style>
