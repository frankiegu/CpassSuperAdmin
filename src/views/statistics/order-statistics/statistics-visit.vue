<template>
  <div class="statistics-order">
    <div class="card-padding">

      <div class="card-body-title">参观预约统计</div>
      <div class="select-type mt10 mb10 clearfix">
        <el-date-picker
          class="fr"
          v-model="formData.date"
          @change="getPageData(1)"
          type="daterange"
          align="right"
          clearable
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          placeholder="选择提交日期"
          :picker-options="pickerOptions"></el-date-picker>
        <div class="select-period mr16">
          <div class="period-site" :class="{'period-site-select' : periodId === 1}" @click="changePeriod(1)">
            日
          </div>
          <div class="period-site" :class="{'period-site-select' : periodId === 2}" @click="changePeriod(2)">
            周
          </div>
          <div class="period-site" :class="{'period-site-select' : periodId === 3}" @click="changePeriod(3)">
            月
          </div>
        </div>
      </div>

      <!--统计图-->
      <div id="myChart" class="mt30 mb30" style="width: 100%;height: 500px;"></div>

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
        :visible.sync="dialogVisible"
        :before-close="handleClose">
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
  import option from '@/components/option'
  import pickerOptions from '@/mixins/pickerOptions'
  import tableMixins from '@/mixins/table'
  // 引入echarts
  import echarts from 'echarts'
  import Vue from 'vue'
  import 'echarts/theme/macarons.js'
  Vue.prototype.$echarts = echarts

  export default {
    mixins: [tableMixins, statisticsVisitMixin, pickerOptions],
    components: {
      [option.name]: option
    },
    data () {
      return {
        statisticsChart: '', // charts
        option: {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['邮件营销', '联盟广告', '视频广告']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '邮件营销',
              type: 'line',
              stack: '总量',
              data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
              name: '联盟广告',
              type: 'line',
              stack: '总量',
              data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
              name: '视频广告',
              type: 'line',
              stack: '总量',
              data: [150, 232, 201, 154, 190, 330, 410]
            }
          ]
        },
        screenWidth: document.body.clientWidth // 屏幕宽度
      }
    },
    mounted () {
      this.drawLine();
      const that = this
      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth
          that.screenWidth = window.screenWidth
        })()
      }
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
  .statistics-order{

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
