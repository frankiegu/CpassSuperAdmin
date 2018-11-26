/*
使用方法：
import filterMixins from './filter.mixins' （实际页面路径为准）

在双花括号中：
{{ message | filterMerchantId }}

在v-bind 中：
<div v-bind:id="rawId | filterMerchantId"></div>
*/

export default {
  data () {
    return {}
  },
  filters: {
    filterMerchantId (value) { // 过滤商户ID，原value可能是1，这个filter将1处理4位数，不足4位就往前面加0
      if (!value) return '-'
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
