import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import nProgress from 'nprogress'       // Progress 进度条

function catchErr (next, error) {
  Vue.prototype.$Message({
    showClose: true,
    message: error,
    type: 'error',
    duration: 1500
  })
  store.dispatch('logout').then(res => {
    next({ path: '/' })
  })
}

// 不重定向白名单
const whiteList = ['/login']
router.beforeEach((to, from, next) => {
  // 设置动态标题，如果一个页面展示：新增编辑和详情
  if (!to.meta.dynamicTitle) {
    // router 统一设置title，动态设置title的就设置name 为空，在页面内动态设置dodument.title
    document.title = to.name || ''
  }
  nProgress.start(); // 开启Progress

  if (store.getters.token) {
    if (to.path === '/login') {
      // 已登录，登录页转到首页
      next({ path: '/' })
      nProgress.done()
    } else {
      // 判断当前用户是否已拉取完user_info信息
      if (store.getters.getResources === 'no') {
        store.commit('SET_PERMISSION', '')

        // 拿到用户信息之后，马上设置了 hasResources = 'yes'
        store.dispatch('getPermission').then(() => {
          // 要加上 {...to}，否则一刷新就是空白，要再访问另一个路由才能把路由添加进来
          next({ ...to })
        }).catch(err => catchErr(next, err))
      } else {
        next()
      }
    }
  } else {
    // 未登录，白名单直通
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // 未登录，除了白名单之外的路由跳转到登录页
      next({
        path: '/login',
        // 将跳转的路由path作为参数，登录成功后跳转到该路由
        query: { redirect: to.fullPath }
      })
      // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
      nProgress.done()
    }
  }
})

router.afterEach((to, from) => {
  nProgress.done(); // 结束Progress
})
