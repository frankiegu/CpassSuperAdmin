// import { fieldData } from '../../common'
export default {
  data () {
    // 自定义电话号码校验规则
    const checkFieldId = (rule, value, callback) => {
      if (!value) {
        callback(new Error('场地不能为空'))
        return
      } else {
        if (!this.closeDialogStatus) {
          for (let item of this.teamsData) {
            // 当前id可以修改
            // console.log('test', item.fieldId, this.currentFieldId, this.dialogData.fieldId);
            if (this.dialogData.fieldId !== this.currentFieldId && item.fieldId === this.dialogData.fieldId) {
              callback(new Error('场地不可以重复添加'))
              return
            }
          }
        }
      }

      callback()
    }
    return {
      disabledweixinPay: false,
      closeDialogStatus: false, // 取消弹出框

      titleTypeList: [
        { key: 'brand', val: '品牌名' },
        { key: 'store', val: '空间名' },
        { key: 'field', val: '场地名' },
        { key: 'arbitrarily', val: '任意名' }
      ],

      spaceList: [],
      storeList: [],
      fieldList: [],

      currentFieldId: null,
      dialogData: {
        id: 0,
        idx: 'add', //
        platformSelectionId: null,
        spaceId: null,
        storeId: null,
        fieldId: null,
        fieldTitle: null,
        fieldName: null,
        imgPath: null,
        created: null,
        updated: null,

        // 二级标题
        spaceName: null,
        storeName: null,
        arbitrarilyName: null,
        titleType: null,

        // 添加空间
        spaceBrandId: null,
        spaceStoreId: null,
        addStoreList: [
          { sBandId: '', sStoreId: '', sStoreList: [] }
        ]
      },
      dialogDataRule: {
        arbitrarilyName: [{ required: true, trigger: ['blur', 'change'], message: '输入名称不能为空' }],
        bandId: [{ required: true, trigger: ['blur', 'change'], message: '品牌名不能为空' }],
        titleType: [{ required: true, trigger: ['blur', 'change'], message: '标题类型不能为空' }],
        storeId: [{ required: true, trigger: ['blur', 'change'], message: '空间名不能为空' }],
        fieldId: [{ required: true, trigger: ['blur', 'change'], validator: checkFieldId }]
      }
    }
  }
}
