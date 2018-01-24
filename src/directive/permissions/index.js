import permissions from './permissions'

const install = function (Vue) {
  Vue.directive('permissions', permissions)
}

if (window.Vue) {
  window.permissions = permissions
  Vue.use(install); // eslint-disable-line
}

permissions.install = install
export default permissions
