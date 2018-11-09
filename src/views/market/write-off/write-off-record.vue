<template>
  <div class="order-field">
    <div class="card-padding">
      <el-form :inline="true" class="text-right mr-10">
        <el-form-item>
          <lh-datePicker label="核销日期" @datePickerChange="datePickerChange"></lh-datePicker>
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="formData.spaceId"
            @change="changeSpace"
            placeholder="请选择所属品牌"
            class="width140px"
            clearable>
            <el-option
              v-for="item in spaceList"
              :label="item.spaceName"
              :value="item.id"
              :key="item.id"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item>
          <el-select
            v-model="formData.storeId"
            @change="changeStore"
            placeholder="请选择消费空间"
            class="width140px"
            clearable>
            <el-option
              v-for="item in storeList"
              :label="item.storeName"
              :value="item.id"
              :key="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="formData.verifyStationId"
            @change="getPageData(1)"
            placeholder="请选择核销点"
            class="width140px"
            clearable>
            <el-option
              v-for="item in verifyStationList"
              :label="item.name"
              :value="item.id"
              :key="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model.trim="formData.couponName"
            @keyup.native.enter="getPageData(1)"
            placeholder="请输入卡券名"
            clearable
            class="width220px">

            <i slot="suffix" @click="getPageData(1)" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>

        <el-form-item v-if="handleHasPermissions('/supervisor/platformVerifyRecord/export')" class="fr">
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

        <el-table-column label="交易号" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.tradeNum }}
          </template>
        </el-table-column>

        <el-table-column label="领取时间" fixed="left" align="left" :min-width="110">
          <template slot-scope="scope">
            <span v-if="scope.row.receiveTime">
              <span style="display: inline-block; width: 80px; height: 23px;">{{ scope.row.receiveTime.substr(0, 10) }}</span>
              <span style="display: inline-block; width: 60px; height: 23px;">{{ scope.row.receiveTime.substr(11, 8) }}</span>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="领取人" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.customerName }}
          </template>
        </el-table-column>

        <el-table-column label="卡券名称" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.platformCouponName }}
          </template>
        </el-table-column>

        <el-table-column label="消费空间" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.storeName }}
          </template>
        </el-table-column>

        <el-table-column label="所属品牌" fixed="left" align="left">
          <template slot-scope="scope">
            {{ scope.row.spaceName }}
          </template>
        </el-table-column>

        <el-table-column label="状态" align="left">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status === 1">已兑换</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="核销点" align="left">
          <template slot-scope="scope">
            {{ scope.row.stationName }}
          </template>
        </el-table-column>

        <el-table-column label="核销员" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.verifierName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="核销时间" align="left" :min-width="110">
          <template slot-scope="scope">
            <span v-if="scope.row.created">
              <span style="display: inline-block; width: 80px; height: 23px;">{{ scope.row.created.substr(0, 10) }}</span>
              <span style="display: inline-block; width: 60px; height: 23px;">{{ scope.row.created.substr(11, 8) }}</span>
            </span>
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
  import { API_PATH } from '@/config/env'
  import { formatTimeString, downloadFile } from '@/config/utils'
  import tableMixins from '@/mixins/table'
  import { spaceList, storeList } from '@/service/common'
  import { platformVerifyRecordPage, PlatformVerifyStationLoadStation } from '@/service/market'

  export default {
    mixins: [tableMixins],
    components: {},
    data () {
      return {
        spaceList: [],
        storeList: [],
        verifyStationList: [],
        formData: {
          couponName: '',
          spaceId: '',
          storeId: '',
          verifyStationId: '',
          startDate: '',
          endDate: ''
        }
      }
    },
    mounted () {
      if (this.handleHasPermissions('/supervisor/platformVerifyRecord/page')) {
        this.getspaceList()
        this.getstoreList()
        this.getStationList()
        this.getPageData()
      }
    },
    methods: {
      getPageData (page) {
        const self = this
        self.currentPage = page || self.currentPage
        const paramsObj = {
          pageSize: self.pageSize,
          pageNum: self.currentPage,

          couponName: this.formData.couponName,
          spaceId: this.formData.spaceId,
          storeId: this.formData.storeId,
          verifyStationId: this.formData.verifyStationId,
          startDate: this.formData.startDate,
          endDate: this.formData.endDate
        }
        platformVerifyRecordPage(paramsObj).then(res => {
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
      // 获取品牌列表
      getspaceList () {
        spaceList().then(res => {
          if (res.status === 'true') {
            this.spaceList = res.info
          } else {
            this.setMsg('error', res.msg)
          }
        })
      },
      // 获取空间列表
      getstoreList () {
        const paramsObj = {
          spaceId: this.formData.spaceId
        }
        storeList(paramsObj).then(res => {
          if (res.status === 'true') {
            this.storeList = res.info
          } else {
            this.setMsg('error', res.msg)
          }
        })
      },
      // 获取核销点列表
      getStationList () {
        const paramsObj = {
          spaceId: this.formData.spaceId,
          storeId: this.formData.storeId
        }
        PlatformVerifyStationLoadStation(paramsObj).then(res => {
          if (res.status === 'true') {
            this.verifyStationList = res.info
          } else {
            this.setMsg('error', res.msg)
          }
        })
      },
      // 品牌变更
      changeSpace () {
        // 清空空间和核销点 的选中项以及列表
        this.formData.storeId = ''
        this.formData.verifyStationId = ''
        this.storeList = []
        this.verifyStationList = []

        this.getPageData(1)
        this.getstoreList()
      },
      // 空间变更
      changeStore () {
        // 清空核销点 的选中项以及列表
        this.formData.verifyStationId = ''
        this.verifyStationList = []

        this.getPageData(1)
        this.getStationList()
      },
      datePickerChange (val, date) {
        const self = this
        self.formData.startDate = date ? formatTimeString(date[0]) : ''
        self.formData.endDate = date ? formatTimeString(date[1]) : ''
        this.getPageData(1)
      },
      exportExcel() {
        if (!this.tableData.length) {
          return this.setMsg('暂无数据')
        }
        let url = API_PATH + '/supervisor/platformVerifyRecord/export'
        downloadFile(url)
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
        width: 80px;
        float: left;
      }
      .label-con{
        float: left;
        width: calc(100% - 80px);
        margin-bottom: 10px;
      }
    }
  }
</style>
