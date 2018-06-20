<template>
  <div class="statistics-order">
    <div class="card-padding">

      <div class="card-body-title">场地订单统计</div>
      <div class="select-type mt10 mb10 clearfix">
        <el-date-picker
          class="fr"
          v-model="dateRange"
          @change="dateChange"
          type="daterange"
          align="right"
          :clearable="false"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          placeholder="选择提交日期"
          :picker-options="pickerOptions2"></el-date-picker>
        <el-radio-group class="fr mr16" v-model="selectedPeriod" @change="getPageData(1)">
          <el-radio-button :label="1">日</el-radio-button>
          <el-radio-button :label="2" :disabled="canWeekClick">周</el-radio-button>
          <el-radio-button :label="3" :disabled="canMonthClick">月</el-radio-button>
        </el-radio-group>
      </div>

      <div class="area-profile clearfix mb16">
        <div class="profile-box selectedBox" :class="{'activeClass': currentIndex === index}" @click="sortByStatus(index)" v-for="(item, index) in orderTypeList" :key="index">
          <span class="profile-title">{{item.label}}</span>
          <span class="profile-count">{{item.number}}</span>
        </div>
      </div>

      <!--统计图-->
      <div id="myChart" ref="mychart" style="width: 100%; height: 500px;"></div>

      <div class="select-type mt10 mb10">
        <span class="lh32">统计明细</span>
        <el-button @click="exportExcel" class="lh-btn-export fr">
          <lh-svg icon-class="icon-download" />导出
        </el-button>
      </div>

      <!--统计表格-->
      <div>
        <el-table :data="tableData" :empty-text="tableEmpty" :slot="tableEmpty" v-loading="tableLoading" border style="width: 100%">
          <el-table-column label="日期" prop="created" align="left" >
            <template slot-scope="scope">
              <router-link class="table-link" tag="a" target="_blank" to="/statistics/C-PASS-order">
                {{scope.row.created}}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="总订单数" prop="moduleName" align="left"></el-table-column>
          <el-table-column label="总成交金额(元)" prop="contact" align="left"></el-table-column>
          <el-table-column label="单均金额(元)" prop="contactTel" align="left" ></el-table-column>
          <el-table-column label="明细" align="left" >
            <span class="table-link">查看明细</span>
          </el-table-column>
        </el-table>
        <el-pagination
          :total="pageTotal"
          :layout="layoutArr"
          :page-size="pageSize"
          :page-sizes="pageSizeArr"
          :current-page="currentPage"
          class="pagination-container"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background></el-pagination>
      </div>

    </div>

  </div>
</template>

<script>
  import statisticsOrderMixin from './statistics-order.mixin'
  import { fieldOrderList } from '@/service/order'
  // 引入echarts
  import echarts from 'echarts'
  import 'echarts/theme/macarons.js'

  export default {
    mixins: [statisticsOrderMixin],
    components: {},
    data () {
      return {
        myChart: '', // charts
        screenWidth: document.body.clientWidth // 屏幕宽度
      }
    },
    mounted () {
      this.setEchart();
      const that = this
      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth
          that.screenWidth = window.screenWidth
        })()
      }
    },
    methods: {
      setEchart () {
        let dom = this.$refs.mychart;
        this.myChart = echarts.init(dom, 'macarons');
        this.myChart.setOption(this.option);
        // let self = this
        fieldOrderList().then(res => {
          if (res.status === 'true') {
            console.log('res', res)
            let data = res.info
            if (data) {
              this.pageTotal = data.total
              this.tableData = data.result
            }
            this.tableLoading = false
            if (this.tableData.length === 0) {
              this.tableEmpty = '暂时无数据'
            }
          } else {
            this.setMsg('error', res.msg)
          }
        })
      }
    },
    watch: {
      screenWidth (val) {
        if (!this.timer) {
          this.screenWidth = val
          this.timer = true
          let that = this
          setTimeout(function () {
            that.timer = false
            that.statisticsChart.resize()
            that.drawLine()
          }, 400)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .statistics-order {
    .card-body-title{
      font-size: 16px;
    }

    .select-type{
      width: 100%;
      height: 32px;

      .select-period{
        display: block;
        width: 152px;
        border: 1px solid rgb(220, 223, 230);
        border-radius: 4px;
        text-align: center;
        float: right;


        .period-site{
          width: 50px;
          height: 30px;
          line-height: 30px;
          float: left;
          border-right: 1px solid rgb(220, 223, 230);
          color: rgba(0, 0, 0, 0.65);
          cursor: pointer;
        }
        .period-site-select{
          background: rgba(220, 223, 230, 0.65);
        }
        .period-site:last-child{
          border-right: none;
        }
      }
    }
    .area-profile{
      width: 100%;
      padding: 24px 0px;
      box-sizing: border-box;

      .profile-box{
        display: block;
        width: 16.8%;
        box-shadow: 0 1px 4px 0 rgba(0, 21, 41, 0.12);
        cursor: pointer;
        position: relative;
        background-color: #fff;
        border-radius: 2px;
        padding: 15px;
        box-sizing: border-box;
        text-align: center;
        margin-right: 4%;
        float: left;

        .profile-title{
          display: inline-block;
          width: 100%;
          color: rgba(0, 0, 0, 0.85);
          margin-bottom: 15px;
          cursor: pointer;
        }
        .profile-count{
          display: inline-block;
          width: 100%;
          color: #000;
          font-size: 24px;
        }
      }
      .profile-box-select{
      }
      .profile-box:last-child{
        margin-right: 0px;
      }
    }
    .area-profile-count{
      width: 100%;
      height: 64px;
      box-sizing: border-box;
      box-shadow: 0 1px 4px 0 rgba(0, 21, 41, 0.12);
      cursor: pointer;
      position: relative;
      background-color: #fff;
      border-radius: 2px;
      text-align: left;

      .profile-count{
        margin-top: 15px;
        margin-left: 2%;
        width: 17.5%;
        height: 32px;
        float: left;
        line-height: 30px;
        border: 1px solid rgb(220, 223, 230);
        box-sizing: border-box;

        .count-left{
          margin-left: 12px;
        }
        .count-right{
          margin-right: 12px;
        }
      }
      .profile-count-select{
        color: #5A72F6 !important;
      }
      .yd-bor{
        border-left: 10px solid #009900;
      }
      .sz-bor{
        border-left: 10px solid #648bfb;
      }
      .hys-bor{
        border-left: 10px solid #626c91;
      }
      .lyt-bor{
        border-left: 10px solid #6be6c1;
      }
      .dgn-bor{
        border-left: 10px solid #199ed8;
      }
    }
    .echarts-box{
      width: 100%;
      height: 300px;
    }
    .activeClass {
      span {
        color: #5A72F6 !important;
      }
    }
  }
</style>
