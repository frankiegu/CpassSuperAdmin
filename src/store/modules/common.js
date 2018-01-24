import Cookies from 'js-cookie';
import {getMessageOrder, readMessage} from '@/service'

const common = {
  state: {
    messageOrderNum: Cookies.get('messageOrderNum') || 0,
    messageTotalNum: Cookies.get('messageTotalNum') || 0,
    navCrumb: '',
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    }
  },

  getters: {
    navCrumb: state => state.navCrumb,
    sidebar: state => state.sidebar,
    getMessageOrderNum: state => state.messageOrderNum,
    getMessageTotalNum: state => state.messageTotalNum
  },

  mutations: {
    NAV_CRUMB: (state, navCrumb) => {
      state.navCrumb = navCrumb
    },
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1);
      } else {
        Cookies.set('sidebarStatus', 0);
      }
      state.sidebar.opened = !state.sidebar.opened;
    },
    MESSAGE_ORDERNUM: (state, orderNum) => {
      state.messageOrderNum = orderNum
    },
    MESSAGE_TOTALNUM: (state, totalNum) => {
      state.messageTotalNum = totalNum
    }
  },

  actions: {
    toggleSideBar: ({commit}) => commit('TOGGLE_SIDEBAR'),
    readMessageWay: ({commit}, typeText) => {
      readMessage({type: typeText})
    },
    getMessagerWay: ({commit}) => {
      return new Promise((resolve, reject) => {
        getMessageOrder().then(res => {
          if (res.status === 'true') {
            Cookies.set('messageOrderNum', res.info)
            commit('MESSAGE_ORDERNUM', res.info)
            Cookies.set('messageTotalNum', res.info)
            commit('MESSAGE_TOTALNUM', res.info)
            resolve(res)
          } else {
            reject(res.msg)
          }
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default common;
