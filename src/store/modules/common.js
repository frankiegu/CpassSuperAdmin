import Cookies from 'js-cookie';

const common = {
  state: {
    navCrumb: '', // 动态设置面包屑的内容
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    }
  },

  getters: {
    navCrumb: state => state.navCrumb,
    sidebar: state => state.sidebar
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
    }
  },

  actions: {
    toggleSideBar: ({commit}) => commit('TOGGLE_SIDEBAR')
  }
}

export default common;
