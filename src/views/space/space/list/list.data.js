import { formatTimeString } from '@/config/utils'

export const pageData = {
  formFilter: {
    storeId: '',
    typeList: [
      {key: '3', label: '工位'},
      {key: '1', label: '会议室'}
    ],
    businessStatus: '',
    statusList: [
      {value: ' ', label: '全部', type: 'info'},
      {value: 1, label: '开放', type: 'success'},
      {value: 0, label: '关闭', type: 'danger'}
    ],
    date: formatTimeString(new Date())
  },
  config: {
    // wrap: true, // 打开，会与默认展开冲突
    mode: 'multiple',
    altInput: true,
    dateBasic: true,
    inline: true,
    locale: 'zh', // 中文
    dateFormat: 'Y-m-d',
    defaultDate: [],
    shorthandCurrentMonth: true,
    minDate: new Date().fp_incr(1),
    maxDate: new Date().fp_incr(90)
  },
  pickerOptions0: {
    disabledDate(time) {
      return time.getTime() < Date.now();
    }
  }
};
