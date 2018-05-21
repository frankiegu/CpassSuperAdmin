<template>
  <div class="order-field">
    <div class="card-padding">
      <el-form :inline="true" class="text-right mr-10 lh-card-head info-top">
        <div class="fl to-bottom-right add-point" @click="dialogVisible = true">添加</div>
      </el-form>

      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        class="width100" border>

        <el-table-column label="核销点名称" fixed="left" align="left">
          <template slot-scope="scope">
            <span class="table-link" @click="editPoint(scope.row.id, scope.row.name, scope.row.spaceName, scope.row.storeName, scope.row.provinceName, scope.row.cityName, scope.row.address )">{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="关联门店" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.spaceName + '-' }}{{ scope.row.storeName }}
          </template>
        </el-table-column>

        <el-table-column label="地址" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.provinceName + '-' }}{{ scope.row.cityName }}
          </template>
        </el-table-column>

        <el-table-column label="状态" fixed="left" align="left">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status === 1">正常</el-tag>
            <el-tag type="danger" v-if="scope.row.status === 0">停用</el-tag>
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
            <el-button type="text" @click="delectPoint(scope.row.id)"
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

    <!--添加dialog-->
    <el-dialog
      title="添加核销点"
      :visible.sync="dialogVisible"
      width="500px">
      <div class="detail-info">
        <div class="label">核销点名称</div>
        <div class="label-con">
          <el-input v-model="pointName" maxlength="20" placeholder="请输入核销点名称" :width="50"></el-input>
        </div>
      </div>
      <div class="detail-info">
        <div class="label">关联门店</div>
        <div class="label-con">
          <el-cascader
            :options="options"
            placeholder="请选择"
            v-model="pointStore">
          </el-cascader>
        </div>
      </div>
      <div class="detail-info">
        <div class="label">地址</div>
        <div class="label-con">
          <el-cascader
            :options="options"
            placeholder="省/市/区"
            v-model="pointProvince">
          </el-cascader>
          <el-input
            class="mt10 mb24"
            maxlength="50"
            type="textarea"
            :rows="3"
            placeholder="请输入核销点地址"
            v-model="pointAddress">
          </el-input>
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
  import tableMixins from '@/mixins/table'
  import { PlatformVerifyStationPage, loadSpaceStoreTree, PlatformVerifyStationChangeStatus, PlatformVerifyStationDelete } from '@/service/market'

  export default {
    mixins: [tableMixins],
    components: {},
    data () {
      return {
        dialogVisible: false,
        pointName: '', // 核销点名称
        pointAddress: '', // 核销点地址
        pointStore: '', // 关联门店
        pointProvince: '', // 省市区

        // 列表数据
        info: [], // 列表
        options: [] // 树形
      }
    },
    mounted () {
      this.getPageData()
      this.getSpaceStore()
    },
    methods: {
      getPageData() {
        const self = this
        const paramsObj = {
          pageSize: self.pageSize,
          pageNum: self.currentPage
        }
        PlatformVerifyStationPage(paramsObj).then(res => {
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
      getSpaceStore() {
        loadSpaceStoreTree().then(res => {
          if (res.status === 'true') {
            this.options = res.info
          }
        })
      },
      handleUpdateStatus(Id, Status) {
        const paramsObj = {
          id: Id,
          status: Status
        }
        PlatformVerifyStationChangeStatus(paramsObj).then(res => {
          if (res.status === 'true') {
            this.setMsg('success', '修改成功!')
          } else {
            this.setMsg('error', res.msg)
          }
        })
      },
      delectPoint(Id) {
        const paramsObj = {
          id: Id
        }
        this.$confirm('是否永久删除该核销点?删除核销点不影响核销记录', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          PlatformVerifyStationDelete(paramsObj).then(res => {
            if (res.status === 'true') {
              this.setMsg('success', '删除成功!')
            } else {
              this.setMsg('error', res.msg)
            }
          })
        }).catch(() => {
          this.setMsg('error', '已取消删除!')
        });
      }
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
        cursor: pointer;
      }
    }
    .detail-info{
      clear: both;
      .label{
        width: 100px;
        float: left;
      }
      .label-con{
        display: inline-block;
        float: left;
        width: calc(100% - 150px);
        margin-bottom: 10px;
      }
    }
  }
</style>
