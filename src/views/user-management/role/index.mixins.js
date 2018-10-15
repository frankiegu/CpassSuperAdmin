export default {
  data () {
    return {
      formData: {
        roleName: ''
      }
    }
  },
  props: {},
  components: {},
  mounted() {
    this.tableData = [
      {
        name: '老板',
        userList: 'hekkerjerj',
        status: '可用',
        desc: '科技部烦恼的功夫'
      },
      {
        name: '老板',
        userList: 'hekkerjerj',
        status: '可用',
        desc: '科技部烦恼的功夫'
      },
      {
        name: '老板',
        userList: 'hekkerjerj',
        status: '可用',
        desc: '科技部烦恼的功夫'
      }
    ]
  },
  watch: {},
  computed: {},
  methods: {}
}
