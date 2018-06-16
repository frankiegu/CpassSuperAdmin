<template>
  <div class="client-list main-content">
    <lh-title title="会员列表"></lh-title>

    <div class="card-padding">
      <member-rate :memberRateData="memberRateData"></member-rate>
      <el-form :model="formData" :inline="true" class="text-right mr-10" @submit.native.prevent>
        <!-- 选择提交日期 -->
        <el-form-item>
          <lh-datePicker label="最后登录时间" :dateType="1" @datePickerChange="datePickerChange"></lh-datePicker>
        </el-form-item>

        <!--选择预约日期-->
        <el-form-item>
          <lh-datePicker label="注册时间" :dateType="2" @datePickerChange="datePickerChange"></lh-datePicker>
        </el-form-item>

        <!--会员等级-->
        <el-form-item>
          <el-select v-model="formData.grade" placeholder="会员等级" clearable class="width120px" @change="getPageData(1)">
            <el-option
              v-for="(value, key) in gradeList"
              :label="value"
              :value="key"
              :key="key"></el-option>
          </el-select>
        </el-form-item>
        <!--会员状态-->
        <el-form-item>
          <el-select v-model="formData.status" placeholder="状态" clearable class="width120px" @change="getPageData(1)">
            <el-option
              v-for="(value, key) in statusList"
              :label="value"
              :value="key"
              :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model.trim="formData.name"
            @keyup.native.enter="getPageData(1)"
            placeholder="按照会员名称搜索"
            class="lh-form-input">

            <i slot="suffix" @click="getPageData(1)" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="exportExcel" class="lh-btn-export">
            <lh-svg icon-class="icon-download" />导出
          </el-button>
        </el-form-item>

      </el-form>

      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading" border>

        <el-table-column label="ID" align="center">
          <template slot-scope="scope">
         <router-link class="table-link" to="/member/detail">
           {{ scope.row.nickname }}
         </router-link>
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="mobile" align="center">
          <template slot-scope="scope">
            {{ scope.row.mobile ? scope.row.mobile : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="邮箱" prop="mobile" align="center">
          <template slot-scope="scope">
            {{ scope.row.mobile ? scope.row.mobile : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="昵称" align="center">
          <template slot-scope="scope">
            {{ scope.row.nickname }}
          </template>
        </el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">
            {{ scope.row.nickname }}
          </template>
        </el-table-column>
        <el-table-column label="职业" align="center">
          <template slot-scope="scope">
            {{ scope.row.nickname }}
          </template>
        </el-table-column>
        <el-table-column label="生日" align="center">
          <template slot-scope="scope">
            {{ scope.row.nickname }}
          </template>
        </el-table-column>
        <el-table-column label="注册时间" prop="createDate" align="center"></el-table-column>
        <el-table-column label="最后一次登录时间" prop="createDate" align="center"></el-table-column>
        <el-table-column label="会员等级" prop="createDate" align="center"></el-table-column>
        <el-table-column label="有效期" prop="createDate" align="center"></el-table-column>
        <el-table-column label="状态" prop="createDate" align="center"></el-table-column>
        <el-table-column label="订单" prop="createDate" align="center"></el-table-column>
        <el-table-column label="积分" prop="createDate" align="center"></el-table-column>
        <el-table-column label="优惠券" prop="createDate" align="center"></el-table-column>
        <el-table-column label="操作" prop="registerName" align="center">
          <template slot-scope="scope">
            <span>详情</span>
            <span>启用</span>
            <!--<span>停用</span>-->
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

<style lang="scss" scoped>
  @import "../../../src/styles/config";
  .client-list {
    .svg-icon {
      color: $theme-blue;
      margin: 0 7px;
    }
    .datePicker-prependTxt {
      display: inline-block;
      border: 1px solid #ddd;
      font-size: 14px;
      padding: 0 5px;
    }
  }
</style>

<script>
  import memberList from './list.mixins'
  export default memberList
</script>
