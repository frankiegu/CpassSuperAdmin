<template>
  <div class="order-field">
    <lh-title></lh-title>

    <div class="card-padding">
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

        <el-table-column label="交易号" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.orderNum }}
          </template>
        </el-table-column>

        <el-table-column label="领取时间" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.createDate }}
          </template>
        </el-table-column>

        <el-table-column label="领取人" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.customerName }}
          </template>
        </el-table-column>

        <el-table-column label="手机号码" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.phone }}
          </template>
        </el-table-column>

        <el-table-column label="卡券名称" align="left">
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

        <el-table-column label="关联店铺" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.shopName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="核销员" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.cantonfairCheckerName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="核销时间" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.redemptionDate	 }}</span>
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
  import tableMixins from '@/mixins/table'
  import writeOffMixins from './write-off.mixins'
  import { cantonfairCoupon } from '@/service/canton-fair'

  export default {
    mixins: [writeOffMixins, tableMixins],
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .order-field {
  }
</style>
