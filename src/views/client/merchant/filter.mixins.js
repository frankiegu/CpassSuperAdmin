export default {
  data () {
    return {}
  },
  filters: {
    filterMerchantId (value) { // 过滤商户ID，原value可能是1，这个filter将1处理4位数，不足4位就往前面加0
      if (!value) return ''
      value = '000' + value.toString()
      return value.slice(-4)
    }
  },
  mounted() {
  },
  computed: {
  },
  methods: {
  }
}
