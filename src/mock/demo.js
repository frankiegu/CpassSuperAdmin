const demo = {
  'status': 'true',
  'code': '200',
  'msg': null,
  'info': [{
    'companyId': 2,
    'companyName': '雷猴软件有限公司01',
    'storeId': 15,
    'storeName': '门店门店',
    'companyContact': null,
    'companyPhone': null
  }, {
    'companyId': 6,
    'companyName': '广州雷猴软件开发有限公司01',
    'storeId': 6,
    'storeName': '雷猴',
    'companyContact': null,
    'companyPhone': null
  }]
}

export default {
  getDemo: () => {
    return demo
  }
}
