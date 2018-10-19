<template>
  <div class="order-field">
    <div class="card-padding">
      <el-form :inline="true" class="text-right mr-10 lh-card-head info-top">
        <div v-if="handleHasPermissions('/supervisor/platformVerifyStation/add')" class="fl to-bottom-right add-point" @click="isWopVisible = true">添加</div>

        <el-form-item v-if="handleHasPermissions('/supervisor/platformVerifyStation/export')" class="fr">
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

        <el-table-column label="核销点名称" fixed="left" align="left">
          <template slot-scope="scope">
            <span v-if="handleHasPermissions('/supervisor/platformVerifyStation/update')" class="table-link" @click="EditPoint(scope.row.id, scope.row.name, scope.row.spaceId, scope.row.storeId, scope.row.provinceCode, scope.row.cityCode, scope.row.districtCode, scope.row.address)">{{ scope.row.name }}</span>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="关联空间" fixed="left" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.spaceName || scope.row.storeName">
              {{ scope.row.spaceName + '-' }}{{ scope.row.storeName }}
            </span>
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

        <el-table-column v-if="handleHasPermissions(['/supervisor/platformVerifyStation/delete', '/supervisor/platformVerifyStation/changeStatus'])" label="操作" align="left">
          <template slot-scope="scope">
            <el-tooltip
              v-if="handleHasPermissions('/supervisor/platformVerifyStation/changeStatus')"
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
            <el-button type="text"
                       v-if="handleHasPermissions('/supervisor/platformVerifyStation/delete')"
                       @click="delectPoint(scope.row.id)"
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

    <!-- 添加核销点弹窗 -->
    <add-wop-dialog :is-visible="isWopVisible"
                    @closeDialog="isWopVisible = false" @refreshData="refresh"></add-wop-dialog>

    <!-- 编辑核销点弹窗 -->
    <edit-wop-dialog :is-visible="isEditWopVisible" :pointData="pointData" :initialName="initialName"
                    @closeDialog="isEditWopVisible = false" @refreshData="refresh"></edit-wop-dialog>
  </div>
</template>

<script>
  import { API_PATH } from '@/config/env'
  import { downloadFile } from '@/config/utils'
  import addWopDialog from '../components/add-wop-dialog'
  import editWopDialog from '../components/edit-wop-dialog'
  import tableMixins from '@/mixins/table'
  import { PlatformVerifyStationPage, PlatformVerifyStationChangeStatus, PlatformVerifyStationDelete } from '@/service/market'

  export default {
    mixins: [tableMixins],
    components: {
      addWopDialog,
      editWopDialog
    },
    data () {
      return {
        // 核销点数据
        pointData: {
          id: '',
          name: '',
          storeId: [],
          addressCode: [],
          addressDetail: ''
        },
        initialName: '',
        dataForm: '',
        isEditWopVisible: false,
        isWopVisible: false // 弹窗开关
      }
    },
    mounted () {
      // 获取核销点列表
      this.getPageData()
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
              this.getPageData()
            } else {
              this.setMsg('error', res.msg)
            }
          })
        }).catch(() => {
          this.setMsg('error', '已取消删除!')
        });
      },
      EditPoint(id, name, spaceId, storeId, provinceCode, cityCode, districtCode, address) {
        this.initialName = name
        this.pointData.id = id
        this.pointData.name = name
        this.pointData.storeId = [spaceId, storeId]
        this.pointData.addressCode = [provinceCode, cityCode, districtCode]
        this.pointData.addressDetail = address
        this.isEditWopVisible = true
      },
      refresh() {
        this.getPageData()
        this.isEditWopVisible = false
        this.isWopVisible = false
      },
      // 导出数据
      exportExcel() {
        if (!this.tableData.length) {
          return this.setMsg('暂无数据')
        }
        const downParams = {
        }
        let url = API_PATH + '/supervisor/platformVerifyStation/export'
        downloadFile(url, downParams)
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
