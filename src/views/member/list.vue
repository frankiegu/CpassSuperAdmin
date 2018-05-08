<template>
  <div class="client-list main-content">
    <lh-title title="会员列表"></lh-title>

    <div class="card-padding">
      <el-form :model="formData" :inline="true" class="text-right mr-10" @submit.native.prevent>

        <el-form-item class="fr">
          <el-input
            v-model.trim="formData.name"
            @keyup.native.enter="getPageData(1)"
            placeholder="按照会员名称搜索"
            class="lh-form-input">

            <i slot="suffix" @click="getPageData(1)" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

      </el-form>

      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading" border>

        <el-table-column label="会员名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.nickname }}
          </template>
        </el-table-column>

        <el-table-column label="联系电话" prop="mobile" align="center">
          <template slot-scope="scope">
            {{ scope.row.mobile ? scope.row.mobile : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="注册渠道" prop="registerName" align="center">
          <template slot-scope="scope">
            {{ scope.row.registerName ? scope.row.registerName : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="注册日期" prop="createDate" align="center"></el-table-column>
        <el-table-column label="累计场地订单" prop="fieldOrderCount" align="center">
          <template slot-scope="scope">
            {{ scope.row.fieldOrderCount ? scope.row.fieldOrderCount : 0 }}
          </template>
        </el-table-column>
        <el-table-column label="上一次登录" prop="lastLogin" align="center"></el-table-column>

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

<style lang="scss" scoped>
  @import "../../../src/styles/config";
  .client-list {
    .svg-icon {
      color: $theme-blue;
      margin: 0 7px;
    }
  }
</style>

<script>
  import memberList from './list.mixins'
  export default memberList
</script>
