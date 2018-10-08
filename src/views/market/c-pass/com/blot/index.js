
import { Quill } from 'vue-quill-editor' // 调用编辑器
import { renderBrandTitle, renderStoreTitle, renderFieldTitle } from './title'
import { renderStoreArrBlot } from './store'
import { renderFieldArrBlot } from './field'

let BlockEmbed = Quill.import('blots/block/embed')

// render数据，blot匹配插入字符串的样式，如果有对应的，就会执行生成的blot方法
// 如插入字符串有选择器 field-box，则会执行 FieldArrBlot方法

// 怎么传参？哪个地方可以插入？

// 添加空间链接
class FieldArrBlot extends BlockEmbed {
  static create(fieldArr) {
    const node = super.create()
    node.innerHTML = renderFieldArrBlot(fieldArr)
    console.log('FieldArrBlot-node', fieldArr, renderFieldArrBlot(fieldArr), node)

    return node
  }
}
FieldArrBlot.blotName = 'fieldArr'
FieldArrBlot.tagName = 'div'
FieldArrBlot.className = 'field-box'
Quill.register(FieldArrBlot)

// 添加空间链接
class StoreArrBlot extends BlockEmbed {
  static create(storeArr) {
    const node = super.create()
    node.innerHTML = renderStoreArrBlot(storeArr)
    console.log('StoreArrBlot-node', node)

    return node
  }
}
StoreArrBlot.blotName = 'storeArr'
StoreArrBlot.tagName = 'div'
StoreArrBlot.className = 'store-list'
Quill.register(StoreArrBlot)

// 分割线
class DividerBlot extends BlockEmbed {}
DividerBlot.blotName = 'divider'
DividerBlot.tagName = 'div'
DividerBlot.className = 'hr'

Quill.register(DividerBlot)

// 任意标题
class ArbitrarilyTitle extends BlockEmbed {
  static create(data) {
    const node = super.create()
    node.innerHTML = data
    return node
  }
}
ArbitrarilyTitle.blotName = 'titleArbitrarily'
ArbitrarilyTitle.tagName = 'div'
ArbitrarilyTitle.className = 'title-arbitrarily'
Quill.register(ArbitrarilyTitle)

// 品牌标题
class BrandTitle extends BlockEmbed {
  static create(brandItm) {
    const node = super.create()

    if (typeof brandItm !== 'boolean') {
      node.dataset.id = brandItm.id
      node.innerHTML = renderBrandTitle(brandItm)
    } else {
      console.log('插入')
    }
    console.log('BrandTitle', brandItm, brandItm, node)

    return node
  }
}
BrandTitle.blotName = 'titleBrand'
BrandTitle.tagName = 'div'
BrandTitle.className = 'title-brand'
Quill.register(BrandTitle)

// 空间标题
class StoreTitle extends BlockEmbed {
  static create(storeItm) {
    const node = super.create()
    node.dataset.id = storeItm.id
    node.innerHTML = renderStoreTitle(storeItm)
    console.log('storeTitle-node', node)
    return node
  }
}
StoreTitle.blotName = 'titleStore'
StoreTitle.tagName = 'div'
StoreTitle.className = 'title-store'
Quill.register(StoreTitle)

// 场地标题
class FieldTitle extends BlockEmbed {
  static create(fieldItm) {
    const node = super.create()
    node.dataset.id = fieldItm.id
    node.innerHTML = renderFieldTitle(fieldItm)
    console.log('fieldTitle-node', node)

    return node
  }
}
FieldTitle.blotName = 'titleField'
FieldTitle.tagName = 'div'
FieldTitle.className = 'title-field'
Quill.register(FieldTitle)
