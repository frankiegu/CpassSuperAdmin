<template>
  <div class="service-order-list main-content">
    <lh-title></lh-title>

    <div class="card-padding">
      <el-form :model="formData" :inline="true" class="text-right mr-10" @submit.native.prevent>
        <el-form-item>
          <el-input
            v-model.trim="formData.name"
            @keyup.native.enter="getPageData(1)"
            placeholder="按照订单编号搜索">
            <i slot="suffix" @click="getPageData(1)" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" :empty-text="tableEmpty" :slot="tableEmpty" v-loading="tableLoading"
        class="width100" border>
        <el-table-column label="订单编号">
          <template slot-scope="scope">
            <router-link
              :to="{path: '/order/service/detail', query: {id: scope.row.id}}"
              class="table-link">
              {{ scope.row.orderNum }}
            </router-link>
          </template>
        </el-table-column>

        <el-table-column label="生成时间" prop="createDate" width="155"></el-table-column>
        <el-table-column label="服务供应商" prop="providerName"></el-table-column>
        <el-table-column label="所属空间" prop="spaceName"></el-table-column>
        <el-table-column label="联系人" prop="contact"></el-table-column>
        <el-table-column label="联系方式" prop="phone" width="110"></el-table-column>
        <el-table-column label="服务类型" prop="typeName"></el-table-column>

        <el-table-column label="订单状态">
          <template slot-scope="scope">
            <div class="label-con">
              <el-tag v-if="scope.row.orderStatus===1" type="primary">待接单</el-tag>
              <el-tag v-else type="success">已接单</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="110">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.orderStatus===1"
              @click="handleClickOrders(scope.row.id)">接单</el-button>
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
  import serviceOrder from './service.mixins'
  import { serviceAcceptOrder } from '@/service/order'
  export default {
    mixins: [serviceOrder],
    data() {
      return {}
    },
    methods: {
      handleClickOrders(id) {
        this.$confirm('确认接取服务订单？', '确认接单', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          lockScroll: false
        }).then(() => {
          serviceAcceptOrder({ orderId: id }).then(res => {
            if (res.status === 'true') {
              this.getPageData()
              this.$message({
                type: 'success',
                message: '接单成功!'
              })
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../src/styles/config";
  .service-order-list {}
</style>

