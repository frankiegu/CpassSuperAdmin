import tableMixins from '@/mixins/table'
export default {
  mixins: [tableMixins],
  data () {
    return {
      formDate: {
        title: ''
      },

      // 橱窗位
      showcaseData: [],
      showcaseTableLoading: false,
      showcaseTableEmpty: '暂无数据'
    }
  },
  methods: {}
}
