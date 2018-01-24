<template>
  <div class="push-activity">
    <div class="page-title">
      <h1>活动管理</h1>
    </div>

    <div class="store-setting card-padding">

      <!--表头功能模块-->
      <el-form class="sort-form-bar"
               :inline="true"
               ref="filterForm"
               :model="queryData">

        <el-form-item v-permissions="'manage/activityDetail/add'" style="float: left">
          <router-link :to="{path: '/push/activity/edit', query: {type: 'add'}}">
            <el-button class="theme-btn-blue add-new ml6" type="primary" icon="el-icon-circle-plus">新增活动</el-button>
          </router-link>
        </el-form-item>

        <el-form-item>
          <el-select
            clearable
            v-model="queryData.activityStatus"
            placeholder="请选择活动状态"
            @change="doQuery()">
            <el-option
              v-for="item in queryInit.activityStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input
            class="width220"
            v-model.trim="queryData.activityName"
            placeholder="请输入活动名称"
            @keyup.native.enter="doQuery()">

            <i slot="suffix" @click="doQuery()" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

      </el-form>

      <!--表单实体-->
      <el-table border
                empty-text="暂无数据"
                :data="tableData"
                v-loading="tableLoading"
                width="100%">

        <el-table-column label="活动名称">
          <template slot-scope="scope">
            <router-link class="table-link margin-lr6"
                         :to="{path: '/push/activity/edit', query: {id: scope.row.id, type: 'detail'}}">
              <span class="pointer-theme-blue dib">{{ scope.row.name }}</span>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column label="报名开始时间" prop="signBeginDate"></el-table-column>

        <el-table-column label="报名结束时间" prop="signEndDate"></el-table-column>

        <el-table-column label="报名状态">
          <template slot-scope="scope">
            <div class="label-con">
              <el-tag v-if="scope.row.signStatus === 1" type="danger">报名结束</el-tag>
              <el-tag v-else-if="scope.row.signStatus === 2">报名未开始</el-tag>
              <el-tag v-else type="success">报名进行中</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="活动开始时间" prop="activityBeginDate" width="140"></el-table-column>

        <el-table-column label="活动结束时间" prop="activityEndDate" width="140"></el-table-column>

        <el-table-column label="活动状态">
          <template slot-scope="scope">
            <div class="label-con">
              <el-tag v-if="scope.row.activityStatus === 1" type="danger">活动结束</el-tag>
              <el-tag v-else-if="scope.row.activityStatus === 2">活动未开始</el-tag>
              <el-tag v-else type="success">活动进行中</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="推送状态">
          <template slot-scope="scope">
            <div class="label-con">
              <el-tag v-if="scope.row.pushStatus === 2 ||  scope.row.pushStatus === '2'" type="success">推送中</el-tag>
              <el-tag v-else>暂停推送</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column width="130" label="操作"
                         v-if="handleHasPermissions(['manage/activityDetail/modifyActivity', 'manage/activityDetail/delete'])">
          <template slot-scope="scope">
            <router-link v-permissions="'manage/activityDetail/modifyActivity'" class="table-link margin-lr6"
                         :to="{path: '/push/activity/edit', query: {id: scope.row.id, type: 'edit'}}">
              <span class="pointer-theme-blue dib">编辑</span>
            </router-link>
            <el-button v-permissions="'manage/activityDetail/delete'" type="text"
                       @click.native="deleteActivity(scope.row.id)"
                       class="theme-gray cursor-pointer margin-lr6 dib">删除
            </el-button>
            <el-tooltip v-permissions="'manage/activityDetail/modifyActivity'"
                        class="item" effect="dark"
                        :content="statusObj[scope.row.id] === '2'? '点击暂停推送': '点击开启推送'"
                        placement="top-start">
              <el-switch
                v-model="statusObj[scope.row.id]"
                @change="updateStatus(scope.row.id, statusObj[scope.row.id])"
                active-value="2"
                inactive-value="1"
                :active-color="switchActiveColor">
              </el-switch>
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

    <!-- 确认停用账号？ -->
    <el-dialog class="set-dialog"
               :title="dialogTitle"
               :visible.sync="stopVisible"
               width="420px">

      <p class="">该账号将无法登陆管理系统</p>

      <div slot="footer" class="dialog-footer">
        <el-button @click="stopVisible = false">取 消</el-button>
        <el-button @click="sureBtn('replace')" type="primary">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import handleHasPermissions from '@/config/com-mixins'
  import {
    getActivityList,
    queryActivityList,
    deleteActivityById,
    editActivity
  } from '@/service/push'

  export default {
    mixins: [handleHasPermissions],
    data() {
      return {
        statusObj: {}, // 推送状态滑钮状态集合
        value2: '2',
        stopVisible: false,
        dialogTitle: '确认删除账号？',
        filterForm: {
          name: '',
          logModule: '',
          logModuleList: [
            {
              value: 1,
              label: '暂停推送'
            }, {
              value: 2,
              label: '推送中'
            }, {
              value: 3,
              label: '手动关闭推送'
            }
          ]
        },
        tableLoading: false,
        tableEmpty: ' ',
        // 查询选项初始化
        queryInit: {
          activityStatus: [
            {value: 4, label: '全部'},
            {value: 1, label: '活动结束'},
            {value: 2, label: '活动未开始'},
            {value: 3, label: '活动进行中'}
          ]
        },
        // 查询参数
        queryData: {
          activityStatus: null,  // 活动状态
          activityName: ''  // 活动名称
        },
        // 表单实体
        tableData: [],

        // 分页参数
        pageTotal: 0,
        pageSize: 3,
        currentPage: 1
      }
    },
    created() {
      // 首次进入加载数据
      this.tableDataInit()
    },
    mounted() {
    },
    methods: {
      updateStatus(id, status) {
        editActivity({
          activityId: id,
          pushStatus: status
        })
          .then(res => {
            if (res.code === '200') {
              this.$message.success('状态已变更')
              this.queryTableData()
            } else {
              this.$message.error('修改失败')
              this.queryTableData()
            }
          })
          .catch((err) => {
            this.$message.error(err.msg)
            this.queryTableData()
          })
      },
      // 执行查询
      doQuery() {
        let _this = this
        _this.currentPage = 1
        _this.queryTableData()
      },
      // 按条件查询列表
      queryTableData() {
        let _this = this
        queryActivityList({
          pageNum: _this.currentPage,
          pageSize: _this.pageSize,
          ..._this.queryData
        })
          .then(res => {
            if (res.status === 'true' && res.code === '200') {
              if (res.info !== null) {
                _this.tableData = res.info.result
                _this.pageTotal = res.info.total
                _this.pageSize = res.info.pageSize
                res.info.result.forEach((item) => {
                  _this.statusObj[item.id] = String(item.pushStatus)
                })
              }
            }
          })
          .catch(() => {
            _this.$message.error('查询失败')
          })
      },
      // 首次进入获取列表的数据
      tableDataInit() {
        let _this = this
        getActivityList()
          .then(res => {
            if (res.status === 'true' && res.code === '200') {
              if (res.info !== null) {
                _this.tableData = res.info.result
                _this.pageTotal = res.info.total
                _this.pageSize = res.info.pageSize
                res.info.result.forEach((item) => {
                  _this.statusObj[item.id] = String(item.pushStatus)
                })
              }
            }
          })
          .catch(() => {
            _this.$message.error('加载数据失败')
          })
      },
      // 删除活动
      deleteActivity(id) {
        id = String(id)
        this.$confirm('此操作将永久删除该活动, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteActivityById({
            activityId: id
          })
            .then(res => {
              if (res.status === 'true' && res.code === '200') {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                // 重新拉去数据
                this.queryTableData()
              } else {
                this.$message.error('删除失败')
              }
            })
            .catch(() => {
              this.$message.error('删除失败')
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      tableList() {
      },
      // 分页器事件
      handleSizeChange(val) {
        this.pageSize = val
        this.queryTableData()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.queryTableData()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../styles/config";

  .push-activity {
    .sort-form-bar {
      margin-right: -10px;
      font-size: 0;
    }
  }
</style>
