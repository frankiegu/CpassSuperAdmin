<template>
  <section class="coupon-detail-page">
    <!--<lh-title></lh-title>-->
    <lh-title :title="couponBaseInfo.name">
      <span class="ml12">
        <!--小时券, 礼品券, 折扣券, 满减券-->
        <el-tag class="mt2" type="success" size="mini" v-if="couponBaseInfo.status === 1">生效中</el-tag>
        <el-tag class="mt2" type="warning" size="mini" v-if="couponBaseInfo.status === 2">已过期</el-tag>
        <el-tag class="mt2" type="info" size="mini" v-if="couponBaseInfo.status === 3">已冻结</el-tag>
      </span>
      <span class="coupon-created ml25">创建日期</span>
      <span class="coupon-created ml10">{{couponBaseInfo.created}}</span>

      <div class="right-part fr mr15">
        <!-- 完成第一次发放后不可删除，按钮隐藏v-permissions="'/manage/coupon/delete'"  -->
        <span v-if="couponBaseInfo.canEdit === 1" @click="deleteCoupon" class="delete-coupon coupon-created mr15">
          删除
        </span>
        <router-link :to="'/coupon/add?id=' + couponId" v-if="couponBaseInfo.canEdit === 1">
          <el-button type="primary" size="small" class=" mr15">编辑</el-button>
        </router-link>
        <el-tooltip
          v-if="couponBaseInfo.status === 1 || couponBaseInfo.status === 3"
          :content="couponBaseInfo.fizenStatusText"
          placement="top"
          class="margin-lr6">
          <el-switch
            v-model="couponBaseInfo.controlStatus"
            active-text=""
            inactive-text=""
            @change="businessToggleAll(couponBaseInfo.controlStatus, couponBaseInfo.id)"
            :active-color="switchActiveColor"></el-switch>
        </el-tooltip>
        <el-tooltip
          v-if="couponBaseInfo.status === 1 || couponBaseInfo.status === 3"
          :content="couponBaseInfo.fizenStatusText"
          placement="top"
          class="margin-lr6">
          <div class="outer-div" @click="showDialog"></div>
        </el-tooltip>
      </div>

    </lh-title>
    <div class="page-title-info coupon-info">
      <el-row>
        <el-col :span="20">
          <el-row :gutter="20">
            <el-col>
              <p>
                <el-tag class="mt2" type="success" size="mini" v-if="couponBaseInfo.type === 1">小时券</el-tag>
                <el-tag class="mt2" type="success" size="mini" v-if="couponBaseInfo.type === 2">满减券</el-tag>
                <el-tag class="mt2" type="success" size="mini" v-if="couponBaseInfo.type === 3">礼品券</el-tag>
                <span>{{couponBaseInfo.description}}</span>
              </p>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="mt20">
            <el-col>
              <lh-item label="优惠内容：" label-width="87px">
                <span v-if="couponBaseInfo.type === 1">减免场地订单{{couponDiscountContent.subtractHour}}小时的费用</span>
                <span v-if="couponBaseInfo.type === 3">{{couponDiscountContent.benefit}}</span>
              </lh-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="6">
              <lh-item label="总张数：" label-width="60px">
                <span style="font-size: 18px; color: #000;">{{couponBaseInfo.quantity}}</span>
              </lh-item>
            </el-col>
            <el-col :span="6">
              <lh-item label="领取率：" label-width="60px">
                <span style="font-size: 18px; color: #000;" v-if="couponBaseInfo.quantity === 0">0.0%</span>
                <span style="font-size: 18px; color: #000;" v-else>{{(receiveStatistics.received/couponBaseInfo.quantity * 100).toFixed(1) + '%' || 0}}</span>
                <span>&nbsp;{{receiveStatistics.received || 0}}/{{couponBaseInfo.quantity}}</span>
              </lh-item>
            </el-col>
            <el-col :span="6">
              <lh-item label="使用率：" label-width="60px">
                <span style="font-size: 18px; color: #000;" v-if="couponBaseInfo.quantity === 0 || !receiveStatistics.used || !receiveStatistics.received">0.0%</span>
                <span style="font-size: 18px; color: #000;" v-else-if="receiveStatistics.used && receiveStatistics.received">{{(receiveStatistics.used/receiveStatistics.received * 100).toFixed(1) + '%' || 0}}</span>
                <span>&nbsp;{{receiveStatistics.used || 0}}/{{receiveStatistics.received || 0}}</span>
              </lh-item>
            </el-col>
            <el-col :span="6" v-if="couponBaseInfo.type === 1">
              <lh-item label="用券总成交额：" label-width="100px">
                <span style="font-size: 18px; color: #000;">{{couponTotalAmount}}&nbsp;</span>元
              </lh-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="page-title-info coupon-tab">
      <!-- tab标签 -->
      <el-tabs v-model="activeTab">
        <!-- 领取方式标签页 -->
        <el-tab-pane label="卡券信息" name="couponInformation" class="coupon-detail-info">
          <!--领取方式-->
          <div class="receive-methods mt12">
            <h3 class="coupon-tab-title mb22">领取方式</h3>
            <el-row class="coupon-tab-content">
              <el-col :span="16">
                <el-row :gutter="20" v-for="(item, index) in conditionTrigger" :key="index">
                  <el-col v-if="item.receiveType === 1">
                    <lh-item label="条件触发" label-width="120px">
                      <span class="mr15">{{item.receiveConditionStartTime ? item.receiveConditionStartTime.substr(0, 16) : ''}} 至 {{item.receiveConditionEndTime ? item.receiveConditionEndTime.substr(0, 16) : ''}} 期间<span v-if="item.receiveConditionType === '1'">，新用户注册</span></span>
                      <!--<el-tooltip-->
                        <!--:content="item.couponStatus ? '生效中' : '未生效'"-->
                        <!--placement="top"-->
                        <!--class="margin-lr6">-->
                        <!--<el-switch-->
                          <!--class=""-->
                          <!--v-model="item.couponStatus"-->
                          <!--active-text=""-->
                          <!--inactive-text=""-->
                          <!--:disabled="true"-->
                          <!--:active-color="switchActiveColor"></el-switch>-->
                      <!--</el-tooltip>-->
                      <el-button type="primary" v-if="item.couponStatus">生效中</el-button>
                      <el-button type="info" v-if="!item.couponStatus">未生效</el-button>
                    </lh-item>
                  </el-col>
                  <el-col v-if="item.receiveType === 2">
                    <!--<lh-item label="支持手动领取" label-width="120px"></lh-item>-->
                    <p class="pb16">支持手动领取</p>
                  </el-col>
                  <el-col v-if="item.receiveType === 3">
                    <!--<lh-item label="支持手动下发" label-width="120px"></lh-item>-->
                    <p class="pb16">支持手动下发</p>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <!--使用限制-->
          <div class="receive-methods mt22">
            <h3 class="coupon-tab-title mb22">使用限制</h3>
            <el-row class="coupon-tab-content">
              <el-col :span="16">
                <el-row :gutter="20" v-if="couponBaseInfo.type === 1">
                  <el-col>
                    <lh-item label="指定项目" label-width="120px">
                      <p class="mr15 mr0" v-for="(item, index) in platformHourCouponFieldTypeList" :key="index">
                        <span v-if="item.type === 1">{{platformHourCouponFieldTypeList.length > 1 ? '会议室、' : '会议室'}}</span>
                        <span v-if="item.type === 2">路演厅</span>
                        <span v-if="item.type === 4">{{platformHourCouponFieldTypeList.length > 1 ? '、其他场地' : '其他场地'}}</span>
                      </p>
                    </lh-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col>
                    <lh-item label="使用范围" label-width="120px">
                      <template slot-scope="scope">
                        <!--小时券, 礼品券, 折扣券, 满减券-->
                        <!--<span v-if="scope.row.type === 0">小时券</span>-->
                        <el-table
                          v-if="storeList.length > 0"
                          :data="storeList"
                          :empty-text="tableEmpty"
                          :slot="tableEmpty"
                          v-loading="tableLoading"
                          class="width50" border>
                          <el-table-column label="空间" align="left" prop="spaceName" v-if="couponBaseInfo.type === 1"></el-table-column>
                          <el-table-column label="礼品商" align="left" prop="spaceName" v-if="couponBaseInfo.type === 3"></el-table-column>
                          <el-table-column label="门店" align="left" prop="storeName" v-if="couponBaseInfo.type === 1"></el-table-column>
                          <el-table-column label="地址" align="left" prop="useCouponAddress" v-if="couponBaseInfo.type === 3"></el-table-column>
                        </el-table>
                        <span v-else>全部门店</span>
                      </template>
                    </lh-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <!--领券详情标签页-->
        <el-tab-pane label="领券详情" name="receiveRecord" class="receive-list">
          <el-button type="primary" @click="batchFreeze(1)" :disabled="multipleSelection.length <= 0">批量冻结</el-button>
          <el-button type="primary" @click="batchFreeze(2)" :disabled="multipleSelection.length <= 0">批量恢复</el-button>
          <div class="fr">
            <el-input
              class="lh-form-input mr15"
              clearable
              v-model.trim="searchName"
              placeholder="搜索领取人名称"
              @keyup.native.enter="getReceiveList(1)">

              <i slot="suffix" @click="getReceiveList(1)" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button class="lh-btn-export" icon="el-icon-download" @click="exportExcel">导出</el-button>
          </div>
          <el-table
            ref="multipleTable"
            :data="receiveList"
            tooltip-effect="dark"
            style="width: 100%"
            class="mt20"
            @sort-change="sortCoupon"
            @filter-change="filterChange"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              label="ID"
              prop="couponCode"
              sortable
              width="160">
              <template slot-scope="scope">{{ scope.row.couponCode }}</template>
            </el-table-column>
            <el-table-column
              prop="customerName"
              label="领取人"
              width="120">
            </el-table-column>
            <el-table-column
              prop="couponReceiveName"
              label="领取方式"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="receiveTime"
              label="领取时间"
              sortable
              show-overflow-tooltip>
            </el-table-column>

            <!--使用状态 0未使用 1已使用 2已失效 3冻结-->
            <el-table-column :label="sortFileName" prop="useStatusName"
                             :filters="[{ text: '待使用', value: 0 }, { text: '已冻结', value: 3 }, { text: '已使用', value: 1 }, { text: '已失效', value: 2 }]"
                             :filter-multiple="false"
                             filter-placement="bottom-end"
                             column-key="statusType"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.useStatus === 0">待使用</span>
                <span v-if="scope.row.useStatus === 1">已使用</span>
                <span v-if="scope.row.useStatus === 2">已失效</span>
                <span v-if="scope.row.useStatus === 3">已冻结</span>
              </template>

            </el-table-column>

            <el-table-column
              prop="useTime"
              label="使用时间"
              sortable
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              v-if="couponBaseInfo.type === 1"
              prop="orderAmount"
              label="订单金额"
              sortable
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              v-if="couponBaseInfo.type === 1"
              prop="discountAmount"
              label="优惠金额"
              sortable
              show-overflow-tooltip>
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
        </el-tab-pane>
      </el-tabs>
    </div>
  </section>
