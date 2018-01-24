/**
 * 一些示例页面路由
 */
import { _import } from '@/config/env'

const subPath = '/examples'

const examplesCounter = _import('examples/counter')           // vuex 使用示例
const examplesJsx = _import('examples/jsx')                   // JSX 使用示例
const examplesTest = _import('examples/test')                 // test
const examplesCheckbox = _import('examples/checkbox')         // checkbox
const examplesQr = _import('examples/qr')                     // qr
const examplesUploadPic = _import('examples/upload-pic')      // upload-pic
const examplesFlatpickr = _import('examples/flatpickr')       // flatpickr
const examplesFlatpickr2 = _import('examples/flatpickr2')     // flatpickr2
const smallComponents = _import('examples/small-components')  // small-components
const examplesEle2 = _import('examples/ele2')                 // ele 2.0.2 test
const examplesTree = _import('examples/permis')               // 树形控件

export default [
  {name: 'counter', path: subPath + '/counter', component: examplesCounter},
  {name: 'jsx', path: subPath + '/jsx', component: examplesJsx},
  {name: 'test', path: subPath + '/test', component: examplesTest},
  {name: 'checkbox', path: subPath + '/checkbox', component: examplesCheckbox},
  {name: 'qr', path: subPath + '/qr', component: examplesQr},
  {name: 'upload-pic', path: subPath + '/upload-pic', component: examplesUploadPic},
  {name: 'flatpickr', path: subPath + '/flatpickr', component: examplesFlatpickr},
  {name: 'flatpickr2', path: subPath + '/flatpickr2', component: examplesFlatpickr2},
  {name: 'small-components', path: subPath + '/small-components', component: smallComponents},
  {name: 'ele2', path: subPath + '/ele2', component: examplesEle2},
  {name: 'tree', path: subPath + '/tree', component: examplesTree}
];
