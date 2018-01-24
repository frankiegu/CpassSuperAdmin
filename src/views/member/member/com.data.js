// 存放会员信息的data数据
export let formData = () => {
  return {
    id: '',
    name: '',
    companyName: '',
    storeName: '',
    telephone: '',
    role: '',
    created: '',
    consumeAmount: '',
    roleName: '',
    status: '',
    creditLevel: '',
    creditPoint: '',
    point: ''
  }
}

export let pageData = {
  tabMapOptions: [
    { label: '门禁权限', key: 'CN' }
    // { label: '消费信息', key: 'US' },
    // { label: '信用记录', key: 'JP' }
  ]
}
