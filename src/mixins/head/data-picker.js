import { getDateStr } from '@/config/utils'

// 禁止小于等于今天，用于form筛选
export const pickerOptions0 = {
  disabledDate: function(time) {
    return time.getTime() < Date.now();
  }
}

// 禁止--小于今天
export const pickerOptions1 = {
  disabledDate: function(time) {
    return time.getTime() < new Date(getDateStr(-1)).getTime();
  }
}

// 禁止--大于今天
export const pickerOptions2 = {
  disabledDate: function(time) {
    return time.getTime() > new Date(getDateStr(-1)).getTime();
  }
}

// 日期可选范围是100天以前至昨天
export const pickerOptions3 = {
  disabledDate: function(time) {
    return time.getTime() < new Date(getDateStr(-101)).getTime() || time.getTime() > new Date(getDateStr(-1)).getTime();
  },
  shortcuts: [{
    text: '一周内',
    onClick(picker) {
      const end = getDateStr(-1)
      const start = getDateStr(-8)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '一个月内',
    onClick(picker) {
      const end = getDateStr(-1)
      const start = getDateStr(-31)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '三个月内',
    onClick(picker) {
      const end = getDateStr(-1)
      const start = getDateStr(-91)
      picker.$emit('pick', [start, end])
    }
  }]
}
