import { fieldData } from '../common'
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

      spaceList: [],
      storeList: [],
      fieldList: [],

      currentFieldId: null,
      dialogData: fieldData,
      dialogDataRule: {
        spaceId: [{ required: true, trigger: ['blur', 'change'], message: '所属品牌不能为空' }],
        storeId: [{ required: true, trigger: ['blur', 'change'], message: '所属空间不能为空' }],
        fieldId: [{ required: true, trigger: ['blur', 'change'], validator: checkFieldId }]
      }
    }
  },
  props: {},
  components: {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {}
}
