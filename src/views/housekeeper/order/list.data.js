// 存放会员信息的data数据
export let pageData = {
  levelList: [
    {
      value: ' ',
      label: '全部',
      type: 'info'
    }, {
      value: 1,
      label: '待接单',
      type: 'warning'
    }, {
      value: 2,
      label: '已接单',
      type: 'primary'
    }, {
      value: 3,
      label: '已完成',
      type: 'success'
    }, {
      value: 4,
      label: '已取消',
      type: 'danger'
    }
  ],
  statusList: {
    '待接单': 'warning',
    '已接单': 'primary',
    '已完成': 'success',
    '已取消': 'danger'
  }
};
