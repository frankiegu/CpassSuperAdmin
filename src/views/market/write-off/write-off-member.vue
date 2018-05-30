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

        <el-table-column label="提交时间" fixed="left" align="left" sortable sort-by="created" :min-width="110">
          <template slot-scope="scope">
            <span v-if="scope.row.created">
              <span style="display: inline-block; width: 80px; height: 23px;">{{ scope.row.created.substr(0, 10) }}</span>
              <span style="display: inline-block; width: 60px; height: 23px;">{{ scope.row.created.substr(11, 8) }}</span>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="核销员名称" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>

        <el-table-column label="手机号码" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.telephone }}
          </template>
        </el-table-column>

        <el-table-column label="核销点" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.stationName }}
          </template>
        </el-table-column>

        <el-table-column label="所属空间" align="left">
          <template slot-scope="scope">
            {{ scope.row.spaceName }}
          </template>
        </el-table-column>

        <el-table-column label="状态" align="left">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 2">待审核</el-tag>
            <el-tag type="success" v-if="scope.row.status === 1">生效中</el-tag>
            <el-tag type="danger" v-if="scope.row.status === 0">已停用</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="核销数" align="left" sortable sort-by="shopName">
          <template slot-scope="scope">
            <span>{{ scope.row.verifyCount || 0 }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="left" :min-width="110">
          <template slot-scope="scope">
            <el-button type="text" @click="operat(scope.row.id, scope.row.platformVerifyStationId, scope.row.name, scope.row.telephone, scope.row.merchantName, scope.row.community)" class="operate-btn">
              <span v-if="scope.row.status === 2">审核</span>
              <span v-if="scope.row.status === 1 || scope.row.status === 0">编辑</span>
            </el-button>
            <el-tooltip
              v-if="scope.row.status === 1 || scope.row.status === 0"
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
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      width="500px">
      <div class="detail-info">
        <div class="label">名称</div>
        <div class="label-con"><div class="intro-desc">{{ name }}</div></div>
      </div>
      <div class="detail-info">
        <div class="label">手机号码</div>
        <div class="label-con"><div class="intro-desc">{{ telephone }}</div></div>
      </div>
      <div class="detail-info">
        <div class="label">所属商家</div>
        <div class="label-con"><div class="intro-desc">{{ merchantName }}</div></div>
      </div>
      <div class="detail-info">
        <div class="label">所属社区</div>
        <div class="label-con"><div class="intro-desc">{{ community }}</div></div>
      </div>
      <div class="detail-info">
        <div class="label">绑定核销点</div>
        <div class="label-con">
          <div class="intro-desc">
            <el-select
              v-model="platformVerifyStationId"
              filterable
              placeholder="请选择"
              class="width150px"
              clearable>
              <el-option
                v-for="item in pointList"
                :label="item.name"
                :value="item.id"
                :key="item.id"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">通过审核</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { API_PATH } from '@/config/env'
  import { downloadFile } from '@/config/utils'
  import tableMixins from '@/mixins/table'
  import { platformVerifierPage, PlatformVerifyStationLoadStation, platformVerifierChangeStatus, platformVerifierReview } from '@/service/market'

  export default {
    mixins: [tableMixins],
    components: {},
    data () {
      return {
        formData: {
          name: ''
        },
        dialogVisible: false,
        pointList: [],
        id: '', // 核销员Id
        platformVerifyStationId: '', // 选择的核销点
        name: '', // 核对员名称
        telephone: '', // 核对员电话
        merchantName: '', // 商家
        community: '' // 核对员所属空间
      }
    },
    mounted () {
      this.getPageData()
      this.getPoint()
    },
    methods: {
      getPageData() {
        const self = this
        const paramsObj = {
          pageSize: self.pageSize,
          pageNum: self.currentPage,
          name: self.formData.name
        }
        platformVerifierPage(paramsObj).then(res => {
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
      // 获取核销点
      getPoint() {
        PlatformVerifyStationLoadStation().then(res => {
          if (res.status === 'true') {
            this.pointList = res.info
          } else {
            this.setMsg('error', res.msg)
          }
        })
      },
      // 更改状态
      handleUpdateStatus(Id, Status) {
        const paramsObj = {
          id: Id,
          status: Status
        }
        platformVerifierChangeStatus(paramsObj).then(res => {
          if (res.status === 'true') {
            this.setMsg('success', '修改成功!')
          } else {
            this.setMsg('error', res.msg)
          }
        })
      },
      operat(menberId, pointId, name, telephone, merchantName, community) {
        this.id = menberId
        this.platformVerifyStationId = pointId
        this.dialogVisible = true
        this.name = name
        this.telephone = telephone
        this.merchantName = merchantName
        this.community = community
      },
      submit() {
        if (!this.platformVerifyStationId) {
          this.setMsg('error', '请选择核销点!')
          return
        }
        const paramsObj = {
          verifierId: this.id,
          stationId: this.platformVerifyStationId
        }
        platformVerifierReview(paramsObj).then(res => {
          if (res.status === 'true') {
            this.setMsg('success', '修改成功!')
            this.dialogVisible = false
            this.getPageData()
          } else {
            this.setMsg('error', res.msg)
          }
        })
      },
      // 导出数据
      exportExcel() {
        if (!this.tableData.length) {
          return this.setMsg('暂无数据')
        }
        const downParams = {
        }
        let url = API_PATH + '/supervisor/platformVerifier/export'
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
