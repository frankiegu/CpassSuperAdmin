<template>
  <div class="statistics-browsing">
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
  import option from '@/components/option'
  import pickerOptions from '@/mixins/pickerOptions'
  import tableMixins from '@/mixins/table'
  export default {
    mixins: [statisticsBrowsingMixin, tableMixins, pickerOptions],
    components: {},
    data () {
      return {
        [option.name]: option
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
    .echarts-box{
      width: 100%;
      height: 300px;
    }
  }
</style>
