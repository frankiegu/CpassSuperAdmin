<template>
  <div class="lh-statistics">
    <el-row :gutter="20" class="data-statistics">
      <el-col v-for="(item, index) in statisticsData" :key="index" :span="6">
        <div class="grid-content statistics-item">
          <span class="fl ml15 font-size-14px">{{item.text}}</span>
          <div class="fr mr20 font-size-25px" :class="item.type">{{ item.num }}</div>
        </div>
      </el-col>
    </el-row>

    <el-form :model="formData" :inline="true" class="mr-10 text-right">
      <el-form-item class="width170px">
        <el-select
          v-model="formData.store"
          @change="getPageData"
          placeholder="所属门店"
          clearable>

          <el-option
            v-for="i in storeList"
            :label="i.storeName"
            :value="i.id"
            :key="i.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="formData.rangeDate"
          @change="getPageData"
          :picker-options="pickerOptions"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          placeholder="选择日期"
          type="daterange"
          align="right"></el-date-picker>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      :empty-text="tableEmpty"
      :slot="tableEmpty"
      v-loading="tableLoading"
      class="width100" border>
      <el-table-column label="排名" prop="sortnum" width="75" sortable>
        <template slot-scope="scope">
          <span :class="{'table-sort': (scope.row.sortnum < 4)}">
            {{ scope.row.sortnum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管家" prop="keeperName"></el-table-column>
      <el-table-column label="门店" prop="storeName"></el-table-column>
      <el-table-column label="已接单数" prop="accepted" sortable></el-table-column>
      <el-table-column label="未完成单数" prop="unfinish" sortable></el-table-column>
    </el-table>

    <el-pagination
      :total="pageTotal"
      :page-size="pageSize"
      :current-page="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 30, 40]"
      class="pagination-container"
      background></el-pagination>
  </div>
</template>

<script>
  import tableMixins from '@/config/mixins/table'
  import {comPickerOptions} from '@/config/data/head'
  import { formatTimeString } from '@/config/utils'
  import allStore from '@/config/mixins/head/getAllStore'
  import { getOrderStat, listOrderStat } from '@/service/housekeeper'

  export default {
    mixins: [allStore, tableMixins],
    props: ['activeIndex'],
    data () {
      return {
        pickerOptions: comPickerOptions,
        formData: { store: '', rangeDate: '' },
        statisticsData: [
          {num: 0, text: '所有工单', type: 'theme-blue'},
          {num: 0, text: '执行中', type: 'theme-red'},
          {num: 0, text: '未接单', type: 'theme-gray'},
          {num: 0, text: '已完成', type: 'theme-green'}
        ]
      }
    },
    watch: {
      activeIndex: {
        handler: function (val, oldVal) {
          if (val === 0) {
            this.getPageData()
          }
        },
        immediate: true
      }
    },
    mounted() {
      getOrderStat().then(res => {
        if (res.status === 'true') {
          let data = res.info
          this.statisticsData[0].num = data.ALL || 0
          this.statisticsData[1].num = data.ACCEPTED || 0
          this.statisticsData[2].num = data.WAIT_ACCEPT || 0
          this.statisticsData[3].num = data.FINISHED || 0
        }
      })
      this.getPageData()
    },
    methods: {
      formatTime(time) {
        return formatTimeString(time)
      },
      getPageData() {
        let formData = this.formData
        const ajaxParams = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          storeId: formData.store,
          startDate: formData.rangeDate ? formatTimeString(formData.rangeDate[0]) : null,
          endDate: formData.rangeDate ? formatTimeString(formData.rangeDate[1]) : null
        }
        listOrderStat(ajaxParams).then(res => {
          if (res.status === 'true') {
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
            this.tableEmpty = '暂时无数据'
            this.setMsg('error', res.msg)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .lh-statistics {
    .data-statistics {
      margin-bottom: 20px;

      .statistics-item {
        height: 60px;
        line-height: 60px;
        text-align: center;
        border-radius: 4px;
        background-color: #eff2fc;
      }
    }
  }
</style>
