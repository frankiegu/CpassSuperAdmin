import tableMixins from '@/mixins/table'
export default {
  mixins: [tableMixins],
  data () {
    return {
      formDate: {
        keywords: '',
        name: ''
      },

      tableData2: [
        { fieldId: '3210', fieldName: '我是路演厅', name: 'name', name1: '1', name2: '2', name3: 1, name4: '4', name5: '5', name6: '6' },
        { fieldId: '3210', fieldName: '我是路演厅', name: 'name', name1: '1', name2: '2', name3: 1, name4: '4', name5: '5', name6: '6' },
        { fieldId: '3210', fieldName: '我是路演厅', name: 'name', name1: '1', name2: '2', name3: 1, name4: '4', name5: '5', name6: '6' }
      ],
      tableLoading2: false,
      tableEmpty2: ' ',

      sortFileName: '状态',
      filterStatus: '',
      statusFilters: [
        { text: '展示中', value: 0, type: '' },
        { text: '已发布', value: 1, type: 'success' },
        { text: '未发布', value: 2, type: 'info' },
        { text: '已过期', value: 3, type: 'warning' }
      ],

      tableData: [
        { fieldId: '3210', fieldName: '我是路演厅', name: 'name', name1: '1', name2: '2', name3: 1, name4: '4', name5: '5', name6: '6' },
        { fieldId: '3210', fieldName: '我是路演厅', name: 'name', name1: '1', name2: '2', name3: 3, name4: '4', name5: '5', name6: '6' }
      ]
    }
  },
  props: {},
  components: {},
  mounted() {
  },
  watch: {},
  computed: {},
  methods: {}
}
