import {constantRouterMap} from '@/router/src/routes'
import {getByAdminUserId} from '@/service'
import {hasPermissions} from '@/config/utils'

const permission = {
  state: {
    permissions: [],
    routers: constantRouterMap, // 动态加载的所有路由，用与sidebar
    asyncRouters: [],           // 用于 addRoutes，防止重复添加白名单
    spaceAccess: 0,
    hasResources: 'no'         // yes 表示未登录，no 表示已经登录
  },

  getters: {
    getPermissions: state => state.permissions,
    getAddRouters: state => state.routers,
    getAsyncRouters: state => state.asyncRouters,
    getSpaceAccess: state => state.spaceAccess,
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
    SET_SPACE_ACCESS: (state, permis) => {
      state.spaceAccess = permis
    },
    SET_RESOURCES: (state, inline) => {
      state.hasResources = inline
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

            let showSpaceCon = hasPermissions('/manage/field/list') ? 1 : 0
            // console.log('showSpaceCon', showSpaceCon);
            commit('SET_SPACE_ACCESS', showSpaceCon)

            commit('SET_RESOURCES', 'yes') // 设置已经拿到权限资源

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
};

export default permission;
