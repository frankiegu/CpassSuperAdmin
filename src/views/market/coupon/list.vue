<template>
  <div class="coupon">

    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <h1>优惠劵管理</h1>
    </div>

    <div class="store-setting card-padding">
      <!-- 查询筛选 -->
      <el-form
        :inline="true"
        :model="couponSort"
        class="sort-form-bar">

        <el-form-item class="">
          <el-select
            v-model="couponSort.status"
            :clearable="true"
            @change="findCouponList"
            placeholder="请选择优惠券状态">
            <el-option
              label="全部"
              value=" ">
            </el-option>
            <el-option
              v-for="(value, key) in statusList"
              :label="value"
              :value="key"
              :key="key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="mr0">
          <el-input
            class="width220px"
            v-model.trim="couponSort.keywords"
            placeholder="请输入优惠劵名称"
            @keyup.native.enter="findCouponList">

            <i slot="suffix" @click="findCouponList" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <router-link
          v-permissions="'/manage/coupon/add'"
          :to="'/market/coupon/add'"
          class="fl">
          <el-button class="theme-btn-blue add-new" type="primary" icon="el-icon-circle-plus">新建优惠券</el-button>
        </router-link>
      </el-form>

      <!-- 表格list -->
      <el-table
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        :data="counponTable"
        v-loading="tableLoading"
        border
        style="width: 100%">
        <!-- 1 -->
        <el-table-column label="优惠券名称">

          <template slot-scope="scope">
            <router-link class="table-link" :to="'/market/coupon/detail?id=' + scope.row.id">
              {{ scope.row.name }}
            </router-link>
          </template>
        </el-table-column>

        <!-- 2 -->
        <el-table-column
          label="创建时间">

          <template slot-scope="scope">
            {{ scope.row.created }}
          </template>
        </el-table-column>

        <!-- 3 -->
        <el-table-column label="券类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 0">折扣券</span>
            <span v-else>满减券</span>
          </template>
        </el-table-column>

        <!-- 3 -->
        <el-table-column label="券状态">
          <template slot-scope="scope">
            <span v-if="scope.row.publishStatus === 0">未发放</span>
            <span v-else-if="scope.row.publishStatus === 1">发放中</span>
            <span v-else>已失效</span>
          </template>
        </el-table-column>

        <!-- 4 -->
        <el-table-column label="规则">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 0">{{ scope.row.discount / 10 }}折</span>
            <span v-else>满{{ scope.row.full }}减{{ scope.row.reduce }}</span>
          </template>
        </el-table-column>

        <!-- 5 -->
        <el-table-column
          label="起始时间">

          <template slot-scope="scope">
            {{ scope.row.startDate }}
          </template>
        </el-table-column>

        <!-- 6 -->
        <el-table-column
          label="结束时间">

          <template slot-scope="scope">
            {{ scope.row.endDate }}
          </template>
        </el-table-column>

        <!-- 7 -->
        <el-table-column
          label="发放情况">

          <template slot-scope="scope">
            {{ scope.row.publishCount }}/{{ scope.row.total }}
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
  import { couponList } from '@/service'
  export default {
    mixins: [handleHasPermissions],
    data () {
      return {
        title: '优惠劵管理',
        search: '', // 输入框输入的内容
        select: '', // 选择框输入的内容
        token: '',
        // 弹出框状态
        dialogFormVisible: false,
        // 优惠劵查询筛选
        statusList: {
          '0': '未发放',
          '1': '发放中',
          '-1': '已失效'
        },
        couponSort: {
          status: '', // 筛选优惠劵的状态
          keywords: ''
        },
        // 企业列表
        counponTable: [],
        tableLoading: true,
        tableEmpty: ' ',
        // 分页器配置
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0
      }
    },
    mounted () {
      this.token = sessionStorage.getItem('token')
      // 查询企业列表
      this.findCouponList()
    },
    methods: {
      findCouponList() {
        const self = this
        const paramsObj = {
          pageNum: self.currentPage,
          pageSize: self.pageSize,
          publishStatus: self.couponSort.status,
          keywords: self.couponSort.keywords
        }
        // console.log('paramsObj: ', paramsObj);

        couponList(paramsObj).then(res => {
          if (res.status === 'true') {
            self.pageTotal = res.info.page.total
            // self.counponTable = [] // res.info.page.result
            self.counponTable = res.info.page.result

            self.tableLoading = false
            if (self.counponTable.length === 0) {
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
        this.findCouponList()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.findCouponList()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .coupon {
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
