/**
 * 面对复用性不高的模块，不采用组件化的方式价值更大
 * 用mixins把共有的数据、验证等抽出来即可
 * 公用：场地添加、编辑、对外开放设置及弹出框、场地详情、订单 | 详情
 */
export default {
  data () {
    return {
      // 数组用对象数组，加上id的方式更健壮，用0和1方便true—false判断
      business: [
        { key: 1, label: '营业' },
        { key: 0, label: '休息' }
      ],
      /**
       * 数组用对象数组，加上id的方式更健壮，用0和1方便true—false判断
       * 0是区分工作日，1是不区分
       */
      // isOpen: 1,
      workingDay: [
        { key: 2, label: '区分工作日' },
        { key: 1, label: '不区分工作日' }
      ]
    }
  },
  methods: {
  }
}
