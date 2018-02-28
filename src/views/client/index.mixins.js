export default {
  data () {
    return {
      formData: {
        name: '',
        reg_date: null,
        registerWay: '',
        // validaty: '',
        productStatus: ''
      },
      channels: [
        { id: ' ', channel: '全部' },
        { id: 1, channel: '后台创建' },
        { id: 2, channel: '客户自助注册' }
      ],
      timeValidity: [
        { id: ' ', validity: '全部' },
        { id: 1, validity: '永久' },
        { id: 2, validity: '一周内到期' },
        { id: 3, validity: '一月内到期' }
      ],
      statusList: [
        { value: ' ', label: '全部' },
        { value: 1, label: '正常', type: 'success' },
        { value: 0, label: '停用', type: 'danger' },
        { value: 2, label: '未开通', type: 'primary' }
      ]
    }
  },
  props: {},
  components: {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {}
}
