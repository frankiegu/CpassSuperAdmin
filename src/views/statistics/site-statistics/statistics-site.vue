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
        <div class="profile-box selectedBox" v-for="(item, index) in orderTypeList" :key="index">
          <span class="profile-title">{{item.label}}</span>
          <span class="profile-count">{{item.number}}</span>
        </div>
      </div>

      <div class="card-body-title">新增统计</div>
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
          <el-table-column label="日期" align="left" width="190">
            <template slot-scope="scope">
              <span>{{ scope.row.relationDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="新增品牌数" align="left">
            <template slot-scope="scope">
              <span class="table-link" @click="showDialog(1, scope.row.id, scope.row.relationDate)">{{ scope.row.newSpaceCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="新增空间数" align="left">
            <template slot-scope="scope">
              <span class="table-link" @click="showDialog(2, scope.row.id, scope.row.relationDate)">{{ scope.row.newStoreCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="新增场地总数" align="left" >
            <template slot-scope="scope">
              <span class="table-link" @click="showDialog(3, scope.row.id, scope.row.relationDate)">{{ scope.row.newFieldCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="移动工位" align="left" >
            <template slot-scope="scope">
              <span class="table-link">{{ scope.row.stationCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="时租工位" align="left" >
            <template slot-scope="scope">
              <span class="table-link">{{ scope.row.hourStationCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="会议室" align="left" >
            <template slot-scope="scope">
              <span class="table-link">{{ scope.row.meetingCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="路演厅" align="left" >
            <template slot-scope="scope">
              <span class="table-link">{{ scope.row.roadshowHallCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="办公室" align="left" >
            <template slot-scope="scope">
              <span class="table-link">{{ scope.row.officeCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="多功能室" align="left" >
            <template slot-scope="scope">
              <span class="table-link">{{ scope.row.otherCount }}</span>
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
    </div>

    <!--新增品牌Dialog-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :width="dialogWidth"
      :lock-scroll="true">
      <div>
        <el-table
          v-if="dialogType === 1"
          :data="diatableData"
          :empty-text="tableEmpty"
          :slot="tableEmpty"
          border style="width: 100%"
          max-height="400">
          <el-table-column label="品牌名称" prop="spaceName" align="left" ></el-table-column>
          <el-table-column label="品牌创建时间" prop="created" align="left"></el-table-column>
        </el-table>

        <el-table
          v-if="dialogType === 2"
          :data="diatableData"
          :empty-text="tableEmpty"
          :slot="tableEmpty" border
          style="width: 100%"
          max-height="400">
          <el-table-column label="品牌名称" prop="spaceName" align="left" ></el-table-column>
          <el-table-column label="空间名称" prop="storeName" align="left"></el-table-column>
          <el-table-column label="空间创建时间" prop="created" align="left"></el-table-column>
        </el-table>

        <!--场地类型筛选-->
        <div v-if="dialogType === 3">
          <el-select
            v-model="formData.fieldType"
            @change="diahandleCurrentChange(1)"
            filterable
            placeholder="请选择场地类型"
            class="width150px fl mb16"
            clearable>
            <el-option
              v-for="item in fieldList"
              :label="item.text"
              :value="item.val"
              :key="item.val"></el-option>
          </el-select>
        </div>
        <el-table
          v-if="dialogType === 3"
          :data="diatableData"
          :empty-text="tableEmpty"
          :slot="tableEmpty" border
          style="width: 100%"
          max-height="400">
          <el-table-column label="品牌名称" prop="spaceName" align="left" ></el-table-column>
          <el-table-column label="空间名称" prop="storeName" align="left"></el-table-column>
          <el-table-column label="场地名称" prop="fieldName" align="left"></el-table-column>
          <el-table-column label="场地类型" prop="fieldTypeName" align="left"></el-table-column>
          <el-table-column label="空间创建时间" prop="created" align="left"></el-table-column>
        </el-table>

        <el-pagination
          :total="diapageTotal"
          :layout="layoutArr"
          :page-size="diapageSize"
          :page-sizes="pageSizeArr"
          :current-page="diacurrentPage"
          class="pagination-container"
          @size-change="diahandleSizeChange"
          @current-change="diahandleCurrentChange"
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
        // dialog分页器设置
        diapageTotal: 0,
        pageSizeArr: [20, 40, 80, 100],
        diapageSize: 20,
        diacurrentPage: 1,

        statisticsChart: '', // charts
        option: {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['品牌', '空间', '场地']
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
            boundaryGap: true,
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '品牌',
              type: 'line',
              stack: '总量',
              data: []
            },
            {
              name: '空间',
              type: 'line',
              stack: '总量',
              data: []
            },
            {
              name: '场地',
              type: 'line',
              stack: '总量',
              data: []
            }
          ]
        },
        screenWidth: document.body.clientWidth // 屏幕宽度
      }
    },
    mounted () {
      const that = this
      that.drawLine()
      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth
          that.screenWidth = window.screenWidth
        })()
      }
    },
    methods: {
      drawLine () {
        let self = this
        // 基于准备好的dom，初始化echarts实例
        self.statisticsChart = echarts.init(document.getElementById('myChart'), 'macarons')
        // 绘制图表
        self.statisticsChart.setOption(this.option);
      },
      showDialog (type, id, date) {
        // dialog标题
        var month = ''
        var day = ''
        if (this.selectedPeriod === 1) {
          month = date.substr(5, 2).substr(0, 1) === '0' ? date.substr(6, 1) : date.substr(5, 2)
          day = date.substr(8, 2).substr(0, 1) === '0' ? date.substr(9, 1) : date.substr(8, 2)
          this.dialogDate = month + '月' + day + '日'
          this.startTime = date
          this.endTime = date
        } else if (this.selectedPeriod === 2 || this.selectedPeriod === 3) {
          month = date.substr(5, 2).substr(0, 1) === '0' ? date.substr(6, 1) : date.substr(5, 2)
          day = date.substr(8, 2).substr(0, 1) === '0' ? date.substr(9, 1) : date.substr(8, 2)
          var startDate = month + '月' + day + '日'

          month = date.substr(16, 2).substr(0, 1) === '0' ? date.substr(17, 1) : date.substr(16, 2)
          day = date.substr(19, 2).substr(0, 1) === '0' ? date.substr(20, 1) : date.substr(19, 2)
          var endDate = month + '月' + day + '日'
          this.dialogDate = startDate + '至' + endDate

          this.startTime = date.substr(0, 10)
          this.endTime = date.substr(11, 21)
        }

        this.dialogType = type
        this.dialogId = id

        // 设置弹窗宽度、标题
        if (type === 1) {
          this.dialogWidth = 700 + 'px'
          this.dialogTitle = this.dialogDate + '新增品牌'
        } else if (type === 2) {
          this.dialogWidth = 800 + 'px'
          this.dialogTitle = this.dialogDate + '新增空间'
        } else if (type === 3) {
          this.dialogWidth = 80 + '%'
          this.dialogTitle = this.dialogDate + '新增场地'
        }

        // 初始化分液器配置、打开弹窗
        this.diapageTotal = 0
        this.diapageSize = 20
        this.diacurrentPage = 1
        this.formData.fieldType = ''
        this.dialogVisible = true
        this.diahandleCurrentChange(1)
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
