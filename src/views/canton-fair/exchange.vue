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

        <el-table-column label="交易号" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.shopName }}
          </template>
        </el-table-column>

        <el-table-column label="领取时间" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.shopName }}
          </template>
        </el-table-column>

        <el-table-column label="领取人" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.shopName }}
          </template>
        </el-table-column>

        <el-table-column label="手机号码" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.shopName }}
          </template>
        </el-table-column>

        <el-table-column label="卡券名称" align="left">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>

        <el-table-column label="状态" align="left">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0">待兑换</el-tag>
            <el-tag type="success" v-if="scope.row.status === 1">已兑换</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="关联店铺" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.telephone }}</span>
          </template>
        </el-table-column>

        <el-table-column label="核销员" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.checkNum }}</span>
          </template>
        </el-table-column>

        <el-table-column label="核销时间" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.checkNum }}</span>
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
  import writeOffMixins from './write-off.mixins'
  import { cantonFairList, cantonfairCoupon } from '@/service/canton-fair'

  export default {
    mixins: [writeOffMixins, tableMixins],
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
      getPageData() {
        const self = this
        const paramsObj = {
          pageSize: self.pageSize,
          pageNum: self.currentPage
        }
        cantonFairList(paramsObj).then(res => {
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
