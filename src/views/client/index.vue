<template>
  <div class="client-list main-content">
    <lh-title title="客户列表"></lh-title>

    <div class="card-padding">
      <el-form :model="formData" :inline="true" class="lh-card-head">
        <router-link
          class="fl el-icon-circle-plus to-bottom-right"
          to="/client/add" tag="a">
          &nbsp;新增客户
        </router-link>

        <el-form-item>
          <el-select
            v-model="formData.registerWay"
            @change="getPageData(1)"
            placeholder="请选择生成渠道"
            class="width150px"
            clearable>
            <el-option
              v-for="i in channels"
              :label="i.channel"
              :value="i.id"
              :key="i.id"></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item>
          <el-select
            v-model="formData.validaty"
            @change="getPageData"
            placeholder="请选择有效期"
            class="width150px"
            clearable>
            <el-option
              v-for="i in timeValidity"
              :label="i.validity"
              :value="i.id"
              :key="i.id"></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item>
          <el-select
            v-model="formData.productStatus"
            @change="changeStatus(1)"
            placeholder="状态"
            class="width150px"
            clearable>
            <lh-option :statusList="statusList"></lh-option>
          </el-select>
        </el-form-item>

        <!-- 选择的是到期时间，所以是往后选 -->
        <el-form-item>
          <el-date-picker
            v-model="formData.reg_date"
            @change="getPageData(1)"
            type="daterange"
            align="right"
            clearable
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            placeholder="选择下单日期"
            :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model.trim="formData.name"
            @keyup.native.enter="getPageData(1)"
            placeholder="请输入客户名称"
            class="width220px">

            <i slot="suffix" @click="getPageData(1)" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="exportExcel" icon="el-icon-download" class="btn-green">导出表格</el-button>
        </el-form-item>
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
        <el-table-column label="联系邮箱" prop="email" align="left"></el-table-column>
        <el-table-column label="生成时间" prop="createDate" align="left" width="155"></el-table-column>
        <el-table-column label="生成渠道" prop="registerWay" align="left"></el-table-column>
        <el-table-column label="产品" prop="productName" align="left"></el-table-column>
        <el-table-column label="有效期" prop="validaty" align="left"></el-table-column>

        <!-- 小宽度可以不写死 -->
        <el-table-column label="状态" align="left">
          <template slot-scope="scope">
            <div class="label-con">
              <el-tag v-if="scope.row.productStatus===1" type="success">正常</el-tag>
              <el-tag v-else-if="scope.row.productStatus===0" type="danger">停用</el-tag>
              <el-tag v-else>未开通</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          align="left"
          label="操作"
          width="110">
          <template slot-scope="scope">
            <router-link
              :to="{path: scope.row.adminUserId ? '/client/modify' : '/client/add', query: {id: scope.row.id}}"
              class="table-link mr5">
              编辑
            </router-link>

            <router-link
              v-if="scope.row.adminUserId"
              :to="{path: '/client/account', query: {id: scope.row.id}}"
              class="table-link">
              账户
            </router-link>

            <span class="theme-gray" v-else>无账户</span>
          </template>
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
</template>

<script>
  import { API_PATH } from '@/config/env'
  import tableMixins from '@/mixins/table'
  import indexMixins from './index.mixins'
  import option from '@/components/option'
  import pickerOptions from '@/mixins/pickerOptions'
  import { formatTimeString, downloadFile } from '@/config/utils'
  import { clientList } from '@/service/client'

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
      changeStatus(page) {
        if (this.formData.reg_date && this.formData.productStatus === 2) {
          this.formData.reg_date = null
        }

        this.getPageData(page)
      },
      formatTime(time) {
        return !time ? '' : time.replace(/:\d{2}$/, '')
      },
      getPageData(page) {
        this.currentPage = page || this.currentPage
        const formData = this.formData
        const paramsObj = {
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          name: formData.name,
          // validaty: formData.validaty,
          registerWay: formData.registerWay,
          productStatus: formData.productStatus,
          productStartDate: this.formData.reg_date ? formatTimeString(this.formData.reg_date[0]) : null,
          productEndDate: this.formData.reg_date ? formatTimeString(this.formData.reg_date[1]) : null
        }

        clientList(paramsObj).then(res => {
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
        const formData = this.formData
        const downParams = {
          name: formData.name,
          // validaty: formData.validaty,
          registerWay: formData.registerWay,
          productStatus: formData.productStatus,
          createStartDate: formData.reg_date ? formatTimeString(formData.reg_date[0]) : null,
          createEndDate: formData.reg_date ? formatTimeString(formData.reg_date[1]) : null
        }
        let url = API_PATH + '/supervisor/client/exportAll'
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
