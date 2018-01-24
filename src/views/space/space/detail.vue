<template>
  <div class="space-detail">
    <div class="page-title"> <h1>查看预约</h1> </div>

    <div class="detail-box detail-padding">
      <img :src="info.mainImg + zoomImgSize(72, 72)" alt="">

      <span>场地名称</span>
      <span class="theme-gray">{{ info.fieldName }}</span>

      <span class="">所属门店</span>
      <span class="theme-gray">{{ info.storeName }}</span>
    </div>

    <div class="form-box card-padding">
      <el-form
        :model="spaceSort"
        :inline="true"
        class="sort-form-bar">

        <el-form-item>
          <el-date-picker
            v-model="spaceSort.date"
            @change="refreshPageData"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            placeholder="选择日期"
            type="date"></el-date-picker>
        </el-form-item>
      </el-form>

      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        class="width100" border>

        <el-table-column label="预约日期" width="125" sortable>
          <template slot-scope="scope">
            <i class="el-icon-time"></i> {{ scope.row.bookDate }}</template>
        </el-table-column>
        <el-table-column label="预约时段" sortable>
          <template slot-scope="scope">
            {{ scope.row.bookStartTime }} - {{ scope.row.bookEndTime }}
          </template>
        </el-table-column>

        <el-table-column label="订单号" width="152">
          <template slot-scope="scope">
            <router-link class="table-link" :to="{path: '/order/booking/detail', query: {id: scope.row.id}}">
              {{ scope.row.orderNum }}
            </router-link>
          </template>
        </el-table-column>

        <el-table-column label="所属企业" prop="companyName"></el-table-column>
        <el-table-column label="联系人" prop="name"></el-table-column>
        <el-table-column label="联系电话" prop="telephone"></el-table-column>
        <el-table-column label="订单状态">
          <template slot-scope="scope">
            <span
              v-for="(item, index) in statusList"
              v-if="scope.row.status === item.status">
              {{ item.text }}</span>
          </template>
        </el-table-column>

        <el-table-column label="下单时间" prop="created" width="155" sortable></el-table-column>
      </el-table>

      <el-pagination
        :total="pageTotal"
        :page-size="pageSize"
        :current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 30, 40]"
        class="pagination-container"
        background></el-pagination>
    </div>
  </div>
</template>

<script>
  import tableMixins from '@/config/mixins/table'
  import { formatTimeString } from '@/config/utils'
  import { findFieldOrder, simpleField } from '@/service/index'
  export default {
    mixins: [tableMixins],
    data () {
      return {
        id: this.$route.query.fieldId,
        date: '',
        info: '',
        // 筛选条件
        spaceSort: {
          date: this.$route.query.date || formatTimeString(new Date())
        },
        statusList: [
          {status: 10, text: '未使用'},
          {status: 20, text: '已使用'},
          {status: 30, text: '已取消'},
          {status: 40, text: '待退款'},
          {status: 50, text: '已退款'}
        ]
      }
    },
    mounted () {
      this.getSpaceDetail()
      this.getPageData()
    },
    methods: {
      refreshPageData (val) {
        if (!this.spaceSort.date) {
          this.setMsg('请选择日期')
          return
        }
        this.spaceSort.date = formatTimeString(val)
        this.getPageData()
      },
      getPageData() {
        const paramsObj = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          date: this.spaceSort.date,
          fieldId: this.id
        }

        findFieldOrder(paramsObj).then(res => {
          if (res.status === 'true') {
            let data = res.info
            this.pageTotal = data.total
            this.tableData = data.result

            this.tableLoading = false
            if (this.tableData.length === 0) {
              this.tableEmpty = '暂时无数据'
            }
          } else {
            this.setMsg('error', res.msg)
          }
        })
      },
      getSpaceDetail () {
        simpleField({ fieldId: this.id }).then(res => {
          if (res.status === 'true') {
            this.info = res.info
          } else {
            this.setMsg('error', res.msg)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .space-detail {
    .sort-form-bar {
      text-align: right;
    }
    .detail-padding {
      padding: 24px 20px;
      background-color: #fff;
      border-radius: 4px;
    }
    .detail-box {
      margin-bottom: 20px;
      line-height: 77px;
      overflow: hidden;

      img {
        float: left;
        display: block;
        width: 72px;
        margin-right: 12px;
        vertical-align: middle;
      }
      span {
        margin-left: 12px;
      }
      .theme-gray {
        margin-left: 10px;
      }
    }
    .grant-switch {
      float: right;
      margin-top: -2px;
    }
  }
</style>
