<template>
  <div class="order-field">
    <div class="card-padding">
      <el-form :inline="true" class="text-right mr-10">
        <el-form-item class="fr">
          <el-button @click="exportExcel" class="lh-btn-export">
            <lh-svg icon-class="icon-download" />导出
          </el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        class="width100" border>

        <el-table-column label="交易号" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.phone }}
          </template>
        </el-table-column>

        <el-table-column label="领取时间" fixed="left" align="left" :min-width="100">
          <template slot-scope="scope">
            {{ scope.row.createDate }}
          </template>
        </el-table-column>

        <el-table-column label="领取人" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.phone }}
          </template>
        </el-table-column>

        <el-table-column label="卡券名称" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.couponName }}
          </template>
        </el-table-column>

        <el-table-column label="状态" align="left">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.redemptionStatus === 10">未使用</el-tag>
            <el-tag type="success" v-if="scope.row.redemptionStatus === 20">已兑换</el-tag>
            <el-tag type="danger" v-if="scope.row.redemptionStatus === 30">已失效</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="核销点" align="left">
          <template slot-scope="scope">
            {{ scope.row.couponName }}
          </template>
        </el-table-column>

        <el-table-column label="核销员" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.shopName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="核销时间" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.shopName }}</span>
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
  import { downloadFile } from '@/config/utils'
  import tableMixins from '@/mixins/table'
  import { cantonfairCoupon } from '@/service/canton-fair'

  export default {
    mixins: [tableMixins],
    components: {},
    data () {
      return {
      }
    },
    mounted () {
      this.getPageData()
    },
    methods: {
      getPageData() {
        const self = this
        const paramsObj = {
          pageSize: self.pageSize,
          pageNum: self.currentPage
        }
        cantonfairCoupon(paramsObj).then(res => {
          if (res.status === 'true') {
            if (res.info) {
              let data = res.info
              if (data) {
                if (data.result) {
                  this.pageTotal = data.total
                  this.tableData = data.result || []
                }
              }

              this.tableLoading = false
              if (this.tableData.length === 0) {
                this.tableEmpty = '暂时无数据'
              }
            } else {
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
        let url = API_PATH + '/supervisor/feedback/export'
        downloadFile(url)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .order-field {
    .operate-btn {
      padding: 6px;
    }
    .detail-info{
      clear: both;
      .label{
        width: 80px;
        float: left;
      }
      .label-con{
        float: left;
        width: calc(100% - 80px);
        margin-bottom: 10px;
      }
    }
  }
</style>
