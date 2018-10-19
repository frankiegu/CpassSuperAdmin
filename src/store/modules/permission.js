import { constantRouterMap } from '@/router/src/routes'
// import {getByAdminUserId} from '@/service'
// import {hasPermissions} from '@/config/utils'

const permission = {
  state: {
    permissions: [],
    routers: constantRouterMap, // 动态加载的所有路由，用与sidebar
    asyncRouters: [],           // 用于 addRoutes，防止重复添加白名单
    hasResources: 'no'         // yes 表示未登录，no 表示已经登录
  },

  getters: {
    getPermissions: state => state.permissions,
    getAddRouters: state => state.routers,
    getAsyncRouters: state => state.asyncRouters,
    getResources: state => state.hasResources
  },

  mutations: {
    SET_PERMISSION: (state, permi) => {
      state.permissions = permi
    },
    ADD_ROUTERS: (state, routes) => {
      state.asyncRouters = routes
      state.routers = constantRouterMap.concat(routes)
    },
    SET_RESOURCES: (state, inline) => {
      state.hasResources = inline
    }
  },

  actions: {
    getPermission: ({ commit }) => {
      return new Promise((resolve, reject) => {
        commit('SET_RESOURCES', 'yes') // 设置已经拿到权限资源
        console.log('this is a permission resource list')
        resolve()

        // getByAdminUserId().then(res => {
        //   if (res.status === 'true') {
        //     const data = []

        //     for (var item of res.info) {
        //       data.push(item.url)
        //     }
        //     commit('SET_PERMISSION', data)

        //     commit('SET_RESOURCES', 'yes') // 设置已经拿到权限资源

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

export default permission
