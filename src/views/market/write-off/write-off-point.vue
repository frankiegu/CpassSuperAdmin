<template>
  <div class="order-field">
    <div class="card-padding">
      <el-form :inline="true" class="text-right mr-10 lh-card-head info-top">
        <div class="fl to-bottom-right add-point">添加</div>
      </el-form>

      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        class="width100" border>

        <el-table-column label="核销点名称" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.createDate }}
          </template>
        </el-table-column>

        <el-table-column label="关联门店" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.couponName }}
          </template>
        </el-table-column>

        <el-table-column label="地址" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.phone }}
          </template>
        </el-table-column>

        <el-table-column label="状态" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.couponName }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <el-tooltip
              :content="scope.row.status === 1 ? '点击停用' : '点击恢复'"
              placement="top"
              class="margin-lr6">

              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                :active-color="switchActiveColor"
                active-text=""
                inactive-text=""
                @change="handleUpdateStatus(scope.row.id, scope.row.status)"></el-switch>
            </el-tooltip>
            <el-button type="text" @click="dialogVisible = true"
                       class="operate-btn"><span>删除</span></el-button>
          </template>
        </el-table-column>

      </el-table>

      <el-pagination
        :total="pageTotal"
        :layout="layoutArr"
        :page-size="pageSize"
        :page-sizes="pageSizeArr"
        :current-page="currentPage"
        class="pagination-container"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background></el-pagination>
    </div>
  </div>
</template>

<script>
  import tableMixins from '@/mixins/table'
  import { cantonfairCoupon } from '@/service/canton-fair'

  export default {
    mixins: [tableMixins],
    components: {},
    data () {
      return {
      }
    },
    mounted () {
      this.getPageData()
    },
    methods: {
      getPageData() {
        const self = this
        const paramsObj = {
          pageSize: self.pageSize,
          pageNum: self.currentPage
        }
        cantonfairCoupon(paramsObj).then(res => {
          if (res.status === 'true') {
            if (res.info) {
              let data = res.info
              if (data) {
                if (data.result) {
                  this.pageTotal = data.total
                  this.tableData = data.result || []
                }
              }

              this.tableLoading = false
              if (this.tableData.length === 0) {
                this.tableEmpty = '暂时无数据'
              }
            } else {
              this.tableEmpty = '暂时无数据'
            }
          } else {
            this.setMsg('error', res.msg)
          }
        })
      },
      handleUpdateStatus() {}
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .order-field {
    .info-top{
      width: 100%;
      height: 36px;
      margin-bottom: 16px;
      .add-point{
        line-height: 16px;
        padding: 9px 30px;
      }
    }
  }
</style>
