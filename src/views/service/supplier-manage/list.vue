<template>
  <div class="service-control">
    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <h1>供应商管理</h1>
    </div>

    <div class="store-setting card-padding">
      <!-- 查询表单 -->
      <el-form
        :inline="true"
        :model="serviceSort"
        class="sort-form-bar">
        <!--<a class="btn-link fl" @click="openSetDialog('editAccessCtrl', 'empty')">添加供应商</a>-->


        <el-form-item class="mr0">
          <el-input
            v-model.trim="serviceSort.name"
            placeholder="请输入供应商名称"
            @keyup.native.enter="getServiceList">

            <i slot="suffix" @click="getServiceList" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <router-link v-permissions="'/manage/valueAddServiceProvider/addOrUpdate'"
                     :to="{path: '/service/supplier-manage/detail'}"
                     class="btn-link fl el-icon-circle-plus"
                     tag="a">&nbsp;添加供应商</router-link>

      </el-form>

      <el-table size="medium"
                :data="tableData"
                :empty-text="tableEmpty"
                :slot="tableEmpty"
                v-loading="tableLoading"
                border
                style="width: 100%">

        <!-- 1 -->
        <el-table-column label="服务供应商">
          <template slot-scope="scope">
            <router-link class="table-link" :to="{path: '/service/supplier-manage/detail', query: {providerId: scope.row.id}}">
              {{scope.row.fullName}}
            </router-link>
          </template>
        </el-table-column>

        <!-- 2 -->
        <el-table-column label="服务数">
          <template slot-scope="scope">
            {{scope.row.sumOfService}}
          </template>
        </el-table-column>

        <!-- 3 -->
        <el-table-column label="联系电话" prop="phone"></el-table-column>

        <!-- 4 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div class="label-con">
              <el-tag v-if="scope.row.statusCode===1" type="success">正常</el-tag>
              <el-tag v-else-if="scope.row.statusCode===2" type="info">关闭</el-tag>
            </div>
          </template>
        </el-table-column>

        <!-- 5 -->
        <el-table-column
           v-if="handleHasPermissions(['/manage/valueAddServiceProvider/addOrUpdate', '/manage/valueAddServiceProvider/changeStatus'])"
          label="操作">

          <template v-if="handleHasPermissions('/manage/valueAddServiceProvider/addOrUpdate')" slot-scope="scope">
            <router-link class="table-link" :to="{path: '/service/supplier-manage/detail', query: {edit: 1, providerId: scope.row.id}}">
              编辑
            </router-link>

            <el-tooltip v-if="handleHasPermissions('/manage/valueAddServiceProvider/changeStatus')"
                        :content="scope.row.statusCode === 1 ? '点击停用该服务供应商' : '点击开启该服务供应商'"
                        placement="top"
                        class="margin-lr6">
              <el-switch
                v-model="scope.row.statusCode"
                :active-value="1"
                :inactive-value="2"
                :active-color="switchActiveColor"
                active-text=""
                inactive-text=""
                @change="handleUpdateStatus(scope.row.statusCode, scope.row.id)"></el-switch>
            </el-tooltip>
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
  import {
    SERVICE_PROVIDER_LIST,
    CHANGE_STATUS
  } from '@/service'

  export default {
    mixins: [handleHasPermissions],
    components: {
    },
    data () {
      return {
        title: '门禁管理',

        tableLoading: true,
        tableEmpty: ' ',

        // 列表数据
        tableData: [],
        // 筛选条件
        serviceSort: {
          name: '' // 供应商名称
        },

        // 分页参数
        pageTotal: 0,
        pageSize: 10,
        currentPage: 1
      }
    },
    mounted () {
      const self = this

      // 查询供应商列表
      self.getServiceList()
    },
    methods: {
      // 供应商列表
      getServiceList() {
        const self = this
        const paramsObj = {
          pageNum: self.currentPage,
          pageSize: self.pageSize,
          // 搜索参数
          name: self.serviceSort.name
        }

        SERVICE_PROVIDER_LIST(paramsObj).then(res => {
          if (res.status === 'true') {
            self.pageTotal = res.info.total
            self.tableData = res.info.result
            let b = []
            if (res.info.result) {
              res.info.result.forEach(item => {
                b.push({
                  id: item.id, // 供应商ID
                  fullName: item.fullName, // 供应商全称
                  abbrName: item.abbrName, // 简称
                  phone: item.phone, // 电话号码
                  introduction: item.introduction, // 简介
                  statusCode: item.statusCode, // 1-正常,2-关闭
                  sumOfService: item.sumOfService // 服务数
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
            self.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            });
          }
        })
      },
      handleUpdateStatus(status, id) {
        const self = this
        const JSON = {
          id: id,
          statusCode: status
        }
        if (status === 1) {
          CHANGE_STATUS(JSON).then(res => {
            if (res.status === 'true') {
              // console.log(res)
            } else {
              self.$message({
                showClose: true,
                message: res.msg,
                type: 'error'
              });
            }
          })
        } else {
          self.$confirm('该服务供应商将被停用', '确认停用该服务供应商？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            CHANGE_STATUS(JSON).then(res => {
              if (res.status === 'true') {
                self.$message({
                  type: 'success',
                  message: '该服务供应商已停用!'
                })
              } else {
                self.$message({
                  type: 'error',
                  message: res.msg
                })
              }
            })
          }).catch(() => {
            // 刷新一下账号列表，展开switch
            this.getServiceList()
            self.$message({
              type: 'info',
              message: '已取消'
            });
          });
        }
      },
      // 分页器事件
      handleSizeChange(val) {
        this.pageSize = val
        this.getServiceList()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getServiceList()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/config.scss';

  .service-control {
    .sort-form-bar {
      text-align: right;
    }
  }
</style>
