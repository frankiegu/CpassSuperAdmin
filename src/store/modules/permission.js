import { constantRouterMap } from '@/router/src/routes'
import { getByAdminUserId } from '@/service'
// import {hasPermissions} from '@/config/utils'

const permission = {
  state: {
    permissions: [],
    routers: constantRouterMap, // 动态加载的所有路由，用与sidebar
    asyncRouters: []           // 用于 addRoutes，防止重复添加白名单
  },

  getters: {
    getPermissions: state => state.permissions,
    getAddRouters: state => state.routers,
    getAsyncRouters: state => state.asyncRouters
  },

  mutations: {
    SET_PERMISSION: (state, permi) => {
      state.permissions = permi
    },
    ADD_ROUTERS: (state, routes) => {
      state.asyncRouters = routes
      state.routers = constantRouterMap.concat(routes)
    }
  },

  actions: {
    getPermission: ({ commit }) => {
      return new Promise((resolve, reject) => {
        getByAdminUserId().then(res => {
          if (res.status === 'true') {
            const data = []

            for (var item of res.info) {
              data.push(item.url)
            }
            commit('SET_PERMISSION', data)

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

export default permission
