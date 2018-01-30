<template>
  <div class="client-list main-content">
    <lh-title title="客户列表"></lh-title>

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

        <el-table-column label="客户名称" fixed="left" align="left">
          <template slot-scope="scope">
            <router-link
              :to="{path: '/client/detail', query: {id: scope.row.id}}"
              class="table-link">
              {{ scope.row.name1 }}
            </router-link>
          </template>
        </el-table-column>

        <el-table-column label="联系人" prop="name" align="left"></el-table-column>
        <el-table-column label="联系电话" prop="name2" width="110" align="left"></el-table-column>
        <el-table-column label="联系邮箱" prop="name3" width="165" align="left"></el-table-column>
        <el-table-column label="生成时间" prop="name" align="left">
          <template slot-scope="scope">
            <i class="el-icon-time"></i> {{ scope.row.name }}
          </template>
        </el-table-column>

        <el-table-column label="生成渠道" prop="name" align="left"></el-table-column>
        <el-table-column label="产品" prop="name" align="left">
          <template slot-scope="scope">
            <div class="label-con">
              <span v-if="scope.row.type===1">免费版</span>
              <span v-else-if="scope.row.type===2">专业版</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="有效期" prop="name" align="left"></el-table-column>
        <el-table-column label="状态" align="left">
          <template slot-scope="scope">
            <div class="label-con">
              <el-tag v-if="scope.row.status===1" type="success">正常</el-tag>
              <el-tag v-else-if="scope.row.status===2" type="danger">停用</el-tag>
            </div>
          </template>
        </el-table-column>

        <!-- @#TODO table内筛选 -->
        <el-table-column
          fixed="right"
          align="left"
          label="操作"
          width="110">
          <template slot-scope="scope">
            <router-link
              :to="{path: '/client/modify', query: {id: scope.row.id}}"
              class="table-link margin-lr6">编辑</router-link>

            <router-link
              v-if="scope.row.account === 2"
              :to="{path: '/client/account', query: {id: scope.row.id}}"
              class="table-link">
              账户
              <!-- <el-tooltip content="点击查看账户信息" placement="top" effect="light">
                <lh-svg icon-class="icon-order" :size="15" class="svg-icon"/>
              </el-tooltip> -->
            </router-link>

            <span class="theme-gray" v-else>无账户</span>
            <!-- <el-tooltip v-else content="未开通账户" placement="top" effect="light">
              <lh-svg icon-class="icon-file-empty" :size="13" class="svg-icon" />
            </el-tooltip> -->
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
        this.tableData = [
          {id: 1, name1: 'xxx有限公司', name2: '15989026006', name3: '2395456928@qq.com', name: 'name', status: 2, type: 1, account: 1},
          {id: 2, name1: 'xxx有限公司', name2: '15989026006', name3: '2395456928@qq.com', name: 'name', status: 2, type: 1, account: 2}
        ]
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
  @import "src/styles/config";
  .client-list {
    .svg-icon {
      color: $theme-blue;
      margin: 0 7px;
    }
  }
</style>
