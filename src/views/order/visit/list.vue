<template>
  <div class="order">

    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <h1>参观预约</h1>
    </div>

    <div class="store-setting card-padding">
      <el-form
        :inline="true"
        :model="visitSort"
        class="sort-form-bar clearfix">

        <div v-if="handleHasPermissions('/manage/visitReservation/exportVisitReservation')" class="search-box">
          <el-button class="btn-green fr" @click="exportExcel" icon="el-icon-download">导出表格</el-button>
        </div>

        <div class="">
          <!-- <el-form-item class="" label="">
            <el-date-picker start-placeholder="开始日期" end-placeholder="结束日期"
              v-model="visitSort.date"
              type="daterange"
              align="right"
              :clearable="true"
              @change="findOrderList"
              placeholder="选择下单日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item> -->

          <!-- <el-form-item class="" label="">
            <el-select v-model="visitSort.companyId" placeholder="请选择企业">
              <el-option
                v-for="item in visitSort.companyList"
                :key="item.id"
                :value="item.id"
                :label="item.name">
              </el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item class="" label="">
            <el-select
              class="width150"
              @change="findVisitList"
              :clearable="true"
              v-model="visitSort.attendType"
              placeholder="请选择进驻类型">
              <el-option
                v-for="item in visitSort.stationed"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item class=""  label="">
            <el-select v-model="visitSort.fieldId" placeholder="请选择场地">
              <el-option
                v-for="item in visitSort.fieldList"
                :key="item.id"
                :label="item.fieldName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item class="" label="">
            <el-select
              class="width150"
              @change="findVisitList"
              :clearable="true"
              v-model="visitSort.storeId"
              placeholder="请选择门店">
              <el-option
                v-for="item in visitSort.storeList"
                :key="item.id"
                :label="item.storeName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="" label="">
            <el-select
               class="width150"
              :clearable="true"
              @change="findVisitList"
              v-model="visitSort.statusCode"
              placeholder="请选择预约状态">
              <el-option
                v-for="item in visitSort.bookingStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :class="{'mr0': !handleHasPermissions('/manage/visitReservation/exportVisitReservation')}">
            <el-input
              class="width220px"
              v-model.trim="visitSort.reservator"
              placeholder="请输入预约人姓名"
              @keyup.native.enter="findVisitList">

              <i slot="suffix" @click="findVisitList" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
        </div>
      </el-form>

      <el-table
        :data="orderTable"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        border
        style="width: 100%">

        <!-- 1 -->
        <el-table-column
          width="165"
          label="申请时间">

          <template slot-scope="scope">
            {{ scope.row.createDate }}
          </template>
        </el-table-column>

        <!-- 2 -->
        <el-table-column
          label="预约人">

          <template slot-scope="scope">
            <!-- table 表格内的时间格式化 -->
            <span>{{ scope.row.reservator }}</span>
          </template>
        </el-table-column>

        <!-- 3 -->
        <el-table-column
          label="联系方式">

          <template slot-scope="scope">
            <!-- table 表格内的时间格式化 -->
            <span>{{ scope.row.mobile }}</span>
          </template>

        </el-table-column>

        <!-- 4 -->
        <el-table-column
          label="进驻类型">

          <template slot-scope="scope">
            <span v-if="scope.row.attendType === 1">个人</span>
            <span v-if="scope.row.attendType === 2">企业</span>
          </template>

        </el-table-column>

        <!-- 5 -->
        <el-table-column
          label="参观门店">
          <template slot-scope="scope">
            {{ scope.row.storeName }}
          </template>
        </el-table-column>

        <!-- 6 -->
        <el-table-column
          label="参观时间">

          <template slot-scope="scope">
            {{ scope.row.visitDate }}
          </template>
        </el-table-column>

        <!-- 7 -->
        <el-table-column
          label="预约状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.statusCode === 1" type="primary">未确认</el-tag>
            <el-tag v-else-if="scope.row.statusCode === 2" type="success">已确认</el-tag>
            <el-tag v-else-if="scope.row.statusCode === 3" type="success">已完成</el-tag>
            <el-tag v-else-if="scope.row.statusCode === 4" type="danger">已取消</el-tag>
          </template>
        </el-table-column>

        <!-- 8 -->
        <el-table-column
          v-if="handleHasPermissions(['/manage/visitReservation/getVisitReservationDetail', '/manage/visitReservation/confirmVisitReservation'])"
          label="操作">

          <template slot-scope="scope">
            <el-row>
              <el-col v-if="handleHasPermissions('/manage/visitReservation/getVisitReservationDetail')" :span="12">
                <router-link class="margin-lr6 pointer-theme-blue" :to="{path: '/order/visit/detail', query: {id: scope.row.id}}">
                  <span>查看</span>
                </router-link>
              </el-col>

              <el-col v-if="handleHasPermissions('/manage/visitReservation/confirmVisitReservation')" :span="12">
                <span @click="showComfirm(scope.row.id)" class="cursor-pointer" v-if="scope.row.statusCode === 1">确认</span>
              </el-col>
            </el-row>
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

    <!-- 确认停用账号？ -->
    <el-dialog class="set-dialog"
               :title="dialogTitle"
               :visible.sync="stopVisible"
               width="420px">

      <p class="">该操作不可逆，是否确认操作？</p>

      <div slot="footer" class="dialog-footer">
        <el-button @click="stopVisible = false">取消</el-button>
        <el-button @click="btnConfirm" type="primary">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import handleHasPermissions from '@/config/com-mixins'
  import { downloadFile } from '@/config/utils'
  import { API_PATH } from '@/config/env'
  import { findAllStore, companyList, fieldList, listVisitReservation, confirmVisitReservation } from '@/service'
  export default {
    mixins: [handleHasPermissions],
    data () {
      return {
        title: '',
        dialogTitle: '确认预约',
        stopVisible: false,
        // 查询表单
        visitSort: {
          date: '',
          storeList: [], // 门店列表
          companyId: null,
          companyList: [], // 企业列表
          storeId: null,
          reservator: '', // 预约人姓名
          statusCode: null, // 预约状态
          attendType: null, // 进驻类型
          fieldId: null,
          fieldList: [], // 场地列表
          orderStatus: null,
          stationed: [
            {
              value: ' ',
              label: '全部'
            }, {
              value: 1,
              label: '个人'
            }, {
              value: 2,
              label: '企业'
            }
          ],
          bookingStatus: [
            {
              value: '',
              label: '全部状态'
            },
            {
              value: 1,
              label: '未确认'
            }, {
              value: 2,
              label: '已确认'
            }, {
              value: 3,
              label: '已完成'
            }, {
              value: 4,
              label: '已取消'
            }
          ],
          orderStatusList: [
            {
              value: 10,
              label: '未使用'
            }, {
              value: 20,
              label: '已使用'
            }, {
              value: 30,
              label: '已取消'
            }
          ],
          no: null,
          startDate: null,
          endDate: null
        },
        // 订单列表
        id: null,
        orderTable: [],
        tableLoading: true,
        tableEmpty: ' ',
        // 分页器配置
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0,

        downloadLoading: false, // 导出按钮loading状态
        exportUrl: '', // 下载链接

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
        }
      }
    },
    mounted () {
      const self = this
      self.token = sessionStorage.getItem('token')

      // 场地列表
      // self.getFieldList()
      // 企业列表
      // self.getCompanyList()
      // 门店列表
      self.getFindAllStore()

      // 查询申请列表
      self.findVisitList()
    },
    methods: {
      // 导出表格
      exportExcel() {
        if (!this.orderTable.length) {
          return this.$message.info('暂无数据')
        }
        const self = this
        self.downloadLoading = true

        // 申请下载code
        const downParams = {
          attendType: self.visitSort.attendType,
          statusCode: self.visitSort.statusCode,
          storeId: self.visitSort.storeId,
          reservator: self.visitSort.reservator
        }
        let excelUrl = API_PATH + '/manage/visitReservation/exportVisitReservation'
        // 下载文件
        downloadFile(excelUrl, downParams)
      },
      // 场地列表
      getFieldList () {
        const self = this
        fieldList().then(res => {
          if (res.status === 'true') {
            self.visitSort.fieldList = res.info.result
            // 添加查看全部门店
            self.visitSort.fieldList.unshift({'id': '', 'fieldName': '全部场地'})
            // console.log('self.visitSort.fieldList: ', self.visitSort.fieldList);
          } else {
            self.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
        })
      },
      // 企业列表
      getCompanyList () {
        const self = this
        companyList().then(res => {
          if (res.status === 'true') {
            self.visitSort.companyList = res.info.result
            // 添加查看全部门店
            self.visitSort.companyList.unshift({'id': '', 'name': '全部企业'})
            // console.log('self.visitSort.companyList: ', self.visitSort.companyList);
          } else {
            self.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
        })
      },
      // 门店列表
      getFindAllStore () {
        const self = this
        findAllStore().then(res => {
          if (res.status === 'true') {
            self.visitSort.storeList = res.info
            // 添加查看全部门店
            self.visitSort.storeList.unshift({'id': '', 'storeName': '全部门店'})
            // console.log('self.visitSort.storeList: ', self.visitSort.storeList);
          } else {
            self.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
        })
      },
      findVisitList() {
        const self = this
        const paramsObj = {
          pageNum: self.currentPage,
          pageSize: self.pageSize,
          attendType: self.visitSort.attendType,
          statusCode: self.visitSort.statusCode,
          reservator: self.visitSort.reservator,
          storeId: self.visitSort.storeId
        }
        // console.log('paramsObj: ', paramsObj);

        listVisitReservation(paramsObj).then(res => {
          if (res.status === 'true') {
            self.pageTotal = res.info.total
            self.orderTable = res.info.result

            self.tableLoading = false
            if (self.orderTable.length === 0) {
              self.tableEmpty = '暂时无数据'
            }

//            for (let i = 0; i < self.orderTable.length; i++) {
//              self.orderTable[i].created = res.info.result[i].created.split(' ')[0]
//            }
          } else {
            self.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
        })
      },
      // 显示弹窗
      showComfirm (id) {
        const self = this
        self.stopVisible = true
        self.id = id
      },
      // 确认预约
      btnConfirm () {
        const self = this
        const prameObj = {
          id: self.id
        }
        confirmVisitReservation(prameObj).then(res => {
          if (res.status === 'true') {
            self.stopVisible = false
            self.findVisitList()
          } else {
            self.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
        })
      },
      // 分页器事件
      handleSizeChange(val) {
        this.pageSize = val;
        this.findVisitList()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.findVisitList()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../styles/config";
  .order {
    .search-left {
      margin-right: 220px;
    }
    .search-box {
      float: right;

      .el-form-item {
        float: right;
      }
    }
    .sort-form-bar {
      text-align: right;

      .members-total {
        margin-right: 12px;
        font-size: 16px;
        font-weight: bold;
        color: $theme-blue;
      }
    }
    .page-search {
      margin-left: 30px;
    }
    .selectWidth {
      width: 100%;
    }
    .dialog-footer {
      text-align: center;
    }
    .avatar-uploader {
      float: left;
      width: 80px;
      height: 80px;
      margin-bottom: 2px;

      .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .el-upload:hover {
        border-color: #20a0ff;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 80px;
        height: 80px;
        line-height: 80px;
        text-align: center;
      }
      .theme-gray {
        vertical-align: middle;
      }
      .avatar {
        width: 80px;
        height: 80px;
        display: block;
      }
    }

    .cursor-pointer{
      cursor: pointer;
    }
  }
</style>
