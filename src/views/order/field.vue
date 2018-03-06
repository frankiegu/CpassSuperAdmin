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
              {{ scope.row.name }}
            </router-link>
          </template>
        </el-table-column>

        <el-table-column label="生成时间" :formatter="formatTime" align="left" width="155" sortable></el-table-column>

        <el-table-column label="场地类型" align="left">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.email === '3'" type="primary">工位</el-tag>
            <el-tag v-else type="success">会议室</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="预约日期" prop="email" align="left"></el-table-column>
        <el-table-column label="预约时段" prop="email" align="left" sortable></el-table-column>
        <el-table-column label="场地所属" prop="email" align="left"></el-table-column>
        <el-table-column label="订单总金额"  :formatter="formatPrice" align="left" sortable></el-table-column>

        <el-table-column label="支付状态" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.email === 10">待支付</span>
            <span v-else-if="scope.row.email === 20">已支付</span>
            <span v-else-if="scope.row.email === 10">已退款</span>
            <span v-else>待退款</span>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" align="left">
          <template slot-scope="scope">
            <span
              v-for="(item, index) in statusList" :key="index"
              v-if="scope.row.email === item.val">
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
  import { clientList } from '@/service/client'

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
