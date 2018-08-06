<template>
  <div class="statistics-area">
    <div class="card-padding">
      <div class="card-body-title">空间地区分布</div>
      <div class="select-type mt16 mb16 clearfix">
        <el-select
          v-model="formData.spaceType"
          @change="getSpaceData(1)"
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

        <el-button @click="exportSpaceExcel" class="lh-btn-export fr">
          <lh-svg icon-class="icon-download" />导出
        </el-button>
      </div>

      <!--空间地区分布图表-->
      <div class="space-detail clearfix mb32">
        <div class="space-table">
          <el-table :data="spaceData" :empty-text="tableEmpty" :slot="tableEmpty" v-loading="tableLoading" border style="width: 100%">
            <el-table-column label="排名" prop="sort" align="left" ></el-table-column>
            <el-table-column label="城市" prop="cityName" align="left"></el-table-column>
            <el-table-column label="已开通空间数" prop="storeCount" align="left"></el-table-column>
            <el-table-column label="占比" prop="percent" align="left" ></el-table-column>
          </el-table>
        </div>
        <div id="myChart1" class="space-echart" style="width: 32%; height: 400px;"></div>
      </div>

      <div class="card-body-title">场地地区分布</div>
      <div class="select-type mt16 clearfix">
        <el-select
          v-model="formData.fieldType"
          @change="getFieldData(1)"
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

        <el-button @click="exportFieldExcel" class="lh-btn-export fr">
          <lh-svg icon-class="icon-download" />导出
        </el-button>
      </div>

      <div class="area-profile clearfix mb16">
        <div class="profile-box selectedBox" :class="{'activeClass': currentIndex === index}" @click="sortByStatus(index, item.key)" v-for="(item, index) in orderTypeList" :key="index">
          <span class="profile-title">{{item.label}}</span>
          <span class="profile-count">{{item.number}}</span>
        </div>
      </div>

      <!--场地地区分布图表-->
      <div class="space-detail clearfix mb24">
        <div class="space-table">
          <el-table :data="fieldData" :empty-text="tableEmpty" :slot="tableEmpty" v-loading="tableLoading" border style="width: 100%">
            <el-table-column label="排名" prop="sort" align="left" ></el-table-column>
            <el-table-column label="城市" prop="cityName" align="left"></el-table-column>
            <el-table-column label="已开通场地数" prop="fieldCount" align="left"></el-table-column>
            <el-table-column label="占比" prop="percent" align="left" ></el-table-column>
          </el-table>
        </div>
        <div id="myChart2" class="space-echart" style="width: 32%; height: 400px;"></div>
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
        statisticsChart2: '', // charts
        screenWidth: document.body.clientWidth, // 屏幕宽度
        option1: {
          title: {
            text: '空间地区统计',
            subtext: '',
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
            data: []
          },
          series: [
            {
              type: 'pie',
              radius: '60%',
              center: ['50%', '50%'],
              selectedMode: 'single',
              data: [],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        },
        option2: {
          title: {
            text: '场地地区统计',
            subtext: '',
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
            data: []
          },
          series: [
            {
              type: 'pie',
              radius: '65%',
              center: ['50%', '50%'],
              selectedMode: 'single',
              data: [],
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
      this.drawLine2();
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
      },
      drawLine2 () {
        let self = this
        // 基于准备好的dom，初始化echarts实例
        self.statisticsChart2 = echarts.init(document.getElementById('myChart2'), 'macarons')
        // 绘制图表
        self.statisticsChart2.setOption(this.option2);
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
        width: 60%;
        margin-right: 4%;
        float: left;
      }
      .space-echart{
        width: 36%;
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
    .activeClass {
      span {
        color: #5A72F6 !important;
      }
    }
  }
</style>
