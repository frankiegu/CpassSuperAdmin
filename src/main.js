import Vue from 'vue'
import router from './router'
import store from './store'

/* 先引入样式 */
import 'element-ui/lib/theme-chalk/index.css'
import './styles/ele-var.scss' // 自定义主题

// 后引入组件
import ElementUI from 'element-ui'
import App from './App'

// 后引入项目的 配置
import comMixins from '@/mixins'                            // 全局的方法
import './permission'                                       // 路由拦截
import vuePermissions from './directive/permissions/index'  // 如果参数为true是，聚焦元素
import { title, item, svg, card, datePicker, lhTextarea } from '@/components'
import './icons'

Vue.use(ElementUI, { size: 'small' })
Vue.use(vuePermissions)
Vue.mixin(comMixins)

// 全局注册组件
const components = [
  title, item, svg, card, datePicker, lhTextarea
]
components.map(component => {
  Vue.component(component.name, component)
})

// 设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false

new Vue({
  router,
  store,
  ...App,
  mounted() {
    this.setOpenedList()
  },
  methods: {
    setOpenedList() {
      this.$store.dispatch('setOpenedList')
    }
  }
}).$mount('#app')
