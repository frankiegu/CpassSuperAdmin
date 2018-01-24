<template>
  <div class="order-list">
    <div class="page-title"> <h1>场地预约订单</h1> </div>

    <div class="store-setting card-padding">
      <el-form :model="formData" :inline="true" class="text-right">
        <div class="fr">
          <el-button
            v-permissions="'/manage/order/exportOrderInfo'"
            @click="exportExcel"
            class="btn-green fr"
            icon="el-icon-download">导出表格</el-button>
        </div>

        <el-form-item>
          <el-date-picker
            v-model="formData.date"
            type="daterange"
            align="right"
            clearable
            @change="getPageData"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            placeholder="选择下单日期"
            :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="formData.storeId"
            @change="getPageData"
            placeholder="请选择门店"
            class="width150"
            clearable>
            <el-option
              v-for="item in storeList"
              :label="item.storeName"
              :key="item.id"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="formData.orderStatus"
            @change="getPageData"
            class="width150"
            clearable
            placeholder="请选择订单状态">

            <el-option label="全部" value=" "></el-option>
            <el-option
              v-for="(val, key) in orderStatusList"
              :key="key"
              :value="key"
              :label="val"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :class="{'mr0': !handleHasPermissions('/manage/order/exportOrderInfo')}">
          <el-input
            v-model.trim="formData.no"
            @keyup.native.enter="getPageData"
            placeholder="请输入订单号/预约单号"
            class="width220px">

            <i slot="suffix" @click="getPageData" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>
      </el-form>

      <el-table
        :data="tableData"
        :empty-text="tableEmpty"
        :slot="tableEmpty"
        v-loading="tableLoading"
        class="width100" border>

        <el-table-column label="订单号" width="150">
          <template slot-scope="scope">
            <router-link :to="{path: '/order/booking/detail', query: {id: scope.row.id}}" class="table-link">
              {{ scope.row.orderNum }}
            </router-link>
          </template>
        </el-table-column>

        <el-table-column label="下单日期" prop="created" width="115">
          <template slot-scope="scope">
            <i class="el-icon-time"></i> {{ scope.row.created }}
          </template>
        </el-table-column>
        <el-table-column label="订单状态">
          <template slot-scope="scope">
            <div class="label-con">
              <span
                v-for="(item, index) in statusList"
                v-if="scope.row.status === item.val"
                :key="index">{{ item.text }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="预约人" prop="name"></el-table-column>
        <el-table-column label="所属企业" prop="companyName"></el-table-column>
        <el-table-column label="所属门店" prop="storeName"></el-table-column>
        <el-table-column label="订单类型">
          <template slot-scope="scope">
            <div v-if="scope.row.type === 1">会议室</div>
            <div v-if="scope.row.type === 3">工位</div>
          </template>
        </el-table-column>

        <el-table-column label="预约登记号">
          <template slot-scope="scope">
            <!-- 如果有工号，就展示工号和密码；今后可能会没有工号，但是会有密码 -->
            <span v-if="scope.row.staffCode">{{ scope.row.staffCode }}&nbsp;-&nbsp;{{ scope.row.password }}</span>
            <span v-else>
              <span v-if="scope.row.password">{{ scope.row.password }}</span>
              <span v-else>{{ scope.row.checkInNum }}</span>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="需支付金额" prop="payAmount" :formatter="formatter"></el-table-column>
        <el-table-column label="支付状态">
          <template slot-scope="scope">
            <div class="label-con">
              <el-tag v-if="scope.row.payStatus === 10" type="primary">未支付</el-tag>
              <el-tag v-else-if="scope.row.payStatus === 20" type="success">已支付</el-tag>
              <el-tag v-else type="gray">已经退款</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          v-if="handleHasPermissions('/manage/order/confirmPay')"
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <router-link
              v-show="scope.row.payStatus !== 20 && scope.row.status === 10"
              :to="{path: '/order/booking/detail', query: {id: scope.row.id, charge: 1}}"
              class="table-link" >现场收费</router-link>
          </template>
        </el-table-column>
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
  import {pageData} from './com.data'
  import { API_PATH } from '@/config/env'
  import headMixins from '@/config/mixins/head'
  import tableMixins from '@/config/mixins/table'
  import {comPickerOptions} from '@/config/data/head'
  import { orderLists, loadConstant } from '@/service'
  import { formatTimeString, downloadFile } from '@/config/utils'
  export default {
    mixins: [headMixins, tableMixins],
    data () {
      return {
        orderStatusList: {},
        statusList: pageData.statusList,
        pickerOptions: comPickerOptions,
        formData: {
          date: '',
          companyId: null,
          storeId: null,
          fieldId: null,
          orderStatus: null,
          no: null,
          startDate: null,
          endDate: null
        }
      }
    },
    mounted () {
      loadConstant('order.status').then(res => {
        if (res.status === 'true') {
          this.orderStatusList = res.info
        }
      })
      // 阅读消息，清空消息提醒
      this.$store.dispatch('readMessageWay', 'order')
        .then(() => {
          setTimeout(() => {
            this.$store.dispatch('getMessagerWay')
          }, 100)
        }).catch(err => {
          this.setMsg('error', err)
        })

      this.getPageData()
    },
    methods: {
      formatter(row, column) {
        return '￥ ' + row.payAmount
      },
      getPageData() {
        let formData = this.formData
        const paramsObj = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          companyId: formData.companyId,
          storeId: formData.storeId,
          fieldId: formData.fieldId,
          orderStatus: formData.orderStatus,
          no: formData.no,
          startDate: formData.date ? formatTimeString(formData.date[0]) : null,
          endDate: formData.date ? formatTimeString(this.formData.date[1]) : null
        }

        orderLists(paramsObj).then(res => {
          if (res.status === 'true') {
            let data = res.info
            if (data) {
              this.pageTotal = data.total
              this.tableData = data.result
            }

            this.tableLoading = false
            if (this.tableData.length === 0) {
              this.tableEmpty = '暂时无数据'
            }

            for (let i = 0; i < this.tableData.length; i++) {
              this.tableData[i].created = data.result[i].created.split(' ')[0]
            }
          } else {
            this.setMsg('error', res.msg)
          }
        })
      },
      exportExcel() {
        if (!this.tableData.length) {
          return this.setMsg('暂无数据')
        }
        const downParams = {
          storeId: this.formData.storeId,
          orderStatus: this.formData.orderStatus,
          no: this.formData.no,
          startDate: this.formData.date ? formatTimeString(this.formData.date[0]) : null,
          endDate: this.formData.date ? formatTimeString(this.formData.date[1]) : null
        }
        let url = API_PATH + '/manage/order/exportOrderInfo'
        downloadFile(url, downParams)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .order-list {
  }
</style>
