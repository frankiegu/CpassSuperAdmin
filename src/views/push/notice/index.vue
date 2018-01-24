<template>
  <div class="push-notice">
    <div class="page-title">
      <h1>公告管理</h1>
    </div>

    <div class="card-padding">
      <el-form class="sort-form-bar" :inline="true" ref="filterForm" :model="filterForm">
        <el-form-item style="float: left">
          <router-link v-permissions="'/manage/notice/addOrUpdate'" :to="{path: '/push/notice/edit', query: {type: 'add'}}">
            <el-button class="theme-btn-blue add-new" type="primary" icon="el-icon-circle-plus">新增公告</el-button>
          </router-link>
        </el-form-item>
        <el-form-item class="mr0">
          <el-input
            class="width220"
            v-model.trim="filterForm.name"
            placeholder="请输入公告标题"
            @keyup.native.enter="handleGetNoticeList">

            <i slot="suffix" @click="handleGetNoticeList" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

      </el-form>

      <el-table border
        :data="tableData"
        v-loading="tableLoading"
        width="100%">

        <el-table-column label="公告标题">
          <template slot-scope="scope">
            <router-link class="table-link margin-lr6"
              :to="{path: '/push/notice/edit', query: {id: scope.row.id, type: 'detail'}}">
              <span class="pointer-theme-blue dib">{{ scope.row.title }}</span>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column label="发布时间" prop="releaseTime"></el-table-column>

        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">暂停</span>
            <span v-if="scope.row.status === 1">推送中</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" v-if="handleHasPermissions(['/manage/notice/addOrUpdate', '/manage/notice/delete'])">
          <template slot-scope="scope">
            <router-link
              v-permissions="'/manage/notice/addOrUpdate'"
              class="table-link margin-lr6 dib"
              :to="{path: '/push/notice/edit', query: {id: scope.row.id, type: 'edit'}}">编辑</router-link>

            <span
              v-permissions="'/manage/notice/delete'"
              @click="handleDeleteNotice(scope.row.id)"
              class="theme-gray cursor-pointer margin-lr6 dib">删除</span>

            <el-tooltip
              v-permissions="'/manage/notice/addOrUpdate'"
              :content="scope.row.status === 1 ? '点击暂停推送' : '点击开始推送'"
              placement="top">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                :active-color="switchActiveColor"
                active-text=""
                inactive-text=""
                @change="handleUpdateStatus(scope.row.id, scope.row.status)"></el-switch>
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
import { getNoticeList, deleteNotice, addOrUpdateNotice } from '@/service'
export default {
  mixins: [handleHasPermissions],
  data() {
    return {
      dialogTitle: '确认删除账号？',
      filterForm: {
        name: ''
      },

      tableLoading: false,
      tableData: [],

      // 分页参数
      pageTotal: 0,
      pageSize: 10,
      currentPage: 1
    }
  },
  mounted () {
    this.handleGetNoticeList()
  },
  methods: {
    // 获取公告列表
    handleGetNoticeList () {
      const _this = this
      const noticeParams = {
        pageNum: _this.currentPage,
        pageSize: _this.pageSize,
        title: _this.filterForm.name
      }
      getNoticeList(noticeParams).then(res => {
        if (res.status === 'true') {
          _this.pageTotal = res.info.total
          _this.tableData = res.info.result
        }
      })
    },
    // 删除公告
    handleDeleteNotice(id) {
      const _this = this
      const deleteParams = {
        noticeId: id
      }
      _this.$confirm('确认删除本条公告？', '确认删除？', {
        lockScroll: false
      }).then(() => {
        deleteNotice(deleteParams).then(res => {
          if (res.status === 'true') {
            _this.$message.success('删除成功！')
            _this.handleGetNoticeList()
          } else {
            _this.$message.error(res.msg)
          }
        })
      }).catch(() => {
        _this.$message.info('已取消操作')
      })
    },
    // 更新公告推送状态
    handleUpdateStatus(id, status) {
      const _this = this
      const updateParams = {
        id: id,
        status: status
      }
      if (status === 0) {
        _this.$confirm('确认暂停推送本条公告？', '确认暂停推送？', {
          lockScroll: false
        }).then(() => {
          addOrUpdateNotice(updateParams).then(res => {
            if (res.status === 'true') {
              _this.$message.success('已暂停该公告的推送')
              _this.handleGetNoticeList()
            } else {
              _this.$message.error(res.msg)
            }
          })
        }).catch(() => {
          _this.$message.info('已取消操作')
          _this.handleGetNoticeList()
        })
      } else if (status === 1) {
        addOrUpdateNotice(updateParams).then(res => {
          if (res.status === 'true') {
            _this.$message.success('已启用该公告的推送')
            _this.handleGetNoticeList()
          } else {
            _this.$message.error(res.msg)
          }
        })
      }
    },
    // 分页器事件
    handleSizeChange(val) {
      this.pageSize = val
      this.handleGetNoticeList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.handleGetNoticeList()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../styles/config";
  .push-notice {
  }
</style>
