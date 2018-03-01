import common from './common'
const tagsView = {
  state: {
    visitedViews: []
  },

  getters: {
    visitedViews: state => state.visitedViews
  },

  mutations: {
    ADD_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.some(v => v.path === view.path)) return
      state.visitedViews.push({
        name: view.name || common.state.navCrumb,
        path: view.path,
        id: view.query.id || ''
      })
      localStorage.visitedViews = JSON.stringify(state.visitedViews)
    },
    DEL_VISITED_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews.splice(i, 1)
          break
        }
      }
      localStorage.visitedViews = JSON.stringify(state.visitedViews)
    },
    DEL_OTHERS_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews = state.visitedViews.slice(i, i + 1)
          break
        }
      }
      localStorage.visitedViews = JSON.stringify(state.visitedViews)
    },
    DEL_ALL_VIEWS: (state) => {
      state.visitedViews = []
      localStorage.visitedViews = JSON.stringify(state.visitedViews)
    },
    SET_OPENED_LIST (state, view) {
      state.visitedViews = localStorage.visitedViews ? JSON.parse(localStorage.visitedViews) : [];
    }
  },

  actions: {
    addVisitedViews({ commit }, view) {
      commit('ADD_VISITED_VIEWS', view)
    },
    delVisitedViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delOthersViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_OTHERS_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delAllViews({ commit, state }) {
      return new Promise((resolve) => {
        commit('DEL_ALL_VIEWS')
        resolve([...state.visitedViews])
      })
    },
    setOpenedList({ commit }, view) {
      commit('SET_OPENED_LIST', view)
    }
  }
}

export default tagsView
