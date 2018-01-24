<template>
  <div class="access-control">
    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <h1>门禁管理</h1>
    </div>

    <div class="store-setting card-padding">
      <!-- 查询表单 -->
      <el-form :inline="true" :model="accessCtrlSort" class="sort-form-bar">
        <router-link
          v-permissions="'/manage/lockBase/add'"
          class="btn-link fl el-icon-circle-plus"
          :to="'/space/access-control/detail?type=add'">&nbsp;新增门禁</router-link>
        <router-link
          v-permissions="'/manage/staff/list'"
          class="btn-link fl"
          :to="'/space/access-control/person'">人员维护</router-link>

        <el-form-item>
          <el-select
            class="width220px"
            v-model="accessCtrlSort.storeId"
            @change="getAccessCtrlList"
            clearable
            placeholder="请选择门店">
            <el-option
              v-for="item in accessCtrlSort.storeList"
              :key="item.id"
              :label="item.storeName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input
            class="width220px"
            v-model.trim="accessCtrlSort.lockName"
            placeholder="请输入门禁名称"
            @keyup.native.enter="getAccessCtrlList">
            <i slot="suffix" @click="getAccessCtrlList" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>
      </el-form>

      <el-table
        size="medium"
        :data="accessCtrlTable"
        v-loading="tableLoading"
        border
        style="width: 100%">
        <el-table-column label="门禁名称" prop="lockName">
          <template slot-scope="scope">
            <router-link
              class="table-link"
              :to="'/space/access-control/detail?type=read&id=' + scope.row.id">{{scope.row.lockName}}</router-link>
          </template>
        </el-table-column>

        <el-table-column label="供应商" prop="supplierName"></el-table-column>
        <el-table-column label="所属门店" prop="storeName"></el-table-column>
        <el-table-column label="关联会员" prop="maintainUserCount"></el-table-column>

        <el-table-column label="门禁状态" prop="lockStatus">
          <template slot-scope="scope">
            <div class="label-con">
              <el-tag v-if="scope.row.lockStatus === 1" type="success">正常</el-tag>
              <el-tag type="danger" v-else>离线</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" v-if="handleHasPermissions('/manage/lockBase/update')">
          <template slot-scope="scope">
            <router-link class="pointer-theme-blue dib" :to="'/space/access-control/detail?type=edit&id=' + scope.row.id">编辑</router-link>
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
  import { listLockBase, findAllStore } from '@/service'

  export default {
    mixins: [handleHasPermissions],
    data () {
      return {
        title: '门禁管理',
        tableLoading: true,

        // 门禁列表数据
        accessCtrlTable: [],
        // 筛选条件
        accessCtrlSort: {
          lockName: '', // 门禁名称
          storeList: [], // 门店列表
          storeId: null  // 门店id
        },

        // 分页参数
        pageTotal: 0,
        pageSize: 10,
        currentPage: 1
      }
    },
    mounted () {
      // 查询门禁列表
      this.getAccessCtrlList()

      // 选择门店列表
      this.getFindAllStore()
    },
    methods: {
      // 门店列表
      getFindAllStore () {
        const _this = this
        findAllStore().then(res => {
          if (res.status === 'true') {
            _this.accessCtrlSort.storeList = res.info
            // 添加查看全部门店
            _this.accessCtrlSort.storeList.unshift({'id': ' ', 'storeName': '全部门店'})
          } else {
            _this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
        })
      },
      // 门禁列表
      getAccessCtrlList() {
        const _this = this
        const paramsObj = {
          pageNum: _this.currentPage,
          pageSize: _this.pageSize,
          lockName: _this.accessCtrlSort.lockName,
          storeId: _this.accessCtrlSort.storeId
        }
        listLockBase(paramsObj).then(res => {
          if (res.status === 'true') {
            _this.pageTotal = res.info.total
            _this.accessCtrlTable = res.info.result
            _this.tableLoading = false
          } else {
            console.error(res.msg)
          }
        })
      },

      // 分页器事件
      handleSizeChange(val) {
        this.pageSize = val
        this.getAccessCtrlList()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getAccessCtrlList()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/config.scss';

  .access-control {
    .el-form-item__content {
      line-height: 36px;
    }
    .set-table-dialog {
      top: 60px;
      .v-modal {
        position: absolute;
        top: 0;
      }
      .panel {
        position: absolute;
        overflow: auto;
        top: 0;
        padding-bottom: 80px;
        &.scroll-panel {
          width: 410px;
          right: -20px;
        }
      }
      .callback {
        display: inline-block;
        font-size: 16px;
        line-height: 25px;
        padding: 0 5px;
        cursor: pointer;
        margin-left: -9px;
      }
      .el-select, .el-cascader {
        width: 100%;
      }
    }
    .sort-form-bar {
      text-align: right;
    }
  }
  .btn-bar {
    margin-bottom: 0;
    button {
      vertical-align: top;
    }
  }
  .btn-save {
    width: 200px;
  }
  .btn-clear {
    float: right;
    width: 100px;
  }
</style>
