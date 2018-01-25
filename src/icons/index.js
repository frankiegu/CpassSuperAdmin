import Vue from 'vue'
import svg from '@/components/svg'// svg组件

// 全局注册组件
Vue.component(svg.name, svg)

// 定义一个加载目录的函数
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
// 加载目录下的所有 svg 文件
requireAll(req)
