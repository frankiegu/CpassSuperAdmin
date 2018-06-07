const tagsView = {
  state: {
    visitedViews: []
  },

  getters: {
    visitedViews: state => state.visitedViews
  },

  mutations: {
    ADD_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.some(v => (v.path === view.path) || view.meta.isError)) return
      state.visitedViews.push({
        name: view.name.length ? view.name : view.meta.title,
        path: view.path,
        id: view.query.id || '',
        type: view.query.type || ''
      })
      state.visitedViews.forEach(v => {
        let path = v.path
        if (v.id) {
          if (path.indexOf('?') > -1) {
            path = path + '&id=' + v.id
          } else {
            path = path + '?id=' + v.id
          }
        }
        if (v.type) {
          if (path.indexOf('?') > -1) {
            path = path + '&type=' + v.type
          } else {
            path = path + '?type=' + v.type
          }
        }
        v.lastPath = path
      })
      sessionStorage.visitedViews = JSON.stringify(state.visitedViews)
    },
    PAGE_OPENED_UPDATE: (state, get) => {
      let openedPage = state.visitedViews[get.index]
      if (get.query) {
        openedPage.id = get.query.id
        openedPage.type = get.query.type
      }
      if (get.name) {
        openedPage.name = get.name
      }
      state.visitedViews.splice(get.index, 1, openedPage)
      state.visitedViews.forEach(v => {
        let path = v.path
        if (v.id) {
          if (path.indexOf('?') > -1) {
            path = path + '&id=' + v.id
          } else {
            path = path + '?id=' + v.id
          }
        }
        if (v.type) {
          if (path.indexOf('?') > -1) {
            path = path + '&type=' + v.type
          } else {
            path = path + '?type=' + v.type
          }
        }
        v.lastPath = path
      })
      sessionStorage.visitedViews = JSON.stringify(state.visitedViews)
    },
    DEL_VISITED_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews.splice(i, 1)
          break
        }
      }
      sessionStorage.visitedViews = JSON.stringify(state.visitedViews)
    },
    DEL_OTHERS_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews = state.visitedViews.slice(i, i + 1)
          break
        }
      }
      sessionStorage.visitedViews = JSON.stringify(state.visitedViews)
    },
    DEL_ALL_VIEWS: (state) => {
      state.visitedViews = []
      sessionStorage.visitedViews = JSON.stringify(state.visitedViews)
    },
    SET_OPENED_LIST (state, view) {
      state.visitedViews = sessionStorage.visitedViews ? JSON.parse(sessionStorage.visitedViews) : [];
    }
  },

  actions: {
    addVisitedViews({ commit, state }, view) {
      let pageOpenedList = state.visitedViews
      let openedPageLen = pageOpenedList.length
      let i = 0
      let tagHasOpened = false
      while (i < openedPageLen) {
        if (view.path === pageOpenedList[i].path) { // 页面已经打开
          commit('PAGE_OPENED_UPDATE', {
            index: i,
            name: view.name.length ? view.name : view.meta.title,
            query: view.query
          })
          tagHasOpened = true
          break
        }
        i++
      }
      if (!tagHasOpened) {
        commit('ADD_VISITED_VIEWS', view)
      }
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
