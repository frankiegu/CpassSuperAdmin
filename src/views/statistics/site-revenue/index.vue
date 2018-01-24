<template>
  <div class="site-revenue">
    <div class="page-title">
      <h1>场地营收统计</h1>
    </div>

    <div class="card-padding">
      <!-- 查询筛选 -->
      <el-form :inline="true" :model="revenueSort" class="sort-form-bar clearfix">
        <el-form-item>
          <el-date-picker
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-model="revenueSort.date"
            type="daterange"
            align="right"
            :picker-options="pickerOptions"
            @change="findRevenueList">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-select v-model="revenueSort.storeId" placeholder="进驻门店" @change="findRevenueList" clearable>
            <el-option v-for="storeItem in storeList" :label="storeItem.storeName" :value="storeItem.id" :key="storeItem.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="revenueSort.name"
            @keyup.native.enter="findRevenueList"
            placeholder="请输入场地名称">
            <i slot="suffix" @click="findRevenueList" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <el-form-item v-permissions="'/manage/field/exportFieldRevenue'">
          <el-button class="btn-green" @click="exportExcel" icon="el-icon-download">导出表格</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格list -->
      <el-table :data="revenueTable" border v-loading="tableLoading">
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="fieldName" label="场地"></el-table-column>
        <el-table-column prop="storeName" label="门店"></el-table-column>
        <el-table-column prop="rentDuration" label="租用时长"></el-table-column>
        <el-table-column prop="openDuration" label="开放时长"></el-table-column>
        <el-table-column prop="usageRate" label="使用率"></el-table-column>
        <el-table-column prop="orderNum" label="预约订单数"></el-table-column>
        <el-table-column prop="revenues" label="营收额"></el-table-column>
        <el-table-column label="操作" v-if="handleHasPermissions('/manage/order/findFieldOrder')">
          <template slot-scope="scope">
            <router-link class="table-link" :to="'/space/detail?fieldId=' + scope.row.fieldId + '&date=' + scope.row.date">查看</router-link>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination background
        class="pagination-container"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import handleHasPermissions from '@/config/com-mixins'
  import { findAllStore, getListFieldRevenue } from '@/service'
  import { formatTimeString, downloadFile } from '@/config/utils'
  import { API_PATH } from '@/config/env'
  export default {
    name: 'site-revenue',
    mixins: [handleHasPermissions],
    data () {
      return {
        // 营收统计筛选
        storeList: [],
        revenueSort: {
          date: '',
          storeId: '',
          name: ''
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 3600 * 1000 * 24;
          },
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() - 3600 * 1000 * 24)
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 8)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() - 3600 * 1000 * 24)
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() - 3600 * 1000 * 24)
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },

        // 统计表格
        tableLoading: true,
        revenueTable: [],

        // 分页器配置
        currentPage: 1,
        pageSize: 10,
        pageTotal: 1
      }
    },
    props: {},
    components: {},
    mounted () {
      // 查询场地营收统计列表
      this.findRevenueList()
      // 查询进驻门店
      findAllStore().then(res => {
        if (res.status === 'true' && res.info) {
          this.storeList = res.info
          this.storeList.unshift({'id': ' ', 'storeName': '全部门店'})
        } else {
          console.log(res.msg)
        }
      })
    },
    watch: {},
    computed: {},
    filters: {},
    methods: {
      // 查询场地营收统计列表
      findRevenueList() {
        let params = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          storeId: this.revenueSort.storeId,
          fieldName: this.revenueSort.name,
          startTime: this.revenueSort.date ? formatTimeString(this.revenueSort.date[0]) : null,
          endTime: this.revenueSort.date ? formatTimeString(this.revenueSort.date[1]) : null
        }
        getListFieldRevenue(params).then(res => {
          if (res.status === 'true' && res.info) {
            this.tableLoading = false
            this.revenueTable = res.info.result
            this.pageTotal = res.info.total

            for (let i = 0; i < this.revenueTable.length; i++) {
              this.revenueTable[i].date = res.info.result[i].date ? res.info.result[i].date.split(' ')[0] : null
            }
          } else {
            console.log(res.msg)
          }
        })
      },
      // 导出表格
      exportExcel() {
        if (!this.revenueTable.length) {
          return this.$message.info('暂无数据')
        }
        let downParams = {
          storeId: this.revenueSort.storeId,
          fieldName: this.revenueSort.name,
          startTime: this.revenueSort.date ? formatTimeString(this.revenueSort.date[0]) : null,
          endTime: this.revenueSort.date ? formatTimeString(this.revenueSort.date[1]) : null
        }
        let url = API_PATH + '/manage/field/exportFieldRevenue'
        downloadFile(url, downParams)
      },
      // 分页器事件
      handleSizeChange(val) {
        this.pageSize = val
        this.findRevenueList()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.findRevenueList()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .site-revenue {
    .sort-form-bar {
      margin-right: -10px;
      font-size: 0;
    }
  }
</style>
