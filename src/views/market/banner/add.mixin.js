export default {
  mixins: [],
  data () {
    // 自定义标题校验规则
    const checkTitle = (rule, value, callback) => {
      if (!value) {
        callback(new Error('banner标题不能为空'))
        return
      } else {
      }

      callback()
    }
    return {
      noAllow: Boolean(this.$route.query.noAllow),
      uploadImg: '',
      uploadText: false,
      title: '', // 页面标题

      formData: {
        bannerPath: '', // banner图片路径
        title: '', // banner标题
        wxLink: '', // 微信h5链接
        wxAppLink: '' // 微信小程序链接
      },
      formDataRule: {
        title: [{ required: true, trigger: ['blur', 'change'], validator: checkTitle }],
        bannerPath: [{ required: true, trigger: ['blur', 'change'], message: 'banner不能为空' }],
        wxLink: [{ required: true, trigger: ['blur', 'change'], message: 'App跳转链接不能为空' }],
        wxAppLink: [{ required: true, trigger: ['blur', 'change'], message: '小程序页面路径不能为空' }]
      },

      ajaxName: '' // 请求ajaxName
    }
  },
  mounted () {
    this.setPageTitle()
  },
  methods: {
    // 设置标题
    setTitleName() {
      this.title = this.noAllow ? 'banner详情' : (this.fieldId ? '编辑banner' : '添加banner')
      document.title = this.title
      this.$store.commit('NAV_CRUMB', this.title)
      this.$route.meta.title = this.title
      if (!this.$route.name) {
        this.$store.dispatch('addVisitedViews', this.$route)
      }
    },
    setPageTitle() {
      this.setTitleName()

      if (this.fieldId) {
        this.getPageData()
        this.ajaxName = 'cPassEditWellChosen'
      } else {
        this.ajaxName = 'cPassAddWellChosen'
      }
    },
    submitForm(formName) {
      if (this.noAllow) {
        this.noAllow = !this.noAllow
        this.setTitleName()
        return
      }

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.setMsg('error')
        } else {
        }
      })
    }
  }
}
