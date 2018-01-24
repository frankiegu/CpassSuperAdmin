<template>
  <div class="settlement">

    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <h1>租金结算管理</h1>
    </div>

    <div class="store-setting card-padding">
      <!-- 查询表单 -->
      <el-form :inline="true" :model="settleSort" class="sort-form-bar">

        <el-form-item label="">
          <el-date-picker
            v-model="settleSort.month"
            type="month"
            :picker-options="monthOption"
            align="right"
            placeholder="选择月份"
            value-format="yyyyMM"
            @change="findSettleList">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="">
          <el-select v-model="settleSort.storeId" placeholder="请选择门店" @change="findSettleList" clearable>
            <el-option v-for="storeItem in storeList" :label="storeItem.storeName" :value="storeItem.id" :key="storeItem.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-select
            v-model="settleSort.status"
            placeholder="结算状态"
            clearable
            @change="findSettleList">

            <el-option label="全部" value=" "></el-option>
            <el-option v-for="(val, key) in statusList" :label="val" :value="key" :key="key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="" label="">
          <el-input
            class="width220"
            v-model.trim="settleSort.keyword"
            placeholder="企业名称或结算单号"
            @keyup.native.enter="findSettleList">

            <i slot="suffix" @click="findSettleList" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <el-form-item v-permissions="'/manage/companyMonthlyBill/exportExcel'">
          <el-button
            @click="exportExcel"
            :loading="downloadLoading"
            icon="el-icon-download"
            class="btn-green">导出表格</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="settleTable"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange">

        <el-table-column
          type="selection"
          width="55"
          v-if="handleHasPermissions('/manage/companyMonthlyBill/exportBillDetailExcel')"></el-table-column>

        <el-table-column label="月份" prop="relationMonth"></el-table-column>
        <el-table-column label="结算单号" prop="billNo">
          <template slot-scope="scope">
            <router-link :to="'/finance/settlement/detail?id=' + scope.row.id" class="table-link">{{ scope.row.billNo }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="所属门店" prop="storeName"></el-table-column>
        <el-table-column label="企业名称" align="left" prop="companyName"></el-table-column>
        <el-table-column label="场地租赁费" prop="rentalFee"></el-table-column>
        <el-table-column label="空间服务费" prop="fieldServiceAmount"></el-table-column>
        <el-table-column label="费用总额" prop="totalAmount"></el-table-column>
        <el-table-column label="需支付金额" prop="mustPayAmount"></el-table-column>

        <!-- 结算状态：“逾期” 红色；结算日期：“逾期结清” 红色，已结清的才有返回结算日期 -->
        <el-table-column label="结算状态" prop="statusName">
          <template slot-scope="scope">
            <span :class="{'theme-red' : scope.row.status === 30}">{{ scope.row.statusName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="结算日期" prop="settlementTime">
          <template slot-scope="scope">
            <span v-if="!scope.row.settlementTime">-</span>
            <span :class="{'theme-red' : scope.row.status === 40}" v-else>{{ scope.row.settlementTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" v-if="handleHasPermissions('/manage/companyMonthlyBill/confirm')">
          <template slot-scope="scope">
            <span class="table-link" @click="openChargeBox(scope.row.id)" v-if="scope.row.status === 10 || scope.row.status === 30">确认收款</span>
          </template>
        </el-table-column>
      </el-table>

      <el-button
        type="primary"
        @click="exportDetail"
        class="mt20"
        :disabled="!allowExport"
        v-if="handleHasPermissions('/manage/companyMonthlyBill/exportBillDetailExcel')"
        :loading="downDetailLoading">导出结算清单</el-button>

      <!-- 分页 -->
      <el-pagination background
        class="pagination-container"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>

    </div>

    <!-- 确认收费弹窗 -->
    <transition name="fade">
      <el-dialog
        title="确认收款"
        :lock-scroll="false"
        :visible.sync="chargeDialogVisible"
        :before-close="cancelCharge"
        width="500px" class="charge-dialog">
        <el-form :model="chargeForm" label-width="70px" ref="chargeForm" class="charge-form">
          <p>点击确认收款后结算单状态将变为 已结清，请确保已收到款项。</p>
          <el-form-item label="企业名称">{{ chargeForm.companyName }}</el-form-item>
          <el-form-item label="费用总额">¥ {{ chargeForm.mustPayAmount }}</el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="btn-save" type="primary" @click="confirmCharge" v-if="chargeForm.mustPayAmount !== 0">确认收款</el-button>
          <el-button @click="cancelCharge" class="btn-clear">取消</el-button>
        </div>
      </el-dialog>
    </transition>

  </div>
</template>

<script>
  import handleHasPermissions from '@/config/com-mixins'
  import { API_PATH } from '@/config/env'
  import { downloadFile } from '@/config/utils'
  import { findAllStore, monthlyBillList, loadConstant, confirmBill } from '@/service/index'
  export default {
    mixins: [handleHasPermissions],
    data () {
      return {
        title: '租金结算管理',
        downloadLoading: false, // 导出表格按钮loading状态
        downDetailLoading: false, // 导出清单明细loading状态
        exportUrl: '', // 下载地址

        monthOption: {
          disabledDate(time) {
            return (time.getTime() + 3600 * 1000 * 24 * 30) > Date.now()
          }
        },

        // 结算列表筛选
        storeList: [], // 门店列表
        statusList: {}, // 结算状态列表
        settleSort: {
          month: '',
          storeId: '',
          status: '',
          keyword: ''
        },
        // 结算列表
        settleTable: [],
        tableEmpty: ' ',
        tableLoading: true,
        allowExport: false, // 选中表格行时才激活导出结算清单按钮
        billIds: [], // 选中的账单id 数组

        // 确认收费弹窗
        chargeId: '',
        chargeDialogVisible: false,
        chargeForm: {}, // 收费信息（公司名以及金额）

        // 分页器配置
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0
      }
    },
    mounted() {
      // 查询账单列表
      this.findSettleList()
      // 查询进驻门店
      findAllStore().then(res => {
        if (res.status === 'true') {
          this.storeList = res.info
          this.storeList.unshift({'id': ' ', 'storeName': '全部门店'})
        } else {
          console.log(res.msg)
        }
      })
      // 获取结算状态常量
      const companyStatus = 'bill.status'
      loadConstant(companyStatus).then(res => {
        if (res.status === 'true') {
          this.statusList = res.info
        } else {
          console.log(res.msg)
        }
      })
    },
    watch: {},
    methods: {
      // 查询账单列表
      findSettleList() {
        const self = this
        const settleParams = {
          pageNum: self.currentPage,
          pageSize: self.pageSize,
          month: self.settleSort.month,
          storeId: self.settleSort.storeId,
          status: self.settleSort.status,
          keyword: self.settleSort.keyword
        }
        monthlyBillList(settleParams).then(res => {
          if (res.status === 'true') {
            self.pageTotal = res.info.total
            self.settleTable = res.info.result

            self.tableLoading = false
            if (self.settleTable.length === 0) {
              self.tableEmpty = '暂时无数据'
            }

            for (let i = 0; i < self.settleTable.length; i++) {
              self.settleTable[i].settlementTime = self.settleTable[i].settlementTime
                ? res.info.result[i].settlementTime.split(' ')[0]
                : null
            }
          } else {
            self.$message.error(res.msg)
          }
        })
      },

      // 导出表格
      exportExcel() {
        if (!this.settleTable.length) {
          return this.$message.info('暂无数据')
        }
        const self = this
        const downParams = {
          storeId: self.settleSort.storeId,
          status: self.settleSort.status,
          month: self.settleSort.month ? self.settleSort.month : null,
          keyword: self.settleSort.keyword
        }
        let url = API_PATH + '/manage/companyMonthlyBill/exportExcel'
        downloadFile(url, downParams)
      },

      // 导出明细
      exportDetail () {
        if (!this.billIds.length) {
          return this.$message.info('暂无数据')
        }
        const downParams = {
          billId: this.billIds
        }
        let url = API_PATH + '/manage/companyMonthlyBill/exportBillDetailExcel'
        downloadFile(url, downParams)
      },

      // 表格选中事件
      handleSelectionChange(selectVal) {
        var tempArr = []
        for (let val of selectVal.values()) {
          tempArr.push(val.id)
        }
        this.billIds = tempArr
        if (selectVal.length) {
          this.allowExport = true
        } else {
          this.allowExport = false
        }
      },

      // 分页器事件
      handleSizeChange(val) {
        this.pageSize = val
        this.findSettleList()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.findSettleList()
      },

      // 打开确认收费弹窗
      openChargeBox(id) {
        this.chargeDialogVisible = true
        this.chargeId = id
        let chargeTarget = this.settleTable.find(target => {
          return target.id === id
        })
        this.chargeForm.companyName = chargeTarget.companyName
        this.chargeForm.mustPayAmount = chargeTarget.mustPayAmount
      },
      // 确认收费
      confirmCharge() {
        const chargeParams = {
          billId: this.chargeId
        }
        confirmBill(chargeParams).then(res => {
          if (res.status === 'true') {
            this.chargeDialogVisible = false
            this.findSettleList()
            this.$message.success('结算成功！')
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 取消收费
      cancelCharge() {
        this.chargeDialogVisible = false
        this.$message.info('已取消操作！')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../styles/config";
  .settlement {
    .sort-form-bar {
      text-align: right;
      margin-right: -10px;
      font-size: 0;
    }
  }
  .charge-form {
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .charge-dialog {
    .dialog-footer {
      text-align: center;
    }
  }
</style>
