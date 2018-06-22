<template>
  <div class="forwarding-funnel">
    <lh-title />

    <!-- 筛选表单 -->
    <div class="lh-form-box">
      <el-form :model="funnelForm" label-width="80px" :inline="true" @submit.native.prevent>
        <el-form-item label="统计事项">
          <el-select v-model="funnelForm.matter" @change="getPartRange">
            <el-option v-for="(value, key) in statisticalList" :value="key" :key="key" :label="value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="统计日期">
          <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="getFunnelDetail"
            start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" :clearable="false"
            :picker-options="pickerOptions" v-model="funnelForm.pickerDate">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="统计范围">
          <el-select v-model="funnelForm.statisticalRange" multiple @change="changeRange"
            @visible-change="handleVisibleChange" collapse-tags>
            <el-option-group v-for="(group, index) in statisticalRangeList" :key="'范围' + index" :label="group.label">
              <el-option v-for="item in group.options" :label="item.name" :value="item.id" :key="item.id" />
            </el-option-group>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div class="lh-card-main">
      <!-- 漏斗图 -->
      <div class="senior-title">漏斗图</div>
      <div class="card-body">
        <el-row :gutter="20" class="funnel-data-container">
          <el-col :span="8" style="width: 370px">
            <div class="funnel-cont">
              <div class="total">{{totalDetail.percent}}</div>
              <div class="receive">{{receiveDetail.percent}}</div>
              <div class="used">{{usedDetail.percent}}</div>
            </div>
          </el-col>
          <el-col style="width: calc(100% - 370px)">
            <el-col :span="12">
              <div class="funnel-detail">总数（张）<span>{{totalDetail.couponTotal}}</span></div>
              <div class="funnel-detail">领取（张）<span>{{receiveDetail.couponTotal}}</span></div>
              <div class="funnel-detail">使用（张）<span>{{usedDetail.couponTotal}}</span></div>
            </el-col>
            <el-col :span="12">
              <div class="total-conversion-rate">
                整体转化率
                <div class="font-bold theme-blue fz20">
                  {{usedDetail.percent}}
                </div>
              </div>
            </el-col>
          </el-col>
        </el-row>
      </div>

      <!-- 详细数据 -->
      <div class="senior-title">详细数据</div>
      <div class="card-body">
        <el-button @click="exportExcel" class="lh-btn-export fr mb18">
          <lh-svg icon-class="icon-download" />导出
        </el-button>
        <el-table :data="tableData" v-loading="tableLoading">
          <el-table-column label="步骤" prop="title"></el-table-column>
          <el-table-column label="用户数" prop="userTotal">
            <template slot-scope="scope">
              <span>{{scope.row.userTotal ? scope.row.userTotal : '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="张数" prop="couponTotal"></el-table-column>
          <el-table-column label="转化率" prop="percent"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import { getDateStr, downloadFile } from '@/config/utils'
  import { API_PATH } from '@/config/env'
  import { loadConstant } from '@/service/common'
  import { issuePlatformCoupon, listPlatformCoupon } from '@/service/funnel'

  export default {
    name: '',
    data() {
      return {
        // 统计事项下拉列表
        statisticalList: {},
        // 统计范围下拉列表
        isVisibleChange: false,
        isSelectedChange: false,
        statisticalRangeList: [],
        // 全部范围
        allRange: {
          label: '',
          options: [{
            id: 0,
            name: '全部'
          }]
        },
        // 部分范围
        partRange: {
          label: '',
          options: []
        },
        isSelectAll: false,

        funnelForm: {
          matter: '1',
          pickerDate: [getDateStr(-30), getDateStr(-1)],
          statisticalRange: [0]
        },

        pickerOptions: {
          shortcuts: [{
            text: '最近7天',
            onClick(picker) {
              const end = new Date(getDateStr(-1))
              const start = new Date(getDateStr(-7))
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近30天',
            onClick(picker) {
              const end = new Date(getDateStr(-1))
              const start = new Date(getDateStr(-30))
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近90天',
            onClick(picker) {
              const end = new Date(getDateStr(-1))
              const start = new Date(getDateStr(-90))
              picker.$emit('pick', [start, end])
            }
          }],
          disabledDate(time) {
            return time.getTime() > new Date(getDateStr(-1)).getTime()
          }
        },
        totalDetail: {},
        receiveDetail: {},
        usedDetail: {},
        tableData: [],
        tableLoading: true
      }
    },
    mounted() {
      // 获取统计事项
      loadConstant('statisticalConsiderations').then(res => {
        if (res.status === 'true') {
          this.statisticalList = res.info
        }
      })

      // 统计范围初始化为'全部'，并获取小时券卡券列表
      this.statisticalRangeList = [this.allRange]
      this.getPartRange(1)
    },
    methods: {
      /**
       * 统计事项改变时要完成三件事
       * 1.重置其他两个筛选条件
       * 2.获取新的统计范围
       * 3.刷新统计详情数据
       */
      getPartRange(type) {
        // 重置筛选条件
        this.funnelForm.pickerDate = [getDateStr(-30), getDateStr(-1)]
        this.funnelForm.statisticalRange = [0]
        this.statisticalRangeList = [this.allRange]

        issuePlatformCoupon({
          couponType: type
        }).then(res => {
          if (res.status === 'true') {
            this.partRange.options = res.info
          }
        })

        // 刷新统计数据详情
        this.getFunnelDetail()
      },

      // 统计范围选择事件
      changeRange(val) {
        this.isSelectedChange = true
        if (val && val.some(value => value === 0)) {
          this.isSelectAll = true
        } else {
          this.isSelectAll = false
          this.statisticalRangeList = [this.allRange, this.partRange]
        }
        if (this.isSelectAll) { // 选中了全部
          this.isSelectAll = false
          // 则去除其他，只保留全部
          this.statisticalRangeList = [this.allRange]
          this.funnelForm.statisticalRange = [0]
        } else {
          // 如果当前不包含全部，则判断是否其他的选项全选了
          if (this.funnelForm.statisticalRange && this.partRange.options &&
            this.funnelForm.statisticalRange.length === this.partRange.options.length) {
            // 如果其他全选了，则也将当前置为全部
            this.statisticalRangeList = [this.allRange]
            this.funnelForm.statisticalRange = [0]
            this.isSelectAll = true
          }
        }
        // 统计范围下拉框隐藏，但选中值改变时，刷新统计详情数据
        if (!this.isVisibleChange) this.getFunnelDetail()
      },

      // 统计范围下拉框切换事件
      handleVisibleChange (isVisible) {
        this.isVisibleChange = isVisible
        // 选中值改变且下拉框隐藏时刷新统计详情数据
        if (this.isSelectedChange && !isVisible) {
          this.getFunnelDetail()
        }
        this.isSelectedChange = false
      },

      // 获取统计详情
      getFunnelDetail() {
        let [startDate, endDate] = this.funnelForm.pickerDate ? this.funnelForm.pickerDate : []
        let params = {
          couponType: this.funnelForm.matter,
          startDate: startDate,
          endDate: endDate
        }
        // 选中全部时，不传couponIds
        if (this.funnelForm.statisticalRange[0] !== 0) {
          params.couponIds = this.funnelForm.statisticalRange
        }
        listPlatformCoupon(params).then(res => {
          if (res.status === 'true') {
            [this.totalDetail, this.receiveDetail, this.usedDetail] = res.info
            this.tableData = res.info
            this.tableLoading = false
          } else {
            this.$message.error(res.msg)
          }
        })
      },

      // TODO 导出
      exportExcel() {
        if (!this.tableData.length) {
          return this.setMsg('暂无数据')
        }
        const downParams = this.funnelForm
        let url = API_PATH + '/supervisor/customer/exportExcel'
        downloadFile(url, downParams)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/styles/variables';
  .forwarding-funnel {
    .funnel-data-container {
      text-align: center;

      .funnel-cont {
        position: relative;
        margin: 0 auto;
        width: 350px;
        height: 270px;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          height: 0;
          width: 0;
          border: 175px solid #ffffff;
          border-top-width: 270px;
          border-bottom-width: 0;
          border-top-color: transparent;
        }

        >div {
          position: relative;
          z-index: 1;
          height: calc((100% - 12px) / 3);
          line-height: 86px;
          color: #ffffff;
          font-family: 'PingFangSC-Medium';
          font-size: 18px;
          @for $i from 1 through 3 {
            &:nth-child(#{$i}) {
              @if $i != 3 {
                margin-bottom: 6px;
              }
              opacity: 0;
              animation: bubble .2s linear both .3s * (1 - ($i - 2));
              background-color: rgba($theme-blue, 1 - ($i - 1) * .2);
            }
          }
        }
      }

      .funnel-detail {
        line-height: 86px;

        & + .funnel-detail {
          margin-top: 6px;
        }

        >span {
          display: inline-block;
          margin-left: 30px;
          min-width: 200px;
          font-family: 'PingFangSC-Medium';
        }

        @media screen and (max-width: 1306px) {
          >span {
            min-width: auto;
          }
        }
      }

      .total-conversion-rate {
        margin: 110px 0;
      }
    }
  }
  @keyframes bubble {
    to {
      opacity: 1;
    }
  }
</style>
<style lang="scss">
  .forwarding-funnel {
    .lh-form-box {
      .el-select, .el-input--small {
        width: 265px;
      }
    }
  }
</style>
