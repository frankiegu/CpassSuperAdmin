<template>
  <div class="forwarding-funnel">
    <lh-title />

    <!-- 筛选表单 -->
    <div class="lh-form-box">
      <el-form :model="funnelForm" label-width="80px" :inline="true" @submit.native.prevent>
        <el-form-item label="统计事项">
          <el-select v-model="funnelForm.matter">
            <el-option v-for="(value, key) in statisticalList" :value="key" :key="key" :label="value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="统计日期">
          <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd"
            start-placeholder="开始日期" end-placeholder="结束日期" type="daterange"
            :picker-options="pickerOptions" v-model="funnelForm.pickerDate">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="统计范围">
          <el-select v-model="funnelForm.statisticalRange" multiple @change="changeRange" collapse-tags>
            <el-option-group v-for="(group, index) in statisticalRangeList" :key="'范围' + index" :label="group.label">
              <el-option v-for="item in group.options" :label="item.label" :value="item.value" :key="item.value" />
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
              <div class="total">100%</div>
              <div class="receive">{{funnelDetail.receiveNum / funnelDetail.totalNum * 100}}%</div>
              <div class="used">{{funnelDetail.usedNum / funnelDetail.totalNum * 100}}%</div>
            </div>
          </el-col>
          <el-col style="width: calc(100% - 370px)">
            <el-col :span="12">
              <div class="funnel-detail">总数（张）<span>{{funnelDetail.totalNum}}</span></div>
              <div class="funnel-detail">领取（张）<span>{{funnelDetail.receiveNum}}</span></div>
              <div class="funnel-detail">使用（张）<span>{{funnelDetail.usedNum}}</span></div>
            </el-col>
            <el-col :span="12">
              <div class="total-conversion-rate">
                整体转化率
                <div class="font-bold theme-blue fz20">
                  {{(funnelDetail.usedNum / funnelDetail.totalNum * 100).toFixed(2)}}%
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
        <el-table :data="tableData" :loading="tableLoading">
          <el-table-column label="步骤" prop="step"></el-table-column>
          <el-table-column label="用户数" prop="userNum"></el-table-column>
          <el-table-column label="张数" prop="pieceNum"></el-table-column>
          <el-table-column label="转化率" prop="turnRate"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import { getDateStr, downloadFile } from '@/config/utils'
  import { API_PATH } from '@/config/env'
  export default {
    name: '',
    data() {
      return {
        // 统计事项下拉列表
        statisticalList: {
          1: '小时券使用漏斗',
          2: '礼品券使用漏斗'
        },
        // 统计范围下拉列表
        statisticalRangeList: [],
        // 选择全部范围
        allRange: {
          label: '',
          options: [{
            value: 0,
            label: '全部'
          }]
        },
        partRange: {
          label: '',
          options: [{
            value: 1,
            label: '黄金礼品券'
          }, {
            value: 2,
            label: '肥肥3小时兑换券'
          }, {
            value: 3,
            label: '满100减10代金券'
          }, {
            value: 4,
            label: '满300减30代金券'
          }, {
            value: 5,
            label: '满500减50代金券'
          }]
        },
        isSelectAll: false,
        funnelForm: {
          matter: '1',
          pickerDate: [getDateStr(-30), getDateStr(-1)],
          statisticalRange: [0]
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date(getDateStr(-1))
              const start = new Date(getDateStr(-7))
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date(getDateStr(-1))
              const start = new Date(getDateStr(-30))
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
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
        funnelDetail: {
          totalNum: 1000,
          receiveNum: 20,
          usedNum: 10
        },
        tableData: [],
        tableLoading: true
      }
    },
    mounted() {
      this.statisticalRangeList = [this.allRange]
    },
    methods: {
      // 统计范围选择事件
      changeRange(val) {
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
      },

      // TODO 导出
      exportExcel() {
        if (!this.tableData.length) {
          return this.setMsg('暂无数据')
        }
        // const funnelForm = this.funnelForm
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
          font-size: 28px;
          @for $i from 1 through 3 {
            &:nth-child(#{$i}) {
              @if $i != 3 {
                margin-bottom: 6px;
              }
              opacity: 0;
              animation: bubble .1s linear both .3s * (1 - ($i - 2));
              background-color: rgba($theme-blue, 1 - $i * .2);
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
