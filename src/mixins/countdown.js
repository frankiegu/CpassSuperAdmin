// 用法
// 在methods的方法中写下面逻辑
// 点击按钮，启动倒计时
/*
  this.isAble // 拿到倒计时的状态
  this.isAble = false // 改变倒计时的状态
  this.settime() // 启动倒计时

  demo，在接口中使用
  if (!this.isAble) {
    return
  }
  fatch().then(res => { // 调用接口
    this.isAble = false // 改变倒计时的状态
    this.settime() // 启动倒计时
  })
*/

export default {
  data () {
    return {
      isAble: true, // 根据isAble来判断倒计时的状态
      countdown: 60, // 倒计时的时间
      smsText: '获取验证码'
    }
  },
  methods: {
    settime () {
      if (this.countdown === 0) {
        this.smsText = '发送验证码'
        this.countdown = 60
        this.isAble = true
      } else {
        this.smsText = this.countdown + 'S重新获取'
        this.countdown--
        setTimeout(() => {
          this.settime()
        }, 1000)
      }
    }
  }
}
