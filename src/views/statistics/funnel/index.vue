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

    <div class="lh-card-main card-padding">
      <!-- 漏斗图 -->
    </div>
  </div>
</template>

<script>
  import { getDateStr } from '@/config/utils'
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
          statisticalRange: []
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
        }
      }
    },
    mounted() {
      this.statisticalRangeList = [this.allRange, this.partRange]
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
      }
    }
  }
</script>

<style lang="scss">
  .forwarding-funnel {
    .lh-form-box {
      .el-select, .el-input--small {
        width: 265px;
      }
    }
  }
</style>
