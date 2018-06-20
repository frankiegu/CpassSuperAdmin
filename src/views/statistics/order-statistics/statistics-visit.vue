<template>
  <div class="statistics-visit">
    <div class="card-padding">

      <div class="card-body-title">参观预约统计</div>
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

      <!--统计图-->
      <div id="myChart" ref="mychart" class="mt30 mb30" style="width: 100%;height: 500px;"></div>

      <div class="select-type mt10 mb10">
        <span class="lh32">统计明细</span>
        <el-button @click="exportExcel" class="lh-btn-export fr">
          <lh-svg icon-class="icon-download" />导出
        </el-button>
      </div>

      <!--统计表格-->
      <div>
        <el-table :data="tableData" :empty-text="tableEmpty" :slot="tableEmpty" v-loading="tableLoading" border style="width: 100%">
          <el-table-column label="日期" prop="created" align="left" ></el-table-column>
          <el-table-column label="参观预约数" prop="winningMaxTime" align="left"></el-table-column>
          <el-table-column label="明细" align="left">
            <template slot-scope="scope">
              <span class="table-link" @click="dialogVisible=true">查看明细</span>
            </template>
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

      <el-dialog
        title="X月X日参观预约明细"
        :visible.sync="dialogVisible">
        <el-table :data="reservationDetail" empty-text="暂无数据" v-loading="reservationLoading" border style="width: 100%">
          <el-table-column label="提交时间" prop="created" align="left" ></el-table-column>
          <el-table-column label="参观空间" prop="winningMaxTime" align="left"></el-table-column>
          <el-table-column label="参观事由" prop="winningMaxTime" align="left"></el-table-column>
          <el-table-column label="提交人" prop="winningMaxTime" align="left"></el-table-column>
        </el-table>
        <el-pagination
          :total="pageTotalExtra"
          :layout="layoutArrExtra"
          :page-size="pageSizeExtra"
          :page-sizes="pageSizeArrExtra"
          :current-page="currentPageExtra"
          class="pagination-container"
          @size-change="handleSizeChangeExtra"
          @current-change="handleCurrentChangeExtra"
          background></el-pagination>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import statisticsVisitMixin from './statistics-visit.mixin'
  // 引入echarts
  import echarts from 'echarts'
  import 'echarts/theme/macarons.js'

  export default {
    mixins: [statisticsVisitMixin],
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
  .statistics-visit{
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
    .echarts-box{
      width: 100%;
      height: 300px;
    }


  }
</style>
