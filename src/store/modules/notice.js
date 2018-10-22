// import { informList } from '@/service/common'

const notice = {
  state: {
    messageNum: 0,
    messageList: [],
    messageBarOpen: false
  },

  getters: {
    messageNum: state => state.messageNum,
    messageList: state => state.messageList,
    messageBarOpen: state => state.messageBarOpen
  },

  mutations: {
    TOGGLE_MSGBAR: (state, status) => {
      if (status === 'close') {
        state.messageBarOpen = false
      } else {
        state.messageBarOpen = !state.messageBarOpen
      }
    },
    MESSAGE_NUM: (state, msgNum) => {
      state.messageNum = msgNum
    },
    MESSAGE_LIST: (state, msgList) => {
      state.messageList = msgList
    }
  },

  actions: {
    toggleMsgBar: ({ commit }, status) => commit('TOGGLE_MSGBAR', status),
    getMsgNum: ({ commit }, num) => {
      commit('MESSAGE_NUM', num)
      if (num === 0) {
        commit('MESSAGE_LIST', [])
      }
    },
    getMsgList: ({ commit }) => {
      // let obj = {
      //   status: 0,
      //   pageNum: 1,
      //   pageSize: 1000
      // }
      // informList(obj).then(res => {
      //   if (res.status === 'true') {
      //     if (res.info) {
      //       let info = res.info
      //       commit('MESSAGE_LIST', info.result)
      //       commit('MESSAGE_NUM', info.total)
      //     }
      //   }
      // })
    }
  }
}

export default notice;

