<template>
  <div class="order-page">
    <el-row :gutter="20" class="number">
      <el-col :span="5">
        <lh-item class="nowrap" label="订单总数" label-width="80px">
          <span class="num-style table-link" @click="getPageData(1)">12</span>
        </lh-item>
      </el-col>
      <el-col :span="5">
        <lh-item class="nowrap" label="待使用" label-width="80px">
          <span class="num-style table-link" @click="getPageData(1)">3</span>
        </lh-item>
      </el-col>
      <el-col :span="5">
        <lh-item class="nowrap" label="已使用" label-width="80px">
          <span class="num-style table-link" @click="getPageData(1)">4</span>
        </lh-item>
      </el-col>
      <el-col :span="5">
        <lh-item class="nowrap" label="已退款/已取消" label-width="120px">
          <span class="num-style table-link" @click="getPageData(1)">5</span>
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

              <el-table-column label="单号" prop="date" align="left"></el-table-column>
              <el-table-column label="下单时间" prop="lookPlayer" align="left"></el-table-column>
              <el-table-column label="下单会员" prop="lotteryCount" align="left"></el-table-column>
              <el-table-column label="联系人" prop="sharePlayer" align="left"></el-table-column>
              <el-table-column label="联系方式" prop="shareCount" align="left"></el-table-column>
              <el-table-column label="预订内容" prop="shareCount" align="left"></el-table-column>
              <el-table-column label="订单原价" prop="shareCount" align="left"></el-table-column>
              <el-table-column label="订单折扣" prop="shareCount" align="left"></el-table-column>
              <el-table-column label="实付金额" prop="shareCount" align="left"></el-table-column>
              <el-table-column label="订单状态" prop="shareCount" align="left"></el-table-column>
              <el-table-column label="优惠券使用情况" prop="shareCount" width="120" align="left"></el-table-column>

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
  export default {
    mixins: [tableMixins],
    data() {
      return {
        orderStatus: '0',
        orderStatusList: [{
          type: '0',
          label: '全部'
        }, {
          type: '1',
          label: '待使用'
        }, {
          type: '2',
          label: '已使用'
        }, {
          type: '3',
          label: '已退款/已取消'
        }]
      }
    },
    mounted() {
      this.getPageData()
    },
    methods: {
      getPageData(page) {
        this.currentPage = page || this.currentPage
        console.log('order-record')
        // const formData = this.formData
        // const paramsObj = {
        //   pageSize: this.pageSize,
        //   pageNum: this.currentPage,
        //   nickname: formData.name
        // }

        // CUSTOMER_LIST(paramsObj).then(res => {
        //   if (res.status === 'true') {
        //     let data = res.info
        //     if (data) {
        //       this.pageTotal = data.total
        //       this.tableData = data.result
        //     }
        //
        //     this.tableLoading = false
        //     if (this.tableData.length === 0) {
        //       this.tableEmpty = '暂时无数据'
        //     }
        //   } else {
        //     this.setMsg('error', res.msg)
        //   }
        // })
      },
      exportExcel() {
        if (!this.tableData.length) {
          return this.setMsg('暂无数据')
        }
        const formData = this.formData
        const downParams = {
          nickname: formData.name
        }
        let url = API_PATH + '/supervisor/customer/exportExcel'
        downloadFile(url, downParams)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .order-page {

  }
</style>
