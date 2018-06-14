<template>
  <div class="statistics-order">
    <div class="card-padding">

      <div class="card-body-title">场地概况</div>
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

      <div class="area-profile clearfix mb16">
        <div class="profile-box">
          <span class="profile-title">总订单数</span>
          <span class="profile-count">100</span>
        </div>
        <div class="profile-box">
          <span class="profile-title">待使用</span>
          <span class="profile-count">0</span>
        </div>
        <div class="profile-box">
          <span class="profile-title">已使用</span>
          <span class="profile-count">58</span>
        </div>
        <div class="profile-box">
          <span class="profile-title">待退款</span>
          <span class="profile-count">20</span>
        </div>
        <div class="profile-box">
          <span class="profile-title">已退款/已取消</span>
          <span class="profile-count">2</span>
        </div>
      </div>
      <div class="area-profile-count clearfix mb16">
        <div class="profile-count yd-bor" :class="{'profile-count-select' : true}">
          <span class="count-left">移动工位订单</span>
          <span class="count-right fr">10</span>
        </div>
        <div class="profile-count sz-bor">
          <span class="count-left">时租工位订单</span>
          <span class="count-right fr">10</span>
        </div>
        <div class="profile-count hys-bor">
          <span class="count-left">会议室订单</span>
          <span class="count-right fr">10</span>
        </div>
        <div class="profile-count lyt-bor">
          <span class="count-left">路演厅订单</span>
          <span class="count-right fr">10</span>
        </div>
        <div class="profile-count dgn-bor">
          <span class="count-left">多功能订单</span>
          <span class="count-right fr">10</span>
        </div>
      </div>

      <!--统计图-->
      <div class="echarts-box">
        <span style="font-size: 200px; text-align: center"></span>
      </div>

      <div class="select-type mt10 mb10">
        <span class="lh32">品牌浏览量统计明细</span>
        <el-button @click="exportExcel" class="lh-btn-export fr">
          <lh-svg icon-class="icon-download" />导出
        </el-button>
      </div>

      <!--统计表格-->
      <div>
        <el-table :data="tableData" :empty-text="tableEmpty" :slot="tableEmpty" v-loading="tableLoading" border style="width: 100%">
          <el-table-column label="日期" prop="contactTel" align="left" ></el-table-column>
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
  import option from '@/components/option'
  import pickerOptions from '@/mixins/pickerOptions'
  import tableMixins from '@/mixins/table'

  export default {
    mixins: [tableMixins, statisticsOrderMixin, pickerOptions],
    components: {
      [option.name]: option
    },
    data () {
      return {
      }
    },
    mounted () {
    },
    methods: {
      changePeriod (id) {
        this.periodId = id
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

  }
</style>
