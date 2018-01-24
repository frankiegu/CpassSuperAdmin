<template>
  <div class="account">
    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <h1>故障报修</h1>
    </div>

    <div class="store-setting card-padding">
      <!-- 查询表单 -->
      <el-form
        :inline="true"
        :model="warningSort"
        class="sort-form-bar">

        <el-form-item>
          <el-select
            class="width150"
            v-model="warningSort.storeId"
            @change="getRepairOrderList"
            placeholder="请选择门店">
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.storeName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :class="{'mr0': !handleHasPermissions('/manage/repair/exportExcel')}">
          <el-input
            class="width220px"
            v-model.trim="warningSort.contacts"
            placeholder="请输入预约人姓名"
            @keyup.native.enter="getRepairOrderList">

            <i slot="suffix" @click="getRepairOrderList" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <el-button
          v-permissions="'/manage/repair/exportExcel'"
          @click="exportExcel()"
          class="btn-green fr"
          type="primary"
          icon="el-icon-download">导出表格</el-button>

      </el-form>

      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        border
        style="width: 100%">

        <!-- 1 -->
        <el-table-column
          width="165"
          label="提交时间">

          <template slot-scope="scope">
            <span>{{ scope.row.submitTime }}</span>
          </template>
        </el-table-column>

        <!-- 2 -->
        <el-table-column
          label="联系人">

          <template slot-scope="scope">
            <span>{{ scope.row.contacts }}</span>
          </template>
        </el-table-column>

        <!-- 3 -->
        <el-table-column
          label="联系方式">

          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>

        <!-- 4 -->
        <el-table-column
          label="报修门店">

          <template slot-scope="scope">
            <span>{{ scope.row.storeName }}</span>
          </template>
        </el-table-column>

        <!-- 5 -->
        <el-table-column
          min-width="180"
          label="报修描述">

          <template slot-scope="scope">
            <span>{{ scope.row.briefDescription.length >= 20 ? (scope.row.briefDescription.substr(0, 20) + '...'): scope.row.briefDescription}}</span>
          </template>
        </el-table-column>

        <!-- 6 -->
        <el-table-column
          label="状态">

          <template slot-scope="scope">
            <!--已完成-->
            <span v-if="scope.row.status==='1'">
              <el-tag type="info">已完成</el-tag>
            </span>

            <!--待处理-->
            <span v-if="scope.row.status==='0'">
              <el-tag>待处理</el-tag>
            </span>
          </template>
        </el-table-column>

        <!-- 7 -->
        <el-table-column
          v-if="handleHasPermissions(['/manage/repair/detail', '/manage/repair/register'])"
          min-width="80"
          label="操作">

          <template slot-scope="scope">

            <el-row>
              <span
                v-permissions="'/manage/repair/detail'"
                v-if="scope.row.status==='1'"
                @click="showDialog('view', scope.row.id)"
                class="pointer-theme-blue dib">查看</span>

              <span
                v-permissions="'/manage/repair/register'"
                v-if="scope.row.status==='0'"
                @click="showDialog('register', scope.row.id)"
                class="pointer-theme-blue margin-lr6 dib">登记</span>
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

       <!--报障登记和报障查看-->
      <transition name="slide-fade">
        <el-form
          :model="repairForm"
          ref="repairForm"
          label-width="80px"
          label-position="left"
          class="set-table-dialog"
          v-show="postStatus">

          <div class="panel scroll-panel">
            <h1 class=""><i @click="cancelSet('repairForm')" class="el-icon-arrow-right fl callback theme-gray"></i>{{ postTitle }}</h1>

            <div class="content mt40">
              <div class="content-form clearfix">

                <!--报修内容-->
                <h2 style="font-weight: bold;">报修内容：</h2>

                <el-form-item class="mt10" label="联系人">
                  <span class="fr">{{ repairForm.contacts }}</span>
                </el-form-item>

                <el-form-item class="mt10" label="联系电话">
                  <span class="fr">{{ repairForm.phone }}</span>
                </el-form-item>

                <el-form-item class="mt10" label="报修门店">
                  <span class="fr" :id="repairForm.storeId">{{ repairForm.storeName }}</span>
                </el-form-item>

                <el-form-item class="mt10" label="报修描述">
                  <span class="fr">{{ repairForm.faultDescription }}</span>
                </el-form-item>

                <!--处理进度-->
                <h2 class="mt40" style="font-weight: bold;">处理进度：</h2>
                <el-form-item class="mt10" label="报修状态">
                  <span class="fr">
                    <el-tag type="info" v-if="repairForm.status === 1">已完成</el-tag>
                    <el-tag v-else-if="repairForm.status === 0">待处理</el-tag>
                  </span>
                </el-form-item>

                <!--查看报修订单-->
                <el-form-item class="mt10" label="登记人" v-if="isView && repairForm.status === 1">
                  <span class="fr">{{ repairForm.adminUserName }}</span>
                </el-form-item>

                <el-form-item class="mt10" label="登记时间" v-if="isView && repairForm.status === 1">
                  <span class="fr">{{ repairForm.registerTime }}</span>
                </el-form-item>

                <el-form-item class="mt10" label="登记内容" v-if="isView">
                  <span class="fr" v-if="repairForm.registerContent">{{ repairForm.registerContent }}</span>
                  <span class="fr" v-else>无</span>
                </el-form-item>

                <!--登记报修订单-->
                <el-form label-position="tpo">
                  <el-form-item class="mt10" label="登记" v-if="!isView">
                    <el-input
                      type="textarea"
                      :rows="4"
                      :maxlength="500"
                      placeholder="（选填）请输入登记结果"
                      v-model.trim="repairForm.registerContent">
                    </el-input>
                  </el-form-item>
                </el-form>

              </div>

            </div>

            <div class="footer">

              <el-button @click="cancelSet('repairForm')" class="btn-clear fl">取消</el-button>
              <el-button
                v-if="!isView"
                class="btn-save"
                type="primary"
                @click="register('repairForm')">确认完成</el-button>
            </div>

          </div>

          <div @touchmove.prevent @click="cancelSet('repairForm')" class="v-modal"></div>
        </el-form>
      </transition>
    </div>
  </div>
