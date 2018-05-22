<template>
  <section class="coupon-detail-page">
    <!--<lh-title></lh-title>-->
    <lh-title :title="couponBaseInfo.name">
      <span class="ml12">
        <!--小时券, 礼品券, 折扣券, 满减券-->
        <el-tag class="mt2" type="success" size="mini" v-if="couponBaseInfo.type === 1">小时券</el-tag>
        <el-tag class="mt2" type="success" size="mini" v-if="couponBaseInfo.type === 2">满减券</el-tag>
        <el-tag class="mt2" type="success" size="mini" v-if="couponBaseInfo.type === 3">礼品券</el-tag>
      </span>
      <span class="coupon-created ml25">创建日期</span>
      <span class="coupon-created ml10">{{couponBaseInfo.created}}</span>

      <div class="right-part fr">
        <!-- 完成第一次发放后不可删除，按钮隐藏v-permissions="'/manage/coupon/delete'"  -->
        <span v-if="couponBaseInfo.canEdit === 1"
              @click="deleteCoupon(couponInfo.id)" class="delete-coupon coupon-created mr15">删除</span>
        <el-button type="primary" size="small" class=" mr15">编辑</el-button>
        <el-tooltip
          :content="couponBaseInfo.fizenStatusText"
          placement="top"
          class="margin-lr6">
          <el-switch
            class=""
            v-model="couponBaseInfo.controlStatus"
            active-text=""
            inactive-text=""
            @change="businessToggleAll(couponBaseInfo.controlStatus, couponBaseInfo.id)"
            :active-color="switchActiveColor"></el-switch>
        </el-tooltip>
        <div class="outer-div" v-if="isSwitchOuter" @click="showDialog"></div>
      </div>

    </lh-title>
    <div class="page-title-info coupon-info">
      <el-row>
        <el-col :span="16">
          <el-row :gutter="20">
            <el-col>
              <p>{{couponBaseInfo.description}}</p>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="mt20">
            <el-col>
              <lh-item label="优惠内容：" label-width="87px">
                <span v-if="couponBaseInfo.type === 1">减免场地订单{{couponDiscountContent.subtractHour}}小时的费用</span>
              </lh-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="6">
              <lh-item label="总张数：" label-width="60px">{{couponBaseInfo.quantity}}</lh-item>
            </el-col>
            <el-col :span="6">
              <lh-item label="领取率：" label-width="60px">
                <span>{{receiveStatistics.received || 0}}</span>
                <span>{{receiveStatistics.received || 0}}/{{couponBaseInfo.quantity}}</span>
              </lh-item>
            </el-col>
            <el-col :span="6">
              <lh-item label="使用率：" label-width="60px">
                <span>{{receiveStatistics.used || 0}}</span>
                <span>{{receiveStatistics.used || 0}}/{{couponBaseInfo.quantity}}</span>
              </lh-item>
            </el-col>
            <el-col :span="6">
              <lh-item label="用券总成交额：" label-width="100px">{{couponTotalAmount}}</lh-item>
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
            <h3 class="coupon-tab-title mb22">卡券信息</h3>
            <el-row class="coupon-tab-content">
              <el-col :span="16">
                <el-row :gutter="20" v-for="(item, index) in conditionTrigger" :key="index">
                  <el-col v-if="item.receiveType === 1">
                    <lh-item label="条件触发" label-width="120px">
                      <span class="mr15">{{item.receiveConditionStartTime ? item.receiveConditionStartTime.substr(0, 16) : ''}} 至 {{item.receiveConditionEndTime ? item.receiveConditionEndTime.substr(0, 16) : ''}} 期间<span v-if="item.receiveConditionType === '1'">，新用户注册</span></span>
                      <el-tooltip
                        :content="item.couponStatus ? '生效中' : '未生效'"
                        placement="top"
                        class="margin-lr6">
                        <el-switch
                          class=""
                          v-model="item.couponStatus"
                          active-text=""
                          inactive-text=""
                          :disabled="true"
                          :active-color="switchActiveColor"></el-switch>
                      </el-tooltip>
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
                <el-row :gutter="20">
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
          <el-button type="primary" @click="batchFreeze(1)">批量冻结</el-button>
          <el-button type="primary" @click="batchFreeze(2)">批量恢复</el-button>
          <div class="fr">
            <el-input
              class="lh-form-input mr15"
              v-model.trim="couponInfo.keywords"
              placeholder="搜索领取人名称"
              @keyup.native.enter="getPageData(1)"></el-input>
            <el-button class="lh-btn-export" icon="el-icon-download" @click="exportExcel">导出</el-button>
          </div>
          <el-table
            ref="multipleTable"
            :data="couponInfo.receiveRecord"
            tooltip-effect="dark"
            style="width: 100%"
            class="mt20"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              label="ID"
              sortable
              width="120">
              <template slot-scope="scope">{{ scope.row.id }}</template>
            </el-table-column>
            <el-table-column
              prop="receiveName"
              label="领取人"
              width="120">
            </el-table-column>
            <el-table-column
              prop="receiveMethod"
              label="领取方式"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="receiveTime"
              label="领取时间"
              sortable
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="receiveTime"
              label="使用状态"
              sortable
              show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.useStatus === 0">待使用</span>
                <span v-if="scope.row.useStatus === -1">冻结</span>
                <span v-if="scope.row.useStatus === 1">已使用</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="useTime"
              label="使用时间"
              sortable
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              v-if="couponInfo.type === 1 || couponInfo.type === 3"
              prop="orderAmount"
              label="订单金额"
              sortable
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              v-if="couponInfo.type === 1 || couponInfo.type === 3"
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
  import { couponDetail } from '@/service/market'
  export default {
    data () {
      return {
        activeTab: 'couponInformation',
        couponId: this.$route.query.id, // 卡券id
        couponInfo: {
          keywords: '', // 领取人输入框
          publishStatus: 0,
          name: '模拟数据',
          mark: '模拟数据......',
          discountContent: '可兑换一杯咖啡',
          useRange: '会议室, 其他场地',
          type: 0,
          discount: 80,
          receiveQuantity: 10, // 领取数量
          total: 30, // 总数量
          useQuantity: 10, // 使用量
          couponAmount: 10000, // 用券总成交额
          created: '2018-05-16 10:00:00',
          startDate: '2018-05-16 14:00:00',
          endDate: '2018-05-31 14:00:00',
          controlStatus: true,
          receiveRecord: [
            {
              id: '1220455522',
              receiveName: 'sdh',
              receiveMethod: '手动领取',
              receiveTime: '2018-05-11 12:00',
              useStatus: 0, // 0-待使用, 1-已使用, -1-冻结
              useTime: '', // 使用时间,
              orderAmount: '',
              discountAmount: '' // 优惠金额
            },
            {
              id: '1220455522',
              receiveName: 'sdh',
              receiveMethod: '手动领取',
              receiveTime: '2018-05-11 12:00',
              useStatus: 0, // 0-待使用, 1-已使用, -1-冻结
              useTime: '', // 使用时间,
              orderAmount: '',
              discountAmount: '' // 优惠金额
            }
          ], // 优惠券领取列表
          useField: [
            {
              id: 0,
              spaceName: '雷猴空间',
              storeName: '中信广场'
            },
            {
              id: 1,
              spaceName: '雷猴空间',
              storeName: '天河北路店'
            }
          ]
        },
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
        isSwitchOuter: true // 冻结或恢复优惠券Switch的外层遮挡div
      }
    },
    methods: {
      // 删除优惠券
      deleteCoupon () {},
      businessToggleAll (currentStatus, id) {
        const self = this
        // console.log('currentStatus: ', currentStatus);
        if (currentStatus === 1) {
          // unfreezeAll({
          //   couponId: id
          // }).then(res => {
          //   if (res.status === 'true') {
          //     self.$message({
          //       type: 'success',
          //       message: '成功解冻优惠券!'
          //     });
          //   } else {
          //     self.$message({
          //       showClose: true,
          //       message: res.msg,
          //       type: 'error'
          //     });
          //   }
          //   // 刷新一下发放情况列表
          //   self.getPageData()
          //   self.findCoupon()
          // })
        } else if (currentStatus === 2) {
          self.$confirm('冻结后优惠券会从会员账户中移除，请谨慎操作', '确认冻结所有优惠券？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // freezeAll({
            //   couponId: id
            // }).then(res => {
            //   if (res.status === 'true') {
            //     self.$message({
            //       type: 'success',
            //       message: '优惠券已冻结!'
            //     });
            //   } else {
            //     self.$message({
            //       showClose: true,
            //       message: res.msg,
            //       type: 'error'
            //     });
            //   }
            //   // 刷新一下发放情况列表
            //   self.getPageData()
            //   self.findCoupon()
            // })
          }).catch(() => {
            self.$message({
              type: 'info',
              message: '已取消'
            });

            // 刷新一下发放情况列表
            // self.getPageData()
            // self.findCoupon()
          });
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      getPageData () {
        couponDetail({ id: this.couponId }).then(res => {
          if (res.status === 'true') {
            console.log(res)
            this.couponBaseInfo = res.info.platformCoupon
            this.couponTotalAmount = res.info.couponTotalAmount
            this.receiveStatistics = res.info.statistics
            this.platformHourCouponFieldTypeList = res.info.platformHourCouponFieldTypeList
            this.storeList = res.info.storeList
            if (this.couponBaseInfo.type === 3) {
              this.storeList.forEach(v => {
                v.useCouponAddress = v.cityName + v.districtName + v.address
              })
            }
            res.info.couponReceiveDetailList.forEach(v => {
              if (v.receiveConditionStatus === 1) {
                v.couponStatus = true
              } else {
                v.couponStatus = false
              }
            })
            this.conditionTrigger = res.info.couponReceiveDetailList
            console.log('this.conditionTrigger', this.conditionTrigger)
            if (this.couponBaseInfo.type === 1) {
              this.couponDiscountContent = res.info.platformHourCoupon
            }
            if (res.info.platformCoupon.status === 1) {
              this.couponBaseInfo.fizenStatusText = '点击冻结优惠券'
              this.couponBaseInfo.controlStatus = true
            } else if (res.info.platformCoupon.status === 3) {
              this.couponBaseInfo.fizenStatusText = '点击解冻优惠券'
              this.couponBaseInfo.controlStatus = false
            } else if (res.info.platformCoupon.status === 2) {
              this.couponBaseInfo.fizenStatusText = '优惠券已过期'
              this.couponBaseInfo.controlStatus = false
            }
          }
        })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getPageData()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getPageData()
      },
      // 导出数据
      exportExcel() {
        if (!this.couponInfo.receiveRecord.length) {
          return this.setMsg('暂无数据')
        }
        const formData = this.couponInfo.keywords
        const downParams = {
          name: formData
        }
        let url = API_PATH + '/supervisor/platformOrder/export'
        downloadFile(url, downParams)
      },
      // 批量冻结/恢复
      batchFreeze (type) {
        if (type === 1) {
          // 冻结
        } else if (type === 2) {
          // 恢复
        }
        console.log('123', this.multipleSelection)
      },
      // 是否开启优惠券弹窗
      showDialog () {
        this.$confirm('优惠券启用后将无法进行任何编辑', '确认开启',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
          this.couponInfo.controlStatus = false
          this.$message({
            type: 'success',
            message: '开启成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消开启'
          });
        });
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
      .outer-div {
        width: 55px;
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
