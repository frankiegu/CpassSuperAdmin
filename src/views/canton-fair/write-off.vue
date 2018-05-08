<template>
  <div class="order-field">
    <lh-title></lh-title>

    <div class="card-padding">
      <!--<el-form :model="formData" :inline="true" class="text-right mr-10">-->
        <!--<el-form-item>-->
          <!--<el-input-->
            <!--v-model.trim="formData.name"-->
            <!--@keyup.native.enter="getPageData"-->
            <!--placeholder="请输入订单编号"-->
            <!--class="width220px">-->

            <!--<i slot="suffix" @click="getPageData" class="el-input__icon el-icon-search"></i>-->
          <!--</el-input>-->
        <!--</el-form-item>-->
      <!--</el-form>-->

      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        class="width100" border>

        <el-table-column label="店铺名称" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.shopName }}
          </template>
        </el-table-column>

        <el-table-column label="核销员" align="left" width="155">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>

        <el-table-column label="绑定时间" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.bindingTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="手机号码" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.telephone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="核销数" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.checkNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" fixed="right" align="left">
          <template slot-scope="scope">
            <el-tooltip
              :content="scope.row.status === 1 ? '点击关闭审核' : '点击启用审核'"
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
  import writeOffMixins from './write-off.mixins'
  import { cantonFairList, cantonFairChecker } from '@/service/canton-fair'

  export default {
    mixins: [writeOffMixins, tableMixins],
    components: {},
    data () {
      return {
        formData: {
          name: ''
        }
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
        cantonFairList(paramsObj).then(res => {
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
      handleUpdateStatus (id, status) {
        const paramsObj = {
          cantonfairCheckerId: id,
          status: status
        }
        cantonFairChecker(paramsObj).then(res => {
          if (res.status === 'true') {
            this.$message.success('修改成功！')
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .order-field {
  }
</style>
