import { PHONEREG, FIXPHONEREG } from '@/config/env'

export let popupData = function () {
  return {
    storeName: '',
    spaceId: '',
    storeCode: '',
    provinceCode: '',
    cityCode: '',
    districtCode: '',
    address: '',
    latitude: '',
    longitude: '',
    contactName: '',
    addressList: [],
    joinValueArray: [],     // 搜索的省 市 区【用于传参】
    joinValueString: '',    // 搜索的省 市 区【用于传参】
    latLng: null,           // 标注点 经纬度【用于传参】
    cascaderName: null,     // 保存获取到的级联name
    selecetedStoreCode: '', // 保存编辑的门店id
    defaultLatLng: '',      // 默认经纬度
    contactTel: ''
  }
}
export let spatialInfo = function () {
  return {
    id: '',
    spaceName: '',
    spaceLogo: '',
    spaceSlogan: '',
    phoneType: 0,
    phoneNumber: ''
  }
}
export let locationMap = function () {
  return {
    map: '',           // 新建地图 API
    listener: '',      // 监听 API
    scaleControl: '',  // 添加比例尺控件 API
    searchService: '', // 搜索
    geocoder: null,    // 地址解析
    info: null,        // 添加信息窗口
    addMarker: null,   // 添加标记，的标识
    marker: ''         // 标注点 API
  }
}
// 自定义电话号码校验规则
var checkTel = (rule, value, callback) => {
  if (!value) {
    callback()
    return
  }
  if (spatialInfo.phoneType === 0) {
    // 手机号码校验规则
    if (!PHONEREG.test(value)) {
      callback(new Error('手机号码不正确'))
    }
  } else {
    // 固定电话号码校验规则
    if (!FIXPHONEREG.test(value)) {
      callback(new Error('固定电话号码格式不正确。例：020-8888888'))
    }
  }
  callback()
}
var validateTel = (rule, value, callback) => {
  if (value.length < 11) {
    callback(new Error('请输入手机号码或固话'));
  } else {
    callback();
  }
};
var validateAddr = (rule, value, callback) => {
  if (value.length === 0) {
    callback(new Error('门店地址不能为空'));
  } else {
    callback();
  }
};
var validateLatitude = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请点击地图进行标记 '));
  } else {
    callback();
  }
};

export const pageData = {
  replaceCascader: {
    label: 'name',
    value: 'code',
    children: 'children',
    disabled: 'disabled'
  },
  ruleSpatialInfo: {
    spaceName: [{required: true, message: '空间名称不能为空', trigger: 'blur,change'}],
    spaceSlogan: [{max: 30, message: '空间标语不超过30字', trigger: 'blur,change'}],
    phoneNumber: [{validator: checkTel, trigger: 'blur, change'}],
    spaceLogo: [{required: true, message: '空间logo不能为空', trigger: 'blur,change'}]
  },
  rulePopupData: {
    storeName: [{required: true, trigger: 'blur,change', message: '门店名称不能为空'}],
    address: [{required: true, trigger: 'blur,change', message: '详细地址不能为空'}],
    contactName: [{required: true, trigger: 'blur,change', message: '姓名不能为空'}],
    contactTel: [{required: true, trigger: 'blur,change', validator: validateTel}],
    // 门店地址，以有没有省市区来判断
    joinValueArray: [{required: true, trigger: 'click', validator: validateAddr}],
    // 地图选点，以有没有纬度来判断
    latitude: [{required: true, trigger: 'click', validator: validateLatitude}]
  }
};