</template>
<script>
  import { API_PATH } from '@/config/env'
  import { downloadFile } from '@/config/utils'
  import { couponBatchFreeze, couponBatchRecover, couponDetail, couponReceiveList, couponDelete, couponChangeStatus } from '@/service/market'
  export default {
    data () {
      return {
        activeTab: 'couponInformation',
        couponId: this.$route.query.id, // 卡券id
        searchName: '', // 领取详情搜索姓名
        receiveList: [], // 领取列表
        couponTotalAmount: 0, // 用券总成交额
        couponBaseInfo: {}, // 优惠券基本信息
        receiveStatistics: {}, // 优惠券领用情况
        couponDiscountContent: {}, // 优惠内容
        platformHourCouponFieldTypeList: [], // 制定项目
        conditionTrigger: [], // 触发条件
        storeList: [], // 卡券使用范围
        multipleSelection: [],

        tableData: [],
        tableLoading: false,
        tableEmpty: ' ',

        // 分页器配置
        pageSizeArr: [20, 40, 80, 100],
        layoutArr: 'total, sizes, prev, pager, next, jumper',
        currentPage: 1,
        pageSize: 20,
        pageTotal: 0,
        isSwitchOuter: true, // 冻结或恢复优惠券Switch的外层遮挡div
        dialogTitle: '',
        dialogTips: '',
        couponStatus: '',
        receiveOrderBy: '', // 领取列表排序
        sortFileName: '使用状态', // 领取列表状态筛选
        statusType: '' // 领取列表按状态筛选
      }
    },
    methods: {
      // 删除优惠券
      deleteCoupon () {
        couponDelete({ id: this.couponId }).then(res => {
          if (res.status === 'true') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.$router.push('/market/coupon')
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            });
          }
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      getPageData () {
        couponDetail({ id: this.couponId }).then(res => {
          if (res.status === 'true') {
            this.couponBaseInfo = res.info.platformCoupon
            this.getReceiveList()
            this.couponTotalAmount = res.info.couponTotalAmount
            this.receiveStatistics = res.info.statistics
            this.couponStatus = res.info.platformCoupon.status // 1-开启, 0-关闭
            this.platformHourCouponFieldTypeList = res.info.platformHourCouponFieldTypeList
            res.info.couponReceiveDetailList.forEach(v => {
              if (v.receiveConditionStatus === 1) {
                v.couponStatus = true
              } else {
                v.couponStatus = false
              }
            })
            this.conditionTrigger = res.info.couponReceiveDetailList
            if (this.couponBaseInfo.type === 1) {
              this.couponDiscountContent = res.info.platformHourCoupon
              this.storeList = res.info.storeList
            } else if (this.couponBaseInfo.type === 3) {
              this.couponDiscountContent = res.info.platformGiftCoupon
              this.storeList = res.info.verifyStationList
              this.storeList.forEach(v => {
                v.useCouponAddress = v.cityName + v.districtName + v.address
              })
            }
            if (res.info.platformCoupon.status === 1) {
              this.couponBaseInfo.fizenStatusText = '点击冻结优惠券'
              this.couponBaseInfo.controlStatus = true
            } else if (res.info.platformCoupon.status === 3) {
              this.couponBaseInfo.fizenStatusText = '点击启用优惠券'
              this.couponBaseInfo.controlStatus = false
            } else if (res.info.platformCoupon.status === 2) {
              this.couponBaseInfo.fizenStatusText = '优惠券已过期'
              this.couponBaseInfo.controlStatus = false
            }
          }
        })
      },
      getReceiveList (page) {
        this.currentPage = page || this.currentPage
        let params = {
          couponId: this.couponId,
          couponType: this.couponBaseInfo.type,
          customerName: this.searchName,
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          orderBy: this.receiveOrderBy,
          useStatus: this.statusType
        }
        couponReceiveList(params).then(res => {
          if (res.status === 'true') {
            this.receiveList = res.info.result
            this.pageTotal = res.info.total
            this.receiveList.forEach(v => {
              if (v.useTime) v.useTime = v.useTime.substr(0, 16)
              if (v.receiveTime) v.receiveTime = v.receiveTime.substr(0, 16)
            })
          }
        })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getReceiveList()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getReceiveList()
      },
      // 导出数据
      exportExcel() {
        if (!this.receiveList.length) {
          return this.setMsg('暂无数据')
        }
        const downParams = {
          couponType: this.couponBaseInfo.type,
          couponId: this.couponId
        }
        let url = API_PATH + '/supervisor/platformCouponCustomer/export'
        downloadFile(url, downParams)
      },
      // 批量冻结/恢复
      batchFreeze (type) {
        let ids = []
        this.multipleSelection.forEach(v => {
          ids.push(v.id)
        })
        if (ids.length > 0) {
          if (type === 1) {
            // 冻结
            couponBatchFreeze({ userIds: ids }).then(res => {
              if (res.status === 'true') {
                this.$message({
                  type: 'success',
                  message: res.info
                });
                this.getReceiveList(1)
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                });
              }
            })
          } else if (type === 2) {
            // 恢复
            couponBatchRecover({ userIds: ids }).then(res => {
              if (res.status === 'true') {
                this.$message({
                  type: 'success',
                  message: res.info
                });
                this.getReceiveList(1)
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                });
              }
            })
          }
        } else {
          this.$message({
            type: 'info',
            message: '请先选择领取人'
          });
        }
      },
      // 是否开启优惠券弹窗
      showDialog () {
        // 状态 1 有效 2 过期 3 冻结
        if (this.couponStatus === 3) {
          if (this.couponBaseInfo.canEdit === 1) {
            this.dialogTitle = '优惠券启用后将无法进行任何编辑'
            this.dialogTips = '确认开启'
          } else {
            this.dialogTitle = '优惠券启用后方可使用'
            this.dialogTips = '确认开启'
          }
        } else if (this.couponStatus === 1) {
          this.dialogTitle = '优惠券冻结后将无法使用'
          this.dialogTips = '确认冻结'
        }
        let title = this.dialogTitle
        let tips = this.dialogTips
        let _this = this
        this.$confirm(title, tips,
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
          let params = {
            id: _this.couponId,
            status: _this.couponStatus === 1 ? 0 : 1
          }
          couponChangeStatus(params).then(res => {
            if (res.status === 'true') {
              if (_this.couponStatus === 1) {
                this.$message({
                  type: 'success',
                  message: '冻结成功!'
                });
              } else {
                this.$message({
                  type: 'success',
                  message: '开启成功!'
                });
              }
              _this.getPageData()
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消开启'
          });
        });
      },
      // 领取列表排序
      sortCoupon (sort) {
        // 卡券id 10升序 11降序 领取时间 20 21 使用时间 30 31 订单金额 40 41 优惠金额 50 51
        if (sort.prop === 'couponCode') {
          this.receiveOrderBy = sort.order === 'ascending' ? 10 : 11
        } else if (sort.prop === 'receiveTime') {
          this.receiveOrderBy = sort.order === 'ascending' ? 20 : 21
        } else if (sort.prop === 'useTime') {
          this.receiveOrderBy = sort.order === 'ascending' ? 30 : 31
        } else if (sort.prop === 'orderAmount') {
          this.receiveOrderBy = sort.order === 'ascending' ? 40 : 41
        } else if (sort.prop === 'discountAmount') {
          this.receiveOrderBy = sort.order === 'ascending' ? 50 : 51
        }
        this.getReceiveList()
        console.log('sort', sort)
      },
      // 筛选触发动作
      filterChange (filters) {
        if (filters.hasOwnProperty('statusType')) {
          if (filters['statusType'].length === 0) {
            this.sortFileName = '使用状态'
            this.statusType = ''
            this.getReceiveList()
            return;
          }
          console.log('filter', filters['statusType'][0])
          // 使用状态 0未使用 1已使用 2已失效 3冻结
          switch (filters['statusType'][0]) {
            case 0:
              this.statusType = 0
              this.sortFileName = '未使用'
              this.getReceiveList()
              break;
            case 1:
              this.statusType = 1
              this.sortFileName = '已使用'
              this.getReceiveList()
              break;
            case 2:
              this.statusType = 2
              this.sortFileName = '已失效'
              this.getReceiveList()
              break;
            case 3:
              this.statusType = 3
              this.sortFileName = '已冻结'
              this.getReceiveList()
              break;
          }
        }
      }
    },
    created () {
      this.getPageData()
    }
  }
</script>
<style lang="scss" scoped>
  .coupon-detail-page {
    .coupon-created {
      color: #000;
    }
    .coupon-info {
      /*padding-top: 15px;*/
      padding-left: 30px;
    }
    .coupon-tab {
      margin-top: 30px;
      margin-left: 24px;
      margin-right: 24px;
      border-radius: 6px;
      padding-top: 24px;
      box-shadow: 0 1px 6px 0 rgba(0, 21, 41, 0.12);
    }
    .coupon-tab-title {
      font-weight: 500;
    }
    .receive-list {
      padding-right: 25px;
      padding-bottom: 25px;
    }
    .coupon-detail-info  {
      padding-bottom: 15px;
    }
    .coupon-tab-content {
      padding-left: 15px;
    }
    .right-part {
      position: relative;
      .delete-coupon {
        cursor: pointer;
      }
      .outer-div {
        width: 40px;
        height: 30px;
        position: absolute;
        right: 0;
        top: 0;
        background-color: pink;
        opacity: 0;
        cursor: pointer;
      }
    }
  }
</style>
