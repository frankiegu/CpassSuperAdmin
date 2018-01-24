import {adminUserInfo} from '@/service'
import Cookies from 'js-cookie'

const user = {
  state: {
    name: Cookies.get('name') || '',
    username: Cookies.get('username') || '',
    avatar: Cookies.get('avatar') || '',
    spaceId: Cookies.get('spaceId') || ''
  },

  getters: {
    avatar: state => state.avatar,
    name: state => state.name,
    getUsername: state => state.username,
    getSpaceId: state => state.spaceId
  },

  mutations: {
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_SPACEID: (state, spaceId) => {
      state.spaceId = spaceId
    }
  },

  actions: {
    getUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        adminUserInfo().then(res => {
          if (res.status === 'true') {
            const data = res.info.adminUser

            Cookies.set('name', data.name)
            commit('SET_NAME', data.name)

            Cookies.set('username', data.username)
            commit('SET_USERNAME', data.username)

            Cookies.set('avatar', data.headImgUrl)
            commit('SET_AVATAR', data.headImgUrl)

            Cookies.set('spaceId', data.spaceId)
            commit('SET_SPACEID', data.spaceId)

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

export default user
