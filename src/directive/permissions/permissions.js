import store from '@/store'
export default{
  inserted: function (el, binding) {
    let totalPermissions = store.getters.getPermissions
    let hasPermissions
    let param = binding.value

    if ((typeof param) === 'object') {
      for (var item of param) {
        if (totalPermissions.includes(item)) {
          hasPermissions = true
        }
      }
    } else {
      // includes方法返回一个布尔值，表示某个数组是否包含给定的值
      hasPermissions = totalPermissions.includes(param)
    }

    // 如果没有权限，就不展示
    if (!hasPermissions) {
      el.style.display = 'none'
    }
  }
}
