// import { adminUserInfo } from '@/service'
import Cookies from 'js-cookie'

const user = {
  state: {
    name: Cookies.get('name') || '',
    username: Cookies.get('username') || '',
    avatar: Cookies.get('avatar') || '',
    getUserInfoed: 'no' // yes 表示未登录，no 表示已经登录
  },

  getters: {
    avatar: state => state.avatar,
    name: state => state.name,
    getUsername: state => state.username,
    getUserInfoed: state => state.getUserInfoed
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
    SET_LOGIN: (state, inline) => {
      state.getUserInfoed = inline
    }
  },

  actions: {
    getUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOGIN', 'yes') // 设置已经登录成功
        console.log('this is a userInfo!')
        resolve()
        // adminUserInfo().then(res => {
        //   if (res.status === 'true') {
        //     const data = res.info.adminUser
        //
        //     Cookies.set('name', data.name)
        //     commit('SET_NAME', data.name)
        //
        //     Cookies.set('username', data.username)
        //     commit('SET_USERNAME', data.username)
        //
        //     Cookies.set('avatar', data.headImgUrl)
        //     commit('SET_AVATAR', data.headImgUrl)
        //
        //     Cookies.set('spaceId', data.spaceId)
        //     commit('SET_SPACEID', data.spaceId)
        //
        //     commit('SET_LOGIN', 'yes') // 设置已经登录成功
        //
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

export default user
