<template>
  <div class="client-list main-content">
    <lh-title title="会员列表"></lh-title>

    <div class="card-padding">
      <el-form :model="formData" :inline="true" class="text-right mr-10">
        <!--<router-link-->
          <!--to="/client/add"-->
          <!--class="btn-link fl "-->
          <!--tag="a">-->
          <!--&nbsp;新增客户-->
        <!--</router-link>-->

        <!--<el-form-item>-->
          <!--<el-select-->
            <!--v-model="formData.registerWay"-->
            <!--@change="getPageData"-->
            <!--placeholder="请选择生成渠道"-->
            <!--class="width150px"-->
            <!--clearable>-->
            <!--<el-option-->
              <!--v-for="i in channels"-->
              <!--:label="i.channel"-->
              <!--:value="i.id"-->
              <!--:key="i.id"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->

        <!--<el-form-item>-->
          <!--<el-select-->
            <!--v-model="formData.validaty"-->
            <!--@change="getPageData"-->
            <!--placeholder="请选择有效期"-->
            <!--class="width150px"-->
            <!--clearable>-->
            <!--<el-option-->
              <!--v-for="i in timeValidity"-->
              <!--:label="i.validity"-->
              <!--:value="i.id"-->
              <!--:key="i.id"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->

        <!--<el-form-item>-->
          <!--<el-select-->
            <!--v-model="formData.productStatus"-->
            <!--@change="getPageData"-->
            <!--placeholder="状态"-->
            <!--class="width100px"-->
            <!--clearable>-->
            <!--<lh-option :statusList="statusList"></lh-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->

        <!--<el-form-item>-->
          <!--<el-date-picker-->
            <!--v-model="formData.reg_date"-->
            <!--@change="getPageData"-->
            <!--type="daterange"-->
            <!--align="right"-->
            <!--clearable-->
            <!--start-placeholder="开始日期"-->
            <!--end-placeholder="结束日期"-->
            <!--placeholder="选择下单日期"-->
            <!--:picker-options="pickerOptions"></el-date-picker>-->
        <!--</el-form-item>-->

        <el-form-item class="fr">
          <el-input
            v-model.trim="formData.name"
            @keyup.native.enter="getPageData"
            placeholder="按照会员名称搜索"
            class="width220px">

            <i slot="suffix" @click="getPageData" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <!--<el-form-item class="fr">-->
          <!--<el-button @click="exportExcel" class="btn-green fr">导出表格</el-button>-->
        <!--</el-form-item>-->
      </el-form>

      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        class="width100" border>

        <el-table-column label="会员名称" fixed="left" align="left">
          <template slot-scope="scope">
            <router-link
              :to="{path: '/client/detail', query: {id: scope.row.id}}"
              class="table-link">
              {{ scope.row.name }}
            </router-link>
          </template>
        </el-table-column>

        <!--<el-table-column label="联系人" prop="contact" align="left"></el-table-column>-->
        <el-table-column label="联系电话" prop="phone" width="110" align="left"></el-table-column>
        <!--<el-table-column label="联系邮箱" prop="email" align="left"></el-table-column>-->
        <el-table-column label="注册时间" prop="createDate" align="left" width="155"></el-table-column>
        <el-table-column label="累计服务订单" prop="registerWay" align="left"></el-table-column>
        <el-table-column label="累计场地订单" prop="productName" align="left"></el-table-column>
        <el-table-column label="上一次登录" prop="validaty" align="left"></el-table-column>

        <!-- 小宽度可以不写死 -->
        <!--<el-table-column label="状态" align="left">-->
          <!--<template slot-scope="scope">-->
            <!--<div class="label-con">-->
              <!--<el-tag v-if="scope.row.productStatus===1" type="success">正常</el-tag>-->
              <!--<el-tag v-else-if="scope.row.productStatus===0" type="danger">停用</el-tag>-->
              <!--<el-tag v-else>未开通</el-tag>-->
            <!--</div>-->
          <!--</template>-->
        <!--</el-table-column>-->

        <!--<el-table-column-->
          <!--fixed="right"-->
          <!--align="left"-->
          <!--label="操作"-->
          <!--width="110">-->
          <!--<template slot-scope="scope">-->
            <!--<router-link-->
              <!--:to="{path: scope.row.adminUserId ? '/client/modify' : '/client/add', query: {id: scope.row.id}}"-->
              <!--class="table-link margin-lr6">-->
              <!--编辑-->
            <!--</router-link>-->

            <!--<router-link-->
              <!--v-if="scope.row.adminUserId"-->
              <!--:to="{path: '/client/account', query: {id: scope.row.id}}"-->
              <!--class="table-link">-->
              <!--账户-->
            <!--</router-link>-->

            <!--<span class="theme-gray" v-else>无账户</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
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
