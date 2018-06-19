<template>
  <div class="statistics-area">
    <div class="card-padding">
      <div class="card-body-title">空间地区分布</div>
      <div class="select-type mt16 mb16 clearfix">
        <el-select
          v-model="formData.spaceType"
          @change="getPageData(1)"
          filterable
          placeholder="请选择状态"
          class="width150px fl"
          clearable>
          <el-option
            v-for="item in typeList"
            :label="item.text"
            :value="item.val"
            :key="item.val"></el-option>
        </el-select>

        <el-button @click="exportExcel" class="lh-btn-export fr">
          <lh-svg icon-class="icon-download" />导出
        </el-button>
      </div>

      <!--空间地区分布图表-->
      <div class="space-detail clearfix mb32">
        <div class="space-table">
          <el-table :data="tableData" :empty-text="tableEmpty" :slot="tableEmpty" v-loading="tableLoading" border style="width: 100%">
            <el-table-column label="排名" prop="contactTel" align="left" ></el-table-column>
            <el-table-column label="城市" prop="moduleName" align="left"></el-table-column>
            <el-table-column label="已开通空间数" prop="contact" align="left"></el-table-column>
            <el-table-column label="占比" prop="contactTel" align="left" ></el-table-column>
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
        <div id="myChart1" class="space-echart" style="width: 32%; height: 400px;"></div>
      </div>

      <div class="card-body-title">场地地区分布</div>
      <div class="select-type mt16 clearfix">
        <el-select
          v-model="formData.fieldType"
          @change="getPageData(1)"
          filterable
          placeholder="请选择状态"
          class="width150px fl"
          clearable>
          <el-option
            v-for="item in typeList"
            :label="item.text"
            :value="item.val"
            :key="item.val"></el-option>
        </el-select>

        <el-button @click="exportExcel" class="lh-btn-export fr">
          <lh-svg icon-class="icon-download" />导出
        </el-button>
      </div>
      <div class="area-profile clearfix mb16">
        <div class="profile-box">
          <span class="profile-title">全部场地</span>
          <span class="profile-count">100</span>
        </div>
        <div class="profile-box">
          <span class="profile-title">移动工位(天)</span>
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

      <!--场地地区分布图表-->
      <div class="space-detail clearfix mb24">
        <div class="space-table">
          <el-table :data="tableData" :empty-text="tableEmpty" :slot="tableEmpty" v-loading="tableLoading" border style="width: 100%">
            <el-table-column label="排名" prop="contactTel" align="left" ></el-table-column>
            <el-table-column label="城市" prop="moduleName" align="left"></el-table-column>
            <el-table-column label="已开通空间数" prop="contact" align="left"></el-table-column>
            <el-table-column label="占比" prop="contactTel" align="left" ></el-table-column>
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
        <div id="myChart2" style="width: 32%; height: 400px;"></div>
      </div>

    </div>
  </div>
</template>

<script>
  import statisticsAreaMixin from './statistics-area.mixin'
  import tableMixins from '@/mixins/table'
  // 引入echarts
  import echarts from 'echarts'
  import Vue from 'vue'
  import 'echarts/theme/macarons.js'
  Vue.prototype.$echarts = echarts

  export default {
    mixins: [tableMixins, statisticsAreaMixin],
    components: {},
    data () {
      return {
        statisticsChart1: '', // charts
        screenWidth: document.body.clientWidth, // 屏幕宽度
        option1: {
          title: {
            text: '天气情况统计',
            subtext: '虚构数据',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          legend: {
            // orient: 'vertical',
            // top: 'middle',
            bottom: 10,
            left: 'center',
            data: ['西凉', '益州', '兖州', '荆州', '幽州']
          },
          series: [
            {
              type: 'pie',
              radius: '65%',
              center: ['50%', '50%'],
              selectedMode: 'single',
              data: [
                { value: 1548, name: '幽州' },
                { value: 555, name: '荆州' },
                { value: 510, name: '兖州' },
                { value: 634, name: '益州' },
                { value: 735, name: '西凉' }
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      }
    },
    mounted () {
      this.drawLine1();
      const that = this
      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth
          that.screenWidth = window.screenWidth
        })()
      }
    },
    methods: {
      drawLine1 () {
        let self = this
        // 基于准备好的dom，初始化echarts实例
        self.statisticsChart1 = echarts.init(document.getElementById('myChart1'), 'macarons')
        // 绘制图表
        self.statisticsChart1.setOption(this.option1);
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
            that.statisticsChart1.resize()
            that.drawLine1()
          }, 400)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .statistics-area {
    .card-body-title{
      font-size: 16px;
    }
    .space-detail{
      width: 100%;
      border: 1px solid rgb(220, 223, 230);
      border-radius: 4px;
      padding: 24px;
      box-sizing: border-box;

      .space-table{
        width: 65%;
        margin-right: 3%;
        float: left;
      }
      .space-echart{
        width: 32%;
        height: 200px;
        float: left;
      }
    }
    .area-profile{
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
  }
</style>
