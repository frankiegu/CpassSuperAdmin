import tableMixins from '@/mixins/table'
export default {
  mixins: [tableMixins],
  data () {
    return {
      sortFileName: '状态',
      filterStatus: '',
      formDate: {
        title: ''
      },

      // 橱窗位
      showcaseData: [],
      showcaseTableLoading: false,
      showcaseTableEmpty: '暂无数据',
      statusFilters: [
        { text: '已发布', value: 1, type: 'success' },
        { text: '未发布', value: 0, type: 'info' }
      ]
    }
  },
  methods: {}
}
