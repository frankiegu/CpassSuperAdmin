<template>
  <div class="refund-approve">

    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <h1>退款审批</h1>
    </div>

    <div class="card-padding">
      <!-- 查询表单 -->
      <el-form :inline="true" :model="refundSort" class="sort-form-bar">

        <el-form-item label="">
          <el-date-picker
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-model="refundSort.date"
            type="daterange"
            align="right"
            placeholder="选择进驻日期"
            :picker-options="pickerOptions"
            @change="findRefundList">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="">
          <el-select
            v-model="refundSort.approveStatus"
            placeholder="审批状态"
            clearable
            @change="findRefundList">

            <el-option label="全部" value=" "></el-option>
            <el-option label="未审批" value="10"></el-option>
            <el-option label="已审批" value="20"></el-option>
            <el-option label="已驳回" value="30"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="" label="">
          <el-input
            class="width220"
            v-model.trim="refundSort.orderNum"
            placeholder="请输入订单号"
            @keyup.native.enter="findRefundList">

            <i slot="suffix" @click="findRefundList" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <el-form-item v-permissions="'/manage/orderRefund/listExcel'">
          <el-button class="btn-green" @click="exportExcel" icon="el-icon-download">导出表格</el-button>
        </el-form-item>

      </el-form>

      <el-table
        :data="refundTable"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        border
        style="width: 100%">
        <el-table-column label="申请时间" prop="created">
        </el-table-column>
        <el-table-column label="订单号" prop="referenceNum"></el-table-column>
        <el-table-column label="申请金额" prop="refundAmount"></el-table-column>
        <el-table-column label="审批状态" prop="username">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 10">待审批</span>
            <span v-if="scope.row.status === 20">已通过 </span>
            <span v-if="scope.row.status === 30">已驳回</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="170">
          <template slot-scope="scope">
            <el-row>
              <el-col :span="handleHasPermissions('/manage/orderRefund/approve') ? 12 : 24">
                <router-link class="margin-lr6 pointer-theme-blue" :to="{path: '/finance/refund-approval/detail', query: {id: scope.row.id}}">
                  <span class="table-link">查看</span>
                </router-link>
              </el-col>
              <el-col :span="12" v-if="scope.row.status === 10 || scope.row.status === 30" v-permissions="'/manage/orderRefund/approve'">
                <router-link class="margin-lr6 pointer-theme-blue" :to="{path: '/finance/refund-approval/detail', query: {id: scope.row.id}}">
                  <span class="table-link theme-gray">审批</span>
                </router-link>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>

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

    <!-- 侧弹窗 -->
    <!--<transition name="slide-fade">-->
      <!--<set-table-dialog v-show="setDialogVisible" :dialogType="showDialogType" :dialogTitle="dialogTitle" :dialogId="dialogId"></set-table-dialog>-->
    <!--</transition>-->
  </div>
</template>

<script>
  import handleHasPermissions from '@/config/com-mixins'
  import { orderRefundList } from '../../../service/index'
  import { API_PATH } from '@/config/env'
  import { formatTimeString, downloadFile } from '@/config/utils'
  import setTableDialog from './components/set-table-dialog.vue'
  export default {
    mixins: [handleHasPermissions],
    data () {
      return {
        title: '退款审批',
        token: sessionStorage.getItem('token'),

        // 退款申请查询筛选
        refundSort: {
          date: '',
          orderNum: '',
          approveStatus: '',
          referenceNum: ''
        },
        // 日期选择器
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },

        // 退款申请列表
        refundTable: [],
        tableLoading: true,
        tableEmpty: ' ',

        setDialogVisible: false,
        showDialogType: 'creditRewardForm',
        dialogTitle: '退款审批',
        dialogId: 0,

        // 分页器配置
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0,

        downloadLoading: false, // 导出按钮loading状态
        exportUrl: '' // 下载链接
      }
    },
    components: {
      setTableDialog
    },
    mounted() {
      // 查询规则列表
      this.findRefundList()
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      // 查询退款列表
      findRefundList() {
        const self = this
        const ruleParams = {
          pageNum: self.currentPage,
          pageSize: self.pageSize,
          startDate: self.refundSort.date ? formatTimeString(self.refundSort.date[0]) : null,
          endDate: self.refundSort.date ? formatTimeString(self.refundSort.date[1]) : null,
          status: self.refundSort.approveStatus,
          orderNum: self.refundSort.orderNum
        }
        orderRefundList(ruleParams).then(res => {
          if (res.status === 'true') {
            self.pageTotal = res.info.page.total
            self.refundTable = res.info.page.result
//            console.log(self.refundTable)

            self.tableLoading = false
            if (self.refundTable.length === 0) {
              self.tableEmpty = '暂时无数据'
            }

//            for (let i = 0; i < self.refundTable.length; i++) {
//              self.refundTable[i].created = res.info.page.result[i].created.split(' ')[0]
//              self.refundTable[i].nextTakeEffectTime = res.info.page.result[i].nextTakeEffectTime.split(' ')[0]
//            }
          } else {
            self.$message.error(res.msg)
          }
        })
      },
      // 导出表格
      exportExcel() {
        if (!this.refundTable.length) {
          return this.$message.info('暂无数据')
        }
        const self = this
        self.downloadLoading = true

        // 申请下载code
        const downParams = {
          startDate: self.refundSort.date ? formatTimeString(self.refundSort.date[0]) : '',
          endDate: self.refundSort.date ? formatTimeString(self.refundSort.date[1]) : '',
          status: self.refundSort.approveStatus,
          orderNum: self.refundSort.referenceNum
        }
        let excelUrl = API_PATH + '/manage/orderRefund/listExcel'
        // 下载文件
        downloadFile(excelUrl, downParams)
      },
      // 关闭设置对话框（侧弹窗）
      cancelDialogSet () {
        this.setDialogVisible = false
      },
      // 打开设置对话框（侧弹窗）
      openDialogSet (id) {
        this.setDialogVisible = true
        this.dialogId = id
      },

      // 分页器事件
      handleSizeChange(val) {
        this.pageSize = val
        this.findRefundList()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.findRefundList()
      }
    }
  }
</script>

<style lang="scss"></style>
<style lang="scss" scoped>
  @import "../../../styles/config";
  .refund-approve {
    .sort-form-bar {
      text-align: right;
      margin-right: -10px;
      font-size: 0;
    }
    .el-select .el-input {
      width: 110px;
    }
    .dialog-footer {
      text-align: center;
    }
  }
</style>
