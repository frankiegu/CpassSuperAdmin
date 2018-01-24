import Vue from 'vue'
import router from './router'
import store from './store'

import '../theme/index.css'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/element-variables.scss'                    // 自定义主题
import ElementUI from 'element-ui'
import vueWaves from './directive/waves/index'              // 水波纹指令
import vueFocus from './directive/focus/index'              // 如果参数为true是，聚焦元素
import vuePermissions from './directive/permissions/index'  // 如果参数为true是，聚焦元素
import App from './App'
import './interceptors'                                     // 路由拦截
import comMixins from '@/config/com-mixins'                 // 全局的方法
import * as filters from '@/filters'                        // global filters
import './mock' // 启动一个本地Server来处理请求返回模拟数据

Vue.use(ElementUI, { size: 'medium' })
Vue.use(vueWaves)
Vue.use(vueFocus)
Vue.use(vuePermissions)

Vue.mixin(comMixins)
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false

new Vue({
  router,
  store,
  ...App
}).$mount('#app')
