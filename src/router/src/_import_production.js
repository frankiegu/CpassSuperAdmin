module.exports = file => () => import('@/views/' + file + '.vue').then(m => m.default)
