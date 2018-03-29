<template>
  <div class="order-field">
    <lh-title></lh-title>

    <div class="content-body card-body">
      <!--<el-form :model="formData" :inline="true" class="text-right mr-10">-->
        <!--<el-form-item>-->
          <!--<el-input-->
            <!--v-model.trim="formData.name"-->
            <!--@keyup.native.enter="getPageData"-->
            <!--placeholder="请输入订单编号"-->
            <!--class="width220px">-->

            <!--<i slot="suffix" @click="getPageData" class="el-input__icon el-icon-search"></i>-->
          <!--</el-input>-->
        <!--</el-form-item>-->
      <!--</el-form>-->

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
              {{ scope.row.referenceNum }}
            </router-link>
          </template>
        </el-table-column>

        <el-table-column label="申请时间" :formatter="formatTime" align="left" width="155">
        </el-table-column>

        <el-table-column label="联系人" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="联系方式" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.telephone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单类型" align="left">
          <template slot-scope="scope">
            <span>场地订单</span>
          </template>
        </el-table-column>
        <el-table-column label="所属空间" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.spaceName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属门店" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.storeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退款金额"  :formatter="formatPrice" align="left">
        </el-table-column>
        <el-table-column label="退款状态" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 10">待审批</span>
            <span v-else-if="scope.row.status === 20">已通过</span>
            <span v-else-if="scope.row.status === 30">已驳回</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left">
          <template slot-scope="scope" v-if="scope.row.status != 20 && scope.row.rejectTimes < 2">
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
  import { refundList } from '@/service/refund'

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
        return '￥ ' + row.refundAmount
      },
      formatTime(row, column) {
        return row.applyDate.substr(0, 16)
        // return row.email.replace(/:\d{2}$/, '')
      },
      getPageData() {
        const self = this
        const paramsObj = {
          pageSize: self.pageSize,
          pageNum: self.currentPage
        }
        refundList(paramsObj).then(res => {
          if (res.status === 'true') {
            let data = res.info
            if (data) {
              if (data.page) {
                this.pageTotal = data.page.total
                this.tableData = data.page.result
              }
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
