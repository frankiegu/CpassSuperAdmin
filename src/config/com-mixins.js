import { hasPermissions } from './utils'
// 公共的设置弹窗的方法
export default {
  data () {
    return {
      switchActiveColor: '#67C23A'
    }
  },
  methods: {
    // 使用缩放图片服务减少引用图片大小
    // 等比缩放，以宽高小值为准。亲测试有效
    zoomImgSize(width, height) {
      // 只传一个参数，就表示宽高相等
      if (!height) {
        height = width
      }
      return `?x-oss-process=image/resize,m_lfit,h_${height || 50},w_${width || 50}`
    },
    setMsg(type = 'info', msg) {
      if (!msg) {
        msg = type
        type = 'info'
      }
      this.$message({
        showClose: true,
        type: type,
        message: msg,
        duration: 1500
      })
    },
    // 判断权限
    handleHasPermissions(resource) {
      return hasPermissions(resource)
    }
  }
}