</template>

<script>
  import { API_PATH } from '@/config/env'
  import handleHasPermissions from '@/config/com-mixins'
  import { downloadFile } from '@/config/utils'
  import {
    findAllStore,
    REPAIR_LIST,
    // applyDownloadCode,
    REPAIR_DETAIL,
    REPAIR_REGISTER
  } from '@/service'

  export default {
    mixins: [handleHasPermissions],
    data () {
      return {
        title: '场地发布管理',
        tableLoading: true,
        tableEmpty: ' ',

        repairForm: {},
        repairId: '', // 报障订单id
        // 分页参数
        pageTotal: 0,
        pageSize: 10,
        currentPage: 1,

        postStatus: false, // 右栏弹层开关
        isView: false, // 是否为查看操作
        postTitle: '', // 查看报修或者登记报修标题

        // table列表数据
        tableData: [],

        storeList: [], // 门店列表
        // 筛选条件
        warningSort: {
          contacts: '', // 联系人
          storeId: null  // 门店id
        }
      }
    },
    mounted () {
      const self = this

      // 获取报修订单列表
      self.getRepairOrderList()

      // 选择门店列表
      self.getFindAllStore()
    },
    methods: {
      cancelSet (formName) {
        this.$refs[formName].resetFields()
        this.postStatus = false
      },
      // 点击查看或者登记
      showDialog (type, id) {
        const self = this

        self.postStatus = true
        self.repairId = id
        // 判断
        if (type === 'view') {
          self.postTitle = '查看报修'
          self.isView = true
        } else if (type === 'register') {
          self.postTitle = '登记报修'
          self.isView = false
        }
        self.getRepairInfo(id)
      },
      // 确定登记操作
      register () {
        const self = this
        const JSON = {
          repairId: self.repairId,
          registerContent: self.repairForm.registerContent || ''
        }
        REPAIR_REGISTER(JSON).then(res => {
          if (res.status === 'true') {
            self.$message({
              type: 'success',
              message: '登记成功'
            });
            self.getRepairOrderList()
          } else {
            self.$message({
              type: 'error',
              message: res.msg
            });
          }
          self.postStatus = false
        })
      },
      // 获取订单信息
      getRepairInfo (id) {
        const self = this
        if (id) {
          const JSON = {
            repairId: id
          }
          // 填充用户信息
          REPAIR_DETAIL(JSON).then(res => {
            if (res.status === 'true') {
              let b = res.info
              self.repairForm = {
                id: b.id, // 报修id
                userId: b.userId, // 提交人id
                contacts: b.contacts, // 联系人
                phone: b.phone, // 联系方式
                storeId: b.storeId, // 报修门店id
                storeName: b.storeName, // 报修门店名称
                faultDescription: b.faultDescription, // 故障描述
                status: b.status, // 状态：1.已完成 0.待处理
                adminUserName: b.adminUserName, // 登记人名称
                registerTime: b.registerTime, // 登记时间
                registerContent: b.registerContent // 登记内容
              }

              // 选中的门店id数组
              let d = []
              if (b.stores) {
                b.stores.forEach(item => {
                  d.push(item.storeId)
                })
              }
              // console.log(d)
              self.repairForm.selectStoreId = d
              // 清空职务
              self.repairForm.post = b.roleId
            } else {
              self.$message({
                type: 'error',
                message: res.msg
              });
            }
          })
        }
      },
      // 门店列表
      getFindAllStore () {
        const self = this
        findAllStore().then(res => {
          if (res.status === 'true') {
            // 保存全部门店数组
            if (res.info) {
              let b = []
              res.info.forEach(item => {
                b.push(item.id)
              })
              self.allStoreIdList = b
            }
            // 列表选择门店
            self.storeList = res.info
            // 添加查看全部门店
            self.storeList.unshift({'id': '-1', 'storeName': '全部门店', disabled: true})
            // console.log('self.orderSort.storeList: ', self.orderSort.storeList);
          } else {
            self.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
        })
      },
      // 报修订单列表
      getRepairOrderList() {
        const self = this
        const paramsObj = {
          pageNum: self.currentPage,
          pageSize: self.pageSize,
          // 搜索参数
          contacts: self.warningSort.contacts,
          storeId: self.warningSort.storeId === '-1' ? '' : self.warningSort.storeId
        }
        // console.log('paramsObj: ', paramsObj);

        REPAIR_LIST(paramsObj).then(res => {
          if (res.status === 'true') {
            self.pageTotal = res.info.total
            self.tableData = res.info.result
            let b = []
            if (res.info.result) {
              res.info.result.forEach(item => {
                b.push({
                  id: item.id, // 报修id
                  contacts: item.contacts, // 联系人
                  phone: item.phone, // 联系方式
                  briefDescription: item.briefDescription, // 故障描述（20字）
                  status: item.status, // 状态：1.已完成 0.待处理
                  submitTime: item.submitTime, // 提交时间
                  storeName: item.storeName // 报修门店
                })
              })
              self.tableData = b
            }
            // table的交互
            self.tableLoading = false
            if (self.tableData.length === 0) {
              self.tableEmpty = '暂时无数据'
            }
          } else {
            self.tableLoading = false
            self.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
        })
      },
      // 导出表格
      exportExcel() {
        if (!this.tableData.length) {
          return this.$message.info('暂无数据')
        }
        const self = this

        // 申请下载code
        const downParams = {
          contacts: self.warningSort.contacts,
          storeId: self.warningSort.storeId === '-1' ? '' : self.warningSort.storeId
        }
        let url = API_PATH + '/manage/repair/exportExcel'
        downloadFile(url, downParams)
        // applyDownloadCode(downParams).then(res => {
          // if (res.status === 'true') {
            // self.exportUrl = API_PATH + '/manage/repair/exportExcel?downloadCode=' + res.info
            // location.href = self.exportUrl
          // } else {
            // self.$message.error(res.msg)
          // }
        // })
      },
      // 分页器事件
      handleSizeChange(val) {
        this.pageSize = val
        this.getRepairOrderList()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getRepairOrderList()
      }
    }
  }
</script>
<style lang="scss">
  /*修改checkbox点击作用范围*/
  .all-store {
    .el-checkbox {
      width: 100%;
      text-align: left;
    }
  }
</style>

<style lang="scss" scoped>
  @import '../../../styles/config.scss';
  @import '../../../styles/common.scss';

  .account {
    .set-table-dialog {
      .panel {
        min-heigth: 100%;
        overflow-y: auto;
        &.scroll-panel {
          width: 410px;
          right: -20px;
        }
        .content {
          .content-form {
            display: block;
            padding-bottom: 100px;
          }
          margin-bottom: 50px;
        }
        .footer {
          position: relative;
          height: 80px;
          margin-top: -80px;
          margin-bottom: 20px;
          clear: both;
        }
        .clearfix:after {content: ".";display: block;height: 0;clear: both;visibility: hidden;}
      }
      .callback {
        display: inline-block;
        font-size: 16px;
        line-height: 25px;
        padding: 0 5px;
        cursor: pointer;
        margin-left: -9px;
      }
    }
    .sort-form-bar {
      text-align: right;
    }
  }
</style>
