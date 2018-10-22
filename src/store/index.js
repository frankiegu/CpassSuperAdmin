import Vue from 'vue'
import Vuex from 'vuex'

import { app, permission, common, tagsView, counter, user } from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    permission,
    common,
    tagsView,
    counter,
    user
  }
})
