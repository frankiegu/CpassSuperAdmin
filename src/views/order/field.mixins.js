export default {
  data () {
    return {
      statusList: [
        { val: 5, text: '待支付' },
        { val: 10, text: '待使用' },
        { val: 20, text: '已使用' },
        { val: 30, text: '已取消' },
        { val: 40, text: '待退款' },
        { val: 50, text: '已退款' }
      ]
      // 订单状态,5-未支付 10未使用 20已使用 30已取消 40-待退款 50-已退款
    }
  },
  props: {},
  components: {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {}
}
