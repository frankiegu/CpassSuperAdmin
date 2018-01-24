<template>
  <div class="members-info">
    <div class="page-title">
      <h1> 会员信息管理
        <span class="members-total ">
          <span class="theme-gray">现有会员</span>
          <count-to class="theme-blue" :startVal='0' :endVal='memberTotal || 0' :duration='3000'></count-to>
          <span class="theme-gray">名</span>
        </span>
      </h1>
    </div>

    <div class="card-padding">
      <!-- 查询表单 -->
      <el-form :model="membersSort" :inline="true" class="mr-10 text-right">
        <el-form-item class="width170px">
          <el-select
            v-model="membersSort.credit_level"
            @change="getPageData"
            placeholder="信用等级"
            clearable>

            <lh-option :statusList="levelList"></lh-option></el-select>
        </el-form-item>

        <el-form-item class="width170px">
          <el-select
            v-model="membersSort.store"
            @change="getPageData"
            placeholder="所属门店"
            clearable>

            <el-option
              v-for="i in storeList"
              :label="i.storeName"
              :value="i.id"
              :key="i.id"></el-option></el-select>
        </el-form-item>

        <el-form-item>
          <el-date-picker
            v-model="membersSort.reg_date"
            @change="getPageData"
            :picker-options="pickerOptions"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            placeholder="选择进驻日期"
            type="daterange"
            align="right"></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model.trim="membersSort.name"
            @keyup.native.enter="getPageData"
            placeholder="请输入姓名/企业名称"
            class="width210px">

            <i @click="getPageData" slot="suffix" class="el-input__icon el-icon-search"></i></el-input>
        </el-form-item>

        <el-form-item v-permissions="'/manage/user/listExcel'">
          <el-button
            @click="exportExcel"
            :loading="downloadLoading"
            icon="el-icon-download"
            class="btn-green">导出表格</el-button>
        </el-form-item>
        <el-form-item v-permissions="'/manage/creditRule/creditRegister'">
          <router-link to="/member/credit-set">
            <el-button class="theme-btn-blue" type="primary">信用值登记</el-button></router-link>
        </el-form-item>
      </el-form>

      <!-- list表格 -->
      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        class="width100" border>

        <el-table-column label="会员姓名" fixed="left">
          <template slot-scope="scope">
            <router-link
              :to="'/member/com?noAllow=1&id=' + scope.row.id"
              class="table-link" >
              {{ scope.row.name }}</router-link>
          </template>
        </el-table-column>

        <el-table-column prop="companyName" label="所属企业"></el-table-column>
        <el-table-column prop="storeName" label="所属门店"></el-table-column>
        <el-table-column prop="telephone" label="联系电话" width="110"></el-table-column>

        <el-table-column prop="roleName" label="会员角色" width="160">
          <template slot-scope="scope">
            <el-select
              :disabled="false"
              v-if="handleHasPermissions('/manage/user/updateRole')"
              v-model="scope.row.role"
              @change="handleUpdateRole(scope.row.id, scope.row.role)"
              @visible-change="handleVisibleChange">

              <el-option label="公司负责人" :value="1"></el-option>
              <el-option label="员工" :value="2"></el-option></el-select>

            <span v-else>{{scope.row.role === 1 ? '公司负责人' : '员工'}}</span>
          </template>
        </el-table-column>

        <el-table-column label="注册日期" width="130" sortable>
          <template slot-scope="scope">
            <i class="el-icon-time"></i> {{ scope.row.created }}</template>
         </el-table-column>

        <el-table-column prop="creditLevel" label="信用等级">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.creditLevel"
              :type="scope.row.creditLevel | statusFilter(filtersStatusList)">
              {{scope.row.creditLevel}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="creditPoint" label="信用值" width="90" sortable></el-table-column>
        <el-table-column prop="point" label="现有积分" width="105" sortable></el-table-column>
        <el-table-column prop="consumeAmount" label="累计消费" width="105" :formatter="formatter" sortable></el-table-column>

        <el-table-column
          v-if="handleHasPermissions(['/manage/user/updateRole', '/manage/user/updateStatus'])"
          label="操作"
          fixed="right"
          width="140">

          <template slot-scope="scope">
            <router-link
              v-if="handleHasPermissions('/manage/user/updateRole')"
              :to="'/member/com?id=' + scope.row.id">
              <el-button size="mini">编辑</el-button></router-link>

            <el-tooltip
              v-if="handleHasPermissions('/manage/user/updateStatus')"
              :content="scope.row.status === 1 ? '点击关闭该会员的前端使用权限' : '点击开启该会员的前端使用权限'"
              placement="top"
              effect="light"
              class="margin-lr6">

              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                :active-color="switchActiveColor"
                active-text=""
                inactive-text=""
                @change="handleUpdateStatus(scope.row.id, scope.row.status)"></el-switch>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        :total="pageTotal"
        :page-size="pageSize"
        :current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 30, 40]"
        class="pagination-container"
        background>
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { pageData } from './list.data'
  import { comPageData } from './common.data'

  import { API_PATH } from '@/config/env'
  import headMixins from '@/config/mixins/head'
  import {comPickerOptions} from '@/config/data/head'
  import tableMixins from '@/config/mixins/table'
  import { formatTimeString, downloadFile } from '@/config/utils'

  import countTo from 'vue-count-to'
  import option from '@/components/option'
  import { userList, userUpdateRole, userUpdateStatus } from '@/service'

  export default {
    name: 'members-info',
    mixins: [headMixins, tableMixins],
    components: { countTo, [option.name]: option },
    data () {
      return {
        title: '会员信息管理',
        memberTotal: 0,
        downloadLoading: false, // 导出按钮loading状态
        exportUrl: '', // 下载链接
        downloadCode: '',
        isVisibleChange: false,

        // 会员查询筛选
        levelList: pageData.levelList,
        pickerOptions: comPickerOptions,
        membersSort: {
          credit_level: '',
          store: '',
          reg_date: '',
          name: this.$route.query.companyName
        },

        filtersStatusList: comPageData.statusList
      }
    },
    mounted () {
      const self = this
      self.getPageData()
    },
    methods: {
      getPageData() {
        const self = this
        const paramsObj = {
          pageNum: self.currentPage,
          pageSize: self.pageSize,
          creditLevel: self.membersSort.credit_level,
          storeId: self.membersSort.store,
          startDate: self.membersSort.reg_date ? formatTimeString(self.membersSort.reg_date[0]) : null,
          endDate: self.membersSort.reg_date ? formatTimeString(self.membersSort.reg_date[1]) : null,
          keyword: self.membersSort.name
        }
        userList(paramsObj).then(res => {
          if (res.status === 'true') {
            self.memberTotal = res.info.totalUser
            self.pageTotal = res.info.page.total
            self.tableData = res.info.page.result

            self.tableLoading = false
            if (self.tableData.length === 0) {
              self.tableEmpty = '暂时无数据'
            }
          } else {
            self.tableEmpty = '暂时无数据'
            self.$message.error(res.msg)
          }
        })
      },
      // 更新会员角色
      handleUpdateRole(id, role) {
        if (!this.isVisibleChange) return false
        const roleParams = {
          userId: id,
          role: role
        }
        userUpdateRole(roleParams).then(res => {
          if (res.status === 'true') {
            this.$message.success('修改成功！')
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 更新会员状态
      handleUpdateStatus(id, status) {
        const statusParams = {
          userId: id,
          status: status
        }
        userUpdateStatus(statusParams).then(res => {
          if (res.status === 'true') {
            this.$message.success('修改成功！')
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 导出表格
      exportExcel() {
        if (!this.tableData.length) {
          return this.$message.info('暂无数据')
        }
        const self = this
        const downParams = {
          creditLevel: self.membersSort.credit_level,
          startDate: self.membersSort.reg_date ? formatTimeString(self.membersSort.reg_date[0]) : null,
          endDate: self.membersSort.reg_date ? formatTimeString(self.membersSort.reg_date[1]) : null,
          storeId: self.membersSort.store,
          keyword: self.membersSort.name
        }
        let url = API_PATH + '/manage/user/listExcel'
        downloadFile(url, downParams)
      },
      formatter(row, column) {
        return '￥ ' + row.consumeAmount;
      },
      handleVisibleChange (isVisible) {
        this.isVisibleChange = isVisible
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .members-info {
    .members-total {
      margin-right: 12px;
      font-size: 14px;
    }
    .cell .el-select {
      width: auto;
      padding: 10px 0;
    }
  }
</style>
