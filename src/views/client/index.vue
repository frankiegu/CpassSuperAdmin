<template>
  <div class="client-list main-content">
    <lh-title :title="'客户列表'"></lh-title>

    <div class="card-padding">
      <el-form :model="formData" :inline="true" class="text-right">
        <router-link
          to="/client/add"
          class="btn-link fl el-icon-circle-plus"
          tag="a">
          &nbsp;新增客户
        </router-link>

        <el-form-item>
          <el-date-picker
            v-model="formData.date"
            type="daterange"
            align="right"
            clearable
            @change="getPageData"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            placeholder="选择下单日期"
            :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model.trim="formData.no"
            @keyup.native.enter="getPageData"
            placeholder="请输入客户名称"
            class="width220px">

            <i slot="suffix" @click="getPageData" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <div class="fr">
          <el-button
            @click="exportExcel"
            class="btn-green fr"
            icon="el-icon-download">导出表格</el-button>
        </div>
      </el-form>

      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        class="width100" border>

        <el-table-column label="客户名称">
          <template slot-scope="scope">
            <router-link
              :to="{path: '/client/detail', query: {id: scope.row.id}}"
              class="table-link">
              {{ scope.row.orderNum }}
            </router-link>
          </template>
        </el-table-column>

        <el-table-column label="联系人" prop="name"></el-table-column>
        <el-table-column label="联系电话" prop="name"></el-table-column>
        <el-table-column label="联系邮箱" prop="name"></el-table-column>

        <el-table-column label="生成时间" prop="companyName">
          <template slot-scope="scope">
            <i class="el-icon-time"></i> {{ scope.row.created }}
          </template>
        </el-table-column>

        <el-table-column label="生成渠道" prop="storeName"></el-table-column>
        <el-table-column label="产品" prop="storeName"></el-table-column>
        <el-table-column label="有效期" prop="storeName"></el-table-column>

        <el-table-column label="状态">
          <template slot-scope="scope">
            <div class="label-con">
              <el-tag v-if="scope.row.statusCode===1" type="success">正常</el-tag>
              <el-tag v-else-if="scope.row.statusCode===2" type="error">停用</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <router-link
              v-show="scope.row.payStatus !== 20 && scope.row.status === 10"
              :to="{path: '/order/booking/detail', query: {id: scope.row.id, charge: 1}}"
              class="table-link" >现场收费</router-link>
          </template>
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
    </div>
  </div>
</template>

<script>
  import { API_PATH } from '@/config/env'
  import tableMixins from '@/config/mixins/table'
  import {comPickerOptions} from '@/config/data/head'
  import { formatTimeString, downloadFile } from '@/config/utils'
  export default {
    mixins: [tableMixins],
    data () {
      return {
        orderStatusList: {},
        statusList: [],
        pickerOptions: comPickerOptions,
        formData: {
          date: '',
          companyId: null,
          storeId: null,
          fieldId: null,
          orderStatus: null,
          no: null,
          startDate: null,
          endDate: null
        }
      }
    },
    mounted () {
      this.getPageData()
    },
    methods: {
      formatter(row, column) {
        return '￥ ' + row.payAmount
      },
      getPageData() {
        this.tableEmpty = '暂时无数据'
      },
      exportExcel() {
        if (!this.tableData.length) {
          return this.setMsg('暂无数据')
        }
        const downParams = {
          storeId: this.formData.storeId,
          orderStatus: this.formData.orderStatus,
          no: this.formData.no,
          startDate: this.formData.date ? formatTimeString(this.formData.date[0]) : null,
          endDate: this.formData.date ? formatTimeString(this.formData.date[1]) : null
        }
        let url = API_PATH + '/manage/order/exportOrderInfo'
        downloadFile(url, downParams)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .client-list {
  }
</style>
