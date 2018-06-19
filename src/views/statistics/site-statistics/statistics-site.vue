<template>
  <div class="statistics-site">
    <div class="card-padding">
      <div class="card-body-title">场地概况</div>
      <div class="select-type mt10 mb10">
        <el-select
          v-model="formData.type"
          @change="getPageData(1)"
          filterable
          placeholder="请选择状态"
          class="width150px fr"
          clearable>
          <el-option
            v-for="item in typeList"
            :label="item.text"
            :value="item.val"
            :key="item.val"></el-option>
        </el-select>
      </div>
      <div class="site-profile clearfix mb16">
        <div class="profile-box">
          <span class="profile-title">全部场地</span>
          <span class="profile-count">100</span>
        </div>
        <div class="profile-box">
          <span class="profile-title">自由工位(天)</span>
          <span class="profile-count">100</span>
        </div>
        <div class="profile-box">
          <span class="profile-title">时租工位(时)</span>
          <span class="profile-count">100</span>
        </div>
        <div class="profile-box">
          <span class="profile-title">会议室</span>
          <span class="profile-count">100</span>
        </div>
        <div class="profile-box">
          <span class="profile-title">路演厅</span>
          <span class="profile-count">100</span>
        </div>
        <div class="profile-box">
          <span class="profile-title">办公室</span>
          <span class="profile-count">100</span>
        </div>
        <div class="profile-box">
          <span class="profile-title">多功能室</span>
          <span class="profile-count">100</span>
        </div>
      </div>

      <div class="card-body-title">新增统计</div>
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
          <el-table-column label="新增品牌数" prop="id" align="left"></el-table-column>
          <el-table-column label="新增空间数" prop="lotteryExtraTime" align="left"></el-table-column>
          <el-table-column label="新增场地总数" prop="lotteryExtraTime" align="left" ></el-table-column>
          <el-table-column label="移动工位" prop="lotteryExtraTime" align="left" ></el-table-column>
          <el-table-column label="时租工位" prop="lotteryExtraTime" align="left" ></el-table-column>
          <el-table-column label="会议室" prop="lotteryExtraTime" align="left" ></el-table-column>
          <el-table-column label="路演厅" prop="lotteryExtraTime" align="left" ></el-table-column>
          <el-table-column label="办公室" prop="lotteryExtraTime" align="left" ></el-table-column>
          <el-table-column label="多功能室" prop="lotteryExtraTime" align="left" ></el-table-column>
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

    <!--新增品牌Dialog-->
    <el-dialog
      title="新增品牌"
      :visible.sync="brandDialogVisible"
      width="700px">
      <div>
        <el-table :data="tableData" :empty-text="tableEmpty" :slot="tableEmpty" border style="width: 100%">
          <el-table-column label="品牌名称" prop="contactTel" align="left" ></el-table-column>
          <el-table-column label="品牌创建时间" prop="moduleName" align="left"></el-table-column>
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
    </el-dialog>

    <!--新增空间Dialog-->
    <el-dialog
      title="新增空间"
      :visible.sync="spaceDialogVisible"
      width="700px">
      <div>
        <el-table :data="tableData" :empty-text="tableEmpty" :slot="tableEmpty" border style="width: 100%">
          <el-table-column label="品牌名称" prop="contactTel" align="left" ></el-table-column>
          <el-table-column label="空间名称" prop="moduleName" align="left"></el-table-column>
          <el-table-column label="空间创建时间" prop="moduleName" align="left"></el-table-column>
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
    </el-dialog>

    <!--新增场地Dialog-->
    <el-dialog
      title="新增场地"
      :visible.sync="fieldDialogVisible"
      width="900px">
      <div>
        <!--场地类型筛选-->
        <div>
          <el-select
            v-model="formData.fieldTyoe"
            @change="getPageData(1)"
            filterable
            placeholder="请选择状态"
            class="width150px fl mb16"
            clearable>
            <el-option
              v-for="item in fieldList"
              :label="item.text"
              :value="item.val"
              :key="item.val"></el-option>
          </el-select>
        </div>
        <el-table :data="tableData" :empty-text="tableEmpty" :slot="tableEmpty" border style="width: 100%">
          <el-table-column label="品牌名称" prop="contactTel" align="left" ></el-table-column>
          <el-table-column label="空间名称" prop="moduleName" align="left"></el-table-column>
          <el-table-column label="空间创建时间" prop="moduleName" align="left"></el-table-column>
          <el-table-column label="场地名称" prop="moduleName" align="left"></el-table-column>
          <el-table-column label="场地类型" prop="moduleName" align="left"></el-table-column>
          <el-table-column label="空间创建时间" prop="moduleName" align="left"></el-table-column>
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
    </el-dialog>
  </div>
</template>

<script>
  import statisticsSiteMixin from './statistics-site.mixin'
  import option from '@/components/option'
  import pickerOptions from '@/mixins/pickerOptions'
  import tableMixins from '@/mixins/table'
  // 引入echarts
  import echarts from 'echarts'
  import Vue from 'vue'
  import 'echarts/theme/macarons.js'
  Vue.prototype.$echarts = echarts

  export default {
    mixins: [tableMixins, statisticsSiteMixin, pickerOptions],
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
  .statistics-site{
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
    .site-profile{
      width: 100%;
      padding: 24px 0px;
      box-sizing: border-box;

      .profile-box{
        display: block;
        width: 12%;
        box-shadow: 0 1px 4px 0 rgba(0, 21, 41, 0.12);
        cursor: pointer;
        position: relative;
        background-color: #fff;
        border-radius: 2px;
        padding: 15px;
        box-sizing: border-box;
        text-align: center;
        margin-right: 2.66%;
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
      .profile-box:last-child{
        margin-right: 0px;
      }
    }
    .echarts-box{
      width: 100%;
      height: 300px;
    }
  }
</style>
