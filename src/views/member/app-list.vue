<template>
  <div class="client-list main-content">

    <div class="card-padding">
      <member-rate :memberRateData="memberRateData"></member-rate>
      <el-form :model="formData" :inline="true" class="text-right mr-10" @submit.native.prevent>
        <!-- 选择提交日期 -->
        <el-form-item>
          <lh-datePicker label="最后登录时间" :dateType="1" :optionType="true" @datePickerChange="datePickerChange"></lh-datePicker>
        </el-form-item>

        <!--选择预约日期-->
        <el-form-item>
          <lh-datePicker label="注册时间" :dateType="2" :optionType="true" @datePickerChange="datePickerChange"></lh-datePicker>
        </el-form-item>

        <!--会员等级-->
        <!--<el-form-item>-->
          <!--<el-select v-model="formData.grade" placeholder="会员等级" clearable class="width120px" @change="getPageData(1)">-->
            <!--<el-option-->
              <!--v-for="(value, key) in gradeList"-->
              <!--:label="value"-->
              <!--:value="key"-->
              <!--:key="key"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
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

        <!--<el-form-item>-->
          <!--<el-button @click="exportExcel" class="lh-btn-export">-->
            <!--<lh-svg icon-class="icon-download" />导出-->
          <!--</el-button>-->
        <!--</el-form-item>-->

      </el-form>

      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading" border>

        <el-table-column label="ID" align="center" width="100">
          <template slot-scope="scope">
            {{ scope.row.customerCode }}
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="telephone" align="center" width="120">
          <template slot-scope="scope">
            {{ scope.row.telephone ? scope.row.telephone : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="邮箱" prop="email" align="center">
          <template slot-scope="scope">
            {{ scope.row.email ? scope.row.email : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="昵称" align="center">
          <template slot-scope="scope">
            {{ scope.row.nickname || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.sex">
               {{ scope.row.sex === 1 ? '男' : '女' }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="职业" align="center">
          <template slot-scope="scope">
            {{ scope.row.tagName || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="生日" align="center">
          <template slot-scope="scope">
            {{ scope.row.birthday || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="注册时间" prop="created" align="center"></el-table-column>
        <el-table-column label="最后一次登录时间" prop="lastLogin" align="center"></el-table-column>
        <el-table-column label="会员等级" width="100" prop="levelName" align="center">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.levelName || '普通会员' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="有效期" prop="indate" align="center"></el-table-column>
        <el-table-column label="状态" prop="status" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 1 ? 'info' : 'danger'">{{ scope.row.status === 1 ? '正常' : '停用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="订单" prop="orderNum" align="center"></el-table-column>
        <el-table-column label="优惠券" prop="couponNum" align="center"></el-table-column>
        <el-table-column label="操作" prop="registerName" align="center" width="100" fixed="right">
          <template slot-scope="scope">
            <router-link class="table-link" :to="'/member/list/app-detail?id='+scope.row.id">详情</router-link>
            <el-tooltip
              :content="scope.row.status === 1 ? '点击停用会员' : '点击启用会员'"
              placement="top"
              class="margin-lr6">

              <span v-if="scope.row.status === 0" class="table-link" @click="changeStatus(scope.row.id, scope.row.status)">启用</span>
              <span v-else class="table-link" style="color: #ff5661;" @click="changeStatus(scope.row.id, scope.row.status)">停用</span>
            </el-tooltip>

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
  }
</style>

<script>
  import memberList from './app-list.mixins'
  export default memberList
</script>
