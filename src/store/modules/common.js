import Cookies from 'js-cookie'
import { regionList } from '@/service/common'

const common = {
  state: {
    navCrumb: '', // 动态设置面包屑的内容
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    },
    regionList: [] // 省市区地址列表
  },

  getters: {
    navCrumb: state => state.navCrumb,
    sidebar: state => state.sidebar,
    regionList: state => state.regionList
  },

  mutations: {
    NAV_CRUMB: (state, navCrumb) => {
      state.navCrumb = navCrumb
    },
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    GET_REGION_LIST: (state, list) => {
      state.regionList = list
    }
  },

  actions: {
    toggleSideBar: ({ commit }) => commit('TOGGLE_SIDEBAR'),
    // 获取省市区列表
    getRegionList: ({ commit, state }) => {
      console.log('1')
      if (!state.regionList.length) {
        console.log('2')
        regionList().then(res => {
          if (res.status === 'true') {
            commit('GET_REGION_LIST', res.info.children)
          }
        })
      }
    }
  }
}

export default common
