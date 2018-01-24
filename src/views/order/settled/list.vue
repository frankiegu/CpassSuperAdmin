<template>
  <div class="visit-list">

    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <h1>入驻申请</h1>
    </div>

    <div class="store-setting card-padding">
      <el-form
        :inline="true"
        :model="settledSort"
        class="sort-form-bar clearfix">

        <div v-permissions="'/manage/enter/exportEnter'" class="search-box">
          <el-button class="btn-green fr" @click="exportExcel" icon="el-icon-download">导出表格</el-button>
        </div>

        <div class="">
          <!--<el-form-item class="" label="">-->
            <!--<el-date-picker start-placeholder="开始日期" end-placeholder="结束日期"-->
              <!--v-model="settledSort.date"-->
              <!--type="daterange"-->
              <!--align="right"-->
              <!--:clearable="true"-->
              <!--@change="findEnterList"-->
              <!--placeholder="选择下单日期"-->
              <!--:picker-options="pickerOptions">-->
            <!--</el-date-picker>-->
          <!--</el-form-item>-->

          <!-- <el-form-item class="" label="">
            <el-select v-model="settledSort.companyId" placeholder="请选择企业">
              <el-option
                v-for="item in settledSort.companyList"
                :key="item.id"
                :value="item.id"
                :label="item.name">
              </el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item class="" label="">
            <el-select
              class="width150"
              @change="findEnterList"
              :clearable="true"
              v-model="settledSort.storeId"
              placeholder="请选择门店">
              <el-option
                v-for="item in settledSort.storeList"
                :key="item.id"
                :label="item.storeName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item class=""  label="">
            <el-select v-model="settledSort.fieldId" placeholder="请选择场地">
              <el-option
                v-for="item in settledSort.fieldList"
                :key="item.id"
                :label="item.fieldName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item class="" label="">
            <el-select
               class="width150"
              :clearable="true"
              @change="findEnterList"
              v-model="settledSort.orderStatus"
              placeholder="请选择审批状态">
              <el-option
                v-for="item in settledSort.settledStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :class="{'mr0': !handleHasPermissions('/manage/enter/exportEnter')}">
            <el-input
              class="width220px"
              v-model.trim="settledSort.companyName"
              placeholder="请输入公司名称"
              @keyup.native.enter="findEnterList">

              <i slot="suffix" @click="findEnterList" class="el-input__icon el-icon-search"></i>
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
            {{ scope.row.created }}
          </template>
        </el-table-column>

        <!-- 2 -->
        <el-table-column
          :span="4"
          label="进驻门店">

          <template slot-scope="scope">
            {{ scope.row.storeName }}
          </template>
        </el-table-column>

        <!-- 3 -->
        <el-table-column
          :span="4"
          label="公司名称">

          <template slot-scope="scope">
            {{ scope.row.companyName }}
          </template>
        </el-table-column>

        <!-- 4 -->
        <el-table-column
          :span="4"
          label="行业类型">

          <template slot-scope="scope">
            {{ scope.row.professionName }}
          </template>
        </el-table-column>

        <!-- 5 -->
        <el-table-column
          :span="4"
          label="公司规模">

          <template slot-scope="scope">
            {{ scope.row.companyScaleName }}
          </template>
        </el-table-column>

        <!-- 6 -->
        <el-table-column
          :span="4"
          label="联系人姓名">

          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>

        <!-- 7 -->
        <el-table-column
          :span="4"
          label="联系电话">

          <template slot-scope="scope">
            {{ scope.row.mobile }}
          </template>
        </el-table-column>

        <!-- 8 -->
        <el-table-column
          :span="4"
          label="审批状态">

          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 10" type="primary">待审批</el-tag>
            <el-tag v-else-if="scope.row.status === 20" type="success">已通过</el-tag>
            <el-tag v-else-if="scope.row.status === 30" type="danger">已驳回</el-tag>
          </template>
        </el-table-column>

        <!-- 9 -->
        <el-table-column
          v-if="handleHasPermissions(['/manage/enter/detail', '/manage/enter/pass'])"
          label="操作">

          <template slot-scope="scope">
            <div v-if="handleHasPermissions('/manage/enter/detail')">
              <router-link
                v-if="scope.row.status === 20 || scope.row.status === 30"
                class="margin-lr6 pointer-theme-blue"
                :to="{path: '/order/settled/detail', query: {id: scope.row.id}}">
                <span>查看</span>
              </router-link>
            </div>

            <div v-if="handleHasPermissions('/manage/enter/pass')">
              <router-link
                v-if="scope.row.status === 10"
                class="margin-lr6 pointer-theme-blue"
                :to="{path: '/order/settled/detail', query: {id: scope.row.id}}">
                <span>审批</span>
              </router-link>
            </div>
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
  import handleHasPermissions from '@/config/com-mixins'
  import { API_PATH } from '@/config/env'
  import { downloadFile } from '@/config/utils'
  import { findAllStore, companyList, fieldList, enterList } from '@/service'
  export default {
    mixins: [handleHasPermissions],
    data () {
      return {
        title: '入驻申请',
        // 查询表单
        settledSort: {
          date: '',
          storeList: [], // 门店列表
          companyId: null,
          companyList: [], // 企业列表
          storeId: null,
          companyName: '', // 公司名称
          fieldId: null,
          fieldList: [], // 场地列表
          orderStatus: null,
          settledStatusList: [
            {
              value: ' ',
              label: '全部'
            }, {
              value: 10,
              label: '待审批'
            }, {
              value: 20,
              label: '已通过'
            }, {
              value: 30,
              label: '已驳回'
            }
          ], // 审批状态
          no: null,
          startDate: null,
          endDate: null
        },
        // 订单列表
        orderTable: [],
        tableLoading: true,
        tableEmpty: ' ',
        // 分页器配置
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0,

        downloadLoading: false, // 导出按钮loading状态
        exportUrl: '' // 下载链接
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

      // 查询订单列表
      self.findEnterList()

      // 阅读消息，清空消息提醒
      this.readMessage()
    },
    methods: {
      readMessage () {
        this.$store.dispatch('readMessageWay', 'order').then(() => {
          // 再刷新一次数据
          setTimeout(() => {
            this.$store.dispatch('getMessagerWay')
          }, 100)
        }).catch(err => {
          this.$message.error(err)
        });
      },
      // 导出表格
      exportExcel() {
        if (!this.orderTable.length) {
          return this.$message.info('暂无数据')
        }
        const self = this
        self.downloadLoading = true

        // 申请下载code
        const downParams = {
          status: self.settledSort.orderStatus,
          storeId: self.settledSort.storeId,
          companyName: self.settledSort.companyName
        }
        console.log(self.settledSort.storeId)
        let excelUrl = API_PATH + '/manage/enter/exportEnter'
        // 下载文件
        downloadFile(excelUrl, downParams)
      },
      // 场地列表
      getFieldList () {
        const self = this
        fieldList().then(res => {
          if (res.status === 'true') {
            self.settledSort.fieldList = res.info.result
            // 添加查看全部门店
            self.settledSort.fieldList.unshift({'id': '', 'fieldName': '全部场地'})
            // console.log('self.settledSort.fieldList: ', self.settledSort.fieldList);
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
            self.settledSort.companyList = res.info.result
            // 添加查看全部门店
            self.settledSort.companyList.unshift({'id': '', 'name': '全部企业'})
            // console.log('self.settledSort.companyList: ', self.settledSort.companyList);
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
            self.settledSort.storeList = res.info
            // 添加查看全部门店
            self.settledSort.storeList.unshift({'id': '', 'storeName': '全部门店'})
            // console.log('self.settledSort.storeList: ', self.settledSort.storeList);
          } else {
            self.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
        })
      },
      findEnterList() {
        const self = this
        const paramsObj = {
          pageNum: self.currentPage,
          pageSize: self.pageSize,
          storeId: self.settledSort.storeId,
          status: self.settledSort.orderStatus,
          companyName: self.settledSort.companyName
        }
        // console.log('paramsObj: ', paramsObj);

        enterList(paramsObj).then(res => {
          if (res.status === 'true') {
            self.pageTotal = res.info.total
            self.orderTable = res.info.result

            self.tableLoading = false
            if (self.orderTable.length === 0) {
              self.tableEmpty = '暂时无数据'
            }
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
        this.pageSize = val
        this.findEnterList()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.findEnterList()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../styles/config";
  .visit-list {
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
  }
</style>
