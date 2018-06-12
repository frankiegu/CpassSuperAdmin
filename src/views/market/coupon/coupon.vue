<template>
  <section class="coupon-list-page">
    <lh-title></lh-title>
    <div class="lh-form-box">
      <!-- 查询筛选 -->
      <el-form :inline="true" :model="couponSort" class="sort-form-bar" @submit.native.prevent>

        <el-form-item class="ml6 mr0">
          <el-input
            class="lh-form-input"
            v-model.trim="couponSort.keywords"
            placeholder="请输入卡劵名称"
            @keyup.native.enter="getPageData(1)">

            <i slot="suffix" @click="getPageData(1)" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <!--v-permissions="'/manage/coupon/add'"-->
        <router-link
          :to="'/coupon/issue'"
          class="fl">
          <el-button type="primary">手动发券</el-button>
        </router-link>
        <router-link
          :to="'/coupon/add'"
          class="fl">
          <el-button class="ml16">添加优惠券</el-button>
        </router-link>

      </el-form>
    </div>
    <div class="lh-card-main coupon-wrapper">
      <!-- 表格list -->
      <div class="ph24">
        <el-table
          :empty-text="tableEmpty"
          :slot="tableEmpty"
          :data="counponTable"
          v-loading="tableLoading"
          @sort-change="sortCoupon"
          @filter-change="filterChange"
          style="width: 100%">
          <!-- 1 -->
          <el-table-column label="卡券名称">

            <template slot-scope="scope">
              <router-link class="table-link" :to="'/market/coupon-detail?id=' + scope.row.id">
                {{ scope.row.name }}
              </router-link>
            </template>
          </el-table-column>

          <!-- 2 -->
          <el-table-column label="类型">
            <template slot-scope="scope">
            <!--小时券, 礼品券, 折扣券, 满减券-->
            <span v-if="scope.row.type === 1">小时券</span>
            <span v-if="scope.row.type === 2">满减券</span>
            <span v-if="scope.row.type === 3">礼品券</span>
          </template>
          </el-table-column>

          <!-- 3 -->
          <el-table-column
            label="开始日期">

            <template slot-scope="scope">
              {{ scope.row.startDate }}
            </template>
          </el-table-column>

          <!-- 4 -->
          <el-table-column
            label="结束日期">

            <template slot-scope="scope">
              {{ scope.row.endDate }}
            </template>
          </el-table-column>

          <!-- 5 -->
          <el-table-column :label="sortFileName" prop="status"
            :filters="[{ text: '有效', value: 1 }, { text: '过期', value: 2 }, { text: '冻结', value: 3 }]"
            :filter-multiple="false"
            filter-placement="bottom-end"
            column-key="statusType"
          >
            <template slot-scope="scope">
              <!--有效, 冻结, 过期-->
              <span v-if="scope.row.status === 2">过期</span>
              <span v-else-if="scope.row.status === 1">有效</span>
              <span v-else>冻结</span>
            </template>

          </el-table-column>

          <!-- 6 -->
          <el-table-column label="优惠内容">
            <template slot-scope="scope">
              <!--小时券-->
              <span v-if="scope.row.type === 1">{{ scope.row.subtractHour }}小时</span>
              <!--礼品券-->
              <span v-if="scope.row.type === 3">{{ scope.row.benefit }}</span>
              <!--满减券  有门槛-->
              <span v-if="scope.row.type === 2 && scope.row.isConditional === 1">满{{ scope.row.applyLowerLimit }}减{{ scope.row.amount }}</span>
              <!--满减券  无门槛-->
              <span v-if="scope.row.type === 2 && scope.row.isConditional === 0">{{ scope.row.amount }}元无门槛</span>
            </template>
          </el-table-column>

          <!-- 7 -->
          <el-table-column label="总数">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="已使用/已领取/总数" placement="top-start">
                <span>{{ scope.row.useQuantity || 0 }}/{{ scope.row.receiveQuantity || 0 }}/{{ scope.row.quantity }}</span>
              </el-tooltip>
            </template>
          </el-table-column>

          <!-- 8 -->
          <el-table-column label="使用范围">
            <template slot-scope="scope">
              <!--小时券-->
              <!--storeType = 1 ==> 全部-->
              <span v-if="scope.row.storeType === 1 && scope.row.type === 1">全部门店</span>
              <!--storeType = 2 ==> 部分-->
              <span v-if="scope.row.storeType === 2 && scope.row.type === 1">部分门店</span>
              <!--礼品券-->
              <span v-if="scope.row.verifyStationType === 1 && scope.row.type === 3">全部核销点</span>
              <!--storeType = 2 ==> 部分-->
              <span v-if="scope.row.verifyStationType === 2 && scope.row.type === 3">部分核销点</span>
            </template>
          </el-table-column>

          <!-- 9 -->
          <el-table-column
            label="添加日期" sortable="custom">

            <template slot-scope="scope">
              {{ scope.row.created }}
            </template>
          </el-table-column>

          <!-- 10 -->
          <el-table-column
            label="条件触发">

            <template slot-scope="scope">
              <span v-if="scope.row.receiveConditionStatus === 0">未生效</span>
              <span v-if="scope.row.receiveConditionStatus === 1">生效中</span>
              <span v-if="!scope.row.receiveConditionStatus && scope.row.receiveConditionStatus !== 0">未设置</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页器 -->
      <el-pagination background
                     class="pagination-container"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="pageSizeArr"
                     :page-size="pageSize"
                     :layout="layoutArr"
                     :total="pageTotal">
      </el-pagination>
    </div>
  </section>
