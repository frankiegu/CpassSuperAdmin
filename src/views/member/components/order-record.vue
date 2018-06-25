<template>
  <div class="order-page">
    <el-row :gutter="20" class="numberCount pl24">
      <el-col :span="5">
        <lh-item class="nowrap" label="订单总数" label-width="80px">
          <span class="num-style table-link" @click="getPageData(1, null)">{{orderStatisticsObj.total}}</span>
        </lh-item>
      </el-col>
      <el-col :span="5">
        <lh-item class="nowrap" label="待使用" label-width="80px">
          <span class="num-style table-link" @click="getPageData(1, 10)">{{orderStatisticsObj.waitUse}}</span>
        </lh-item>
      </el-col>
      <el-col :span="5">
        <lh-item class="nowrap" label="已使用" label-width="80px">
          <span class="num-style table-link" @click="getPageData(1, 20)">{{orderStatisticsObj.used}}</span>
        </lh-item>
      </el-col>
      <el-col :span="5">
        <lh-item class="nowrap" label="已退款/已取消" label-width="120px">
          <span class="num-style table-link" @click="getPageData(1, 30)">{{orderStatisticsObj.refundedOrCancel}}</span>
        </lh-item>
      </el-col>
    </el-row>

    <el-row>
      <el-row :span="24">
        <el-button @click="exportExcel" class="lh-btn-export">
          <lh-svg icon-class="icon-download" />导出
        </el-button>
        <el-tabs @tab-click="getPageData(1)" class="el-col el-col-24" v-model="orderStatus">
          <el-tab-pane
            v-for="status in orderStatusList"
            :label="status.label"
            :key='status.type'
            :name="status.type">
            <el-table :data="tableData" empty-text="暂时无数据" v-loading="tableLoading" border
                      style="width: 100%">

              <el-table-column label="单号" prop="orderNum"></el-table-column>
              <el-table-column label="下单时间" prop="created"></el-table-column>
              <el-table-column label="联系人" prop="contactName">
                <template slot-scope="scope">
                  {{scope.row.contactName || '-'}}
                </template>
              </el-table-column>
              <el-table-column label="联系方式" prop="contactTelephone">
                <template slot-scope="scope">
                  {{scope.row.contactTelephone || '-'}}
                </template>
              </el-table-column>
              <el-table-column label="预订内容" prop="bookContent" width="120" show-overflow-tooltip></el-table-column>
              <el-table-column label="订单原价" prop="orderAmount"></el-table-column>
              <el-table-column label="订单折扣">
                <template slot-scope="scope">
                  {{scope.row.discountAmount || '-'}}
                </template>
              </el-table-column>
              <el-table-column label="实付金额" prop="payAmount"></el-table-column>
              <el-table-column label="订单状态">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.status === 10 ? '' : (scope.row.status === 20 ? 'info' : 'danger')">{{scope.row.statusName}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="优惠券使用情况" width="120">
                <template slot-scope="scope">
                  {{scope.row.useCouponName || '-'}}
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
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-row>

  </div>
</template>
<script>
  import tableMixins from '@/mixins/table'
  import { API_PATH } from '@/config/env'
  import { downloadFile } from '@/config/utils'
  import { appOrderStatistics, appOrderList } from '@/service/member'
  export default {
    mixins: [tableMixins],
    props: ['id'],
    data() {
      return {
        orderStatisticsObj: {}, // app会员订单统计
        orderStatus: '0',
        orderStatusList: [{
          type: '0',
          label: '全部'
        }, {
          type: '10',
          label: '待使用'
        }, {
          type: '20',
          label: '已使用'
        }, {
          type: '30',
          label: '已退款/已取消'
        }]
      }
    },
    mounted() {
      this.getPageData()
      this.getOrderStatistics()
    },
    methods: {
      getPageData(page, status) {
        this.currentPage = page || this.currentPage
        // 点击数字时切换对应tab
        switch (status) {
          case null:
            this.orderStatus = '0'
            break;
          case 10:
            this.orderStatus = '10'
            break;
          case 20:
            this.orderStatus = '20'
            break;
          case 30:
            this.orderStatus = '30'
            break;
        }
        let orderStatus
        switch (this.orderStatus) {
          case '0':
            orderStatus = null
            break;
          case '10':
            orderStatus = 10
            break;
          case '20':
            orderStatus = 20
            break;
          case '30':
            orderStatus = [30, 50]
            break;
        }
        const paramsObj = {
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          appCustomerId: this.id,
          orderStatus: status ? (status === 30 ? [30, 50] : status) : orderStatus
        }

        appOrderList(paramsObj).then(res => {
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
      // app会员订单统计
      getOrderStatistics() {
        appOrderStatistics({ appCustomerId: this.id }).then(res => {
          if (res.status === 'true') {
            this.orderStatisticsObj = res.info
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
          appCustomerId: this.id
        }
        let url = API_PATH + '/supervisor/appCustomer/orderExport'
        downloadFile(url, downParams)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .order-page {
    .lh-btn-export {
      z-index: 100;
    }
  }
</style>
