<template>
  <div class="order-field">
    <div class="card-padding">
      <el-form :model="formData" :inline="true" class="text-right mr-10">
        <el-form-item>
          <el-input
          v-model.trim="formData.name"
          @keyup.native.enter="getPageData"
          placeholder="请输入核销员名称"
          class="width220px">

          <i slot="suffix" @click="getPageData" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <el-form-item class="fr">
          <el-button @click="exportExcel" class="lh-btn-export">
            <lh-svg icon-class="icon-download" />导出
          </el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        class="width100" border>

        <el-table-column label="提交时间" fixed="left" align="left" sortable sort-by="createDate">
          <template slot-scope="scope">
            {{ scope.row.createDate }}
          </template>
        </el-table-column>

        <el-table-column label="核销员名称" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.couponName }}
          </template>
        </el-table-column>

        <el-table-column label="手机号码" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.phone }}
          </template>
        </el-table-column>

        <el-table-column label="核销点" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.couponName }}
          </template>
        </el-table-column>

        <el-table-column label="所属空间" align="left">
          <template slot-scope="scope">
            {{ scope.row.couponName }}
          </template>
        </el-table-column>

        <el-table-column label="状态" align="left">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.redemptionStatus === 10">未使用</el-tag>
            <el-tag type="success" v-if="scope.row.redemptionStatus === 20">已兑换</el-tag>
            <el-tag type="danger" v-if="scope.row.redemptionStatus === 30">已失效</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="核销数" align="left" sortable sort-by="shopName">
          <template slot-scope="scope">
            <span>{{ scope.row.shopName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <el-button type="text" @click="dialogVisible = true"
                       class="operate-btn"><span>审核</span><span v-if="false">编辑</span></el-button>
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

    <!--审核dialog-->
    <el-dialog
      title="核销员审核"
      :visible.sync="dialogVisible"
      width="35%">
      <div class="detail-info">
        <div class="label">名称</div>
        <div class="label-con"><div class="intro-desc">就是名字</div></div>
      </div>
      <div class="detail-info">
        <div class="label">手机号码</div>
        <div class="label-con"><div class="intro-desc">15622222223</div></div>
      </div>
      <div class="detail-info">
        <div class="label">所属商家</div>
        <div class="label-con"><div class="intro-desc">广交会核销点A323</div></div>
      </div>
      <div class="detail-info">
        <div class="label">所属社区</div>
        <div class="label-con"><div class="intro-desc">雷猴空间</div></div>
      </div>
      <div class="detail-info">
        <div class="label">绑定核销点</div>
        <div class="label-con">
          <div class="intro-desc">
            <el-select
              v-model="writeOffPoint"
              filterable
              @change="getPageData(1)"
              placeholder="请选择"
              class="width150px"
              clearable>
              <el-option
                v-for="item in statusList"
                :label="item.text"
                :value="item.val"
                :key="item.val"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">通过审核</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { API_PATH } from '@/config/env'
  import { downloadFile } from '@/config/utils'
  import tableMixins from '@/mixins/table'
  import { cantonfairCoupon } from '@/service/canton-fair'

  export default {
    mixins: [tableMixins],
    components: {},
    data () {
      return {
        formData: {
          name: ''
        },
        dialogVisible: false,
        writeOffPoint: '', // 选择的核销点
        statusList: [
          { val: 5, text: '待支付' },
          { val: 10, text: '待使用' },
          { val: 20, text: '已使用' },
          { val: 30, text: '已取消' },
          { val: 40, text: '待退款' },
          { val: 50, text: '已退款' }
        ]
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
      handleUpdateStatus(id, status) {},
      exportExcel() {
        if (!this.tableData.length) {
          return this.setMsg('暂无数据')
        }
        const formData = this.formData
        const downParams = {
          content: formData.name
        }
        let url = API_PATH + '/supervisor/feedback/export'
        downloadFile(url, downParams)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/styles/config";
  .order-field {
    .operate-btn {
      padding: 6px;
    }
    .detail-info{
      clear: both;
      .label{
        width: 100px;
        float: left;
      }
      .label-con{
        float: left;
        width: calc(100% - 100px);
        margin-bottom: 10px;
      }
    }
  }
</style>
