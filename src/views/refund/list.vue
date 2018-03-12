<template>
  <div class="order-field">
    <lh-title></lh-title>

    <div class="content-body card-body">
      <el-form :model="formData" :inline="true" class="text-right mr-10">
        <el-form-item>
          <el-input
            v-model.trim="formData.name"
            @keyup.native.enter="getPageData"
            placeholder="请输入订单编号"
            class="width220px">

            <i slot="suffix" @click="getPageData" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>
      </el-form>

      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        class="width100" border>

        <el-table-column label="订单编号" fixed="left" align="left">
          <template slot-scope="scope">
            <router-link
              :to="{path: '/refund/detail', query: {id: scope.row.id}}"
              class="table-link">
              {{ scope.row.name }}
            </router-link>
          </template>
        </el-table-column>

        <el-table-column label="申请时间" :formatter="formatTime" align="left" width="155">
          <template slot-scope="scope">
            <span>2018-02-12 21:20</span>
          </template>
        </el-table-column>

        <el-table-column label="联系人" align="left">
          <template slot-scope="scope">
            <span>邓先生</span>
          </template>
        </el-table-column>

        <el-table-column label="联系方式" align="left"></el-table-column>
        <el-table-column label="订单类型" align="left"></el-table-column>
        <el-table-column label="所属空间" align="left"></el-table-column>
        <el-table-column label="所属门店" align="left"></el-table-column>
        <el-table-column label="退款金额"  :formatter="formatPrice" align="left">
          <template slot-scope="scope">
            <span>￥112</span>
          </template>
        </el-table-column>

        <el-table-column label="退款状态" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.email === 10">待审批</span>
            <span v-else-if="scope.row.email === 20">已处理</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <router-link
              :to="{path: '/refund/detail', query: {id: scope.row.id}}"
              class="table-link">
              审批
            </router-link>
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
  import tableMixins from '@/mixins/table'
  import refundMixins from './list.mixins'
  import { clientList } from '@/service/client'

  export default {
    mixins: [refundMixins, tableMixins],
    components: {},
    data () {
      return {
        formData: {
          name: ''
        }
      }
    },
    mounted () {
      this.getPageData()
    },
    methods: {
      formatPrice(row, column) {
        return '￥ ' + row.email
      },
      formatTime(row, column) {
        return row.email
        // return row.email.replace(/:\d{2}$/, '')
      },
      getPageData() {
        const paramsObj = {
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          name: this.formData.name
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .order-field {
  }
</style>