</template>
<script>
  import tableMixins from '@/mixins/table'
  import { couponList } from '@/service/market'
  export default {
    mixins: [tableMixins],
    data () {
      return {
        counponTable: [],
        orderBy: '',
        sortFileName: '状态',
        statusType: '',
        couponSort: {
          keywords: ''
        }
      }
    },
    methods: {
      getPageData (page) {
        this.currentPage = page || this.currentPage
        const self = this
        const paramsObj = {
          pageNum: self.currentPage,
          pageSize: self.pageSize,
          couponName: self.couponSort.keywords,
          orderBy: this.orderBy,
          status: this.statusType
        }
        couponList(paramsObj).then(res => {
          if (res.status === 'true') {
            self.pageTotal = res.info.total
            res.info.result.forEach(v => {
              v.useQuantity = v.statistics.used
              v.receiveQuantity = v.statistics.received
              if (v.startDate) v.startDate = v.startDate.substr(0, 16)
              if (v.endDate) v.endDate = v.endDate.substr(0, 16)
              if (v.created) v.created = v.created.substr(0, 16)
            })
            self.counponTable = res.info.result
            self.tableLoading = false
            if (self.counponTable.length === 0) {
              self.tableEmpty = '暂时无数据'
            }
          } else {
            self.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
        })
      },
      sortCoupon (sort) {
        console.log('sort', sort)
        this.orderBy = sort.order === 'ascending' ? 0 : 1
        this.getPageData(1)
      },
      // 筛选触发动作
      filterChange (filters) {
        if (filters.hasOwnProperty('statusType')) {
          if (filters['statusType'].length === 0) {
            this.sortFileName = '状态'
            this.statusType = ''
            this.getPageData()
            return;
          }
          console.log('filter', filters['statusType'][0])
          switch (filters['statusType'][0]) {
            case 1:
              this.statusType = 1
              this.sortFileName = '有效'
              this.getPageData()
              break;
            case 2:
              this.statusType = 2
              this.sortFileName = '过期'
              this.getPageData()
              break;
            case 3:
              this.statusType = 3
              this.sortFileName = '冻结'
              this.getPageData()
              break;
          }
        }
      }
    },
    mounted () {
      this.getPageData()
    },
    watch: {}
  }
</script>
<style lang="scss" scoped>
  .coupon-list-page {
    .coupon-wrapper {
      padding-top: 24px;
      padding-bottom: 24px;
    }
  }
</style>
