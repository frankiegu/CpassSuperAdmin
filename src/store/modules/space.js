import { defaultSpaceInfo } from '@/service'
import Cookies from 'js-cookie'

const space = {
  state: {
    spaceLogo: Cookies.get('spaceLogo') || '',
    spaceName: Cookies.get('spaceName') || ''
  },

  getters: {
    getSpaceLogo: state => state.spaceLogo,
    getSpaceName: state => state.spaceName
  },

  mutations: {
    SET_SPACE_LOGO: (state, spaceLogo) => {
      state.spaceLogo = spaceLogo
    },
    SET_SPACE_NAEM: (state, spaceName) => {
      state.spaceName = spaceName
    }
  },

  actions: {
    getSpaceInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        defaultSpaceInfo().then(res => {
          if (res.status === 'true') {
            const data = res.info
            Cookies.set('spaceLogo', data.spaceLogo)
            commit('SET_SPACE_LOGO', data.spaceLogo)
            Cookies.set('spaceName', data.spaceName)
            commit('SET_SPACE_NAEM', data.spaceName)
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

export default space
