import Vue from 'vue'
import Vuex from 'vuex'

import { app, permission, common, tagsView, counter, user, notice, logout } from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    permission,
    common,
    tagsView,
    counter,
    user,
    notice,
    logout
  }
})
