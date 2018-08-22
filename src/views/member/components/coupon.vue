<template>
  <div class="order-page">
    <el-row :gutter="20" class="numberCount pl24">
      <el-col :span="5">
        <lh-item class="nowrap" label="待使用" label-width="80px">
          <span class="num-style table-link" @click="getPageData(1, '0')">{{couponStatisticsObj.notUsedTotal}}</span>
        </lh-item>
      </el-col>
      <el-col :span="5">
        <lh-item class="nowrap" label="已使用" label-width="80px">
          <span class="num-style table-link" @click="getPageData(1, '1')">{{couponStatisticsObj.usedTotal}}</span>
        </lh-item>
      </el-col>
      <el-col :span="5">
        <lh-item class="nowrap" label="已过期" label-width="80px">
          <span class="num-style table-link" @click="getPageData(1, '2')">{{couponStatisticsObj.expiredTotal}}</span>
        </lh-item>
      </el-col>
    </el-row>

    <el-row>
      <el-row :span="24">
        <el-tabs @tab-click="getPageData(1)" class="el-col el-col-24" v-model="couponStatus">
          <el-tab-pane
            v-for="status in couponStatusList"
            :label="status.label"
            :key='status.type'
            :name="status.type">
            <el-table :data="tableData" empty-text="暂时无数据" v-loading="tableLoading" border
                      style="width: 100%">

              <el-table-column label="名称" prop="platformCouponName" align="left"></el-table-column>
              <el-table-column label="券类" prop="lookPlayer" align="left">
                <template slot-scope="scope">
                  <span v-if="scope.row.platformCouponType === 1">小时券</span>
                  <span v-else-if="scope.row.platformCouponType === 2">代金券</span>
                  <span v-else-if="scope.row.platformCouponType === 3">礼品券</span>
                </template>
              </el-table-column>
              <el-table-column label="适用范围" align="left">
                <template slot-scope="scope">
                  <!--礼品券-->
                  <span v-if="scope.row.platformCouponType === 3">{{scope.row.verifyStationType === 1 ? '全部核销点' : '部分核销点'}}</span>
                  <span v-else>{{scope.row.storeType === 1 ? '全部空间' : '部分空间'}}</span>
                </template>
              </el-table-column>
              <el-table-column label="有效期" width="180" align="left">
                <template slot-scope="scope" align="left">
                  {{scope.row.startDate}} <br> 至 <br> {{scope.row.endDate}}
                </template>
              </el-table-column>
              <el-table-column label="获取途径" align="left">
                <template slot-scope="scope">
                  <el-tag>{{scope.row.receiveName}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="获取时间" prop="receiveTime" width="180" align="left"></el-table-column>
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
  import { couponStatistics, appCouponList } from '@/service/member'
  export default {
    mixins: [tableMixins],
    props: {
      id: {
        type: String
      }
    },
    data() {
      return {
        couponStatisticsObj: {},
        couponStatus: '0',
        couponStatusList: [{
          type: '0',
          label: '待使用'
        }, {
          type: '1',
          label: '已使用'
        }, {
          type: '2',
          label: '已过期'
        }]
      }
    },
    mounted() {
      this.getPageData()
      this.getCouponStatistics()
    },
    methods: {
      getPageData(page, status) {
        this.currentPage = page || this.currentPage
        // 点击数字时切换对应tab
        if (status) {
          this.couponStatus = status
        }
        const paramsObj = {
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          customerId: this.id,
          useStatus: status || this.couponStatus
        }

        appCouponList(paramsObj).then(res => {
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
      getCouponStatistics() {
        couponStatistics({ customerId: this.id }).then(res => {
          if (res.status === 'true') {
            this.couponStatisticsObj = res.info
          } else {
            this.setMsg('error', res.msg)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
