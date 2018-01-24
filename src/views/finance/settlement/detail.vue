<template>
  <div class="settle-detail">

    <!-- 有面包屑的时候，就隐藏这个标题 -->
    <div class="page-title">
      <h1>结算清单明细</h1>
    </div>

    <div class="card-padding card-padding-vertical">
      <h3 class="grid-title">基本信息</h3>
      <el-form :model="settleDetailForm" ref="settleDetailForm" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="公司名称">
              <p class="form-static-txt">{{ settleDetailForm.companyName }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属门店">
              <p class="form-static-txt">{{ settleDetailForm.storeName }}</p>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="结算单号">
              <p class="form-static-txt">{{ settleDetailForm.billNo }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="账单月份">
              <p class="form-static-txt">{{ settleDetailForm.relationMonth }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="账单总金额">
              <p class="form-static-txt">{{ settleDetailForm.totalAmount }}&nbsp;元</p>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="账单状态">
              <p class="form-static-txt">{{ settleDetailForm.statusName }}</p>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <h3 class="grid-title">场地租赁费
        <el-button
          v-permissions="'/manage/companyMonthlyBill/updateBillRentPrice'"
          v-if="!isEditFee && (settleDetailForm.status === 10 || settleDetailForm.status === 30) && siteFeeList.length !== 0"
          type="primary"
          size="mini"
          class="btn-set-fee fr"
          @click="isEditFee = true">调整费用</el-button>
        <el-button v-if="isEditFee" type="primary" size="mini" class="btn-set-fee fr" @click="handleUpdateFee">保存</el-button>
        <el-button v-if="isEditFee" size="mini" class="btn-set-fee fr" @click="handleCancelEdit">取消</el-button>
      </h3>
      <div class="clearfix">
        <el-table
          class="fl"
          border
          :data="siteFeeList"
          v-loading="orderLoading"
          style="width: 500px; margin-bottom: 22px;">
          <el-table-column label="场地名称" prop="rentGround"></el-table-column>
          <el-table-column label="计费天数" prop="consumeMonthDay"></el-table-column>
          <el-table-column label="需付租金" prop="perMonthRentPrice">
            <template slot-scope="scope">
              <span v-if="!isEditFee">{{ scope.row.actualPrice }}</span>
              <el-input type="number" :min="0" :max="99999999" v-model.number="scope.row.actualPrice" @input.native="handleInputPrice(scope.row.id)" v-else></el-input>
            </template>
          </el-table-column>
          <el-table-column label="支付状态" prop="payStatusName"></el-table-column>
        </el-table>
        <span class="theme-red fl" style="margin-left: 10px">{{ warningTxt }}</span>
      </div>

      <h3 class="grid-title">空间服务费</h3>
      <el-table border :data="billOrderList" v-loading="orderLoading">
        <el-table-column label="预约日期">
          <template slot-scope="scope">
            <span class="db">{{ scope.row.bookDate }}</span>
            <span class="db">{{ scope.row.bookStartTime + '-' + scope.row.bookEndTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="订单类型" prop="orderType">
          <template slot-scope="scope">
            <span v-if="scope.row.orderType === 1">场地预约</span>
          </template>
        </el-table-column>

        <el-table-column label="订单编号" prop="orderNo">
          <template slot-scope="scope">
            <router-link :to="'/order/booking/detail?id=' + scope.row.orderId" class="table-link" target="_blank">{{ scope.row.orderNo }}</router-link>
          </template>
        </el-table-column>

        <el-table-column label="预约人" prop="contactName"></el-table-column>
        <el-table-column label="联系方式" prop="telephone"></el-table-column>
        <el-table-column label="需支付金额" prop="actualPrice">
          <template slot-scope="scope">
            <span>{{ scope.row.actualPrice }}&nbsp;元</span>
          </template>
        </el-table-column>
        <el-table-column label="支付状态" prop="payStatusName"></el-table-column>
        <el-table-column
          label="操作"
          prop="calcStatus"
          v-if="handleHasPermissions('/manage/companyMonthlyBill/updateBillOrderCalcStatus')">
          <template slot-scope="scope">
            <el-tooltip
              :content="scope.row.calcStatus === 0 ? '此订单费用未计入账单' : '此订单费用将计入账单'"
              v-if="scope.row.payStatus === 10"
              placement="top">
              <el-switch
                v-model="scope.row.calcStatus"
                :active-value="1"
                :inactive-value="0"
                :disabled="settleDetailForm.status === 20 || settleDetailForm.status === 40"
                :active-color="switchActiveColor"
                active-text=""
                inactive-text=""
                @change="handleToggleCalc(scope.row.calcStatus, scope.row.id)">
              </el-switch>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import handleHasPermissions from '@/config/com-mixins'
  import { monthlyBillDetail, updateBillRentPrice, updateBillOrderCalcStatus } from '../../../service/index'
  export default {
    name: 'detail',
    mixins: [handleHasPermissions],
    data () {
      return {
        title: '结算清单明细',
        token: '',
        detailId: '', // 企业详情id
        isEditFee: false, // 是否编辑月租金
        currRow: '', // 当前修改租金行
        warningTxt: '',

        // 企业信息表单字段
        settleDetailForm: {
          companyName: '', // 公司名称
          storeName: '', // 进驻门店,
          billNo: '', // 账单号
          relationMonth: '', // 账单日期
          totalAmount: '', // 账单总额
          statusName: '' // 账单状态
        },

        siteFeeList: [], // 场地费用列表
        siteFeeCopy: [], // 场地费用的备份
        billOrderList: [], // 账单关联的订单列表
        orderLoading: true // 订单列表loading状态
      }
    },
    props: {},
    components: {},
    mounted () {
      this.token = sessionStorage.getItem('token')

      this.detailId = this.$route.query.id ? this.$route.query.id : ''
      if (this.detailId) {
        this.handleGetDetail()
      }
    },
    watch: {},
    computed: {
      billRent: function () {
        var tempArr = []
        if (this.siteFeeList) {
          for (let value of this.siteFeeList.values()) {
            let tempObj = {}
            tempObj.id = value.id
            tempObj.actualPrice = value.actualPrice
            tempArr.push(tempObj)
          }
          return tempArr
        }
      }
    },
    filters: {},
    methods: {
      handleInputPrice(id) {
        let feeTarget = this.siteFeeList.find(target => {
          return target.id === id
        })
        if (feeTarget.actualPrice < 0) {
          feeTarget.actualPrice = 0
          this.warningTxt = '金额最小为0，最大8位数'
        } else if (feeTarget.actualPrice > 99999999) {
          feeTarget.actualPrice = event.target.value.slice(0, 7)
          this.warningTxt = '金额最小为0，最大8位数'
        } else {
          this.warningTxt = ''
        }
      },
      // 获取账单明细
      handleGetDetail() {
        const paramsObj = {
          billId: this.detailId
        }
        this.siteFeeCopy = []
        monthlyBillDetail(paramsObj).then(res => {
          if (res.status === 'true' && res.info != null) {
            this.orderLoading = false
            this.settleDetailForm = res.info.bill
            this.siteFeeList = res.info.aggrementRentList
            this.billOrderList = res.info.billOrderList

            for (let value of this.siteFeeList.values()) {
              let tempPriceObj = {}
              tempPriceObj.actualPrice = value.actualPrice
              this.siteFeeCopy.push(tempPriceObj)
            }

            for (let i = 0; i < this.billOrderList.length; i++) {
              this.billOrderList[i].orderCreated = res.info.billOrderList[i].orderCreated
                ? res.info.billOrderList[i].orderCreated.split(' ')[0]
                : null
            }
          } else {
            console.log(res.msg)
          }
        })
      },
      // 取消修改租赁费
      handleCancelEdit() {
        this.isEditFee = false
        for (let [index, val] of this.siteFeeCopy.entries()) {
          this.siteFeeList[index].actualPrice = val.actualPrice
        }
      },
      // 修改场地租赁费
      handleUpdateFee() {
        const updateFeeObj = {
          billRent: this.billRent
        }
        updateBillRentPrice(updateFeeObj).then(res => {
          if (res.status === 'true') {
            this.isEditFee = false
            this.$message.success('修改成功！')
            this.handleGetDetail()
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 切换费用计入状态
      handleToggleCalc(currentStatus, id) {
        const self = this
        const target = self.billOrderList.find((target) => { // 目标订单
          return target.id === id
        })
        const paramsObj = {
          billOrderId: id,
          calcStatus: currentStatus
        }
        // 执行暂停收费前需弹窗确认
        if (currentStatus === 0) {
          self.$confirm('确认后将在结算单中停止收取此笔费用', '确认停止收费？', {
            lockScroll: false
          }).then(() => {
            updateBillOrderCalcStatus(paramsObj).then(res => {
              if (res.status === 'true') {
                self.handleGetDetail()
                self.$message.success('修改成功！')
              } else {
                self.$message.error(res.msg)
                setTimeout(function () {
                  target.calcStatus = currentStatus === 0 ? 1 : 0
                }, 600)
              }
            })
          }).catch(() => {
            self.$message.info('已取消操作！')
            target.calcStatus = currentStatus === 0 ? 1 : 0
          })
        } else {
          updateBillOrderCalcStatus(paramsObj).then(res => {
            if (res.status === 'true') {
              self.handleGetDetail()
              self.$message.success('修改成功！')
            } else {
              self.$message.error(res.msg)
              setTimeout(function () {
                target.calcStatus = currentStatus === 0 ? 1 : 0
              }, 600)
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../styles/config";
  .settle-detail {
    .form-static-txt {
      white-space: nowrap;
      color: #a1a1ab;
    }

    .el-select, .el-cascader {
      display: block;
    }
    .btn-set-fee {
      margin-right: 10px;
      margin-top: -4px;
    }
  }
</style>
