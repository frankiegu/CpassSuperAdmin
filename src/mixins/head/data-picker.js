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

