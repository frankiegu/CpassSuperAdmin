<template>
  <div class="system-log">
    <div class="page-title"> <h1>操作日志</h1> </div>

    <div class="store-setting card-padding">
      <el-form :model="logSort" :inline="true" class="sort-form-bar">
        <el-form-item>
          <el-date-picker
            v-model="logSort.date"
            @change="getPageData"
            :picker-options="selectDateRange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            placeholder="选择日期范围"
            type="daterange"
            align="right"
            clearable></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="logSort.logModule"
            @change="getPageData"
            placeholder="请选择操作模块"
            clearable>
            <el-option label="全部" value=" ">
            </el-option>
            <el-option
              v-for="(val, key) in logModuleList"
              :key="key"
              :label="val"
              :value="val"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :class="{'mr0': !handleHasPermissions('/manage/operationLog/exportLogInfo')}">
          <el-select
            v-model="logSort.adminUserId"
            @change="getPageData"
            placeholder="请选择操作账号"
            clearable>
            <el-option
              v-for="item in adminList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option></el-select>
        </el-form-item>

        <el-button
          v-permissions="'/manage/operationLog/exportLogInfo'"
          @click="exportExcel"
          :loading="downloadLoading"
          class="btn-green"
          icon="el-icon-download">导出操作日志</el-button>
      </el-form>

      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        class="width100" border>

        <el-table-column label="时间">
          <template slot-scope="scope" width="125" sortable>
            <i class="el-icon-time"></i> {{ scope.row.logTime }}</template>
        </el-table-column>
        <el-table-column label="账号" prop="adminUserName"></el-table-column>
        <el-table-column label="操作模块" prop="logModule"></el-table-column>
        <el-table-column label="操作记录" prop="logAction"></el-table-column>
        <el-table-column label="操作对象" prop="targetName"></el-table-column>
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
  </div>
</template>

<script>
  import {API_PATH} from '@/config/env'
  import tableMixins from '@/config/mixins/table'
  import {comPickerOptions} from '@/config/data/head'
  import {formatTimeString, downloadFile} from '@/config/utils'
  import {logList, listLogModule, adminUserList} from '@/service'

  export default {
    mixins: [tableMixins],
    data () {
      return {
        downloadLoading: false,
        selectDateRange: comPickerOptions,
        date: null,        // 选择日期
        logModuleList: {}, // 日志模块列表
        adminList: [],     // 管理账号列表
        logSort: {         // 筛选条件
          adminUserId: '',
          logModule: '',
          date: ''
        }
      }
    },
    mounted () {
      // 获取日志模块列表
      listLogModule().then(res => {
        if (res.status === 'true') {
          this.logModuleList = res.info
        }
      })
      // 获取管理员账号列表
      adminUserList().then(res => {
        if (res.status === 'true') {
          this.adminList = res.info
          this.adminList.unshift({'id': ' ', 'name': '全部'})
        }
      })
      this.getPageData()
    },
    methods: {
      getPageData() {
        let logSort = this.logSort
        const paramsObj = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          startTime: logSort.date ? formatTimeString(logSort.date[0]) : '',
          endTime: logSort.date ? formatTimeString(logSort.date[1]) : '',
          adminUserId: logSort.adminUserId,
          logModule: logSort.logModule
        }
        logList(paramsObj).then(res => {
          if (res.status === 'true') {
            let data = res.info
            this.pageTotal = data.total
            this.tableData = data.result

            // table的交互
            this.tableLoading = false
            if (this.tableData.length === 0) {
              this.tableEmpty = '暂时无数据'
            }
          } else {
            this.setMsg('error', res.msg)
          }
        })
      },
      exportExcel() {
        if (!this.tableData.length) {
          return this.setMsg('暂无数据')
        }
        let logSort = this.logSort
        const downParams = {
          logModule: logSort.logModule,
          adminUserId: logSort.adminUserId,
          startTime: logSort.date ? formatTimeString(logSort.date[0]) : '',
          endTime: logSort.date ? formatTimeString(logSort.date[1]) : ''
        }
        let url = API_PATH + '/manage/operationLog/exportLogInfo'
        downloadFile(url, downParams)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/config.scss';
  .system-log {
    .sort-form-bar {
      text-align: right;
    }
  }
</style>
