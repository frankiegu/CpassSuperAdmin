import Cookies from 'js-cookie'
import { supervisorLogin } from '@/service'
import { logoutNoToken } from '@/config/utils'

const app = {
  state: {
    token: sessionStorage.getItem('token') || ''
  },

  getters: {
    token: state => state.token
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    }
  },

  actions: {
    loginByPhone({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        supervisorLogin(userInfo).then(res => {
          if (res.status === 'true') {
            const data = res.info

            Cookies.set('telphone', userInfo.username)
            sessionStorage.setItem('token', data)
            commit('SET_TOKEN', data)

            resolve(res)
          } else {
            reject(res.msg)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        logoutNoToken()
        resolve()
        // logout().then(res => {
        //   if (res.status === 'true') {
        //     logoutNoToken()

        //     resolve(res)
        //   } else {
        //     reject(res.msg)
        //   }
        // }).catch(error => {
        //   reject(error)
        // })
      })
    }
  }
}

export default app
