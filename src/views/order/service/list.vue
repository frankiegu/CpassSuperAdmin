<template>
  <div class="space">
    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <h1>服务订单</h1>
    </div>

    <div class="store-setting card-padding">
      <!-- 查询表单 -->
      <el-form
        :inline="true"
        :model="serviceSort"
        class="sort-form-bar">

        <el-form-item class="" label="">
          <el-date-picker start-placeholder="开始日期" end-placeholder="结束日期"
                          v-model="serviceSort.date"
                          type="daterange"
                          align="right"
                          placeholder="选择日期范围"
                          :clearable="true"
                          :picker-options="serviceSortDate"
                          @change="getServiceBookingList">
          </el-date-picker>
        </el-form-item>

        <el-form-item class=""  label="">
          <el-select
            :clearable="true"
            v-model="serviceSort.orderStatus"
            @change="getServiceBookingList"
            placeholder="订单状态">

            <el-option
              label="全部"
              value=" ">
            </el-option>
            <el-option
              v-for="(val, key) in serviceStatusList"
              :key="key"
              :label="val"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :class="{'mr0': !handleHasPermissions('/manage/valueAddServiceOrder/exportOrder')}">
          <el-input
            class="width220"
            v-model.trim="serviceSort.orderNum"
            placeholder="请输入服务单号"
            @keyup.native.enter="getServiceBookingList()">

            <i slot="suffix" @click="getServiceBookingList()" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <el-button
          v-permissions="'/manage/valueAddServiceOrder/exportOrder'"
          @click="exportExcel"
          :loading="downloadLoading"
          class="btn-green"
          icon="el-icon-download">导出表格</el-button>
      </el-form>

      <el-table
        :data="serviceTable"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        border
        style="width: 100%">

        <!-- 1 -->
        <el-table-column label="服务单号" width="140">
          <template slot-scope="scope">
            <router-link class="table-link" :to="{path: '/order/service/detail', query: {id: scope.row.id}}">
              {{ scope.row.orderNum }}
            </router-link>
          </template>
        </el-table-column>

        <!-- 2 -->
        <el-table-column label="下单时间" prop="createDate" width="165"></el-table-column>

        <!-- 3 -->
        <el-table-column label="订单状态">

          <template slot-scope="scope">
            <el-tag v-if="scope.row.orderStatus === 1">待接单</el-tag>
            <el-tag v-else-if="scope.row.orderStatus === 2" type="success">已接单</el-tag>
            <el-tag v-else-if="scope.row.orderStatus === 3" type="info">已完成</el-tag>
            <el-tag v-else-if="scope.row.orderStatus === 4" type="danger">已取消</el-tag>
          </template>
        </el-table-column>

        <!-- 4 -->
        <el-table-column label="服务名称" prop="serviceName"></el-table-column>

        <!-- 5 -->
        <el-table-column label="服务供应商" prop="providerName"></el-table-column>

        <!-- 6 -->
        <el-table-column label="联系人" prop="contact"></el-table-column>

        <!-- 7 -->
        <el-table-column label="联系号码" prop="phone"></el-table-column>

        <!-- 8 -->
        <el-table-column label="操作" v-if="handleHasPermissions('/manage/valueAddServiceOrder/acceptOrder')">

          <template slot-scope="scope">
            <el-button v-if="scope.row.orderStatus === 1" type="text" @click="receiveOrder(scope.row.id)">接单</el-button>
          </template>
        </el-table-column>

      </el-table>

      <!-- 分页器 -->
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
  </div>
</template>

<script>
  import { formatTimeString, downloadFile } from '@/config/utils'
  import handleHasPermissions from '@/config/com-mixins'
  import { API_PATH } from '@/config/env'
  import { SERVICE_ORDER_LIST, SERVICE_ORDER_STATUS, RECIEVE_ORDER } from '@/service'

  export default {
    mixins: [handleHasPermissions],
    data () {
      return {
        title: '场地发布管理',
        date: null, // 选择日期
        tableLoading: true,
        tableEmpty: ' ',
        downloadLoading: false,

        // 分页参数
        pageTotal: 0,
        pageSize: 10,
        currentPage: 1,

        // table列表数据
        serviceTable: [],

        // 选择日期范围
        serviceSortDate: {
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
        // 服务状态列表
        serviceStatusList: {},
        // 筛选条件
        serviceSort: {
          orderStatus: '',
          date: '',
          orderNum: ''
        }
      }
    },
    mounted () {
      // 获取服务订单状态列表
      const self = this
      const JSON = {
        key: 'orderStatus'
      }
      SERVICE_ORDER_STATUS(JSON).then(res => {
        if (res.status === 'true') {
          self.serviceStatusList = res.info
        } else {
          self.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
      // 查询服务订单列表
      this.getServiceBookingList()
    },
    methods: {
      // 服务订单列表
      getServiceBookingList() {
        const self = this
        const paramsObj = {
          pageNum: self.currentPage,
          pageSize: self.pageSize,
          startDate: self.serviceSort.date ? formatTimeString(self.serviceSort.date[0]) : '',
          endDate: self.serviceSort.date ? formatTimeString(self.serviceSort.date[1]) : '',
          orderNum: self.serviceSort.orderNum,
          orderStatus: self.serviceSort.orderStatus
        }
        SERVICE_ORDER_LIST(paramsObj).then(res => {
          if (res.status === 'true') {
            self.pageTotal = res.info.total
            self.serviceTable = res.info.result

            // table的交互
            self.tableLoading = false
            if (self.serviceTable.length === 0) {
              self.tableEmpty = '暂时无数据'
            }
          } else {
            self.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      },
      // 接单
      receiveOrder (id) {
        const self = this
        const JSON = {
          id: id
        }
        self.$confirm('是否对该服务订单进行接单?', '接单', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          RECIEVE_ORDER(JSON).then(res => {
            if (res.status === 'true') {
              self.getServiceBookingList()
              self.$message({
                type: 'success',
                message: '接单成功!'
              });
            } else {
              self.$message({
                type: 'error',
                message: res.msg
              });
            }
          })
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },

      // 分页器事件
      handleSizeChange(val) {
        this.pageSize = val
        this.getServiceBookingList()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getServiceBookingList()
      },
      // 导出服务订单
      exportExcel() {
        if (!this.serviceTable.length) {
          return this.$message.info('暂无数据')
        }
        const self = this
        // self.downloadLoading = true
        // 申请下载code
        const downParams = {
          orderStatus: self.serviceSort.orderStatus,
          orderNum: self.serviceSort.orderNum,
          startDate: self.serviceSort.date ? formatTimeString(self.serviceSort.date[0]) : '',
          endDate: self.serviceSort.date ? formatTimeString(self.serviceSort.date[1]) : ''
        }
        let url = API_PATH + '/manage/valueAddServiceOrder/exportOrder'
        downloadFile(url, downParams)
        // applyDownloadCode(downParams).then(res => {
          // if (res.status === 'true') {
            // self.exportUrl = API_PATH + '/manage/valueAddServiceOrder/exportOrder?downloadCode=' + res.info
            // location.href = self.exportUrl
            // setTimeout(function () {
              // self.downloadLoading = false
            // }, 500)
          // } else {
            // self.downloadLoading = false
            // self.$message.error(res.msg)
          // }
        // })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/config.scss';

  .space {
    .sort-form-bar {
      text-align: right;
    }
  }
</style>
