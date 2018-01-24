<template>
  <div class="housekeeper-order">
    <div class="page-title"> <h1>管家工单</h1></div>

    <div class="card-padding">
      <el-form :model="keeperOrder" :inline="true" class="mr-10 text-right">
        <el-form-item class="width170px">
          <el-select
            v-model="keeperOrder.store"
            @change="getPageData"
            placeholder="请选择所属门店"
            clearable>

            <el-option
              v-for="i in storeList"
              :label="i.storeName"
              :value="i.id"
              :key="i.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="width170px">
          <el-select
            v-model="keeperOrder.orderTypeId"
            @change="getPageData"
            placeholder="请选择服务类型"
            clearable>

            <el-option
              v-for="i in serviceTypeList"
              :label="i.typeName"
              :value="i.id"
              :key="i.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="width170px">
          <el-select
            v-model="keeperOrder.orderStatus"
            @change="getPageData"
            placeholder="请选择工单状态"
            clearable>

            <lh-option :statusList="levelList"></lh-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-date-picker
            v-model="keeperOrder.reg_date"
            @change="getPageData"
            :picker-options="pickerOptions"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            type="daterange"
            align="right"></el-date-picker>
        </el-form-item>

        <el-form-item v-permissions="'/manage/spaceKeeperOrder/export'">
          <el-button
            @click="exportExcel"
            icon="el-icon-download"
            class="btn-green">导出表格</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        class="width100" border>

        <el-table-column label="工单编号" width="150">
          <template slot-scope="scope">
            <router-link class="table-link" :to="{path: '/housekeeper/order/detail', query: {id: scope.row.id}}">
              {{ scope.row.orderNumber }}
            </router-link>
          </template>
        </el-table-column>

        <el-table-column label="提交时间" prop="createTime" width="155" sortable>
          <template slot-scope="scope">
            <i class="el-icon-time"></i> {{ formatTime(scope.row.createTime) }}</template>
         </el-table-column>

        <el-table-column prop="orderName" label="工单标题"></el-table-column>
        <el-table-column prop="orderTypeName" label="服务类型"></el-table-column>
        <el-table-column label="服务时间" prop="requireTime" width="155" sortable>
          <template slot-scope="scope">
            <i class="el-icon-time"></i> {{ formatTime(scope.row.requireTime) }}</template>
         </el-table-column>

        <el-table-column label="工单状态">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.orderStatusName"
              :type="scope.row.orderStatusName | statusFilter(filtersStatusList)">
              {{scope.row.orderStatusName}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="companyName" label="所属公司"></el-table-column>
        <el-table-column prop="contact" label="联系人"></el-table-column>
        <el-table-column prop="phone" label="联系方式" width="110"></el-table-column>
        <el-table-column prop="keeperName" label="接单管家" width="110"></el-table-column>

        <el-table-column
          v-if="handleHasPermissions(['/manage/spaceKeeperOrder/accept'])"
          label="操作"
          fixed="right"
          width="80">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.canAcceptOrder"
              @click="showDialog(scope.row.id, scope.row.contact, scope.row.phone)" size="mini">接单</el-button></template>
        </el-table-column>
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

      <keeper-dialog
        :orderId="orderId"
        :dialogVisible="dialogVisible"
        @getPageData="getPageData"
        @updateDialogStatus="val => dialogVisible = val"></keeper-dialog>
    </div>
  </div>
</template>

<script>
  import { pageData } from './list.data'
  import option from '@/components/option'
  import headMixins from '@/config/mixins/head'
  import keeperDialog from './components/dialog'
  import tableMixins from '@/config/mixins/table'
  import { API_PATH } from '@/config/env'
  import {comPickerOptions} from '@/config/data/head'
  import { formatTimeString, downloadFile } from '@/config/utils'
  import { keeperOrderList, serviceTypeList } from '@/service/housekeeper'

  export default {
    mixins: [headMixins, tableMixins],
    components: { keeperDialog, [option.name]: option },
    data () {
      return {
        levelList: pageData.levelList,
        pickerOptions: comPickerOptions,
        serviceTypeList: [],
        keeperOrder: {
          orderTypeId: '',
          orderStatus: '',
          store: '',
          reg_date: ''
        },
        filtersStatusList: pageData.statusList,
        // dialog
        dialogVisible: false,
        orderId: ''
      }
    },
    mounted () {
      serviceTypeList().then(res => {
        if (res.status === 'true') {
          this.serviceTypeList = res.info
          this.serviceTypeList.unshift({'id': ' ', 'typeName': '全部类型'})
        }
      })
      this.getPageData()
    },
    methods: {
      formatTime(time) {
        return formatTimeString(time, 'yyyy-MM-dd HH:mm')
      },
      showDialog(id) {
        this.dialogVisible = true
        this.orderId = id
      },
      getPageData() {
        let keeperOrder = this.keeperOrder
        const paramsObj = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          storeId: keeperOrder.store,
          orderTypeId: keeperOrder.orderTypeId,
          orderStatus: keeperOrder.orderStatus,
          startDate: keeperOrder.reg_date ? formatTimeString(keeperOrder.reg_date[0]) : null,
          endDate: keeperOrder.reg_date ? formatTimeString(keeperOrder.reg_date[1]) : null
        }
        keeperOrderList(paramsObj).then(res => {
          if (res.status === 'true') {
            let data = res.info
            this.pageTotal = data.total
            this.tableData = data.result

            this.tableLoading = false
            if (this.tableData.length === 0) {
              this.tableEmpty = '暂时无数据'
            }
          } else {
            this.tableEmpty = '暂时无数据'
            this.setMsg('error', res.msg)
          }
        })
      },
      exportExcel() {
        if (!this.tableData.length) {
          return this.setMsg('暂无数据')
        }
        let keeperOrder = this.keeperOrder
        const downParams = {
          storeId: keeperOrder.store,
          orderTypeId: keeperOrder.orderTypeId,
          orderStatus: keeperOrder.orderStatus,
          startDate: keeperOrder.reg_date ? formatTimeString(keeperOrder.reg_date[0]) : null,
          endDate: keeperOrder.reg_date ? formatTimeString(keeperOrder.reg_date[1]) : null
        }
        let url = API_PATH + '/manage/spaceKeeperOrder/export'
        downloadFile(url, downParams)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .housekeeper-order {
    .members-total {
      margin-right: 12px;
      font-size: 14px;
    }
    .cell .el-select {
      width: auto;
      padding: 10px 0;
    }
  }
</style>
