/**
 * 腾讯地图异步加载 JavaScript API
 * @return {Promise}
 */
export default function (key) {
  let myKey = key || '7VDBZ-AXYCK-4W2JT-AGYLZ-43CN6-FDBTG'  // 7VDBZ-AXYCK-4W2JT-AGYLZ-43CN6-FDBTG Arong的开发密钥
  return new Promise(function (resolve, reject) {
    if (window.qq) {
      resolve(window.qq)
    } else {
      window.initTcMap = function () {
        resolve(window.qq)
      }
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'http://map.qq.com/api/js?v=2.exp&callback=initTcMap&key=' + myKey
      script.onerror = reject
      document.head.appendChild(script)
    }
  })
}
