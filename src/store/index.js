import Vue from 'vue'
import Vuex from 'vuex'

import {app, permission, common, user, space, counter} from './modules'
import {housekeeper} from './view-modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    permission,
    common,
    user,
    space,
    counter,
    housekeeper
  }
})
