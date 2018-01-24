<template>
  <div class="unlock-record">
    <!-- 查询表单 -->
    <el-form :inline="true" :model="recordSort" class="sort-form-bar">
      <el-form-item>
        <el-date-picker
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          v-model="recordSort.date"
          type="daterange"
          align="right"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          @change="handleGetRecord">
        </el-date-picker>
      </el-form-item>
    </el-form>

    <!-- 开锁记录表格 -->
    <el-table :data="recordTable" border style="width: 100%">
      <el-table-column label="操作人员" prop="userName"></el-table-column>
      <el-table-column label="绑定工号" prop="staffCode"></el-table-column>
      <el-table-column label="操作时间" prop="operateTime"></el-table-column>
      <el-table-column label="操作类型" prop="operateType">
        <template slot-scope="scope">{{scope.row.operateType === 1 ? '指纹开门' : '密码开门'}}</template>
      </el-table-column>
      <el-table-column label="备注" prop="remark">
        <template slot-scope="scope">
          <span v-if="scope.row.remark && scope.row.remark.length !== 0">{{scope.row.remark}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      background
      class="pagination-container"
      @size-change="handleRecordSizeChange"
      @current-change="handleRecordCurrentChange"
      :current-page="usageRecord.currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="usageRecord.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="usageRecord.pageTotal">
    </el-pagination>
  </div>
</template>

<script>
  import {unlockRecord} from '@/service'
  export default {
    name: 'unlock-record',
    data() {
      return {
        // 开锁记录选项卡
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
        recordSort: {
          date: ''
        },
        recordTable: [],
        usageRecord: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 10
        }
      }
    },
    props: {
      lockBaseId: [String, Number]
    },
    mounted() {
      // 查询开锁记录
      this.handleGetRecord()
    },
    methods: {
      // 查询开锁记录
      handleGetRecord() {
        let params = {
          pageNum: this.usageRecord.currentPage,
          pageSize: this.usageRecord.pageSize,
          lockBaseId: this.lockBaseId,
          startTime: this.recordSort.date[0],
          endTime: this.recordSort.date[1]
        }
        unlockRecord(params).then(res => {
          if (res.status === 'true' && res.info) {
            this.usageRecord.pageTotal = res.info.total
            this.recordTable = res.info.result
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      handleRecordSizeChange(val) {
        this.usageRecord.pageSize = val
        this.handleGetRecord()
      },
      handleRecordCurrentChange(val) {
        this.usageRecord.currentPage = val
        this.handleGetRecord()
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
