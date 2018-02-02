const counter = {
  state: {
    count: 0
  },

  getters: {
    evenOrOdd: state => state.count % 2 === 0 ? 'even' : 'odd',
    getCount: state => state.count
  },

  mutations: {
    INCREMENT(state) {
      state.count++
    },
    DECREMENT(state) {
      state.count--
    }
  },

  actions: {
    increment: ({ commit }) => commit('INCREMENT'),
    decrement: ({ commit }) => commit('DECREMENT'),
    incrementIfOdd({ commit, state }) {
      if ((state.count + 1) % 2 === 0) {
        commit('INCREMENT')
      }
    },
    incrementAsync({ commit }) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit('INCREMENT')
          resolve()
        }, 1000)
      })
    }
  }
}

export default counter
