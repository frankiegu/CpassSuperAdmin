import { indexBannerAddOrUpdate, indexBannerDetail } from '@/service/market'
export default {
  mixins: [],
  data () {
    return {
      bannerId: this.$route.query.bannerId,
      noAllow: Boolean(this.$route.query.noAllow),
      uploadText: false,
      verifyImg: '',
      title: '', // 页面标题

      formData: {
        bannerPath: '', // banner图片路径
        title: '', // banner标题
        wxLink: '', // 微信h5链接
        wxAppLink: '' // 微信小程序链接
      },
      formDataRule: {
        title: [{ required: true, trigger: ['blur', 'change'], message: 'banner标题不能为空' }],
        wxLink: [{ required: true, trigger: ['blur', 'change'], message: 'App跳转链接不能为空' }],
        wxAppLink: [{ required: true, trigger: ['blur', 'change'], message: '小程序页面路径不能为空' }]
      }
    }
  },
  mounted () {
    this.setPageTitle()
  },
  methods: {
    uploadImg(val) {
      this.formData.bannerPath = val
      this.verifyImage()
    },
    // 设置标题
    setTitleName() {
      this.title = this.noAllow ? 'banner详情' : (this.bannerId ? '编辑banner' : '添加banner')
      document.title = this.title
      this.$store.commit('NAV_CRUMB', this.title)
      this.$route.meta.title = this.title
      if (!this.$route.name) {
        this.$store.dispatch('addVisitedViews', this.$route)
      }
    },
    setPageTitle() {
      this.setTitleName()

      if (this.bannerId) {
        this.getPageData()
      } else {
      }
    },
    getPageData() {
      indexBannerDetail({ id: this.bannerId }).then(res => {
        if (res.status === 'true') {
          this.formData.bannerPath = res.info.imgUrl
          this.formData.title = res.info.title
          this.formData.wxLink = res.info.appForwardUrl
          this.formData.wxAppLink = res.info.wxappForwardUrl
        } else {
          this.setMsg('error', res.msg)
        }
      })
    },
    verifyImage() {
      this.verifyImg = !this.formData.bannerPath ? '请上传banner' : ''
    },
    submitForm(formName) {
      if (this.noAllow) {
        this.noAllow = !this.noAllow
        this.setTitleName()
        return
      }

      this.verifyImage()

      this.$refs[formName].validate((valid) => {
        if (valid) {
          let dataObj = {
            id: this.bannerId || '',
            imgUrl: this.formData.bannerPath,
            title: this.formData.title,
            appForwardUrl: this.formData.wxLink,
            wxappForwardUrl: this.formData.wxAppLink
          }
          indexBannerAddOrUpdate(dataObj).then(res => {
            if (res.status === 'true') {
              this.noAllow = !this.noAllow

              if (this.bannerId) {
                this.setMsg('success', '更新banner成功')
                this.setTitleName()
              } else {
                this.setMsg('success', '添加banner成功')
                this.$router.replace({ path: '/market/banner' })
              }
            } else {
              this.setMsg('error', res.msg)
            }
          })
        } else {
        }
      })
    }
  }
}
