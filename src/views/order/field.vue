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
              :to="{path: '/order/field/detail', query: {id: scope.row.id}}"
              class="table-link">
              {{ scope.row.orderNum }}
            </router-link>
          </template>
        </el-table-column>

        <!--<el-table-column label="生成时间" :formatter="formatTime" align="left" width="155" sortable></el-table-column>-->
        <el-table-column label="生成时间" prop="created" align="left" width="155" sortable></el-table-column>

        <el-table-column label="场地类型" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === '3'" type="primary">工位</el-tag>
            <el-tag v-else type="primary">会议室</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="预约日期" prop="bookDate" align="left"></el-table-column>
        <el-table-column label="预约时段" prop="bookingPeriod" align="left" sortable sort-by="bookStartTime"></el-table-column>
        <el-table-column label="场地所属" prop="spaceName" align="left"></el-table-column>
        <el-table-column label="订单总金额" prop="formatPrice" align="left" sortable sort-by="orderAmount"></el-table-column>

        <el-table-column label="支付状态" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.payStatus === 10">待支付</span>
            <span v-else-if="scope.row.payStatus === 20">已支付</span>
            <span v-else-if="scope.row.payStatus === 10">已退款</span>
            <span v-else>待退款</span>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" align="left">
          <template slot-scope="scope">
            <span
              v-for="(item, index) in statusList" :key="index"
              v-if="scope.row.status === item.val">
              {{ item.text }}
            </span>
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
  import spaceMixins from './field.mixins'
  import { fieldOrderList } from '@/service/order'

  export default {
    mixins: [spaceMixins, tableMixins],
    components: {},
    data () {
      return {
        formData: {
          name: ''
        }
      }
    },
    created () {
      this.getPageData()
    },
    methods: {
      formatPrice(row, column) {
        return '￥ ' + row.orderAmount
      },
      formatTime(row, column) {
        return row.created
        // return row.email.replace(/:\d{2}$/, '')
      },
      getPageData() {
        const paramsObj = {
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          orderNum: this.formData.name
        }
        fieldOrderList(paramsObj).then(res => {
          if (res.status === 'true') {
            console.log('res', res)
            let data = res.info
            if (data) {
              this.pageTotal = data.total
              this.tableData = data.result
              // 支付状态payStatus, 10=未支付, 20=已支付, 30=已经退款
              this.tableData.forEach(v => {
                v.formatPrice = '￥ ' + v.orderAmount
                if (v.type === 1) {
                  v.bookingPeriod = v.bookStartTime + '～' + v.bookEndTime
                } else {
                  v.bookingPeriod = '-'
                }
              })
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
