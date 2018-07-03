<template>
  <div class="statistics-browsing">
    <div class="card-padding">

      <div class="card-body-title">场地概况</div>
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
          :picker-options="pickerOptions3"></el-date-picker>
        <el-radio-group class="fr mr16" v-model="selectedPeriod" @change="getPageData(1)">
          <el-radio-button :label="1">日</el-radio-button>
          <el-radio-button :label="2" :disabled="canWeekClick">周</el-radio-button>
          <el-radio-button :label="3" :disabled="canMonthClick">月</el-radio-button>
        </el-radio-group>
      </div>

      <!--统计图-->
      <div id="myChart" class="mt30 mb30" @click="showVis" style="width: 100%;height: 600px;"></div>

      <div class="select-type mt10 mb10">
        <span class="lh32">品牌浏览量统计明细</span>
        <el-button @click="exportExcel" class="lh-btn-export fr">
          <lh-svg icon-class="icon-download" />导出
        </el-button>
      </div>

      <!--统计表格-->
      <div>
        <el-table :data="tableData" :empty-text="tableEmpty" :slot="tableEmpty" v-loading="tableLoading" border style="width: 100%">
          <el-table-column label="排名" prop="contactTel" align="left" ></el-table-column>
          <el-table-column label="品牌名称" prop="moduleName" align="left"></el-table-column>
          <el-table-column label="总访问次数" prop="contact" align="left"></el-table-column>
          <el-table-column label="空间详情页浏览次数" prop="contactTel" align="left" ></el-table-column>
          <el-table-column label="场地详情页浏览次数" prop="contactTel" align="left" ></el-table-column>
          <el-table-column label="累计订单数" prop="contactTel" align="left" ></el-table-column>
          <el-table-column label="累计参观数" prop="contactTel" align="left" ></el-table-column>
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
  import statisticsBrowsingMixin from './statistics-browsing.mixin'
  import tableMixins from '@/mixins/table'
  // 引入echarts
  import echarts from 'echarts'
  import Vue from 'vue'
  import 'echarts/theme/macarons.js'
  Vue.prototype.$echarts = echarts

  export default {
    mixins: [statisticsBrowsingMixin, tableMixins],
    components: {
    },
    data () {
      return {
        statisticsChart: '', // charts
        screenWidth: document.body.clientWidth, // 屏幕宽度
        option: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          barWidth: '',
          legend: {
            show: true,
            selectedMode: 'single',
            data: ['品牌', '空间', '场地']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          yAxis: {
            type: 'value'
          },
          xAxis: {
            type: 'category',
            data: ['A空间', 'B空间', 'C空间', 'D空间', 'E空间', 'F空间', 'G空间', 'H空间', 'I空间', 'J空间']
          },
          series: [
            {
              name: '品牌',
              type: 'bar',
              stack: '总量',
              data: [320, 120, 301, 220, 500, 400, 320, 191, 302, 200]
            },
            {
              name: '空间',
              type: 'bar',
              stack: '总量',
              data: []
            },
            {
              name: '场地',
              type: 'bar',
              stack: '总量',
              data: []
            }
          ]
        },

        // dialog分页器设置
        dialogTitle: '',
        diapageTotal: 0,
        pageSizeArr: [20, 40, 80, 100],
        diapageSize: 20,
        diacurrentPage: 1
      }
    },
    mounted () {
      const that = this
      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth
          that.screenWidth = window.screenWidth
        })()
      }
      if (that.screenWidth < 1100) {
        this.option.barWidth = 40
      } else if (that.screenWidth < 1400) {
        this.option.barWidth = 50
      } else {
        this.option.barWidth = 60
      }
      that.drawLine()
    },
    methods: {
      changePeriod (id) {
        this.periodId = id
      },
      drawLine () {
        let self = this
        // 基于准备好的dom，初始化echarts实例
        self.statisticsChart = echarts.init(document.getElementById('myChart'), 'macarons')
        // 绘制图表
        self.statisticsChart.setOption(this.option);
      },
      showVis (param) {
        console.log(this.statisticsChart)
      }
    },
    watch: {
      screenWidth (val) {
        // 柱形宽度随着屏幕宽度变化
        if (val < 1100) {
          this.option.barWidth = 40
        } else if (val < 1400) {
          this.option.barWidth = 50
        } else {
          this.option.barWidth = 60
        }
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
  .statistics-browsing{
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
  }
</style>
