<template>
  <div class="action-log-list main-content">
    <lh-title title="操作记录"></lh-title>

    <el-form :model="logSort" :inline="true" class="lh-form-box">
      <el-form-item>
        <el-date-picker
          v-model="logSort.date"
          @change="getPageData(1)"
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
          @change="getPageData(1)"
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

      <el-form-item>
        <el-input
          v-model.trim="logSort.adminUserId"
          @keyup.native.enter="getPageData(1)"
          placeholder="请输入操作人"
          class="lh-form-input"
          clearable>

          <i slot="suffix" @click="getPageData(1)" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-form-item>

    </el-form>

    <div class="lh-card-main">

      <div class="lh-form-table-head">
        <el-button
          v-if="handleHasPermissions('/supervisor/operationLog/exportLogInfo')"
          @click="exportExcel"
          class="lh-btn-export fr">
          <lh-svg icon-class="icon-download" />导出
        </el-button>
      </div>

      <el-tabs v-model="type" class="lh-form-tab lh-form-tab-mb0" @tab-click="getPageData">
        <el-tab-pane v-for="item in typeList" :label="item.label" :key="item.key" :name="item.key">
          <div class="mh24 mt24">
            <el-table
              :data="tableData"
              :empty-text="tableEmpty"
              :slot="tableEmpty"
              v-loading="tableLoading"
              class="width100" border>

              <el-table-column label="操作时间">
                <template slot-scope="scope" width="125" sortable>
                  <i class="el-icon-time"></i> {{ scope.row.logTime }}</template>
              </el-table-column>
              <el-table-column label="操作人" prop="adminUserName"></el-table-column>
              <el-table-column label="操作模块" prop="logModule"></el-table-column>
              <el-table-column label="操作记录" prop="logAction"></el-table-column>
              <el-table-column label="操作对象" prop="targetName"></el-table-column>
            </el-table>

            <el-pagination
              :total="pageTotal"
              :layout="layoutArr"
              :page-size="pageSize"
              :page-sizes="pageSizeArr"
              :current-page="currentPage"
              class="pagination-container mb22"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              background></el-pagination>
          </div>

        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>

<script>
  import tableMixins from '@/mixins/table'
  import indexMixins from './index.mixins'

  export default {
    mixins: [tableMixins, indexMixins],
    data () {
      return {}
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/variables';
  .action-log-list main-content {
    .sort-form-bar {
      text-align: right;
    }
  }
</style>
