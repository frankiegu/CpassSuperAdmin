import store from '@/store'
import { WS_PATH } from './env'

const wsUpdater = {
  socket: null,
  start: function() {
    // console.log('ws start')
    let url = 'ws://' + location.host + WS_PATH + '/ws?token=' + sessionStorage.getItem('token')
    if (wsUpdater.socket == null) wsUpdater.socket = new WebSocket(url)

    wsUpdater.socket.onopen = function (event) {
      // console.log('onopen: ', event)
      // 连接建立成功后开始发送心跳
      heartCheck.start()
    }

    // 后端推消息过来时触发的回调
    wsUpdater.socket.onmessage = function(event) {
      // 收到数据时，重置发送心跳定时程序
      heartCheck.reset()
      // 转化数据格式，将消息插入消息列表顶部；未读消息数量更新
      const res = JSON.parse(event.data)
      if (res.status === 'true' && res.type === 'notice' && res.info) {
        store.getters.messageList.unshift(res.info.informVo)
        store.dispatch('getMsgNum', res.info.unreadTotal)
      }

      if (res.status === 'true' && res.type === 'logout' && res.msg) {
        sessionStorage.removeItem('token')
        store.dispatch('setLogoutStatus', true)
        store.dispatch('setLogoutPrompt', res.msg)
      }
    }

    // 连接发生错误时触发的回调
    wsUpdater.socket.onerror = function(event) {
      // console.log(event)
    }

    // 关闭链接时触发的回调
    wsUpdater.socket.onclose = function(event) {
      // console.log(event, 'Connection closed.')
      // 连接关闭后移除该连接；清除心跳定时；10分钟后重新发起连接
      wsUpdater.socket = null
      heartCheck.end()
      if (sessionStorage.getItem('token')) {
        if (process.env.NODE_ENV === 'production') wsUpdater.reconnect()
      }
    }
  },
  reconnect: function () {
    // 3分钟后重新发起连接
    setTimeout(function () {
      store.dispatch('getMsgList')
      wsUpdater.start()
    }, 180000)
  }
}

// 心跳
const heartCheck = {
  timeout: 60000, // 60s
  timeoutObj: null,
  reset: function() {
    clearInterval(this.timeoutObj)
    this.start()
  },
  start: function() {
    this.timeoutObj = setInterval(function() {
      if (wsUpdater.socket.readyState === 1) {
        wsUpdater.socket.send('HeartBeat')
      }
    }, this.timeout)
  },
  end: function () {
    clearInterval(this.timeoutObj)
  }
}

export { wsUpdater }
