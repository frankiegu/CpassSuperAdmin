import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import nProgress from 'nprogress'       // Progress 进度条
import '@/styles/nprogress.css'         // Progress 进度条 样式

import {Message} from 'element-ui'      // 在js中引入ele组件 message
const notify = Message
Vue.prototype.$Message = notify

function catchErr (next, error) {
  Vue.prototype.$Message({ showClose: true, message: error, type: 'error' })
  store.dispatch('logout').then(res => {
    next({path: '/'})
  })
}

// 不重定向白名单
// /space-preview 用户扫码手机访问，所以不需要权限也要能访问
const whiteList = ['/login', '/space-preview', '/back-pwd']
router.beforeEach((to, from, next) => {
  if (!to.meta.dynamicTitle) {          // 设置动态标题，如果一个页面展示：新增编辑和详情
    document.title = to.name || ''      // router 统一设置title，动态设置title的就设置name 为空，在页面内动态设置dodument.title
  }
  nProgress.start(); // 开启Progress

  if (store.getters.token) {
    if (to.path === '/login') { // 已登录，登录页转到首页
      next({ path: '/' })
    } else {
      // 判断当前用户是否已拉取完user_info信息
      if (store.getters.getUserInfoed === 'no') {
        store.commit('SET_PERMISSION', '')

        store.dispatch('getPermission').then(() => {
          // 动态添加路由，呼应vuex 添加到 sidebar
          // router.addRoutes(store.getters.getAsyncRouters)

          // 拿到用户信息之后，马上设置了 getUserInfoed = 'yes'
          store.dispatch('getUserInfo').then(res => {
            store.dispatch('getSpaceInfo').then(res => {
              next({...to}) // 要加上 {...to}，否则一刷新就是空白，要再访问另一个路由才能把路由添加进来
            }).catch(err => catchErr(next, err))
          }).catch(err => catchErr(next, err))
        }).catch(err => catchErr(next, err))
      } else {
        next()
      }
    }
  } else { // 未登录，白名单直通
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else { // 未登录，除了白名单之外的路由跳转到登录页
      next({
        path: '/login',
        query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
      // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
      nProgress.done()
    }
  }
})

router.afterEach((to, from) => {
  nProgress.done(); // 结束Progress
})
