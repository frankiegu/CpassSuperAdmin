<template>
  <div class="client-list main-content">
    <lh-title title="客户列表"></lh-title>

    <div class="card-padding">
      <el-form :model="formData" :inline="true" class="text-right">
        <router-link
          to="/client/add"
          class="btn-link fl "
          tag="a">
          &nbsp;新增客户
        </router-link>

        <el-form-item>
          <el-select
            v-model="formData.registerWay"
            placeholder="请选择生成渠道"
            class="width150px">
            <el-option
              v-for="i in channels"
              :label="i.channel"
              :value="i.id"
              :key="i.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="formData.validaty"
            placeholder="请选择有效期"
            class="width150px">
            <el-option
              v-for="i in timeValidity"
              :label="i.validity"
              :value="i.id"
              :key="i.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="formData.productStatus"
            placeholder="状态"
            class="width100px"
            multiple>
            <lh-option :statusList="statusList"></lh-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-date-picker
            v-model="formData.reg_date"
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
            v-model.trim="formData.name"
            @keyup.native.enter="getPageData"
            placeholder="请输入客户名称"
            class="width150px">

            <i slot="suffix" @click="getPageData" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <!-- @#TODO 接口没有出 -->
        <div class="fr">
          <el-button
            @click="exportExcel"
            class="btn-green fr">导出表格</el-button>
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
              {{ scope.row.name }}
            </router-link>
          </template>
        </el-table-column>

        <el-table-column label="联系人" prop="contact" align="left"></el-table-column>
        <el-table-column label="联系电话" prop="phone" width="110" align="left"></el-table-column>
        <el-table-column label="联系邮箱" prop="email" width="165" align="left"></el-table-column>
        <el-table-column label="生成时间" align="left" width="155">
          <template slot-scope="scope">
            <i class="el-icon-time"></i> {{ formatTime(scope.row.createDate) }}
          </template>
        </el-table-column>

        <el-table-column label="生成渠道" align="left">
          <template slot-scope="scope">
            <div class="label-con">
              <span v-if="scope.row.registerWay===1">后台创建</span>
              <span v-else>自助注册</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="产品" prop="productName" align="left" width="65"></el-table-column>
        <el-table-column label="有效期" prop="validatyAlias" align="left"></el-table-column>
        <el-table-column label="状态" align="left" width="65">
          <template slot-scope="scope">
            <div class="label-con">
              <el-tag v-if="scope.row.productStatus===1" type="success">正常</el-tag>
              <el-tag v-else type="danger">停用</el-tag>
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
              :to="{path: scope.row.account === 2 ? '/client/modify' : '/client/add', query: {id: scope.row.id}}"
              class="table-link margin-lr6">编辑</router-link>

            <router-link
              v-if="scope.row.adminUserId"
              :to="{path: '/client/account', query: {id: scope.row.adminUserId}}"
              class="table-link">
              账户
            </router-link>

            <span class="theme-gray" v-else>无账户</span>
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
  import tableMixins from '@/mixins/table'
  import indexMixins from './index.mixins'
  import option from '@/components/option'
  import pickerOptions from '@/mixins/pickerOptions'
  import { formatTimeString, downloadFile } from '@/config/utils'
  import { listClient } from '@/service/client'

  export default {
    mixins: [tableMixins, pickerOptions, indexMixins],
    components: {
      [option.name]: option
    },
    data () {
      return {}
    },
    mounted () {
      this.getPageData()
    },
    methods: {
      formatTime(time) {
        return time.replace(/:\d{2}$/, '')
      },
      getPageData() {
        let formData = this.formData
        const paramsObj = {
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          name: formData.name,
          createStartDate: this.formData.reg_date ? formatTimeString(this.formData.reg_date[0]) : null,
          createEndDate: this.formData.reg_date ? formatTimeString(this.formData.reg_date[1]) : null,
          registerWay: formData.registerWay,
          validaty: formData.validaty,
          productStatus: formData.productStatus
        }

        listClient(paramsObj).then(res => {
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
            this.setMsg('error', res.msg)
          }
        })
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
  @import "../../styles/config";
  .client-list {
    .svg-icon {
      color: $theme-blue;
      margin: 0 7px;
    }
  }
</style>
