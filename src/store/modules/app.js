import Cookies from 'js-cookie'
import { supervisorLogin } from '@/service'
import { logoutNoToken } from '@/config/utils'

const app = {
  state: {
    firstLogin: 0, // 0:不是第一次登录；1：第一次登录
    token: sessionStorage.getItem('token') || ''
  },

  getters: {
    firstLogin: state => state.firstLogin,
    token: state => state.token
  },

  mutations: {
    SET_FIRST_LOGIN: (state, firstLogin) => {
      state.firstLogin = firstLogin
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    }
  },

  actions: {
    loginByPhone({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        supervisorLogin(userInfo).then(res => {
          if (res.status === 'true') {
            commit('SET_FIRST_LOGIN', res.info.firstLogin)
            // 不是第一次登录才设置token
            if (res.info.firstLogin === 0) {
              const data = res.info.token

              Cookies.set('sospTelphone', userInfo.username)
              sessionStorage.setItem('token', data)
              commit('SET_TOKEN', data)
            }
            resolve(res)
          } else {
            reject(res)
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
