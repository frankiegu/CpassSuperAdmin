export default {
  data () {
    return {
      /**
       * 点开弹窗，请求品牌列表
       * 触发选项之后，清空并请求空间列表，类推
       *
       * 二级标题一个字段
       * 空间、场地一个字段，根据类型传参即可
       */
      repeatTip: '空间名重复：',
      brandList: [],
      storeList: [],
      fieldList: [],
      titleTypeList: [
        { key: 'brand', val: '品牌名' },
        { key: 'store', val: '空间名' },
        { key: 'field', val: '场地名' },
        { key: 'arbitrarily', val: '任意名' }
      ],

      dialogData: {
        titleType: null,
        brandId: null,
        brandItm: null,
        storeId: null,
        storeItm: null,
        fieldId: null,
        fieldItm: null,
        titleName: null,
        arbitrarilyName: null,

        addArr: [{
          brandId: null,
          brandList: [],
          storeId: null,
          storeItm: null,
          storeList: [],
          fieldId: null,
          fieldItm: null,
          fieldList: []
        }]
      },
      dialogDataRule: {
        titleType: [{ required: true, trigger: ['blur', 'change'], message: '标题类型不能为空' }],
        brandId: [{ required: true, trigger: ['blur', 'change'], message: '品牌名不能为空' }],
        storeId: [{ required: true, trigger: ['blur', 'change'], message: '空间名不能为空' }],
        fieldId: [{ required: true, trigger: ['blur', 'change'], message: '场地名不能为空' }],
        arbitrarilyName: [{ required: true, trigger: ['blur', 'change'], message: '输入名称不能为空' }]
      },
      dialogData2: {
        titleType: null,
        brandId: null,
        brandItm: null,
        storeId: null,
        storeItm: null,
        fieldId: null,
        fieldItm: null,
        titleName: null,
        arbitrarilyName: null,

        addArr: [{
          brandId: null,
          storeId: null,
          fieldId: null,
          brandList: [],
          storeList: [],
          fieldList: []
        }]
      }
    }
  }
}
