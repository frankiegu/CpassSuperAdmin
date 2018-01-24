// 空间管家混合mixins
// mixins可以公用，但是组件之间数据传递，需要用到vuex
import store from '@/store'
export default {
  methods: {
    showDialog(id) {
      let title

      if (id === 'keeper') {
        title = '添加管家'
      } else if (id === 'service') {
        title = '管家服务类型'
      } else {
        title = '关联企业'
      }
      store.commit('SET_DIALOGVISIBLE', true)
      store.commit('SET_DIALOGTITLE', title)
      store.commit('SET_MONITORCLICK', Math.random())
    }
  }
}
