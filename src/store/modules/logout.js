const logout = {
  state: {
    logoutStatus: false,
    logoutPrompt: ''
  },

  getters: {
    logoutStatus: state => state.logoutStatus,
    logoutPrompt: state => state.logoutPrompt
  },

  mutations: {
    LOGOUT_STATUS: (state, status) => {
      state.logoutStatus = status
    },
    LOGOUT_PROMPT: (state, prompt) => {
      state.logoutPrompt = prompt
    }
  },

  actions: {
    setLogoutStatus: ({ commit }, status) => commit('LOGOUT_STATUS', status),
    setLogoutPrompt: ({ commit }, status) => commit('LOGOUT_PROMPT', status)
  }
}

export default logout;

